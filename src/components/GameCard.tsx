import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/db/schema";
import FavoriteButton from "./FavoriteButton";

export default function GameCard({ game, favorited }: { game: Game; favorited: boolean }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="card-glow group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-800/70 transition hover:-translate-y-1 hover:border-brand-400/40"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={game.imageUrl}
          alt={game.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/90 to-transparent" />
        <div className="absolute right-2 top-2">
          <FavoriteButton gameId={game.id} initial={favorited} />
        </div>
        {game.isFeatured && (
          <span className="absolute left-2 top-2 rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            Hot
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{game.name}</h3>
        <p className="mt-1 text-xs text-slate-400">{game.publisher}</p>
        <span className="mt-auto pt-3 text-xs font-medium text-brand-300">{game.currencyName} →</span>
      </div>
    </Link>
  );
}
