import { confirmDemoPayment, publicOrder, syncOrderPayment } from "@/lib/orders";
import { bakongMode } from "@/lib/bakong";

export const dynamic = "force-dynamic";

/**
 * Confirms a payment.
 * - Live mode: asks the Bakong Open API (check_transaction_by_md5) again.
 * - Demo mode: simulates a successful settlement so the flow is testable.
 */
export async function POST(_request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const mode = bakongMode();

  if (mode === "live") {
    const result = await syncOrderPayment(code);
    if (!result) return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
    return Response.json({
      ok: true,
      mode,
      paid: result.paid,
      message: result.providerMessage,
      order: publicOrder(result.order),
    });
  }

  const order = await confirmDemoPayment(code);
  if (!order) return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
  return Response.json({
    ok: true,
    mode,
    paid: order.status === "paid",
    message: "Demo payment recorded",
    order: publicOrder(order),
  });
}
