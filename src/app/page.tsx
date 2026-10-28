import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import GameGrid from "@/components/GameGrid";
import { listFavoriteGameIds, listGames } from "@/lib/queries";
import { getSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    title: "Find the pack that fits",
    body: "Compare bundles side by side and pick the amount that matches how you play.",
    icon: "💎",
  },
  {
    title: "Three steps, then back to the game",
    body: "Choose a title, enter your player details and confirm. No account setup needed.",
    icon: "⚡",
  },
  {
    title: "Keep favorites one tap away",
    body: "Heart the games you top up most and they'll be waiting on your next visit.",
    icon: "❤️",
  },
  {
    title: "Every order on record",
    body: "Status, amount and player details for each top-up live in your order history.",
    icon: "🧾",
  },
];

export default async function HomePage() {
  const sid = await getSessionId();
  const [games, favoriteIds] = await Promise.all([listGames(), listFavoriteGameIds(sid)]);
  const featured = games.filter((g) => g.isFeatured);

  return (
    <div className="space-y-12">
      <HeroBanner />

      {featured.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Trending now</p>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Popular top-ups</h2>
            </div>
            <Link href="#games" className="text-sm font-medium text-slate-300 hover:text-white">
              View all
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {featured.map((g) => (
              <Link
                key={g.id}
                href={`/games/${g.slug}`}
                className="card-glow flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-white/5 bg-ink-800/70 p-3 transition hover:border-brand-400/40 sm:w-auto"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={g.imageUrl} alt={g.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{g.name}</p>
                  <p className="truncate text-xs text-slate-400">{g.currencyName}</p>
                </div>
                <span className="ml-auto rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-300">
                  Top up
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="games" className="scroll-mt-24">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Catalog</p>
          <h2 className="text-xl font-bold text-white sm:text-2xl">All games</h2>
        </div>
        <GameGrid games={games} favoriteIds={favoriteIds} />
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Why Tratopup</p>
          <h2 className="text-xl font-bold text-white sm:text-2xl">Built around your play session</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-glow rounded-2xl border border-white/5 bg-ink-800/60 p-5 transition hover:border-white/15"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-2xl">{f.icon}</div>
              <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-glow relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-ink-800 to-ink-950 p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
        <h2 className="relative text-2xl font-extrabold text-white sm:text-3xl">
          Many games. One checkout.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          Whether it&apos;s your nightly ranked grind or a brand-new world you just downloaded, the credits you
          need are a few taps away.
        </p>
        <Link
          href="#games"
          className="relative mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-brand-100"
        >
          Start a top-up
        </Link>
      </section>
    </div>
  );
}
