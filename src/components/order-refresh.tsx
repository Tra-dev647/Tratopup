"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/format";

export function OrderRefresh({
  code,
  status,
  locale,
}: {
  code: string;
  status: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const km = locale === "km";

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/orders/${code}?sync=1`, { cache: "no-store" });
      const data = (await res.json()) as {
        ok: boolean;
        paid?: boolean;
        order?: { status: string };
        providerMessage?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setMessage(data.error ?? (km ? "រកមិនឃើញការបញ្ជាទិញ" : "Order not found"));
        return;
      }
      setMessage(data.providerMessage ?? "");
      if (data.order?.status !== status) router.refresh();
    } catch {
      setMessage(km ? "ការតភ្ជាប់បរាជ័យ" : "Connection failed");
    } finally {
      setChecking(false);
    }
  }, [code, status, router, km]);

  useEffect(() => {
    if (status !== "pending") return;
    const timer = setInterval(() => {
      void check();
    }, 7000);
    return () => clearInterval(timer);
  }, [status, check]);

  if (status !== "pending") return null;

  return (
    <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg2)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--amber)]">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[var(--amber)]" />
          {km ? "កំពុងរង់ចាំការបង់ប្រាក់" : "Waiting for payment"}
        </span>
        <button
          type="button"
          onClick={() => void check()}
          disabled={checking}
          className="kt-btn kt-btn-ghost ml-auto px-3 py-1.5 text-[11.5px] font-bold disabled:opacity-60"
        >
          {checking ? (km ? "កំពុងពិនិត្យ…" : "Checking…") : km ? "ពិនិត្យស្ថានភាព" : "Check status"}
        </button>
      </div>
      {message && <p className="mt-1.5 text-[10.5px] text-[var(--muted)]">{message}</p>}
    </div>
  );
}
