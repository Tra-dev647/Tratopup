import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Tratopup home">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" aria-hidden>
          <path d="M12 2 2.5 9.2 12 22l9.5-12.8L12 2Zm0 3.1 5.2 4H6.8L12 5.1ZM6.2 11h11.6L12 18.6 6.2 11Z" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-base font-extrabold tracking-tight text-white">
            Tra<span className="text-brand-400">topup</span>
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Game Credits
          </span>
        </span>
      )}
    </Link>
  );
}
