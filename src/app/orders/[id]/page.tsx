import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import StatusBadge from "@/components/StatusBadge";
import OrderStatusPoller from "@/components/OrderStatusPoller";
import { getOrderForSession } from "@/lib/queries";
import { getSessionId } from "@/lib/session";
import { formatAmount, formatDate, formatKhr, formatUsd } from "@/lib/format";
import { getPaymentMethod } from "@/lib/payments";

export const metadata: Metadata = { title: "Order details" };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const sid = await getSessionId();
  const row = await getOrderForSession(Number(id), sid);
  if (!row) notFound();

  const { order, game, pkg } = row;
  const payment = getPaymentMethod(order.paymentMethod);
  const pendingPay = order.status === "pending_payment";
  const processing = order.status === "processing";
  const completed = order.status === "completed";
  const isNew = sp.new === "1";
  const qrImage = pendingPay && order.khqr ? await QRCode.toDataURL(order.khqr, { margin: 1, width: 280 }) : null;
  const expiresAt = new Date(order.createdAt).getTime() + 15 * 60 * 1000;
  const icon = pendingPay ? "📱" : processing ? "⏳" : completed ? "✅" : order.status === "expired" ? "⌛" : "⚠️";
  const title = pendingPay
    ? "Scan to pay"
    : processing
      ? isNew ? "Order received!" : "Processing your top-up"
      : completed
        ? "Top-up delivered"
        : order.status === "expired"
          ? "Payment expired"
          : "We're checking this order";
  const message = pendingPay
    ? "Open any Cambodian banking app, scan the KHQR and pay the exact amount. This page updates automatically."
    : processing
      ? "Payment received. We're sending the credits to your account now. This usually takes a few seconds."
      : completed
        ? `Your ${game.currencyName.toLowerCase()} have been credited to ${order.playerName ?? order.playerId}. Enjoy the game!`
        : order.status === "expired"
          ? "We didn't receive a payment in time. Place a new order to try again."
          : "Something needs a manual check. Message us on Telegram with your order number and we'll fix it.";

  return (
    <div className="mx-auto max-w-2xl">
      <OrderStatusPoller active={pendingPay || processing} />

      <nav className="mb-6 text-xs text-slate-400">
        <Link href="/orders" className="hover:text-white">My orders</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{order.orderNo}</span>
      </nav>

      <div className="card-glow overflow-hidden rounded-3xl border border-white/5 bg-ink-800/70">
        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div
            className={`grid h-16 w-16 place-items-center rounded-full text-3xl ${
              pendingPay || processing ? "animate-pulse-ring bg-brand-500/20" : completed ? "bg-emerald-500/20" : "bg-white/10"
            }`}
          >
            {icon}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white">{title}</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-400">{message}</p>
          {qrImage && (
            <div className="mt-5 rounded-2xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrImage} alt="KHQR payment code" width={224} height={224} />
              <p className="mt-1 text-sm font-bold text-ink-950">{formatUsd(order.amountUsd)}</p>
            </div>
          )}
          {pendingPay && (
            <p className="mt-2 text-xs text-slate-500">
              Pay before {new Date(expiresAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          <div className="mt-4">
            <StatusBadge status={order.status} />
          </div>
        </div>

        <div className="border-t border-white/5 bg-ink-950/40 p-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={game.imageUrl} alt={game.name} fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-white">{game.name}</p>
              <p className="text-sm text-brand-300">{formatAmount(pkg.amount, pkg.bonus, pkg.name)}</p>
              <p className="text-xs text-slate-500">{game.publisher}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-extrabold text-white">{formatUsd(order.amountUsd)}</p>
              <p className="text-xs text-slate-400">≈ {formatKhr(order.amountUsd)}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Item label="Order number" value={order.orderNo} mono />
            <Item label="Placed" value={formatDate(order.createdAt)} />
            <Item label={game.playerIdLabel} value={order.playerId} mono />
            {order.zoneId && <Item label={game.zoneLabel ?? "Zone"} value={order.zoneId} mono />}
            {order.playerName && <Item label="Nickname" value={order.playerName} />}
            <Item label="Payment" value={payment?.name ?? order.paymentMethod} />
            {order.completedAt && <Item label="Delivered" value={formatDate(order.completedAt)} />}
          </dl>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/5 p-6 sm:flex-row">
          <Link
            href={`/games/${game.slug}`}
            className="flex-1 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:brightness-110"
          >
            Top up again
          </Link>
          <Link
            href="/orders"
            className="flex-1 rounded-full border border-white/15 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/5"
          >
            View all orders
          </Link>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Need help with this order? Message us on Telegram with your order number.
      </p>
    </div>
  );
}

function Item({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 sm:block sm:border-0 sm:pb-0">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className={`text-right text-slate-100 sm:mt-0.5 sm:text-left ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
