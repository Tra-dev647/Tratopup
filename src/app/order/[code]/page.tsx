import Image from "next/image";
import Link from "next/link";
import { OrderRefresh } from "@/components/order-refresh";
import { getOrderByCode } from "@/lib/orders";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";
import { qrDataUrl } from "@/lib/bakong";
import { orderStatusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [{ locale }, order] = await Promise.all([getPrefs(), getOrderByCode(code)]);
  const dict = getDict(locale);
  const km = locale === "km";

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="kt-card p-8">
          <p className="text-4xl">🔍</p>
          <h1 className="kt-khmer mt-3 text-lg font-extrabold">{dict.orderNotFound}</h1>
          <p className="kt-khmer mt-1 text-[12.5px] text-[var(--muted)]">{code}</p>
          <Link href="/track" className="kt-btn kt-btn-primary kt-khmer mt-4 px-4 py-2.5 text-sm">
            {dict.navTrack}
          </Link>
        </div>
      </div>
    );
  }

  const qrImage = order.status === "pending" && order.qrString ? await qrDataUrl(order.qrString) : "";
  const paid = order.status === "paid";
  const amount =
    order.currency === "KHR"
      ? `៛${order.rielAmount.toLocaleString("en-US")}`
      : `$${(order.amountCents / 100).toFixed(2)}`;
  const steps = [
    { key: "created", label: km ? "បានបង្កើតការបញ្ជាទិញ" : "Order created", done: true, at: order.createdAt },
    { key: "paid", label: km ? "បានបង់ប្រាក់" : "Payment received", done: Boolean(order.paidAt), at: order.paidAt },
    { key: "delivered", label: km ? "ដឹកជញ្ជូនរួចរាល់" : "Delivered", done: Boolean(order.deliveredAt), at: order.deliveredAt },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="kt-card overflow-hidden">
        <div
          className={`flex items-center gap-3 px-4 py-4 sm:px-5 ${
            paid ? "bg-[#f0fdf5]" : order.status === "pending" ? "bg-[#fffbeb]" : "bg-[#fff1f1]"
          }`}
        >
          <span
            className={`grid h-11 w-11 place-items-center rounded-full text-lg ${
              paid ? "bg-[var(--ok)] text-white" : order.status === "pending" ? "bg-[#f59e0b] text-white" : "bg-[var(--err)] text-white"
            }`}
          >
            {paid ? "✓" : order.status === "pending" ? "⏱" : "✕"}
          </span>
          <div>
            <h1 className="kt-khmer text-[16px] font-extrabold">{orderStatusLabel(order.status, locale)}</h1>
            <p className="kt-khmer text-[11.5px] text-[var(--muted)]">
              {paid ? dict.deliveryDone : order.status === "pending" ? dict.scanToPay : km ? "QR នេះផុតកំណត់ហើយ" : "This QR is no longer valid"}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[17px] font-extrabold">{amount}</p>
            <p className="font-mono text-[10px] text-[var(--muted)]">{order.code}</p>
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:grid-cols-[220px_1fr] sm:p-5">
          <div>
            {qrImage ? (
              <div className="rounded-xl border border-[var(--line)] bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImage} alt={`KHQR ${order.code}`} className="w-full rounded-lg" />
                <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  KHQR · Bakong
                </p>
              </div>
            ) : (
              <div className="grid h-full min-h-[160px] place-items-center rounded-xl border border-[var(--line)] bg-[var(--bg2)] p-4 text-center">
                <div>
                  <Image
                    src="/images/brand/logo-00a6427d.png"
                    alt="Tratopup"
                    width={54}
                    height={54}
                    className="mx-auto h-14 w-14 rounded-full"
                  />
                  <p className="kt-khmer mt-2 text-[11.5px] font-semibold text-[var(--muted)]">
                    {paid ? (km ? "បានទូទាត់រួចរាល់" : "Settled") : km ? "សូមបង្កើតការបញ្ជាទិញថ្មី" : "Please start a new order"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[var(--acc-soft)] px-2 py-1 text-[10px] font-extrabold text-[var(--acc)]">
                {order.paymentMode === "live" ? "BAKONG API" : "DEMO MODE"}
              </span>
              <span className="truncate text-[12px] font-bold">{order.gameName}</span>
              <span className="ml-auto text-[12px] text-[var(--muted)]">{order.packageName}</span>
            </div>

            <dl className="mt-3 space-y-1.5 rounded-xl bg-[var(--bg2)] p-3 text-[11.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">{dict.userId}</dt>
                <dd className="font-mono font-semibold">
                  {order.playerId}
                  {order.serverId ? ` (${order.serverId})` : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">{dict.orderCode}</dt>
                <dd className="font-mono font-semibold">{order.code}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--muted)]">MD5</dt>
                <dd className="max-w-[60%] truncate font-mono text-[10.5px] font-semibold">{order.md5}</dd>
              </div>
              {order.paymentRef && (
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--muted)]">Ref</dt>
                  <dd className="max-w-[60%] truncate font-mono text-[10.5px] font-semibold">{order.paymentRef}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-[var(--line)] pt-1.5">
                <dt className="text-[var(--muted)]">{km ? "ថ្ងៃបង្កើត" : "Created"}</dt>
                <dd className="font-semibold">
                  {new Date(order.createdAt).toLocaleString(km ? "km-KH" : "en-US")}
                </dd>
              </div>
            </dl>

            <ol className="mt-3 space-y-2">
              {steps.map((step) => (
                <li key={step.key} className="flex items-center gap-2 text-[11.5px]">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[8px] ${
                      step.done ? "bg-[var(--ok)] text-white" : "border border-[var(--line)] bg-white text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className={`kt-khmer ${step.done ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"}`}>
                    {step.label}
                  </span>
                  {step.at && (
                    <span className="ml-auto text-[10px] text-[var(--muted)]">
                      {new Date(step.at).toLocaleTimeString(km ? "km-KH" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <OrderRefresh code={order.code} status={order.status} locale={locale} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <Link href={`/game/${order.gameSlug}`} className="kt-btn kt-btn-ghost kt-khmer px-4 py-2.5 text-[12.5px]">
          ← {km ? "ត្រឡប់ទៅហ្គេម" : "Back to game"}
        </Link>
        <div className="flex gap-2">
          <Link href="/track" className="kt-btn kt-btn-ghost kt-khmer px-4 py-2.5 text-[12.5px]">
            {dict.navTrack}
          </Link>
          <Link href="/" className="kt-btn kt-btn-primary kt-khmer px-4 py-2.5 text-[12.5px]">
            {dict.topUpNow}
          </Link>
        </div>
      </div>
    </div>
  );
}
