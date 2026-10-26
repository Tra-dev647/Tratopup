import { asc, desc, eq, min } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeed } from "@/db/seed";
import { games, packages, recentPurchases, type Game, type GamePackage } from "@/db/schema";

export async function getGames(): Promise<Game[]> {
  await ensureSeed();
  return db.select().from(games).orderBy(asc(games.sortOrder));
}

export type GameWithPrice = Game & { fromCents: number };

export async function getGamesWithPrices(): Promise<GameWithPrice[]> {
  await ensureSeed();
  const rows = await db
    .select({ game: games, fromCents: min(packages.priceCents) })
    .from(games)
    .leftJoin(packages, eq(packages.gameId, games.id))
    .groupBy(games.id)
    .orderBy(asc(games.sortOrder));
  return rows.map((row) => ({ ...row.game, fromCents: Number(row.fromCents ?? 0) }));
}

export async function getPopularGames(limit = 8): Promise<Game[]> {
  await ensureSeed();
  return db.select().from(games).where(eq(games.popular, true)).orderBy(asc(games.sortOrder)).limit(limit);
}

export async function getGameWithPackages(
  slug: string,
): Promise<{ game: Game; packages: GamePackage[] } | null> {
  await ensureSeed();
  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  if (!game) return null;
  const rows = await db
    .select()
    .from(packages)
    .where(eq(packages.gameId, game.id))
    .orderBy(asc(packages.sortOrder));
  return { game, packages: rows };
}

export async function getRecentPurchases(limit = 12) {
  await ensureSeed();
  return db.select().from(recentPurchases).orderBy(desc(recentPurchases.createdAt)).limit(limit);
}

export function packageGroups(items: GamePackage[]): GamePackage[][] {
  const groupSize = Math.ceil(items.length / 2) || 1;
  return [items.slice(0, groupSize), items.slice(groupSize)].filter((group) => group.length > 0);
}
