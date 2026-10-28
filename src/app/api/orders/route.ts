import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { games, orders, packages } from "@/db/schema";
import { getOrCreateSessionId, getSessionId } from "@/lib/session";
import { getPaymentMethod } from "@/lib/payments";
import { listOrdersForSession } from "@/lib/queries";
import { bakongEnabled, generateKhqr } from "@/lib/bakong";

export async function GET() {
  const sid = await getSessionId();
  const rows = await listOrdersForSession(sid);
  return NextResponse.json({ orders: rows });
}

type CreateOrderBody = {
  gameId?: unknown;
  packageId?: unknown;
  playerId?: unknown;
  zoneId?: unknown;
  playerName?: unknown;
  paymentMethod?: unknown;
};

function makeOrderNo() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KT${y}${m}${d}-${rand}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CreateOrderBody | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const gameId = Number(body.gameId);
  const packageId = Number(body.packageId);
  const playerId = typeof body.playerId === "string" ? body.playerId.trim() : "";
  const zoneId = typeof body.zoneId === "string" ? body.zoneId.trim() : "";
  const playerName = typeof body.playerName === "string" ? body.playerName.trim() : "";
  const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : "";

  if (!Number.isInteger(gameId) || !Number.isInteger(packageId)) {
    return NextResponse.json({ error: "Invalid game or package" }, { status: 400 });
  }
  if (playerId.length < 3 || playerId.length > 40) {
    return NextResponse.json({ error: "Please enter a valid player ID" }, { status: 400 });
  }
  if (!getPaymentMethod(paymentMethod)) {
    return NextResponse.json({ error: "Please choose a payment method" }, { status: 400 });
  }

  const [game] = await db.select().from(games).where(eq(games.id, gameId)).limit(1);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  if (game.slug === "mobile-legends" && !/^\d{5,15}$/.test(playerId)) {
    return NextResponse.json({ error: "User ID must be digits only" }, { status: 400 });
  }
  if (zoneId.length > 10 || (zoneId && !/^\d+$/.test(zoneId))) {
    return NextResponse.json({ error: "Zone ID must be digits only" }, { status: 400 });
  }
  if (game.requiresZone && zoneId.length === 0) {
    return NextResponse.json(
      { error: `${game.zoneLabel ?? "Zone ID"} is required for this game` },
      { status: 400 },
    );
  }

  const [pkg] = await db
    .select()
    .from(packages)
    .where(and(eq(packages.id, packageId), eq(packages.gameId, gameId)))
    .limit(1);
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  const sid = await getOrCreateSessionId();

  const orderNo = makeOrderNo();
  let khqr: { qr: string; md5: string } | null = null;
  if (bakongEnabled()) {
    try {
      khqr = generateKhqr(orderNo, Number(pkg.priceUsd));
    } catch {
      return NextResponse.json({ error: "Payment is unavailable right now. Please try again." }, { status: 503 });
    }
  }

  const [created] = await db
    .insert(orders)
    .values({
      orderNo,
      sessionId: sid,
      gameId,
      packageId,
      playerId,
      zoneId: game.requiresZone ? zoneId : null,
      playerName: playerName || null,
      paymentMethod,
      amountUsd: pkg.priceUsd,
      status: khqr ? "pending_payment" : "processing",
      khqr: khqr?.qr ?? null,
      md5: khqr?.md5 ?? null,
    })
    .returning();

  return NextResponse.json({ order: created }, { status: 201 });
}
