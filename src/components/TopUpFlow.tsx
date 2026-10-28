"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Game, Package } from "@/db/schema";
import { PAYMENT_METHODS } from "@/lib/payments";
import { formatAmount, formatKhr, formatUsd } from "@/lib/format";

type Props = { game: Game; packages: Package[] };

export default function TopUpFlow({ game, packages }: Props) {
  const router = useRouter();

  const [playerId, setPlayerId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [nickname, setNickname] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [payment, setPayment] = useState<string>(PAYMENT_METHODS.length === 1 ? PAYMENT_METHODS[0].id : "");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const idReady = playerId.trim().length >= 3 && (!game.requiresZone || zoneId.trim().length > 0);
  const canReview = idReady && !!selectedPkg && !!payment;

  const groups = useMemo(() => {
    const credits = packages.filter((p) => p.amount > 1 || p.bonus > 0);
    const passes = packages.filter((p) => !(p.amount > 1 || p.bonus > 0));
    return { credits, passes };
  }, [packages]);

  async function checkPlayer() {
    setChecking(true);
    setCheckError(null);
    setNickname(null);
    try {
      const res = await fetch(`/api/games/${game.slug}/check-player`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, zoneId }),
      });
      const data = (await res.json()) as { nickname?: string | null; error?: string; unverified?: boolean };
      if (!res.ok) throw new Error(data.error ?? "Could not verify player");
      setNickname(data.nickname ?? null);
      if (data.unverified) setCheckError("Could not verify right now. Double-check your ID before paying.");
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "Could not verify player");
    } finally {
      setChecking(false);
    }
  }

  async function placeOrder() {
    if (!selectedPkg) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game.id,
          packageId: selectedPkg.id,
          playerId,
          zoneId,
          playerName: nickname ?? "",
          paymentMethod: payment,
        }),
      });
      const data = (await res.json()) as { order?: { id: number }; error?: string };
      if (!res.ok || !data.order) throw new Error(data.error ?? "Could not place order");
      router.push(`/orders/${data.order.id}?new=1`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not place order");
      setSubmitting(false);
    }
  }

  const paymentMeta = PAYMENT_METHODS.find((m) => m.id === payment);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Step 1 */}
        <StepCard step={1} title="Enter your account" done={idReady}>
          <div className={`grid gap-3 ${game.requiresZone ? "sm:grid-cols-[1fr_160px]" : ""}`}>
            <Field label={game.playerIdLabel}>
              <input
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value);
                  setNickname(null);
                }}
                inputMode={game.playerIdLabel === "Username" ? "text" : "numeric"}
                placeholder={`Enter ${game.playerIdLabel}`}
                className={inputCls}
              />
            </Field>
            {game.requiresZone && (
              <Field label={game.zoneLabel ?? "Zone ID"}>
                <input
                  value={zoneId}
                  onChange={(e) => {
                    setZoneId(e.target.value);
                    setNickname(null);
                  }}
                  placeholder={game.zoneLabel ?? "Zone"}
                  className={inputCls}
                />
              </Field>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={checkPlayer}
              disabled={!idReady || checking}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {checking ? "Checking…" : "Verify account"}
            </button>
            {nickname && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
                <CheckIcon className="h-4 w-4" />
                {nickname}
              </span>
            )}
            {checkError && <span className="text-sm text-rose-400">{checkError}</span>}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Find your {game.playerIdLabel.toLowerCase()} in the game&apos;s profile screen. Double-check it — credits
            sent to the wrong account can&apos;t be recalled.
          </p>
        </StepCard>

        {/* Step 2 */}
        <StepCard step={2} title="Choose a package" done={!!selectedPkg}>
          {groups.credits.length > 0 && (
            <PackageGroup
              items={groups.credits}
              currency={game.currencyName}
              selected={selectedPkg}
              onSelect={setSelectedPkg}
            />
          )}
          {groups.passes.length > 0 && (
            <>
              {groups.credits.length > 0 && (
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Passes & memberships
                </p>
              )}
              <PackageGroup
                items={groups.passes}
                currency={game.currencyName}
                selected={selectedPkg}
                onSelect={setSelectedPkg}
              />
            </>
          )}
        </StepCard>

        {/* Step 3 */}
        <StepCard step={3} title="Select payment" done={!!payment}>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => {
              const active = payment === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(m.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-400/30"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${m.accent} text-sm font-bold text-white`}
                  >
                    {m.short}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{m.name}</span>
                    <span className="block truncate text-xs text-slate-400">{m.description}</span>
                  </span>
                  {active && <CheckIcon className="ml-auto h-5 w-5 shrink-0 text-brand-400" />}
                </button>
              );
            })}
          </div>
        </StepCard>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card-glow rounded-2xl border border-white/5 bg-ink-800/80 p-5">
          <h3 className="text-base font-bold text-white">Order summary</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Game" value={game.name} />
            <Row label={game.playerIdLabel} value={playerId.trim() || "—"} />
            {game.requiresZone && <Row label={game.zoneLabel ?? "Zone"} value={zoneId.trim() || "—"} />}
            {nickname && <Row label="Nickname" value={nickname} />}
            <Row
              label="Package"
              value={selectedPkg ? formatAmount(selectedPkg.amount, selectedPkg.bonus, selectedPkg.name) : "—"}
            />
            <Row label="Payment" value={paymentMeta?.name ?? "—"} />
          </dl>
          <div className="my-4 border-t border-dashed border-white/10" />
          <div className="flex items-end justify-between">
            <span className="text-sm text-slate-400">Total</span>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-white">
                {selectedPkg ? formatUsd(selectedPkg.priceUsd) : "$0.00"}
              </div>
              <div className="text-xs text-slate-400">
                ≈ {selectedPkg ? formatKhr(selectedPkg.priceUsd) : "៛0"}
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={!canReview}
            onClick={() => setShowReview(true)}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Review order
          </button>
          {!canReview && (
            <p className="mt-3 text-center text-xs text-slate-500">
              {!idReady
                ? `Enter your ${game.playerIdLabel.toLowerCase()} to continue`
                : !selectedPkg
                  ? "Choose a package to continue"
                  : "Select a payment method to continue"}
            </p>
          )}
        </div>
      </aside>

      {showReview && selectedPkg && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => !submitting && setShowReview(false)}
        >
          <div
            className="animate-fade-up w-full max-w-md rounded-t-3xl border border-white/10 bg-ink-900 p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Confirm your top-up</h3>
            <p className="mt-1 text-sm text-slate-400">
              Please check the details below. Credits are delivered to this account only.
            </p>
            <dl className="mt-4 space-y-2.5 rounded-xl bg-white/5 p-4 text-sm">
              <Row label="Game" value={game.name} />
              <Row label={game.playerIdLabel} value={playerId.trim()} strong />
              {game.requiresZone && <Row label={game.zoneLabel ?? "Zone"} value={zoneId.trim()} strong />}
              {nickname && <Row label="Nickname" value={nickname} />}
              <Row label="Package" value={formatAmount(selectedPkg.amount, selectedPkg.bonus, selectedPkg.name)} />
              <Row label="Payment" value={paymentMeta?.name ?? ""} />
              <Row label="Total" value={`${formatUsd(selectedPkg.priceUsd)} (≈ ${formatKhr(selectedPkg.priceUsd)})`} strong />
            </dl>
            {submitError && <p className="mt-3 text-sm text-rose-400">{submitError}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowReview(false)}
                className="rounded-full border border-white/15 py-2.5 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={placeOrder}
                className="rounded-full bg-gradient-to-r from-brand-400 to-brand-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Pay ${formatUsd(selectedPkg.priceUsd)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-slate-400">{label}</dt>
      <dd className={`truncate text-right ${strong ? "font-semibold text-white" : "text-slate-200"}`}>{value}</dd>
    </div>
  );
}

function StepCard({
  step,
  title,
  done,
  children,
}: {
  step: number;
  title: string;
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="card-glow rounded-2xl border border-white/5 bg-ink-800/60 p-5">
      <header className="mb-4 flex items-center gap-3">
        <span
          className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition ${
            done ? "bg-emerald-500 text-white" : "bg-brand-500 text-white"
          }`}
        >
          {done ? <CheckIcon className="h-4 w-4" /> : step}
        </span>
        <h2 className="text-base font-bold text-white">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function PackageGroup({
  items,
  currency,
  selected,
  onSelect,
}: {
  items: Package[];
  currency: string;
  selected: Package | null;
  onSelect: (p: Package) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((p) => {
        const active = selected?.id === p.id;
        const isCredit = p.amount > 1 || p.bonus > 0;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className={`relative flex flex-col rounded-xl border p-3 text-left transition ${
              active
                ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-400/30"
                : "border-white/10 bg-white/[0.03] hover:border-white/25"
            }`}
          >
            {p.isPopular && (
              <span className="absolute -top-2 left-3 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Popular
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm font-bold text-white">
              {isCredit && <DiamondIcon className="h-4 w-4 text-sky-300" />}
              {isCredit ? p.amount.toLocaleString("en-US") : p.name}
            </span>
            {isCredit && p.bonus > 0 && (
              <span className="mt-0.5 text-xs font-semibold text-emerald-300">+{p.bonus.toLocaleString("en-US")} bonus</span>
            )}
            {isCredit && p.bonus === 0 && <span className="mt-0.5 text-xs text-slate-400">{currency}</span>}
            <span className="mt-3 text-sm font-semibold text-brand-300">{formatUsd(p.priceUsd)}</span>
            <span className="text-[11px] text-slate-500">≈ {formatKhr(p.priceUsd)}</span>
          </button>
        );
      })}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2 2.5 9.2 12 22l9.5-12.8L12 2Z" />
    </svg>
  );
}
