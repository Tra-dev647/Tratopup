"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrencySwitcher, LanguageSwitcher } from "@/components/prefs";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/format";

type SessionUser = { id: number; name: string; email: string } | null;

export function SiteHeader({ locale, dict, user }: { locale: Locale; dict: Dictionary; user: SessionUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenu(false);
    router.refresh();
  }

  const nav = [
    { href: "/", label: dict.navTopup },
    { href: "/games", label: dict.navGames },
    { href: "/track", label: dict.navTrack },
    { href: "/services", label: dict.navStore },
    { href: "/api-docs", label: dict.navApi },
  ];

  return (
    <>
      <div className="hidden bg-[#0b1a33] py-1.5 text-center text-[12px] font-medium text-[#cfe0ff] md:block">
        <span className="kt-khmer">
          ⚡ {dict.poweredBy} · KHQR · ABA · ACLEDA · Wing · Bakong — {locale === "km" ? "ដឹកជញ្ជូនភ្លាមៗ ២៤/៧" : "instant delivery 24/7"}
        </span>
      </div>
      <header
        className={`sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-[0_4px_20px_rgba(16,24,40,0.06)]" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/brand/logo-00a6427d.png"
              alt="Tratopup"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-[var(--text)]">
                Khmer <span className="text-[var(--acc)]">TopUp</span>
              </span>
              <span className="kt-khmer mt-0.5 text-[10px] font-medium text-[var(--muted)]">ថបអាប់ហ្គេម លឿន</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="kt-khmer rounded-lg px-3 py-2 text-[13.5px] font-semibold text-[#3c4453] transition hover:bg-[var(--bg2)] hover:text-[var(--acc)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <CurrencySwitcher />
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm font-semibold transition hover:border-[#c9d6e8]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--acc-soft)] text-[12px] font-extrabold text-[var(--acc)]">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[110px] truncate sm:inline">{user.name}</span>
                </button>
                {menu && (
                  <>
                    <button className="fixed inset-0 z-30 cursor-default" onClick={() => setMenu(false)} aria-label="close" />
                    <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-[var(--line)] bg-white p-1.5 shadow-[var(--shadow-lg)]">
                      <div className="px-2 py-1.5 text-[11px] text-[var(--muted)]">{user.email}</div>
                      <Link
                        href="/orders"
                        onClick={() => setMenu(false)}
                        className="kt-khmer block rounded-lg px-2 py-2 text-sm font-medium hover:bg-[var(--bg2)]"
                      >
                        {dict.navOrders}
                      </Link>
                      <Link
                        href="/track"
                        onClick={() => setMenu(false)}
                        className="kt-khmer block rounded-lg px-2 py-2 text-sm font-medium hover:bg-[var(--bg2)]"
                      >
                        {dict.navTrack}
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="kt-khmer mt-1 block w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-[var(--err)] hover:bg-[#fff1f1]"
                      >
                        {dict.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login" className="kt-khmer kt-btn kt-btn-ghost px-3 py-2 text-sm">
                  {dict.login}
                </Link>
                <Link href="/register" className="kt-btn kt-btn-primary kt-khmer px-3.5 py-2 text-sm">
                  {dict.register}
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-white lg:hidden"
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-[var(--line)] bg-white px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="kt-khmer rounded-lg px-3 py-2.5 text-sm font-semibold text-[#3c4453] hover:bg-[var(--bg2)]"
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="kt-btn kt-btn-ghost kt-khmer py-2.5 text-sm">
                    {dict.login}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="kt-btn kt-btn-primary kt-khmer py-2.5 text-sm"
                  >
                    {dict.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
