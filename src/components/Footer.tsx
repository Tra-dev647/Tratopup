import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/5 bg-ink-950/60 pb-24 md:pb-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Mobile Legends: Bang Bang top-ups with simple checkout and order tracking.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["KHQR", "Bakong"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/#games" className="hover:text-white">All games</Link></li>
            <li><Link href="/favorites" className="hover:text-white">Favorites</Link></li>
            <li><Link href="/orders" className="hover:text-white">My orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/#how-it-works" className="hover:text-white">How it works</Link></li>
            <li><span className="cursor-default">Telegram: Contact support</span></li>
            <li><span className="cursor-default">Daily 8:00 – 23:00</span></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 border-t border-white/5 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} Tratopup. All rights reserved.</span>
        <span>Game names and artwork shown are illustrative for this demo store.</span>
      </div>
    </footer>
  );
}
