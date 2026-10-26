import { getOrderByCode, publicOrder, syncOrderPayment } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const order = await getOrderByCode(code);
  if (!order) return Response.json({ ok: false, error: "Order not found" }, { status: 404 });

  const url = new URL(request.url);
  if (url.searchParams.get("sync") === "1") {
    const result = await syncOrderPayment(code);
    if (!result) return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    return Response.json({
      ok: true,
      mode: result.mode,
      paid: result.paid,
      checked: result.checked,
      providerMessage: result.providerMessage,
      order: publicOrder(result.order),
    });
  }

  return Response.json({ ok: true, order: publicOrder(order) });
}
