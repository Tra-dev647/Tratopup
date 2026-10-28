import Link from "next/link";
import type { Metadata } from "next";
import GameCard from "@/components/GameCard";
import { listFavoriteGames } from "@/lib/queries";
import { getSessionId } from "@/lib/session";

export const metadata: Metadata = { title: "Favorites" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const sid = await getSessionId();
  const games = await listFavoriteGames(sid);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Saved</p>
        <h1 className="text-2xl font-bold text-white">Your favorites</h1>
        <p className="mt-1 text-sm text-slate-400">Games you&apos;ve hearted, ready for your next top-up.</p>
      </div>

      {games.length === 0 ? (
        <div className="card-glow rounded-3xl border border-dashed border-white/10 bg-ink-800/40 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-500/10 text-2xl">❤️</div>
          <h2 className="mt-4 text-lg font-semibold text-white">No favorites yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            Tap the heart on any game card to pin it here. Your list is saved on this device.
          </p>
          <Link
            href="/#games"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
          >
            Browse games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {games.map((g) => (
            <GameCard key={g.id} game={g} favorited />
          ))}
        </div>
      )}
    </div>
  );
}
