import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopUpFlow from "@/components/TopUpFlow";
import FavoriteButton from "@/components/FavoriteButton";
import { getGameBySlug, listFavoriteGameIds, listPackagesForGame } from "@/lib/queries";
import { getSessionId } from "@/lib/session";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  return { title: game ? `${game.name} Top-Up` : "Game not found" };
}

export default async function GamePage({ params }: Params) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const sid = await getSessionId();
  const [packages, favIds] = await Promise.all([listPackagesForGame(game.id), listFavoriteGameIds(sid)]);

  return (
    <div className="space-y-6">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#games" className="hover:text-white">Games</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{game.name}</span>
      </nav>

      <section className="card-glow relative overflow-hidden rounded-3xl border border-white/5 bg-ink-800/70">
        <div className="absolute inset-0 opacity-30">
          <Image src={game.imageUrl} alt="" fill sizes="100vw" className="object-cover blur-2xl" />
        </div>
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/10 sm:h-28 sm:w-28">
            <Image src={game.imageUrl} alt={game.name} fill sizes="112px" className="object-cover" priority />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                {game.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Official partner
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{game.name}</h1>
            <p className="mt-1 text-sm text-slate-300">
              {game.publisher} · {game.currencyName}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{game.description}</p>
          </div>
          <div className="flex gap-2 sm:self-start">
            <FavoriteButton gameId={game.id} initial={favIds.includes(game.id)} size="md" />
          </div>
        </div>
        <div className="relative grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 bg-ink-950/40 text-center text-xs">
          {[
            ["⚡", "Instant delivery"],
            ["🔒", "Secure payment"],
            ["🕗", "Support 8:00 – 23:00"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center justify-center gap-1.5 py-3 text-slate-300">
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <TopUpFlow game={game} packages={packages} />
    </div>
  );
}
