import { db } from "@/db";
import { favorites, games, orders, packages } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { advanceOrder, bakongEnabled } from "@/lib/fulfil";

export async function listGames() {
  await ensureSeeded();
  return db.select().from(games).where(eq(games.slug, "mobile-legends")).orderBy(asc(games.sortOrder), asc(games.name));
}

export async function getGameBySlug(slug: string) {
  await ensureSeeded();
  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  return game ?? null;
}

export async function listPackagesForGame(gameId: number) {
  return db
    .select()
    .from(packages)
    .where(eq(packages.gameId, gameId))
    .orderBy(asc(packages.sortOrder), asc(packages.id));
}

export async function listFavoriteGameIds(sessionId: string | undefined) {
  if (!sessionId) return [] as number[];
  const rows = await db
    .select({ gameId: favorites.gameId })
    .from(favorites)
    .where(eq(favorites.sessionId, sessionId));
  return rows.map((r) => r.gameId);
}

export async function listFavoriteGames(sessionId: string | undefined) {
  await ensureSeeded();
  if (!sessionId) return [];
  const ids = await listFavoriteGameIds(sessionId);
  if (ids.length === 0) return [];
  return db
    .select()
    .from(games)
    .where(inArray(games.id, ids))
    .orderBy(asc(games.sortOrder), asc(games.name));
}

export async function listOrdersForSession(sessionId: string | undefined) {
  await ensureSeeded();
  if (!sessionId) return [];
  const rows = await db
    .select({
      order: orders,
      game: games,
      pkg: packages,
    })
    .from(orders)
    .innerJoin(games, eq(orders.gameId, games.id))
    .innerJoin(packages, eq(orders.packageId, packages.id))
    .where(eq(orders.sessionId, sessionId))
    .orderBy(desc(orders.createdAt));
  return rows;
}

export async function getOrderForSession(id: number, sessionId: string | undefined) {
  await ensureSeeded();
  if (!sessionId || !Number.isFinite(id)) return null;
  const [row] = await db
    .select({ order: orders, game: games, pkg: packages })
    .from(orders)
    .innerJoin(games, eq(orders.gameId, games.id))
    .innerJoin(packages, eq(orders.packageId, packages.id))
    .where(and(eq(orders.id, id), eq(orders.sessionId, sessionId)))
    .limit(1);
  if (!row) return null;

  if (bakongEnabled()) {
    // Real flow: check the KHQR payment, then fulfil through the supplier.
    row.order = await advanceOrder(row.order, row.game, row.pkg);
  } else if (row.order.status === "processing") {
    // Dev fallback: simulate fulfilment ~8 seconds after the order is placed.
    const age = Date.now() - new Date(row.order.createdAt).getTime();
    if (age > 8000) {
      const [updated] = await db
        .update(orders)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();
      if (updated) row.order = updated;
    }
  }
  return row;
}
