import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import StatusBadge from "@/components/StatusBadge";
import { listOrdersForSession } from "@/lib/queries";
import { getSessionId } from "@/lib/session";
import { formatAmount, formatDate, formatUsd } from "@/lib/format";
import { getPaymentMethod } from "@/lib/payments";

export const metadata: Metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const sid = await getSessionId();
  const rows = await listOrdersForSession(sid);

  const totalSpent = rows.reduce((sum, r) => sum + Number(r.order.amountUsd), 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Account</p>
          <h1 className="text-2xl font-bold text-white">My orders</h1>
          <p className="mt-1 text-sm text-slate-400">Every top-up placed from this device, newest first.</p>
        </div>
        {rows.length > 0 && (
          <div className="flex gap-3">
            <Stat label="Orders" value={String(rows.length)} />
            <Stat label="Total spent" value={formatUsd(totalSpent)} />
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card-glow rounded-3xl border border-dashed border-white/10 bg-ink-800/40 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-2xl">🧾</div>
          <h2 className="mt-4 text-lg font-semibold text-white">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            Once you complete a top-up it will show up here with its status and details.
          </p>
          <Link
            href="/#games"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
          >
            Start a top-up
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ order, game, pkg }) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="card-glow flex items-center gap-4 rounded-2xl border border-white/5 bg-ink-800/70 p-4 transition hover:border-brand-400/40"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={game.imageUrl} alt={game.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">{game.name}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {formatAmount(pkg.amount, pkg.bonus, pkg.name)} · {game.playerIdLabel} {order.playerId}
                    {order.zoneId ? ` (${order.zoneId})` : ""}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {order.orderNo} · {formatDate(order.createdAt)} · {getPaymentMethod(order.paymentMethod)?.name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-white">{formatUsd(order.amountUsd)}</p>
                  <p className="text-xs text-brand-300">Details →</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-ink-800/70 px-4 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}
