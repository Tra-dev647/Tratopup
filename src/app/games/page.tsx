import Link from "next/link";
import { GameGrid } from "@/components/game-grid";
import { getGamesWithPrices } from "@/lib/games";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ locale }, games, params] = await Promise.all([getPrefs(), getGamesWithPrices(), searchParams]);
  const dict = getDict(locale);
  const km = locale === "km";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
      <nav className="kt-khmer flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--acc)]">
          {km ? "ទំព័រដើម" : "Home"}
        </Link>
        <span>›</span>
        <span className="font-semibold text-[var(--text)]">{dict.allGames}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="kt-khmer text-[24px] font-extrabold tracking-tight sm:text-[28px]">{dict.allGames}</h1>
          <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">
            {km
              ? `${games.length} ហ្គេម និងសេវាកម្ម · បង់ប្រាក់តាម KHQR · ដឹកជញ្ជូនភ្លាមៗ`
              : `${games.length} games & services · pay by KHQR · instant delivery`}
          </p>
        </div>
        <Link href="/track" className="kt-btn kt-btn-ghost kt-khmer px-3.5 py-2 text-[12.5px]">
          {dict.navTrack}
        </Link>
      </div>

      <div className="mt-5">
        <GameGrid games={games} dict={dict} initialQuery={params.q ?? ""} />
      </div>
    </div>
  );
}
