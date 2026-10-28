"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    eyebrow: "Instant delivery",
    title: "Diamonds, delivered in seconds",
    body: "Top up Mobile Legends: Bang Bang Diamonds quickly with Tratopup.",
    cta: { href: "/games/mobile-legends", label: "Top up MLBB" },
    tint: "from-ink-950/95 via-ink-950/70 to-transparent",
  },
  {
    eyebrow: "Limited event",
    title: "Choose your Diamonds package",
    body: "Select a Diamonds package and enter your MLBB Player ID and Zone ID.",
    cta: { href: "/games/mobile-legends", label: "Choose Diamonds" },
    tint: "from-brand-700/90 via-ink-950/70 to-transparent",
  },
  {
    eyebrow: "New",
    title: "Fast and simple top-up",
    body: "Use Tratopup to place and track your Mobile Legends top-up order.",
    cta: { href: "/games/mobile-legends", label: "Top up MLBB" },
    tint: "from-violet-900/90 via-ink-950/70 to-transparent",
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="card-glow relative overflow-hidden rounded-3xl border border-white/5">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/8]">
        <Image
          src="/images/banner-diamonds.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.tint} transition-colors duration-700`} />

        <div key={index} className="animate-fade-up absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            {slide.eyebrow}
          </span>
          <h1 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-200 sm:mt-3 sm:text-base">{slide.body}</p>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
            <Link
              href={slide.cta.href}
              className="rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:brightness-110"
            >
              {slide.cta.label}
            </Link>
            <Link
              href="#games"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Browse all games
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-1.5 sm:bottom-6 sm:right-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-400" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
