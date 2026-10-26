import Link from "next/link";
import { TrackForm } from "@/components/track-form";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function TrackPage() {
  const [{ locale }, user] = await Promise.all([getPrefs(), getCurrentUser()]);
  const dict = getDict(locale);
  const km = locale === "km";
  const recent = user ? (await getOrdersForUser(user.id, 5)) : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="kt-card p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--acc-soft)] text-[var(--acc)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <h1 className="kt-khmer mt-3 text-[22px] font-extrabold">{dict.trackTitle}</h1>
        <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">{dict.trackSub}</p>
        <TrackForm dict={dict} locale={locale} />

        {recent.length > 0 && (
          <div className="mt-6">
            <h2 className="kt-khmer text-[12px] font-bold uppercase tracking-wide text-[var(--muted)]">
              {km ? "ការបញ្ជាទិញថ្មីៗ" : "Recent orders"}
            </h2>
            <ul className="mt-2 divide-y divide-[var(--line)]">
              {recent.map((order) => (
                <li key={order.code}>
                  <Link href={`/order/${order.code}`} className="flex items-center gap-2 py-2.5 hover:text-[var(--acc)]">
                    <span className="font-mono text-[11.5px] font-bold">{order.code}</span>
                    <span className="truncate text-[11.5px] text-[var(--muted)]">
                      {order.gameName} · {order.packageName}
                    </span>
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        order.status === "paid" ? "bg-[#e9f9ef] text-[var(--ok)]" : "bg-[#fffbeb] text-[var(--amber)]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 border-t border-[var(--line)] pt-4">
          <p className="kt-khmer text-[12px] text-[var(--muted)]">
            {km ? (
              <>
                មានបញ្ហា? ទាក់ទង{" "}
                <a href="https://t.me/khmertopup" className="font-bold text-[var(--acc)] hover:underline">
                  @khmertopup
                </a>{" "}
                ជាមួយលេខបញ្ជាទិញរបស់អ្នក។
              </>
            ) : (
              <>
                Need help? Message{" "}
                <a href="https://t.me/khmertopup" className="font-bold text-[var(--acc)] hover:underline">
                  @khmertopup
                </a>{" "}
                with your order code.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
