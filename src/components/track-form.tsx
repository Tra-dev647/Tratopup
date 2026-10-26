"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/format";
import type { Dictionary } from "@/lib/i18n";

export function TrackForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const km = locale === "km";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(value)}`, { cache: "no-store" });
      if (!res.ok) {
        setError(dict.orderNotFound);
        return;
      }
      router.push(`/order/${value}`);
    } catch {
      setError(km ? "ការតភ្ជាប់បរាជ័យ សូមព្យាយាមម្តងទៀត។" : "Connection failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder={dict.trackPlaceholder}
          className="kt-input kt-khmer font-mono uppercase"
          aria-label={dict.trackPlaceholder}
        />
        <button type="submit" disabled={loading} className="kt-btn kt-btn-primary kt-khmer px-5 py-3 text-sm disabled:opacity-60">
          {loading ? dict.checking : dict.trackBtn}
        </button>
      </div>
      {error && (
        <p className="kt-khmer mt-2 rounded-lg border border-[#fecaca] bg-[#fff1f1] px-3 py-2 text-[12px] font-medium text-[var(--err)]">
          {error}
        </p>
      )}
    </form>
  );
}
