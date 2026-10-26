import Link from "next/link";
import { Price } from "@/components/prefs";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/orders";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";
import { orderStatusLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [{ locale }, user] = await Promise.all([getPrefs(), getCurrentUser()]);
  const dict = getDict(locale);
  const km = locale === "km";

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="kt-card p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--acc-soft)] text-[var(--acc)]">
            🔐
          </span>
          <h1 className="kt-khmer mt-3 text-lg font-extrabold">
            {km ? "សូមចូលដើម្បីមើលការបញ្ជាទិញ" : "Log in to view your orders"}
          </h1>
          <div className="mt-4 flex justify-center gap-2">
            <Link href="/login" className="kt-btn kt-btn-primary kt-khmer px-4 py-2.5 text-sm">
              {dict.login}
            </Link>
            <Link href="/register" className="kt-btn kt-btn-ghost kt-khmer px-4 py-2.5 text-sm">
              {dict.register}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orders = await getOrdersForUser(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="kt-khmer text-[22px] font-extrabold">{dict.navOrders}</h1>
          <p className="kt-khmer mt-1 text-[12.5px] text-[var(--muted)]">
            {user.name} · {user.email}
          </p>
        </div>
        <Link href="/games" className="kt-btn kt-btn-primary kt-khmer px-4 py-2.5 text-[12.5px]">
          {dict.topUpNow}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg2)] py-14 text-center">
          <p className="kt-khmer text-[13px] text-[var(--muted)]">
            {km ? "មិនមានការបញ្ជាទិញនៅឡើយទេ។" : "No orders yet."}
          </p>
          <Link href="/games" className="kt-khmer mt-3 inline-block text-[12.5px] font-bold text-[var(--acc)] hover:underline">
            {km ? "ចាប់ផ្តើមថបអាប់ →" : "Start top-up →"}
          </Link>
        </div>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/order/${order.code}`}
                className="kt-card flex flex-wrap items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold">{order.gameName}</p>
                  <p className="kt-khmer mt-0.5 truncate text-[11.5px] text-[var(--muted)]">
                    {order.packageName} · {order.playerId}
                    {order.serverId ? ` (${order.serverId})` : ""}
                  </p>
                  <p className="mt-1 font-mono text-[10.5px] text-[var(--muted)]">
                    {order.code} · {new Date(order.createdAt).toLocaleString(km ? "km-KH" : "en-US")}
                  </p>
                </div>
                <div className="text-right">
                  <Price cents={order.amountCents} className="text-[14px] font-extrabold" />
                  <p
                    className={`kt-khmer mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      order.status === "paid"
                        ? "bg-[#e9f9ef] text-[var(--ok)]"
                        : order.status === "pending"
                          ? "bg-[#fffbeb] text-[var(--amber)]"
                          : "bg-[#fff1f1] text-[var(--err)]"
                    }`}
                  >
                    {orderStatusLabel(order.status, locale)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
