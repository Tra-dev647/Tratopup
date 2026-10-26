import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/buy-panel";
import { GameGrid } from "@/components/game-grid";
import { getGameWithPackages, getGamesWithPrices } from "@/lib/games";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";
import { getCurrentUser } from "@/lib/auth";
import type { GameInfo, PackageInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ locale }, data, allGames, user] = await Promise.all([
    getPrefs(),
    getGameWithPackages(slug),
    getGamesWithPrices(),
    getCurrentUser(),
  ]);
  if (!data) notFound();

  const dict = getDict(locale);
  const km = locale === "km";
  const { game, packages } = data;
  const related = allGames.filter((item) => item.slug !== game.slug).slice(0, 5);

  const gameInfo: GameInfo = {
    slug: game.slug,
    name: game.name,
    nameKm: game.nameKm,
    image: game.image,
    publisher: game.publisher,
    fields: game.fields,
    idHintKm: game.idHintKm,
    idHintEn: game.idHintEn,
  };
  const packageInfo: PackageInfo[] = packages.map((pkg) => ({
    packageId: pkg.packageId,
    name: pkg.name,
    priceCents: pkg.priceCents,
    oldPriceCents: pkg.oldPriceCents,
    popular: pkg.popular,
  }));

  const idLabel = game.fields.phone ? dict.phone : dict.userId;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <nav className="kt-khmer flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--acc)]">
          {km ? "ទំព័រដើម" : "Home"}
        </Link>
        <span>›</span>
        <Link href="/games" className="hover:text-[var(--acc)]">
          {dict.allGames}
        </Link>
        <span>›</span>
        <span className="font-semibold text-[var(--text)]">{game.name}</span>
      </nav>

      <div className="kt-card mt-3 overflow-hidden">
        <div className="relative flex flex-col gap-4 bg-[linear-gradient(112deg,#f3f7ff_0%,#fff_68%)] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--line)] sm:h-24 sm:w-24">
            <Image src={game.image} alt={game.name} fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-extrabold leading-tight sm:text-[24px]">{game.name}</h1>
              {game.popular && (
                <span className="kt-khmer rounded-md bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-1.5 py-0.5 text-[9.5px] font-extrabold text-white">
                  {game.badge ?? dict.popular}
                </span>
              )}
            </div>
            <p className="kt-khmer mt-0.5 text-[12px] text-[var(--muted)]">
              {game.nameKm} · {game.publisher || "Tratopup"} · {packages.length} {dict.packages}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="kt-chip !py-1 !text-[10.5px]">
                <span className="text-[var(--ok)]">✓</span> <span className="kt-khmer">{dict.instant}</span>
              </span>
              <span className="kt-chip !py-1 !text-[10.5px]">
                <span className="text-[var(--ok)]">✓</span> <span className="kt-khmer">{dict.secure}</span>
              </span>
              <span className="kt-chip !py-1 !text-[10.5px]">
                <span className="text-[var(--ok)]">✓</span> <span className="kt-khmer">{dict.verified}</span>
              </span>
            </div>
          </div>
          <div className="sm:ml-auto">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#cfe0ff] bg-white px-3 py-2 text-[11px] font-bold text-[var(--acc)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" />
              KHQR · Bakong API
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <BuyPanel
          game={gameInfo}
          packages={packageInfo}
          dict={dict}
          locale={locale}
          isAuthed={Boolean(user)}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="kt-card p-4 sm:p-5">
          <h2 className="kt-khmer flex items-center gap-2 text-[14.5px] font-extrabold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--acc-soft)] text-[var(--acc)]">?</span>
            {dict.searchIdHint}
          </h2>
          <ol className="kt-khmer mt-3 space-y-2.5 text-[12.5px] leading-6 text-[#4c5566]">
            <li className="flex gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--bg2)] text-[10px] font-bold text-[var(--muted)]">
                1
              </span>
              {km ? game.idHintKm : game.idHintEn}
            </li>
            <li className="flex gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--bg2)] text-[10px] font-bold text-[var(--muted)]">
                2
              </span>
              {km
                ? `បញ្ចូល ${idLabel}${game.fields.zoneId ? " និង Zone ID" : ""} នៅខាងស្តាំ រួចជ្រើសរើសកញ្ចប់ដែលអ្នកចង់បាន។`
                : `Enter your ${idLabel}${game.fields.zoneId ? " and Zone ID" : ""} on the right and choose the package you want.`}
            </li>
            <li className="flex gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--bg2)] text-[10px] font-bold text-[var(--muted)]">
                3
              </span>
              {km
                ? "ស្កេន KHQR ហើយបង់ប្រាក់ — ប្រព័ន្ធនឹងពិនិត្យស្ថានភាព និងដឹកជញ្ជូនភ្លាមៗ។"
                : "Scan the KHQR and pay — we verify the transaction and deliver instantly."}
            </li>
          </ol>
          <div className="kt-khmer mt-4 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-3 py-2 text-[11.5px] leading-5 text-[#92400e]">
            {km
              ? "សូមពិនិត្យ ID ឲ្យបានត្រឹមត្រូវមុនបង់ប្រាក់។ ការបញ្ចូល ID ខុសអាចបណ្តាលឲ្យបាត់បង់កញ្ចប់។"
              : "Double-check your ID before paying. An incorrect ID may result in a lost package."}
          </div>
        </div>

        <div className="kt-card p-4 sm:p-5">
          <h2 className="kt-khmer text-[14px] font-extrabold">API · {game.name}</h2>
          <p className="kt-khmer mt-1 text-[11.5px] leading-5 text-[var(--muted)]">
            {km
              ? "ធ្វើការបញ្ចូលទឹកប្រាក់ដោយស្វ័យប្រវត្តិពីគេហទំព័រ ឬ bot ផ្ទាល់ខ្លួនរបស់អ្នក។"
              : "Automate top-ups from your own website or bot with your reseller API key."}
          </p>
          <dl className="mt-3 space-y-2 text-[11.5px]">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-[var(--muted)]">Base URL</dt>
              <dd className="truncate font-mono text-[11px] font-semibold">https://khmer-topup.com/api/v1</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-[var(--muted)]">{km ? "កូដហ្គេម" : "Game code"}</dt>
              <dd className="font-mono text-[11px] font-semibold">{game.slug}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-[var(--muted)]">{km ? "ការផ្ទៀងផ្ទាត់" : "Auth"}</dt>
              <dd className="font-mono text-[11px] font-semibold">X-API-Key</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-[var(--muted)]">{km ? "ចំនួនកញ្ចប់" : "Packages"}</dt>
              <dd className="font-mono text-[11px] font-semibold">{packages.length}</dd>
            </div>
          </dl>
          <Link href="/api-docs" className="kt-khmer mt-3 inline-block text-[12px] font-bold text-[var(--acc)] hover:underline">
            {dict.apiDocs} →
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="kt-khmer text-[18px] font-extrabold">{km ? "ហ្គេមពេញនិយមផ្សេងទៀត" : "More popular games"}</h2>
        <div className="mt-4">
          <GameGrid games={related} dict={dict} showFilters={false} />
        </div>
      </section>
    </div>
  );
}
