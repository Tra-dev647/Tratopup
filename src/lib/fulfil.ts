import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { games, orders, packages } from "@/db/schema";
import { bakongEnabled, isPaid, PAYMENT_WINDOW_MS } from "@/lib/bakong";
import { supplierCreateOrder, supplierEnabled, supplierGames, supplierOrderStatus } from "@/lib/supplier";

type Order = typeof orders.$inferSelect;
type Game = typeof games.$inferSelect;
type Pkg = typeof packages.$inferSelect;

let catalogCache: { at: number; data: Awaited<ReturnType<typeof supplierGames>> } | null = null;

async function resolveSupplierPackageId(game: Game, pkg: Pkg): Promise<number | null> {
  if (pkg.supplierPackageId) return pkg.supplierPackageId;
  if (!catalogCache || Date.now() - catalogCache.at > 10 * 60 * 1000) {
    catalogCache = { at: Date.now(), data: await supplierGames() };
  }
  const sg = catalogCache.data.find((g) => g.slug === game.slug);
  if (!sg) return null;
  const wanted = pkg.amount > 1 || pkg.bonus > 0 ? `${pkg.amount} ${pkg.name}` : pkg.name;
  const hit = sg.packages.find((p) => p.name.trim().toLowerCase() === wanted.trim().toLowerCase());
  return hit?.package_id ?? null;
}

async function setNote(id: number, status: string, note: string) {
  const [row] = await db.update(orders).set({ status, note }).where(eq(orders.id, id)).returning();
  return row;
}

/**
 * Move an order forward one step based on real payment and supplier state.
 * Safe to call on every page view or poll: transitions are guarded in SQL.
 */
export async function advanceOrder(order: Order, game: Game, pkg: Pkg): Promise<Order> {
  // 1) Waiting for the KHQR payment.
  if (order.status === "pending_payment" && order.md5) {
    const age = Date.now() - new Date(order.createdAt).getTime();
    const paid = await isPaid(order.md5);
    if (!paid) {
      if (age > PAYMENT_WINDOW_MS) {
        const [row] = await db
          .update(orders)
          .set({ status: "expired" })
          .where(and(eq(orders.id, order.id), eq(orders.status, "pending_payment")))
          .returning();
        return row ?? order;
      }
      return order;
    }

    // Only one caller wins this transition, so the supplier is charged once.
    const [won] = await db
      .update(orders)
      .set({ status: "processing", paidAt: new Date() })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending_payment")))
      .returning();
    if (!won) return order;
    order = won;

    if (!supplierEnabled()) {
      return setNote(order.id, "needs_review", "Paid, but SUPPLIER_API_KEY is not set. Deliver manually.");
    }
    try {
      const supplierPkgId = await resolveSupplierPackageId(game, pkg);
      if (!supplierPkgId) {
        return setNote(order.id, "needs_review", `Paid, but no supplier package matches "${pkg.amount} ${pkg.name}". Set packages.supplier_package_id.`);
      }
      const s = await supplierCreateOrder({
        packageId: supplierPkgId,
        playerId: order.playerId,
        serverId: order.zoneId ?? undefined,
        reference: order.orderNo,
      });
      const [row] = await db
        .update(orders)
        .set({ supplierOrderCode: s.order_code })
        .where(eq(orders.id, order.id))
        .returning();
      return row ?? order;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      return setNote(order.id, "needs_review", `Paid, supplier order failed: ${msg}`);
    }
  }

  // 2) Paid and submitted: follow the supplier's status.
  if (order.status === "processing" && order.supplierOrderCode && supplierEnabled()) {
    try {
      const s = await supplierOrderStatus(order.supplierOrderCode);
      if (s.status === "completed") {
        const [row] = await db
          .update(orders)
          .set({ status: "completed", completedAt: new Date() })
          .where(and(eq(orders.id, order.id), eq(orders.status, "processing")))
          .returning();
        return row ?? order;
      }
      if (s.status === "refunded") {
        return setNote(order.id, "failed", "Supplier refunded the order (invalid account or supplier failure). Refund the customer.");
      }
    } catch {
      /* transient supplier error: try again on the next poll */
    }
  }
  return order;
}

export { bakongEnabled };
