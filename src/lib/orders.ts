import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeed } from "@/db/seed";
import { games, orders, packages, recentPurchases, type Order } from "@/db/schema";
import {
  BAKONG_CURRENCY,
  bakongMode,
  buildKhqr,
  checkTransactionByMd5,
  generateDeeplink,
  khqrMd5,
  qrDataUrl,
  USD_TO_KHR,
} from "@/lib/bakong";
import { maskPlayer, type Currency } from "@/lib/format";

export const ORDER_TTL_MS = 10 * 60 * 1000;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newOrderCode(): string {
  const bytes = crypto.randomBytes(6);
  let out = "";
  for (const byte of bytes) out += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  return `KT-${out}`;
}

export type CreateOrderInput = {
  gameSlug: string;
  packageId: number;
  playerId: string;
  serverId?: string;
  playerName?: string;
  contact?: string;
  currency?: Currency;
  userId?: number | null;
};

export type CreateOrderResult =
  | { ok: true; order: Order; qrImage: string; mode: "live" | "demo" }
  | { ok: false; error: string; status: number };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  await ensureSeed();
  const slug = (input.gameSlug ?? "").trim();
  const playerId = (input.playerId ?? "").trim().replace(/\s+/g, "");
  if (!slug) return { ok: false, error: "Game is required", status: 400 };
  if (!playerId || playerId.length < 3) {
    return { ok: false, error: "Please enter a valid player ID", status: 400 };
  }
  if (playerId.length > 40) return { ok: false, error: "Player ID is too long", status: 400 };

  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  if (!game) return { ok: false, error: "Game not found", status: 404 };

  const [pkg] = await db
    .select()
    .from(packages)
    .where(and(eq(packages.gameId, game.id), eq(packages.packageId, input.packageId)))
    .limit(1);

  if (!pkg) return { ok: false, error: "Package not found", status: 404 };

  const currency: Currency = input.currency === "KHR" ? "KHR" : "USD";
  const amountCents = pkg.priceCents;
  const rielAmount = Math.round((amountCents / 100) * USD_TO_KHR);
  const code = newOrderCode();

  const khqr = buildKhqr({
    amount: currency === "KHR" ? rielAmount : amountCents / 100,
    currency,
    billNumber: code,
    storeLabel: game.name,
    terminalLabel: "KHQR-WEB",
  });
  const md5 = khqrMd5(khqr);
  const deeplink = (await generateDeeplink(khqr).catch(() => null)) ?? "";
  const expiresAt = new Date(Date.now() + ORDER_TTL_MS);

  const [order] = await db
    .insert(orders)
    .values({
      code,
      userId: input.userId ?? null,
      gameSlug: game.slug,
      gameName: game.name,
      packageId: pkg.packageId,
      packageName: pkg.name,
      playerId,
      serverId: (input.serverId ?? "").trim(),
      playerName: (input.playerName ?? "").trim(),
      contact: (input.contact ?? "").trim(),
      amountCents,
      currency,
      rielAmount,
      qrString: khqr,
      md5,
      deeplink,
      paymentMode: bakongMode(),
      status: "pending",
      expiresAt,
    })
    .returning();

  const qrImage = await qrDataUrl(khqr);
  return { ok: true, order, qrImage, mode: bakongMode() };
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  await ensureSeed();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code.trim().toUpperCase()))
    .limit(1);
  return order ?? null;
}

export async function getOrdersForUser(userId: number, limit = 30): Promise<Order[]> {
  await ensureSeed();
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

async function markDelivered(order: Order, reference: string): Promise<Order> {
  const now = new Date();
  const [updated] = await db
    .update(orders)
    .set({ status: "paid", paidAt: now, deliveredAt: now, paymentRef: reference.slice(0, 120) })
    .where(eq(orders.id, order.id))
    .returning();

  await db.insert(recentPurchases).values({
    gameSlug: order.gameSlug,
    gameName: order.gameName,
    packageName: order.packageName,
    maskedPlayer: maskPlayer(order.playerId),
    priceCents: order.amountCents,
  });

  return updated;
}

export type SyncResult = {
  order: Order;
  checked: boolean;
  paid: boolean;
  providerMessage: string;
  mode: "live" | "demo";
};

/**
 * Polls the Bakong Open API for the payment behind this order's KHQR MD5.
 * Demo mode never auto-marks orders paid — it requires an explicit confirm.
 */
export async function syncOrderPayment(code: string): Promise<SyncResult | null> {
  const order = await getOrderByCode(code);
  if (!order) return null;
  const mode = bakongMode();

  if (order.status === "paid") {
    return { order, checked: false, paid: true, providerMessage: "Already paid", mode };
  }

  if (order.status === "expired" || order.expiresAt.getTime() < Date.now()) {
    if (order.status !== "expired") {
      const [expired] = await db
        .update(orders)
        .set({ status: "expired" })
        .where(eq(orders.id, order.id))
        .returning();
      return { order: expired, checked: false, paid: false, providerMessage: "QR expired", mode };
    }
    return { order, checked: false, paid: false, providerMessage: "QR expired", mode };
  }

  if (mode === "demo") {
    return {
      order,
      checked: true,
      paid: false,
      providerMessage: "Demo mode — BAKONG_API_TOKEN not configured",
      mode,
    };
  }

  const result = await checkTransactionByMd5(order.md5);
  if (result.paid) {
    const updated = await markDelivered(order, result.data?.hash ?? result.data?.externalRef ?? order.md5);
    return { order: updated, checked: true, paid: true, providerMessage: result.message, mode };
  }

  return { order, checked: true, paid: false, providerMessage: result.message, mode };
}

/** Only available when no Bakong token is configured (sandbox / demo). */
export async function confirmDemoPayment(code: string): Promise<Order | null> {
  if (bakongMode() === "live") return null;
  const order = await getOrderByCode(code);
  if (!order || order.status === "paid") return order ?? null;
  if (order.expiresAt.getTime() < Date.now() && order.status === "pending") {
    const [expired] = await db.update(orders).set({ status: "expired" }).where(eq(orders.id, order.id)).returning();
    return expired;
  }
  return markDelivered(order, `DEMO-${crypto.randomBytes(4).toString("hex").toUpperCase()}`);
}

export function publicOrder(order: Order) {
  return {
    code: order.code,
    gameSlug: order.gameSlug,
    gameName: order.gameName,
    packageId: order.packageId,
    packageName: order.packageName,
    playerId: order.playerId,
    serverId: order.serverId,
    playerName: order.playerName,
    amountCents: order.amountCents,
    currency: order.currency,
    rielAmount: order.rielAmount,
    md5: order.md5,
    status: order.status,
    paymentMode: order.paymentMode,
    paymentRef: order.paymentRef,
    createdAt: order.createdAt.toISOString(),
    expiresAt: order.expiresAt.toISOString(),
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
  };
}

export type PublicOrder = ReturnType<typeof publicOrder>;

export function defaultKhqrCurrency(): Currency {
  return BAKONG_CURRENCY === "KHR" ? "KHR" : "USD";
}
