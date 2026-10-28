"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  gameId: number;
  initial: boolean;
  size?: "sm" | "md";
  onChange?: (favorited: boolean) => void;
};

export default function FavoriteButton({ gameId, initial, size = "sm", onChange }: Props) {
  const [fav, setFav] = useState(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    onChange?.(next);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { favorited: boolean };
      setFav(data.favorited);
      onChange?.(data.favorited);
      startTransition(() => router.refresh());
    } catch {
      setFav(!next);
      onChange?.(!next);
    }
  }

  const dim = size === "md" ? "h-10 w-10" : "h-8 w-8";
  const icon = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      className={`${dim} grid place-items-center rounded-full border backdrop-blur transition active:scale-90 ${
        fav
          ? "border-rose-400/40 bg-rose-500/20 text-rose-400"
          : "border-white/10 bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={icon}
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        />
      </svg>
    </button>
  );
}
