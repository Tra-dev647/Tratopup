import Link from "next/link";
import { bakongHealth, buildKhqr, khqrMd5 } from "@/lib/bakong";
import { getGameWithPackages } from "@/lib/games";
import { getPrefs } from "@/lib/locale";
import { getDict } from "@/lib/i18n";
import { formatUsd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ApiDocsPage() {
  const [{ locale }, health, ml] = await Promise.all([getPrefs(), bakongHealth(), getGameWithPackages("mobile-legends")]);
  const dict = getDict(locale);
  const km = locale === "km";
  const sampleQr = buildKhqr({ amount: 4.86, currency: "USD", billNumber: "KT-SAMPLE01" });
  const sampleMd5 = khqrMd5(sampleQr);
  const packages = (ml?.packages ?? []).slice(0, 8);

  const endpoints = [
    {
      method: "POST",
      path: "/api/orders",
      desc: km ? "បង្កើតការបញ្ជាទិញ និង KHQR (md5 + QR image)" : "Create an order and KHQR (md5 + QR image)",
    },
    {
      method: "GET",
      path: "/api/orders/{code}",
      desc: km ? "យកស្ថានភាពការបញ្ជាទិញ" : "Read order status",
    },
    {
      method: "GET",
      path: "/api/orders/{code}?sync=1",
      desc: km ? "ផ្ទៀងផ្ទាត់ជាមួយ Bakong ភ្លាមៗ" : "Verify with the Bakong API immediately",
    },
    {
      method: "POST",
      path: "/api/orders/{code}/confirm",
      desc: km ? "បញ្ជាក់ការបង់ប្រាក់ (live) ឬ demo settlement" : "Confirm payment (live check or demo settlement)",
    },
    {
      method: "GET",
      path: "/api/games",
      desc: km ? "បញ្ជីហ្គេម និងការទិញថ្មីៗ" : "Game catalogue and recent purchases",
    },
    {
      method: "GET",
      path: "/api/bakong/status",
      desc: km ? "ស្ថានភាព Bakong Open API និង KHQR គំរូ" : "Bakong Open API health and a sample KHQR",
    },
    { method: "GET", path: "/api/health", desc: km ? "សុខភាពប្រព័ន្ធ" : "Service health probe" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[var(--acc-soft)] px-2 py-1 font-mono text-[10.5px] font-extrabold text-[var(--acc)]">
          API v1
        </span>
        <span
          className={`rounded-md px-2 py-1 text-[10.5px] font-extrabold ${
            health.tokenConfigured ? "bg-[#e9f9ef] text-[var(--ok)]" : "bg-[#fffbeb] text-[#b45309]"
          }`}
        >
          BAKONG · {health.tokenConfigured ? "LIVE" : "DEMO"}
        </span>
      </div>
      <h1 className="kt-khmer mt-2 text-[26px] font-extrabold tracking-tight sm:text-[30px]">{dict.navApi}</h1>
      <p className="kt-khmer mt-1.5 max-w-2xl text-[13px] leading-6 text-[var(--muted)]">
        {km
          ? "ឯកសារយោង API សម្រាប់ការបញ្ចូលទឹកប្រាក់ស្វ័យប្រវត្តិ និងការបង់ប្រាក់តាម KHQR ជាមួយ Bakong Open API របស់ធនាគារជាតិកម្ពុជា។"
          : "Reference for automated top-ups and KHQR payments with the National Bank of Cambodia's Bakong Open API."}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Base URL",
            value: "https://khmer-topup.com",
            note: km ? "គ្រប់ endpoint ស្ថិតនៅក្រោម /api" : "All endpoints live under /api",
          },
          {
            title: km ? "ការផ្ទៀងផ្ទាត់" : "Authentication",
            value: "X-API-Key / cookie",
            note: km ? "សោ API អ្នកលក់បន្ត ឬ session cookie" : "Reseller API key or session cookie",
          },
          {
            title: "Bakong account",
            value: health.accountId,
            note: `${health.merchantCity ?? "Phnom Penh"} · ${health.baseUrl}`,
          },
        ].map((card) => (
          <div key={card.title} className="kt-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">{card.title}</p>
            <p className="mt-1 truncate font-mono text-[13px] font-bold text-[var(--text)]">{card.value}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{card.note}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="kt-khmer text-[18px] font-extrabold">{km ? "Endpoints" : "Endpoints"}</h2>
        <div className="kt-card mt-3 overflow-hidden">
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--bg2)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th className="px-4 py-2.5 font-bold">Method</th>
                <th className="px-4 py-2.5 font-bold">Path</th>
                <th className="px-4 py-2.5 font-bold">{km ? "ការពិពណ៌នា" : "Description"}</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-extrabold ${
                        endpoint.method === "POST" ? "bg-[#e9f9ef] text-[var(--ok)]" : "bg-[var(--acc-soft)] text-[var(--acc)]"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11.5px] font-semibold">{endpoint.path}</td>
                  <td className="kt-khmer px-4 py-2.5 text-[11.5px] text-[var(--muted)]">{endpoint.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="kt-card p-4 sm:p-5">
          <h2 className="kt-khmer text-[15px] font-extrabold">
            {km ? "បង្កើតការបញ្ជាទិញ + KHQR" : "Create an order + KHQR"}
          </h2>
          <pre className="kt-scroll-x mt-3 overflow-x-auto rounded-xl bg-[#0b1a33] p-3.5 text-[11px] leading-6 text-[#cfe0ff]">
{`curl -X POST https://khmer-topup.com/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "gameSlug": "mobile-legends",
    "packageId": 107,
    "playerId": "12345678",
    "serverId": "1234",
    "currency": "USD"
  }'`}
          </pre>
          <p className="kt-khmer mt-2 text-[11.5px] leading-5 text-[var(--muted)]">
            {km
              ? "ឆ្លើយតបមាន order.code, order.md5, qrImage (data URL) និង deeplink (ប្រសិនបើមាន token)។"
              : "The response includes order.code, order.md5, qrImage (data URL) and an optional deeplink."}
          </p>
          <pre className="kt-scroll-x mt-3 overflow-x-auto rounded-xl bg-[#0f172a] p-3.5 text-[11px] leading-6 text-[#a7f3d0]">
{`{
  "ok": true,
  "mode": "live",
  "order": { "code": "KT-8F3K2Q", "status": "pending",
             "amountCents": 486, "md5": "${sampleMd5.slice(0, 12)}…" },
  "qrImage": "data:image/png;base64,…"
}`}
          </pre>
        </div>

        <div className="kt-card p-4 sm:p-5">
          <h2 className="kt-khmer text-[15px] font-extrabold">
            {km ? "Bakong Open API" : "Bakong Open API"}
          </h2>
          <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--bg2)] p-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--muted)]">
              {km ? "QR គំរូ (USD ៤.៨៦)" : "Sample KHQR (USD 4.86)"}
            </p>
            <p className="mt-1 break-all font-mono text-[10.5px] leading-5 text-[var(--text)]">{sampleQr}</p>
            <p className="mt-2 break-all font-mono text-[10.5px] text-[var(--muted)]">MD5: {sampleMd5}</p>
          </div>
          <pre className="kt-scroll-x mt-3 overflow-x-auto rounded-xl bg-[#0b1a33] p-3.5 text-[11px] leading-6 text-[#cfe0ff]">
{`POST ${health.baseUrl}/v1/check_transaction_by_md5
Authorization: Bearer <BAKONG_API_TOKEN>
Content-Type: application/json

{ "md5": "${sampleMd5}" }`}
          </pre>
          <p className="kt-khmer mt-2 text-[11.5px] leading-5 text-[var(--muted)]">
            {km
              ? "responseCode = 0 មានន័យថាបានបង់ប្រាក់។ ប្រព័ន្ធរបស់យើង poll រៀងរាល់ ៥ វិនាទីក្នុងអំឡុងពេល checkout។"
              : "responseCode = 0 means the transaction is settled. Our checkout polls this endpoint every 5 seconds."}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="kt-khmer text-[18px] font-extrabold">
          {km ? "ការកំណត់បរិស្ថាន (Environment variables)" : "Environment variables"}
        </h2>
        <div className="kt-card mt-3 overflow-hidden">
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--bg2)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th className="px-4 py-2.5 font-bold">Key</th>
                <th className="px-4 py-2.5 font-bold">{km ? "តម្លៃបច្ចុប្បន្ន" : "Current value"}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[11.5px]">
              {[
                ["BAKONG_API_TOKEN", health.tokenConfigured ? "•••••••• (set)" : "(not set → demo mode)"],
                ["BAKONG_API_BASE_URL", health.baseUrl],
                ["BAKONG_ACCOUNT_ID", health.accountId],
                ["BAKONG_MERCHANT_NAME", health.merchantName],
                ["BAKONG_CURRENCY", health.currency],
              ].map(([key, value]) => (
                <tr key={key} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-2.5 font-bold text-[var(--text)]">{key}</td>
                  <td className="truncate px-4 py-2.5 text-[var(--muted)]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {ml && (
        <section className="mt-8">
          <h2 className="kt-khmer text-[18px] font-extrabold">
            {km ? "កញ្ចប់ · mobile-legends" : "Packages · mobile-legends"}
          </h2>
          <div className="kt-card mt-3 overflow-hidden">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--bg2)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                  <th className="px-4 py-2.5 font-bold">package_id</th>
                  <th className="px-4 py-2.5 font-bold">{km ? "កញ្ចប់" : "Package"}</th>
                  <th className="px-4 py-2.5 font-bold">{km ? "តម្លៃ" : "Price"}</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.packageId} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-4 py-2.5 font-mono text-[11.5px] font-bold">{pkg.packageId}</td>
                    <td className="px-4 py-2.5">{pkg.name}</td>
                    <td className="px-4 py-2.5 font-mono">{formatUsd(pkg.priceCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/game/mobile-legends" className="kt-khmer mt-3 inline-block text-[12px] font-bold text-[var(--acc)] hover:underline">
            {km ? "មើលកញ្ចប់ទាំងអស់ →" : "See all packages →"}
          </Link>
        </section>
      )}
    </div>
  );
}
