"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Price, usePrefs } from "@/components/prefs";
import { formatMoney, type Locale } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";
import type { GameInfo, OrderInfo, PackageInfo } from "@/lib/types";

type ApiCreateResponse = {
  ok: boolean;
  error?: string;
  mode?: "live" | "demo";
  order?: OrderInfo;
  qrImage?: string;
  qrString?: string;
  deeplink?: string | null;
};

type ApiCheckResponse = {
  ok: boolean;
  error?: string;
  paid?: boolean;
  mode?: "live" | "demo";
  checked?: boolean;
  providerMessage?: string;
  message?: string;
  order?: OrderInfo;
};

function maskId(value: string) {
  if (!value) return "";
  if (value.length <= 4) return value;
  return `${value.slice(0, 2)}${"•".repeat(Math.max(2, value.length - 4))}${value.slice(-2)}`;
}

export function BuyPanel({
  game,
  packages,
  dict,
  locale,
  isAuthed,
}: {
  game: GameInfo;
  packages: PackageInfo[];
  dict: Dictionary;
  locale: Locale;
  isAuthed: boolean;
}) {
  const { currency } = usePrefs();
  const defaultPackage = useMemo(
    () => packages.find((item) => item.popular) ?? packages[0],
    [packages],
  );
  const [selected, setSelected] = useState<PackageInfo | undefined>(defaultPackage);
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"form" | "pay" | "paid">("form");
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [qrImage, setQrImage] = useState("");
  const [qrString, setQrString] = useState("");
  const [deeplink, setDeeplink] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "demo">("demo");
  const [providerMessage, setProviderMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const km = locale === "km";

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refreshOrder = useCallback(async (code: string, sync: boolean) => {
    try {
      const res = await fetch(`/api/orders/${code}${sync ? "?sync=1" : ""}`, { cache: "no-store" });
      const data = (await res.json()) as ApiCheckResponse;
      if (!res.ok || !data.order) return;
      setOrder(data.order);
      if (data.providerMessage) setProviderMessage(data.providerMessage);
      if (data.mode) setMode(data.mode);
      if (data.order.status === "paid") {
        setStage("paid");
        stopPolling();
      }
      if (data.order.status === "expired") stopPolling();
    } catch {
      /* network hiccup — keep polling */
    }
  }, [stopPolling]);

  useEffect(() => {
    if (stage !== "pay" || !order) return;
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(order.expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) stopPolling();
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [stage, order, stopPolling]);

  useEffect(() => {
    if (stage !== "pay" || !order) return;
    stopPolling();
    pollRef.current = setInterval(() => {
      void refreshOrder(order.code, true);
    }, 5000);
    return stopPolling;
  }, [stage, order, refreshOrder, stopPolling]);

  async function handleCreate() {
    if (!selected) return;
    setError("");
    if (playerId.trim().length < 3) {
      setError(km ? "សូមបញ្ចូល Player ID ត្រឹមត្រូវ។" : "Please enter a valid Player ID.");
      return;
    }
    if (game.fields.zoneId && serverId.trim().length < 1) {
      setError(km ? "សូមបញ្ចូល Zone ID។" : "Please enter your Zone ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSlug: game.slug,
          packageId: selected.packageId,
          playerId: playerId.trim(),
          serverId: serverId.trim(),
          contact: contact.trim(),
          currency,
        }),
      });
      const data = (await res.json()) as ApiCreateResponse;
      if (!res.ok || !data.ok || !data.order) {
        setError(data.error ?? (km ? "មានបញ្ហាក្នុងការបង្កើតការបញ្ជាទិញ។" : "Could not create the order."));
        return;
      }
      setOrder(data.order);
      setQrImage(data.qrImage ?? "");
      setQrString(data.qrString ?? "");
      setDeeplink(data.deeplink ?? null);
      setMode(data.mode ?? "demo");
      setStage("pay");
    } catch {
      setError(km ? "ការតភ្ជាប់បរាជ័យ សូមព្យាយាមម្តងទៀត។" : "Connection failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaid(manual = false) {
    if (!order) return;
    setChecking(true);
    setProviderMessage("");
    try {
      const endpoint = manual ? `/api/orders/${order.code}/confirm` : `/api/orders/${order.code}`;
      const res = await fetch(endpoint, { method: manual ? "POST" : "GET", cache: "no-store" });
      const data = (await res.json()) as ApiCheckResponse;
      if (!res.ok || !data.ok) {
        setProviderMessage(data.error ?? "");
        return;
      }
      if (data.order) setOrder(data.order);
      setProviderMessage(data.providerMessage ?? data.message ?? "");
      if (data.paid || data.order?.status === "paid") {
        setStage("paid");
        stopPolling();
      }
    } catch {
      setProviderMessage(km ? "មិនអាចភ្ជាប់ទៅ Bakong API បានទេ។" : "Could not reach the Bakong API.");
    } finally {
      setChecking(false);
    }
  }

  function reset() {
    stopPolling();
    setStage("form");
    setOrder(null);
    setQrImage("");
    setQrString("");
    setDeeplink(null);
    setProviderMessage("");
    setPlayerId("");
    setServerId("");
  }

  async function copyQr() {
    try {
      await navigator.clipboard.writeText(qrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  const amountLabel = order ? formatMoney(order.amountCents, order.currency) : selected ? formatMoney(selected.priceCents, currency) : "";
  const payAmount = order ? (order.currency === "KHR" ? `៛${order.rielAmount.toLocaleString("en-US")}` : `$${(order.amountCents / 100).toFixed(2)}`) : "";
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="relative">
      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <div className="kt-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-4 py-3.5 sm:px-5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--acc-soft)] text-[var(--acc)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 10h16" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <div>
              <h2 className="kt-khmer text-[15px] font-extrabold">{dict.choosePackage}</h2>
              <p className="text-[11.5px] text-[var(--muted)]">
                {packages.length} {dict.packages}
              </p>
            </div>
            <span className="ml-auto rounded-full bg-[#e9f9ef] px-2.5 py-1 text-[11px] font-bold text-[var(--ok)]">
              ⚡ {dict.statDelivery}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {packages.map((pkg) => {
                const active = selected?.packageId === pkg.packageId;
                return (
                  <button
                    key={pkg.packageId}
                    type="button"
                    onClick={() => setSelected(pkg)}
                    className={`relative overflow-hidden rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[var(--acc)] bg-[var(--acc-soft)] shadow-[0_4px_14px_rgba(13,110,253,0.16)]"
                        : "border-[var(--line)] bg-white hover:border-[#c9d6e8] hover:bg-[#fbfdff]"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute right-0 top-0 rounded-bl-lg bg-[#f59e0b] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                        HOT
                      </span>
                    )}
                    <span className="block text-[13px] font-bold leading-tight text-[var(--text)]">{pkg.name}</span>
                    <span className="mt-1 flex items-baseline gap-1.5">
                      <Price cents={pkg.priceCents} className="text-[13px] font-extrabold text-[var(--acc)]" />
                      {pkg.oldPriceCents && (
                        <Price cents={pkg.oldPriceCents} strike className="text-[10px] font-semibold text-[var(--muted)]" />
                      )}
                    </span>
                    {active && (
                      <span className="absolute bottom-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--acc)] text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="kt-card p-4 sm:p-5 lg:sticky lg:top-24">
          <h2 className="kt-khmer text-[15px] font-extrabold">{dict.playerInfo}</h2>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">
                {game.fields.phone ? dict.phone : dict.userId} <span className="text-[var(--err)]">*</span>
              </span>
              <input
                value={playerId}
                onChange={(event) => setPlayerId(event.target.value)}
                inputMode={game.fields.phone ? "tel" : "numeric"}
                placeholder={game.fields.phone ? "+85512 345 678" : dict.playerIdPlaceholder}
                className="kt-input"
              />
            </label>
            {game.fields.zoneId && (
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">
                  {dict.zoneId} <span className="text-[var(--err)]">*</span>
                </span>
                <input
                  value={serverId}
                  onChange={(event) => setServerId(event.target.value)}
                  inputMode="numeric"
                  placeholder={dict.zonePlaceholder}
                  className="kt-input"
                />
              </label>
            )}
            {game.fields.serverId && (
              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">{dict.serverId}</span>
                <input value={serverId} onChange={(event) => setServerId(event.target.value)} className="kt-input" />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">
                {km ? "អ៊ីមែល / Telegram (ស្រេចចិត្ត)" : "Email / Telegram (optional)"}
              </span>
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="you@example.com"
                className="kt-input"
              />
            </label>
          </div>

          {playerId.trim().length >= 3 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#bbf0cf] bg-[#f0fdf5] px-3 py-2 text-[12px] text-[var(--ok)]">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--ok)] text-[9px] text-white">✓</span>
              <span className="kt-khmer font-semibold">{dict.verifiedAccount}</span>
              <span className="ml-auto font-mono text-[11px] opacity-80">{maskId(playerId.trim())}</span>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-[var(--bg2)] p-3">
            <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
              <span className="kt-khmer">{dict.total}</span>
              <span className="font-bold text-[var(--text)]">{amountLabel}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
              <span>{selected?.name}</span>
              <span>{game.name}</span>
            </div>
            {currency === "KHR" && selected && (
              <p className="mt-1 text-right text-[10.5px] text-[var(--muted)]">≈ ${(selected.priceCents / 100).toFixed(2)} USD</p>
            )}
          </div>

          {error && (
            <p className="kt-khmer mt-3 rounded-lg border border-[#fecaca] bg-[#fff1f1] px-3 py-2 text-[12px] font-medium text-[var(--err)]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleCreate}
            disabled={loading || !selected}
            className="kt-btn kt-btn-primary kt-khmer mt-3 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? dict.checkingAccount : `${dict.continuePay} · ${amountLabel}`}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--muted)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {dict.poweredBy}
          </p>
          {!isAuthed && (
            <p className="kt-khmer mt-1 text-center text-[10.5px] text-[var(--muted)]">
              {km ? (
                <>
                  <Link href="/login" className="font-bold text-[var(--acc)] hover:underline">
                    {dict.login}
                  </Link>{" "}
                  ដើម្បីរក្សាទុកប្រវត្តិបញ្ជាទិញ
                </>
              ) : (
                <>
                  <Link href="/login" className="font-bold text-[var(--acc)] hover:underline">
                    Log in
                  </Link>{" "}
                  to keep your order history
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {stage !== "form" && order && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0b1a33]/55 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="kt-fade-up relative my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_24px_70px_rgba(8,20,40,0.3)]">
            {stage === "paid" ? (
              <div className="p-6 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9f9ef]">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      stroke="#15803d"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="kt-khmer mt-4 text-lg font-extrabold">{dict.paidSuccess}</h3>
                <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">{dict.deliveryDone}</p>
                <div className="mt-4 rounded-xl bg-[var(--bg2)] p-3 text-left text-[12px]">
                  <Row label={dict.orderCode} value={order.code} mono />
                  <Row label={game.name} value={order.packageName} />
                  <Row label={game.fields.phone ? dict.phone : dict.userId} value={order.playerId + (order.serverId ? ` (${order.serverId})` : "")} />
                  <Row label={dict.total} value={payAmount} strong />
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link href={`/order/${order.code}`} className="kt-btn kt-btn-ghost kt-khmer flex-1 py-2.5 text-sm">
                    {km ? "មើលវិក័យប័ត្រ" : "View receipt"}
                  </Link>
                  <button type="button" onClick={reset} className="kt-btn kt-btn-primary kt-khmer flex-1 py-2.5 text-sm">
                    {km ? "ថបអាប់បន្ថែម" : "Top up again"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[linear-gradient(112deg,#f3f7ff,#fff)] px-4 py-3">
                  <Image src="/images/pay/khqr.png" alt="KHQR" width={46} height={28} className="h-7 w-auto" />
                  <div>
                    <p className="text-[13px] font-extrabold">{dict.scanToPay}</p>
                    <p className="text-[10.5px] text-[var(--muted)]">{dict.payWith} Bakong · ABA · ACLEDA · Wing</p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--err)]"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-[74vh] overflow-y-auto p-4 sm:p-5">
                  <div className="flex flex-col items-center">
                    <div className="relative rounded-2xl border border-[var(--line)] bg-white p-2 shadow-sm">
                      {qrImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={qrImage} alt={`KHQR ${order.code}`} width={230} height={230} className="h-[210px] w-[210px]" />
                      ) : (
                        <div className="kt-skeleton h-[210px] w-[210px] rounded-xl" />
                      )}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#1a1a1a] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
                        KHQR
                      </span>
                    </div>
                    <p className="mt-4 text-2xl font-extrabold text-[var(--text)]">{payAmount}</p>
                    <p className="kt-khmer text-[11.5px] text-[var(--muted)]">
                      {order.packageName} · {game.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="kt-chip !py-1 font-mono text-[11px]">{order.code}</span>
                      <span
                        className={`kt-chip !py-1 text-[11px] ${
                          remaining > 0 ? "!text-[var(--amber)]" : "!text-[var(--err)]"
                        }`}
                      >
                        ⏱ {dict.expiresIn} {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg2)] p-3 text-[11.5px]">
                    <Row label={dict.orderCode} value={order.code} mono />
                    <Row label={game.fields.phone ? dict.phone : dict.userId} value={order.playerId} />
                    {order.serverId && <Row label={dict.zoneId} value={order.serverId} />}
                    <Row label="MD5" value={order.md5.slice(0, 16) + "…"} mono />
                    <Row label={dict.total} value={payAmount} strong />
                  </div>

                  <div
                    className={`mt-3 rounded-xl border px-3 py-2 text-[11px] leading-5 ${
                      mode === "demo"
                        ? "border-[#fde68a] bg-[#fffbeb] text-[#92400e]"
                        : "border-[#bbf0cf] bg-[#f0fdf5] text-[#166534]"
                    }`}
                  >
                    <span className="kt-khmer">{mode === "demo" ? dict.demoNote : dict.liveNote}</span>
                  </div>

                  {providerMessage && (
                    <p className="mt-2 text-center text-[11px] text-[var(--muted)]">{providerMessage}</p>
                  )}

                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => void handlePaid(false)}
                      disabled={checking || order.status === "paid"}
                      className="kt-btn kt-btn-primary kt-khmer py-2.5 text-[13px] disabled:opacity-60"
                    >
                      {checking ? dict.checking : dict.iPaid}
                    </button>
                    <div className="flex gap-2">
                      {mode === "demo" ? (
                        <button
                          type="button"
                          onClick={() => void handlePaid(true)}
                          disabled={checking}
                          className="kt-btn kt-khmer flex-1 border border-[#f59e0b] bg-[#fffbeb] py-2 text-[12px] font-bold text-[#b45309] disabled:opacity-60"
                        >
                          {dict.demoPay}
                        </button>
                      ) : (
                        deeplink && (
                          <a
                            href={deeplink}
                            target="_blank"
                            rel="noreferrer"
                            className="kt-btn kt-btn-ghost flex-1 py-2 text-[12px] font-bold"
                          >
                            {km ? "បើកកម្មវិធីធនាគារ" : "Open banking app"}
                          </a>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => void copyQr()}
                        className="kt-btn kt-btn-ghost flex-1 py-2 text-[12px] font-bold"
                      >
                        {copied ? (km ? "បានចម្លង ✓" : "Copied ✓") : km ? "ចម្លង QR" : "Copy QR"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[10px] text-[var(--muted)]">
                    {km
                      ? "បន្ទាប់ពីបង់ប្រាក់ ប្រព័ន្ធនឹងពិនិត្យស្ថានភាពដោយស្វ័យប្រវត្តិរៀងរាល់ ៥ វិនាទី។"
                      : "We check the payment status automatically every 5 seconds."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
  strong = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={`${mono ? "font-mono" : ""} ${strong ? "font-extrabold" : "font-semibold"} truncate text-right text-[var(--text)]`}>
        {value}
      </span>
    </div>
  );
}
