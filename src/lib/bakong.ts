import { BakongKHQR, IndividualInfo, khqrData } from "bakong-khqr";

/** Order payment window. After this the QR is treated as expired. */
export const PAYMENT_WINDOW_MS = 15 * 60 * 1000;

// Accept both naming styles so the .env can use either.
const token = () => process.env.BAKONG_API_TOKEN ?? process.env.BAKONG_TOKEN;
const merchantName = () => process.env.MERCHANT_NAME ?? process.env.BAKONG_MERCHANT_NAME ?? "Tratopup";
const merchantCity = () => process.env.MERCHANT_CITY ?? process.env.BAKONG_MERCHANT_CITY ?? "Phnom Penh";

export function bakongEnabled() {
  return Boolean(process.env.BAKONG_ACCOUNT_ID && token());
}

/** Build a fixed-amount (USD) KHQR for one order. */
export function generateKhqr(orderNo: string, amountUsd: number) {
  const info = new IndividualInfo(
    process.env.BAKONG_ACCOUNT_ID!,
    merchantName(),
    merchantCity(),
    {
      currency: khqrData.currency.usd,
      amount: Number(amountUsd.toFixed(2)),
      billNumber: orderNo,
      expirationTimestamp: Date.now() + PAYMENT_WINDOW_MS,
    },
  );
  const res = new BakongKHQR().generateIndividual(info);
  if (!res?.data?.qr || !res?.data?.md5) {
    throw new Error(`KHQR generation failed: ${res?.status?.message ?? "unknown error"}`);
  }
  return { qr: res.data.qr as string, md5: res.data.md5 as string };
}

/**
 * Ask Bakong whether the QR with this md5 has been paid.
 * The md5 covers the amount and bill number, so a hit means the exact amount was paid.
 */
export async function isPaid(md5: string): Promise<boolean> {
  const base = process.env.BAKONG_API_URL ?? "https://api-bakong.nbc.gov.kh";
  try {
    const res = await fetch(`${base}/v1/check_transaction_by_md5`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ md5 }),
    });
    const data = (await res.json().catch(() => null)) as { responseCode?: number } | null;
    return data?.responseCode === 0;
  } catch {
    return false;
  }
}
