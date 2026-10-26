import { getGames, getRecentPurchases } from "@/lib/games";

export const dynamic = "force-dynamic";

export async function GET() {
  const [games, recent] = await Promise.all([getGames(), getRecentPurchases(12)]);
  return Response.json({ ok: true, count: games.length, games, recent });
}
