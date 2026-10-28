"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/db/schema";
import GameCard from "./GameCard";

export default function GameGrid({ games, favoriteIds }: { games: Game[]; favoriteIds: number[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(games.map((g) => g.category)))], [games]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      const matchesQuery =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.publisher.toLowerCase().includes(q) ||
        g.currencyName.toLowerCase().includes(q);
      const matchesCat = category === "All" || g.category === category;
      return matchesQuery && matchesCat;
    });
  }, [games, query, category]);

  const favSet = new Set(favoriteIds);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search games</span>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
          />
        </label>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c
                  ? "bg-white text-ink-950"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-400">
          No games match “{query}”. Try another name.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} favorited={favSet.has(g.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
