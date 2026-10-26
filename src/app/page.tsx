import Image from "next/image";
import Link from "next/link";
import { GameGrid } from "@/components/game-grid";
import { LiveTicker } from "@/components/live-ticker";
import { Price } from "@/components/prefs";
import { getDict } from "@/lib/i18n";
import { getGamesWithPrices, getPopularGames, getRecentPurchases } from "@/lib/games";
import { getPrefs } from "@/lib/locale";
import { qrDataUrl } from "@/lib/bakong";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ locale }, games, popular, recent, qrImage] = await Promise.all([
    getPrefs(),
    getGamesWithPrices(),
    getPopularGames(8),
    getRecentPurchases(12),
    qrDataUrl("https://khmer-topup.com/km/"),
  ]);
  const dict = getDict(locale);
  const km = locale === "km";
  const imageBySlug = new Map(games.map((game) => [game.slug, game.image]));
  const feed = recent.map((item) => ({
    id: item.id,
    gameName: item.gameName,
    packageName: item.packageName,
    maskedPlayer: item.maskedPlayer,
    priceCents: item.priceCents,
    image: imageBySlug.get(item.gameSlug) ?? "/images/games/mobile-legends-real.webp",
  }));
  const featured = popular[0] ?? games[0];

  const highlights = [
    {
      title: km ? "ដឹកជញ្ជូនភ្លាមៗ" : "Instant delivery",
      body: km
        ? "ប្រព័ន្ធស្វ័យប្រវត្តិដឹកជញ្ជូនក្នុងរយៈពេលប៉ុន្មានវិនាទី បន្ទាប់ពីបង់ប្រាក់ — ២៤/៧។"
        : "Automated delivery within seconds after payment — 24/7, no waiting.",
      icon: "bolt",
    },
    {
      title: km ? "សុវត្ថិភាព ១០០%" : "100% secure",
      body: km
        ? "បង់ប្រាក់តាម KHQR របស់ Bakong (ធនាគារជាតិកម្ពុជា) — គ្មានការបញ្ចូលលេខកាតឡើយ។"
        : "Pay with KHQR by Bakong (National Bank of Cambodia) — never enter card details.",
      icon: "shield",
    },
    {
      title: km ? "តម្លៃល្អបំផុត" : "Best prices",
      body: km
        ? "តម្លៃសមរម្យបំផុតនៅកម្ពុជា ជាមួយបញ្ជីតម្លៃច្បាស់លាស់ និងគ្មានថ្លៃបន្ថែម។"
        : "The best rates in Cambodia with transparent pricing and zero hidden fees.",
      icon: "tag",
    },
  ];

  const steps = [
    { n: "01", title: dict.step1, body: dict.step1d },
    { n: "02", title: dict.step2, body: dict.step2d },
    { n: "03", title: dict.step3, body: dict.step3d },
  ];

  const faqs = [
    {
      q: km ? "តើត្រូវចំណាយពេលប៉ុន្មានដើម្បីទទួលបានពេជ្រ?" : "How long does delivery take?",
      a: km
        ? "ជាធម្មតាក្រោម ១ នាទី។ ប្រព័ន្ធពិនិត្យការបង់ប្រាក់តាម Bakong API ដោយស្វ័យប្រវត្តិ ហើយដឹកជញ្ជូនភ្លាមៗនៅពេលបានបញ្ជាក់។"
        : "Usually under one minute. Payments are confirmed automatically through the Bakong API and the package is delivered right away.",
    },
    {
      q: km ? "តើខ្ញុំអាចបង់ប្រាក់ដោយរបៀបណា?" : "How can I pay?",
      a: km
        ? "ស្កេន QR ជាមួយកម្មវិធីធនាគារណាមួយដែលគាំទ្រ KHQR ដូចជា ABA, ACLEDA, Wing, Canadia, ឬ Bakong។"
        : "Scan the QR with any KHQR-enabled banking app such as ABA, ACLEDA, Wing, Canadia or Bakong.",
    },
    {
      q: km ? "តើត្រូវបញ្ចូល ID ខុសធ្វើដូចម្តេច?" : "What if I enter the wrong ID?",
      a: km
        ? "សូមពិនិត្យ User ID និង Zone ID/Server មុនពេលបង់ប្រាក់។ ប្រសិនបើមានបញ្ហា សូមទាក់ទង Telegram @khmertopup ជាមួយលេខបញ្ជាទិញ។"
        : "Please double-check your User ID and Zone/Server before paying. If something goes wrong, message @khmertopup on Telegram with your order code.",
    },
    {
      q: km ? "តើទិន្នន័យរបស់ខ្ញុំមានសុវត្ថិភាពទេ?" : "Is my data safe?",
      a: km
        ? "យើងមិនរក្សាទុកព័ត៌មានកាតធនាគារទេ។ ការបង់ប្រាក់ធ្វើឡើងតាម KHQR ហើយប្រព័ន្ធពិនិត្យតែ MD5 នៃ QR ប៉ុណ្ណោះ។"
        : "We never store card details. Payments happen over KHQR and we only verify the QR MD5 through the Bakong API.",
    },
  ];

  return (
    <>
      <section className="kt-hero-glow border-b border-[var(--line)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:py-14">
          <div className="kt-fade-up">
            <span className="kt-chip !border-[#cfe0ff] !bg-white !text-[var(--acc)]">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--acc)] text-[9px] text-white">⚡</span>
              <span className="kt-khmer">{dict.heroBadge}</span>
            </span>
            <h1 className="kt-khmer mt-4 text-[clamp(1.75rem,4.4vw,2.9rem)] font-extrabold leading-[1.25] tracking-tight text-[var(--text)]">
              {km ? (
                <>
                  បញ្ចូលទឹកប្រាក់ក្នុងហ្គេមណាមួយ —{" "}
                  <span className="bg-[linear-gradient(100deg,#0d6efd,#4d9bff)] bg-clip-text text-transparent">
                    លឿន សុវត្ថិភាព
                  </span>
                </>
              ) : (
                <>
                  Top up any game —{" "}
                  <span className="bg-[linear-gradient(100deg,#0d6efd,#4d9bff)] bg-clip-text text-transparent">
                    fast & safe
                  </span>
                </>
              )}
            </h1>
            <p className="kt-khmer mt-3 max-w-xl text-[14px] leading-7 text-[#4c5566]">{dict.heroSub}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/#games`}
                className="kt-btn kt-btn-primary kt-khmer px-5 py-3 text-[14px]"
              >
                {dict.heroPrimary}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/track" className="kt-btn kt-btn-ghost kt-khmer px-5 py-3 text-[14px]">
                {dict.navTrack}
              </Link>
            </div>

            <div className="mt-7 grid max-w-lg grid-cols-3 gap-3">
              {[
                { v: "160+", l: dict.statGames },
                { v: "24/7", l: dict.statDelivery },
                { v: "KHQR", l: dict.statPayment },
              ].map((stat) => (
                <div key={stat.l} className="rounded-xl border border-[var(--line)] bg-white px-3 py-2.5">
                  <p className="text-[16px] font-extrabold text-[var(--text)]">{stat.v}</p>
                  <p className="kt-khmer mt-0.5 text-[10.5px] leading-4 text-[var(--muted)]">{stat.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="kt-khmer text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                {dict.payTitle}
              </span>
              <div className="flex items-center gap-2">
                <Image src="/images/pay/khqr.png" alt="KHQR" width={48} height={28} className="h-6 w-auto object-contain" />
                <Image src="/images/pay/aba.png" alt="ABA Pay" width={48} height={28} className="h-6 w-auto object-contain" />
                <span className="rounded-md border border-[var(--line)] bg-white px-2 py-1 text-[10px] font-bold text-[#26a17b]">
                  USDT
                </span>
                <span className="rounded-md border border-[var(--line)] bg-white px-2 py-1 text-[10px] font-bold text-[#b45309]">
                  Bakong API
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-[#4d9bff]/20 blur-2xl" />
            <div className="absolute -right-4 bottom-6 h-32 w-32 rounded-full bg-[#0d6efd]/15 blur-3xl" />

            {featured && (
              <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow-lg)]">
                <div className="relative h-36 w-full sm:h-40">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 440px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,20,35,0.02),rgba(15,20,35,0.55))]" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="kt-khmer rounded-md bg-[#f59e0b] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                        {dict.popular}
                      </span>
                      <p className="mt-1 text-[15px] font-extrabold text-white drop-shadow">{featured.name}</p>
                    </div>
                    <Link
                      href={`/game/${featured.slug}`}
                      className="rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--acc)] backdrop-blur"
                    >
                      {dict.topUpNow}
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3">
                  {["55 Diamonds", "343 Diamonds", "706 Diamonds"].map((name, index) => (
                    <div key={name} className="rounded-lg border border-[var(--line)] p-2">
                      <p className="text-[10.5px] font-bold leading-tight">{name}</p>
                      <Price
                        cents={[77, 486, 986][index]}
                        className="mt-1 block text-[11px] font-extrabold text-[var(--acc)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative -mt-3 ml-auto w-[86%] rounded-2xl border border-[var(--line)] bg-white p-3 shadow-[0_18px_44px_rgba(16,24,40,0.16)]">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-[var(--line)] p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrImage} alt="KHQR" width={70} height={70} className="h-[66px] w-[66px]" />
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ok)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]" />
                    KHQR · Bakong
                  </p>
                  <p className="text-[15px] font-extrabold">$4.86</p>
                  <p className="kt-khmer truncate text-[10.5px] text-[var(--muted)]">
                    {km ? "ស្កេនដើម្បីបង់ប្រាក់ — គ្រប់ធនាគារ" : "Scan to pay — any bank app"}
                  </p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-[#e9f9ef] px-2 py-1 text-[9.5px] font-bold text-[var(--ok)]">
                  ✓ API
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LiveTicker items={feed} dict={dict} />

      <section id="games" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="kt-khmer text-[22px] font-extrabold tracking-tight sm:text-[26px]">{dict.allGames}</h2>
            <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">
              {km
                ? "ជ្រើសរើសហ្គេមដែលអ្នកចូលចិត្ត ហើយថបអាប់ភ្លាមៗ — ដឹកជញ្ជូនភ្លាមៗ"
                : "Pick your favourite game and top up instantly — delivered in seconds."}
            </p>
          </div>
          <Link href="/games" className="kt-khmer text-[13px] font-bold text-[var(--acc)] hover:underline">
            {km ? "មើលហ្គេមទាំងអស់ →" : "See all games →"}
          </Link>
        </div>
        <div className="mt-5">
          <GameGrid games={games} dict={dict} limit={10} showFilters />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--bg2)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="kt-khmer text-[22px] font-extrabold sm:text-[26px]">{dict.whyTitle}</h2>
            <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">{dict.whySub}</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[var(--line)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--acc-soft)] text-[var(--acc)]">
                  {item.icon === "bolt" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-12H12l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  ) : item.icon === "shield" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" stroke="currentColor" strokeWidth="1.8" />
                      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M20 13H9l-2 6H5l2.5-12H19a1 1 0 0 1 1 1v5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <circle cx="7.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </span>
                <h3 className="kt-khmer mt-3 text-[15px] font-extrabold">{item.title}</h3>
                <p className="kt-khmer mt-1.5 text-[12.5px] leading-6 text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="kt-khmer text-[22px] font-extrabold sm:text-[26px]">{dict.howTitle}</h2>
          <p className="kt-khmer mt-1 text-[13px] text-[var(--muted)]">{dict.howSub}</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-5">
              <span className="absolute -right-2 -top-4 text-[64px] font-extrabold text-[#f0f4fa]">{step.n}</span>
              <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-[var(--grad)] text-[13px] font-extrabold text-white">
                {step.n}
              </span>
              <h3 className="kt-khmer relative mt-3 text-[15px] font-extrabold">{step.title}</h3>
              <p className="kt-khmer relative mt-1.5 text-[12.5px] leading-6 text-[var(--muted)]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[linear-gradient(112deg,#f3f7ff_0%,#fff_68%)] py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="kt-khmer text-[22px] font-extrabold sm:text-[26px]">{dict.payTitle}</h2>
            <p className="kt-khmer mt-1.5 text-[13px] leading-6 text-[var(--muted)]">{dict.paySub}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { name: "KHQR · Bakong", note: km ? "គ្រប់ធនាគារកម្ពុជា" : "All Cambodian banks", img: "/images/pay/khqr.png" },
                { name: "ABA Pay", note: km ? "ស្កេន និងបង់ភ្លាមៗ" : "Scan & pay instantly", img: "/images/pay/aba.png" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-3">
                  <Image src={item.img} alt={item.name} width={52} height={30} className="h-8 w-auto object-contain" />
                  <div>
                    <p className="text-[12px] font-extrabold">{item.name}</p>
                    <p className="kt-khmer text-[10.5px] text-[var(--muted)]">{item.note}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#26a17b] text-[11px] font-black text-white">₮</span>
                <div>
                  <p className="text-[12px] font-extrabold">USDT · TRC20</p>
                  <p className="kt-khmer text-[10.5px] text-[var(--muted)]">{km ? "បង់តាម crypto" : "Crypto payment"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f3ba2f] text-[12px] font-black text-black">B</span>
                <div>
                  <p className="text-[12px] font-extrabold">Binance Pay</p>
                  <p className="kt-khmer text-[10.5px] text-[var(--muted)]">{km ? "ស្វ័យប្រវត្តិ" : "Instant settlement"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#e9f9ef] px-2 py-1 text-[10px] font-extrabold text-[var(--ok)]">
                BAKONG OPEN API
              </span>
              <span className="text-[11px] text-[var(--muted)]">check_transaction_by_md5</span>
            </div>
            <pre className="kt-scroll-x mt-3 overflow-x-auto rounded-xl bg-[#0b1a33] p-3.5 text-[11px] leading-6 text-[#cfe0ff]">
{`POST /v1/check_transaction_by_md5
Authorization: Bearer <BAKONG_API_TOKEN>

{ "md5": "d60f3db96913029a2af979a1662c1e72" }`}
            </pre>
            <p className="kt-khmer mt-3 text-[11.5px] leading-6 text-[var(--muted)]">
              {km
                ? "រាល់ការបង់ប្រាក់ KHQR ត្រូវបានផ្ទៀងផ្ទាត់ដោយផ្ទាល់ជាមួយ Bakong — ហើយកញ្ចប់ត្រូវបានដឹកជញ្ជូនភ្លាមៗបន្ទាប់ពីបញ្ជាក់។"
                : "Every KHQR payment is verified directly with Bakong, then the package is delivered instantly after confirmation."}
            </p>
            <Link href="/api-docs" className="kt-khmer mt-3 inline-block text-[12px] font-bold text-[var(--acc)] hover:underline">
              {dict.apiDocs} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="kt-khmer text-center text-[22px] font-extrabold sm:text-[26px]">
          {km ? "សំណួរញឹកញាប់" : "Frequently asked questions"}
        </h2>
        <div className="mt-6 space-y-2.5">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-[var(--line)] bg-white p-4 open:shadow-[var(--shadow)]">
              <summary className="kt-khmer flex cursor-pointer list-none items-center justify-between gap-3 text-[13.5px] font-bold">
                {faq.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--muted)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="kt-khmer mt-2.5 text-[12.5px] leading-6 text-[var(--muted)]">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0b1a33,#0d2a52)] px-6 py-9 text-white sm:px-10">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#4d9bff]/25 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="kt-khmer text-[20px] font-extrabold sm:text-[24px]">
                {km ? "ចាប់ផ្តើមថបអាប់ឥឡូវនេះ" : "Start topping up today"}
              </h2>
              <p className="kt-khmer mt-1 text-[12.5px] leading-6 text-[#cfe0ff]">
                {km
                  ? "ជ្រើសរើសហ្គេម បញ្ចូល ID ស្កេន KHQR — រួចរាល់ក្នុងរយៈពេលប៉ុន្មានវិនាទី។"
                  : "Pick a game, enter your ID, scan the KHQR — done in seconds."}
              </p>
            </div>
            <Link href="/games" className="kt-btn kt-khmer shrink-0 bg-white px-5 py-3 text-[13px] font-extrabold text-[#0b1a33] hover:bg-[#eef4ff]">
              {dict.topUpNow} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
