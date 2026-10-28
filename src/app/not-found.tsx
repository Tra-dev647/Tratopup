import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card-glow mx-auto mt-10 max-w-md rounded-3xl border border-white/5 bg-ink-800/60 p-10 text-center">
      <p className="text-6xl font-black text-white/10">404</p>
      <h1 className="mt-2 text-xl font-bold text-white">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-sm text-slate-400">
        The game or order you&apos;re looking for doesn&apos;t exist or isn&apos;t available on this device.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
