import Image from "next/image";
import { Price } from "@/components/prefs";
import type { Dictionary } from "@/lib/i18n";

export type FeedItem = {
  id: number;
  gameName: string;
  packageName: string;
  maskedPlayer: string;
  priceCents: number;
  image: string;
};

export function LiveTicker({ items, dict }: { items: FeedItem[]; dict: Dictionary }) {
  const list = items.length > 0 ? [...items, ...items] : [];
  if (list.length === 0) return null;

  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="flex items-center gap-3 py-2.5">
        <div className="hidden shrink-0 items-center gap-1.5 border-r border-[var(--line)] pl-4 pr-3 text-[11px] font-bold uppercase tracking-wide text-[var(--ok)] sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ok)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ok)]" />
          </span>
          Live
        </div>
        <div className="overflow-hidden">
          <div className="kt-marquee gap-3">
            {list.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg2)] py-1 pl-1 pr-3"
              >
                <Image
                  src={item.image}
                  alt={item.gameName}
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px] rounded-full object-cover"
                />
                <span className="text-[11.5px] text-[var(--muted)]">
                  <span className="font-bold text-[var(--text)]">{item.maskedPlayer}</span>{" "}
                  <span className="kt-khmer">{dict.bought}</span>{" "}
                  <span className="font-semibold text-[#3c4453]">{item.gameName}</span>{" "}
                  {item.packageName} <span className="font-bold text-[var(--ok)]">· <Price cents={item.priceCents} /></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
