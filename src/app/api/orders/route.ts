import { getCurrentUser } from "@/lib/auth";
import { createOrder, getOrdersForUser, publicOrder } from "@/lib/orders";
import type { Currency } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const result = await createOrder({
    gameSlug: String(body.gameSlug ?? ""),
    packageId: Number(body.packageId ?? 0),
    playerId: String(body.playerId ?? ""),
    serverId: String(body.serverId ?? ""),
    playerName: String(body.playerName ?? ""),
    contact: String(body.contact ?? ""),
    currency: (body.currency === "KHR" ? "KHR" : "USD") as Currency,
    userId: user?.id ?? null,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: result.status });
  }

  return Response.json({
    ok: true,
    mode: result.mode,
    order: publicOrder(result.order),
    qrImage: result.qrImage,
    qrString: result.order.qrString,
    deeplink: result.order.deeplink || null,
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false, error: "Not signed in" }, { status: 401 });
  const rows = await getOrdersForUser(user.id);
  return Response.json({ ok: true, orders: rows.map(publicOrder) });
}
