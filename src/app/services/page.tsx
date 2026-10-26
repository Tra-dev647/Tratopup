import Link from "next/link";
import { Price } from "@/components/prefs";
import { getGamesWithPrices } from "@/lib/games";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [{ locale }, games] = await Promise.all([getPrefs(), getGamesWithPrices()]);
  const dict = getDict(locale);
  const km = locale === "km";
  const topups = games.slice(0, 4);

  const plans = [
    {
      name: km ? "ចាប់ផ្តើម" : "Starter",
      price: 0,
      tag: km ? "ឥតគិតថ្លៃ" : "Free",
      features: km
        ? ["ហាងផ្ទាល់ខ្លួន ១", "ការបញ្ជាទិញ ១០០/ខែ", "បង់ប្រាក់តាម KHQR", "គាំទ្រតាម Telegram"]
        : ["1 storefront", "100 orders / month", "KHQR payments", "Telegram support"],
      cta: dict.register,
    },
    {
      name: "Growth",
      price: 900,
      tag: km ? "ពេញនិយម" : "Popular",
      highlight: true,
      features: km
        ? ["ហាង ៣ · domain ផ្ទាល់ខ្លួន", "ការបញ្ជាទិញគ្មានកំណត់", "API access + webhooks", "តម្លៃដុំពិសេស", "គាំទ្រ ២៤/៧"]
        : ["3 stores · custom domain", "Unlimited orders", "API access + webhooks", "Wholesale pricing", "24/7 support"],
      cta: dict.register,
    },
    {
      name: "Pro",
      price: 2900,
      tag: km ? "សម្រាប់អាជីវកម្ម" : "Business",
      features: km
        ? ["ហាងគ្មានកំណត់", "Settlement ប្រចាំថ្ងៃ", "Priority Bakong reconciliation", "គណនីអ្នកគ្រប់គ្រង ៥", "ការគាំទ្រផ្ទាល់"]
        : ["Unlimited stores", "Daily settlement", "Priority Bakong reconciliation", "5 team seats", "Dedicated support"],
      cta: km ? "ទាក់ទងពួកយើង" : "Contact us",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="kt-chip">
          <span className="text-[var(--acc)]">◆</span> {dict.navStore}
        </span>
        <h1 className="kt-khmer mt-3 text-[26px] font-extrabold leading-tight sm:text-[32px]">
          {km ? "បង្កើតហាងថបអាប់របស់អ្នកជាមួយ Tratopup" : "Launch your own top-up store with Tratopup"}
        </h1>
        <p className="kt-khmer mt-2 text-[13px] leading-6 text-[var(--muted)]">
          {km
            ? "ទទួលបានតម្លៃដុំ បង្កើតហាងផ្ទាល់ខ្លួន និងបង់ប្រាក់តាម KHQR — ទាំងអស់ដំណើរការដោយស្វ័យប្រវត្តិ។"
            : "Get wholesale pricing, your own storefront and KHQR payments — fully automated."}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border bg-white p-5 ${
              plan.highlight ? "border-[var(--acc)] shadow-[0_16px_40px_rgba(13,110,253,0.16)]" : "border-[var(--line)]"
            }`}
          >
            {plan.highlight && (
              <span className="absolute right-4 top-4 rounded-full bg-[var(--acc)] px-2 py-0.5 text-[9.5px] font-extrabold text-white">
                {plan.tag}
              </span>
            )}
            <p className="text-[13px] font-extrabold">{plan.name}</p>
            <p className="mt-2 flex items-baseline gap-1">
              <Price cents={plan.price} className="text-[26px] font-extrabold" />
              <span className="text-[11px] text-[var(--muted)]">/{km ? "ខែ" : "month"}</span>
            </p>
            <p className="kt-khmer mt-0.5 text-[11px] text-[var(--muted)]">
              {plan.price === 0 ? (km ? "គ្មានកាតឥណទាន" : "No card required") : km ? "បង់ប្រាក់ជារៀងរាល់ខែ" : "Billed monthly"}
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="kt-khmer flex items-start gap-2 text-[12px] text-[#4c5566]">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#e9f9ef] text-[9px] text-[var(--ok)]">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.price === 2900 ? "https://t.me/khmertopup" : "/register"}
              className={`kt-btn kt-khmer mt-5 w-full py-2.5 text-[12.5px] ${plan.highlight ? "kt-btn-primary" : "kt-btn-ghost"}`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="kt-card p-5">
          <h2 className="kt-khmer text-[16px] font-extrabold">{km ? "តម្លៃដុំសម្រាប់អ្នកលក់បន្ត" : "Reseller wholesale rates"}</h2>
          <ul className="mt-3 divide-y divide-[var(--line)]">
            {topups.map((game) => (
              <li key={game.slug} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold">{game.name}</p>
                  <p className="text-[10.5px] text-[var(--muted)]">{game.publisher}</p>
                </div>
                <div className="text-right">
                  <Price cents={game.fromCents} className="text-[12.5px] font-extrabold text-[var(--acc)]" />
                  <p className="kt-khmer text-[10px] text-[var(--muted)]">{km ? "ចាប់ផ្តើមពី" : "starting at"}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/games" className="kt-khmer mt-3 inline-block text-[12px] font-bold text-[var(--acc)] hover:underline">
            {dict.allGames} →
          </Link>
        </div>

        <div className="kt-card p-5">
          <h2 className="kt-khmer text-[16px] font-extrabold">{km ? "ហេតុអ្វីលក់ជាមួយយើង?" : "Why sell with us?"}</h2>
          <ul className="kt-khmer mt-3 space-y-3 text-[12.5px] leading-6 text-[#4c5566]">
            {[
              km ? "ប្រព័ន្ធ API ដែលអាចបញ្ចូលបានក្នុងរយៈពេលប៉ុន្មាននាទី" : "An API you can integrate in minutes",
              km ? "ការបង់ប្រាក់ KHQR ដែលផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាម Bakong" : "KHQR payments verified automatically via Bakong",
              km ? "តម្លៃដុំប្រកួតប្រជែង និងការគាំទ្រតាម Telegram" : "Competitive wholesale pricing and Telegram support",
              km ? "ផ្ទាំងគ្រប់គ្រងការបញ្ជាទិញ និងរបាយការណ៍លក់" : "Order dashboard and sales reporting",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--acc)]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-[var(--bg2)] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--muted)]">API Base URL</p>
            <p className="mt-0.5 font-mono text-[11.5px] font-semibold">https://khmer-topup.com/api</p>
            <Link href="/api-docs" className="kt-khmer mt-1.5 inline-block text-[11.5px] font-bold text-[var(--acc)] hover:underline">
              {dict.apiDocs} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
