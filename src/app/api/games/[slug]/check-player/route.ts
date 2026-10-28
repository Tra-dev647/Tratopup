import { NextResponse } from "next/server";
import { getGameBySlug } from "@/lib/queries";
import { supplierCheck, supplierEnabled } from "@/lib/supplier";

const ADJECTIVES = ["Shadow", "Neon", "Crimson", "Frost", "Silent", "Turbo", "Lucky", "Iron", "Nova", "Pixel"];
const NOUNS = ["Wolf", "Phoenix", "Striker", "Ninja", "Ranger", "Viper", "Knight", "Ghost", "Falcon", "Titan"];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

/**
 * Simulated player lookup. Real providers verify the account with the
 * publisher; here we derive a stable nickname from the ID so the flow
 * behaves consistently.
 */
export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const game = await getGameBySlug(slug);
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { playerId?: unknown; zoneId?: unknown } | null;
  const playerId = typeof body?.playerId === "string" ? body.playerId.trim() : "";
  const zoneId = typeof body?.zoneId === "string" ? body.zoneId.trim() : "";

  if (playerId.length < 3) {
    return NextResponse.json({ error: `Please enter a valid ${game.playerIdLabel}` }, { status: 400 });
  }
  if (game.requiresZone && zoneId.length === 0) {
    return NextResponse.json({ error: `${game.zoneLabel ?? "Zone ID"} is required` }, { status: 400 });
  }

  if (slug === "mobile-legends" && !/^\d{5,15}$/.test(playerId)) {
    return NextResponse.json({ error: "User ID must be digits only" }, { status: 400 });
  }
  if (zoneId.length > 10 || (zoneId && !/^\d+$/.test(zoneId))) {
    return NextResponse.json({ error: "Zone ID must be digits only" }, { status: 400 });
  }

  // Real lookup through the supplier API when a key is configured.
  if (supplierEnabled()) {
    const r = await supplierCheck(slug, playerId, zoneId || undefined);
    if (r.result === "valid") return NextResponse.json({ ok: true, nickname: r.nickname });
    if (r.result === "invalid") {
      return NextResponse.json({ error: "Account not found. Check your ID and Zone ID." }, { status: 404 });
    }
    if (r.result === "incomplete") {
      return NextResponse.json({ error: r.message ?? "Missing required field" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, nickname: null, unverified: true });
  }

  // Small artificial delay so the UI feels like a live lookup.
  await new Promise((r) => setTimeout(r, 500));

  const h = hash(`${slug}:${playerId}:${zoneId}`);
  const nickname = `${ADJECTIVES[h % ADJECTIVES.length]}${NOUNS[Math.floor(h / 16) % NOUNS.length]}${(h % 900) + 100}`;

  return NextResponse.json({ ok: true, nickname });
}
