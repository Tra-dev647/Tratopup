import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--bg2)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/brand/logo-00a6427d.png"
              alt="Tratopup"
              width={38}
              height={38}
              className="h-9 w-9 rounded-full"
            />
            <span className="text-[15px] font-extrabold">
              Khmer <span className="text-[var(--acc)]">TopUp</span>
            </span>
          </div>
          <p className="kt-khmer mt-3 max-w-xs text-[13px] leading-6 text-[var(--muted)]">{dict.footerAbout}</p>
          <div className="mt-4 flex gap-2">
            <a
              href="https://t.me/khmertopup"
              target="_blank"
              rel="noreferrer"
              className="kt-chip hover:border-[var(--acc)] hover:text-[var(--acc)]"
            >
              Telegram
            </a>
            <a
              href="https://www.facebook.com/share/1HgRVRmexd/"
              target="_blank"
              rel="noreferrer"
              className="kt-chip hover:border-[var(--acc)] hover:text-[var(--acc)]"
            >
              Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="kt-khmer text-[13px] font-bold uppercase tracking-wide text-[var(--text)]">
            {dict.navServices}
          </h4>
          <ul className="mt-3 space-y-2 text-[13px] text-[var(--muted)]">
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/games">
                {dict.navGames}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/services">
                {dict.navStore}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/api-docs">
                {dict.navApi}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/track">
                {dict.navTrack}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="kt-khmer text-[13px] font-bold uppercase tracking-wide text-[var(--text)]">Account</h4>
          <ul className="mt-3 space-y-2 text-[13px] text-[var(--muted)]">
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/register">
                {dict.register}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/login">
                {dict.login}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/orders">
                {dict.navOrders}
              </Link>
            </li>
            <li>
              <Link className="kt-khmer hover:text-[var(--acc)]" href="/terms">
                {dict.terms}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="kt-khmer text-[13px] font-bold uppercase tracking-wide text-[var(--text)]">
            {dict.payTitle}
          </h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white p-2">
              <Image src="/images/pay/khqr.png" alt="KHQR" width={34} height={22} className="h-6 w-auto object-contain" />
              <span className="text-[11px] font-bold">KHQR</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white p-2">
              <Image src="/images/pay/aba.png" alt="ABA Pay" width={34} height={22} className="h-6 w-auto object-contain" />
              <span className="text-[11px] font-bold">ABA</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white p-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#26a17b] text-[9px] font-black text-white">
                ₮
              </span>
              <span className="text-[11px] font-bold">USDT</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white p-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f3ba2f] text-[10px] font-black text-black">
                B
              </span>
              <span className="text-[11px] font-bold">Binance</span>
            </div>
          </div>
          <p className="kt-khmer mt-3 text-[11px] leading-5 text-[var(--muted)]">{dict.poweredBy}</p>
        </div>
      </div>

      <div className="border-t border-[var(--line)] py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-[12px] text-[var(--muted)] sm:flex-row sm:px-6">
          <span>© 2026 khmer-topup.com · {dict.rights}</span>
          <span className="kt-khmer flex items-center gap-3">
            <Link href="/terms" className="hover:text-[var(--acc)]">
              {dict.terms}
            </Link>
            <a href="https://t.me/khmertopup" target="_blank" rel="noreferrer" className="hover:text-[var(--acc)]">
              {dict.contact}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
