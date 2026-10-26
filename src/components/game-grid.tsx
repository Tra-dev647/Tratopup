"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Price } from "@/components/prefs";
import type { Dictionary } from "@/lib/i18n";
import type { GameWithPrice } from "@/lib/games";

type Filter = "all" | "popular" | "game" | "social";

export function GameGrid({
  games,
  dict,
  initialQuery = "",
  limit,
  showFilters = true,
}: {
  games: GameWithPrice[];
  dict: Dictionary;
  initialQuery?: string;
  limit?: number;
  showFilters?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>("all");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return games.filter((game) => {
      if (filter === "popular" && !game.popular) return false;
      if (filter === "social" && game.category !== "social") return false;
      if (filter === "game" && game.category === "social") return false;
      if (!term) return true;
      return (
        game.name.toLowerCase().includes(term) ||
        game.slug.toLowerCase().includes(term) ||
        game.nameKm.toLowerCase().includes(term) ||
        game.publisher.toLowerCase().includes(term)
      );
    });
  }, [games, query, filter]);

  const visible = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  const chips: Array<{ key: Filter; label: string }> = [
    { key: "all", label: dict.allGames },
    { key: "popular", label: dict.popular },
    { key: "game", label: "Game" },
    { key: "social", label: "Social" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.searchPlaceholder}
            className="kt-input kt-khmer pl-11"
            aria-label={dict.searchPlaceholder}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--err)]"
            >
              ✕
            </button>
          )}
        </div>
        {showFilters && (
          <div className="kt-scroll-x flex gap-2 overflow-x-auto pb-1">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  startTransition(() => setFilter(chip.key));
                  router.prefetch("/games");
                }}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-[12.5px] font-bold transition ${
                  filter === chip.key
                    ? "border-transparent bg-[var(--acc)] text-white shadow-[0_6px_16px_rgba(13,110,253,0.25)]"
                    : "border-[var(--line)] bg-white text-[#3c4453] hover:border-[#c9d6e8]"
                }`}
              >
                <span className="kt-khmer">{chip.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg2)] py-14 text-center">
          <p className="kt-khmer text-sm text-[var(--muted)]">{dict.noResults}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="kt-khmer mt-3 text-sm font-bold text-[var(--acc)] hover:underline"
          >
            {dict.clearFilter}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((game) => (
            <Link
              key={game.slug}
              href={`/game/${game.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#c9d6e8] hover:shadow-[var(--shadow-lg)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#eef3fb]">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.04]"
                />
                {game.popular && (
                  <span className="kt-khmer absolute left-2 top-2 rounded-md bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                    {game.badge ?? dict.popular}
                  </span>
                )}
              </div>
              <div className="p-2.5 sm:p-3">
                <p className="truncate text-[13px] font-extrabold text-[var(--text)]">{game.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                  {game.publisher || (game.category === "social" ? "Social" : "Game")}
                </p>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <span className="text-[11px] text-[var(--muted)]">
                    {game.fromCents > 0 ? (
                      <>
                        from <Price cents={game.fromCents} className="font-bold text-[#3c4453]" />
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                  <span className="rounded-lg bg-[var(--acc-soft)] px-2 py-1 text-[10.5px] font-extrabold text-[var(--acc)] transition group-hover:bg-[var(--acc)] group-hover:text-white">
                    {dict.topUpNow}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
