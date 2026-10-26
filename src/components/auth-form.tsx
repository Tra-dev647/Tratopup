"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function AuthForm({ mode, dict }: { mode: "login" | "register"; dict: Dictionary }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    if (isRegister) {
      payload.name = String(formData.get("name") ?? "");
      payload.phone = String(formData.get("phone") ?? "");
    }
    try {
      const res = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/orders");
      router.refresh();
    } catch {
      setError("Connection failed, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {isRegister && (
        <label className="block">
          <span className="kt-khmer mb-1 block text-[12px] font-semibold text-[#3c4453]">ឈ្មោះ / Full name</span>
          <input name="name" required minLength={2} className="kt-input" placeholder="Sok Dara" />
        </label>
      )}
      <label className="block">
        <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">Email</span>
        <input name="email" type="email" required className="kt-input" placeholder="you@example.com" autoComplete="email" />
      </label>
      {isRegister && (
        <label className="block">
          <span className="mb-1 block text-[12px] font-semibold text-[#3c4453]">លេខទូរស័ព្ទ / Phone</span>
          <input name="phone" className="kt-input" placeholder="+855 12 345 678" autoComplete="tel" />
        </label>
      )}
      <label className="block">
        <span className="kt-khmer mb-1 block text-[12px] font-semibold text-[#3c4453]">
          លេខសម្ងាត់ / Password
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="kt-input"
          placeholder="••••••••"
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
      </label>

      {error && (
        <p className="kt-khmer rounded-lg border border-[#fecaca] bg-[#fff1f1] px-3 py-2 text-[12px] font-medium text-[var(--err)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="kt-btn kt-btn-primary kt-khmer w-full py-3 text-sm disabled:opacity-60">
        {loading ? "…" : isRegister ? dict.register : dict.login}
      </button>

      <p className="kt-khmer pt-1 text-center text-[12px] text-[var(--muted)]">
        {isRegister ? (
          <>
            មានគណនីរួចហើយ?{" "}
            <Link href="/login" className="font-bold text-[var(--acc)] hover:underline">
              {dict.login}
            </Link>
          </>
        ) : (
          <>
            មិនទាន់មានគណនី?{" "}
            <Link href="/register" className="font-bold text-[var(--acc)] hover:underline">
              {dict.register}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
