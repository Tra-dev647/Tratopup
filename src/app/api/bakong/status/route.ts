import { bakongHealth, buildKhqr, khqrMd5 } from "@/lib/bakong";
import { checkTransactionByMd5 } from "@/lib/bakong";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await bakongHealth();
  const sample = buildKhqr({ amount: 4.86, currency: "USD", billNumber: "KT-SAMPLE" });
  const md5 = khqrMd5(sample);
  const probe = health.tokenConfigured ? await checkTransactionByMd5(md5) : null;

  return Response.json({
    ok: true,
    ...health,
    sample: { qr: sample, md5 },
    probe,
    note: health.tokenConfigured
      ? "Bakong Open API token configured — payments are verified with check_transaction_by_md5."
      : "No BAKONG_API_TOKEN configured — checkout runs in demo settlement mode.",
  });
}
