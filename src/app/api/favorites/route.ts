import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites, games } from "@/db/schema";
import { getOrCreateSessionId, getSessionId } from "@/lib/session";
import { listFavoriteGameIds } from "@/lib/queries";

export async function GET() {
  const sid = await getSessionId();
  const ids = await listFavoriteGameIds(sid);
  return NextResponse.json({ gameIds: ids });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { gameId?: unknown } | null;
  const gameId = Number(body?.gameId);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
  }

  const [game] = await db.select({ id: games.id }).from(games).where(eq(games.id, gameId)).limit(1);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const sid = await getOrCreateSessionId();

  const [existing] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.sessionId, sid), eq(favorites.gameId, gameId)))
    .limit(1);

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return NextResponse.json({ favorited: false });
  }

  await db.insert(favorites).values({ sessionId: sid, gameId }).onConflictDoNothing();
  return NextResponse.json({ favorited: true });
}
