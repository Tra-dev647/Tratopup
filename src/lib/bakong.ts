import crypto from "node:crypto";
import QRCode from "qrcode";

/**
 * Bakong / KHQR integration.
 *
 * - KHQR payloads are generated locally following the EMVCo + KHQR spec
 *   (same output as the NBC KHQR SDK) so the site works even when the NBC
 *   network is unreachable.
 * - Payment confirmation is done with the official Bakong Open API
 *   `POST /v1/check_transaction_by_md5` when `BAKONG_API_TOKEN` is configured.
 * - When no token is configured the app runs in clearly-labelled demo mode so
 *   the full checkout flow can still be exercised.
 */

export const BAKONG_BASE_URL = (
  process.env.BAKONG_API_BASE_URL ?? "https://api-bakong.nbc.gov.kh"
).replace(/\/$/, "");

const BAKONG_TOKEN = (process.env.BAKONG_API_TOKEN ?? "").trim();
export const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID ?? "khmer_topup@acleda";
export const BAKONG_MERCHANT_NAME = process.env.BAKONG_MERCHANT_NAME ?? "TRATOPUP";
export const BAKONG_MERCHANT_CITY = process.env.BAKONG_MERCHANT_CITY ?? "Phnom Penh";
export const BAKONG_CURRENCY = (process.env.BAKONG_CURRENCY ?? "USD").toUpperCase();

export const USD_TO_KHR = 4100;

export type PaymentCurrency = "USD" | "KHR";

export function isBakongLive(): boolean {
  return BAKONG_TOKEN.length > 0;
}

export function bakongMode(): "live" | "demo" {
  return isBakongLive() ? "live" : "demo";
}

function tlv(tag: string, value: string): string {
  return `${tag}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC-16/CCITT-FALSE – required checksum for the KHQR payload. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function khqrMd5(qr: string): string {
  return crypto.createHash("md5").update(qr, "utf8").digest("hex");
}

export type KhqrInput = {
  amount: number;
  currency?: PaymentCurrency;
  billNumber: string;
  storeLabel?: string;
  terminalLabel?: string;
  mobileNumber?: string;
  accountId?: string;
  accountInformation?: string;
  acquiringBank?: string;
  merchantName?: string;
  merchantCity?: string;
  expirationSeconds?: number;
};

/**
 * Build a dynamic (amount-bearing) KHQR string using the Bakong individual
 * merchant profile (tag 29) as used by the official KHQR SDK.
 */
export function buildKhqr(input: KhqrInput): string {
  const currency = input.currency ?? (BAKONG_CURRENCY === "KHR" ? "KHR" : "USD");
  const amount =
    currency === "KHR" ? String(Math.round(input.amount)) : input.amount.toFixed(2);

  // KHQR tag 29 — solo merchant / individual profile.
  // 00 = Bakong account ID (required), 01 = account information (optional),
  // 02 = acquiring bank (optional).
  const merchantAccount =
    tlv("00", (input.accountId ?? BAKONG_ACCOUNT_ID).slice(0, 32)) +
    (input.accountInformation ? tlv("01", input.accountInformation.slice(0, 32)) : "") +
    (input.acquiringBank ? tlv("02", input.acquiringBank.slice(0, 32)) : "");

  const additional =
    tlv("01", input.billNumber.slice(0, 25)) +
    (input.storeLabel ? tlv("03", input.storeLabel.slice(0, 25)) : "") +
    (input.terminalLabel ? tlv("07", input.terminalLabel.slice(0, 25)) : "");

  const payload =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("29", merchantAccount) +
    tlv("52", "5999") +
    tlv("53", currency === "KHR" ? "116" : "840") +
    tlv("54", amount) +
    tlv("58", "KH") +
    tlv("59", (input.merchantName ?? BAKONG_MERCHANT_NAME).slice(0, 25)) +
    tlv("60", (input.merchantCity ?? BAKONG_MERCHANT_CITY).slice(0, 15)) +
    tlv("62", additional);

  // CRC tag 63 must always be the final field.
  const withCrcTag = `${payload}6304`;
  return withCrcTag + crc16(withCrcTag);
}

export async function qrDataUrl(qr: string): Promise<string> {
  return QRCode.toDataURL(qr, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 560,
    color: { dark: "#0b1220ff", light: "#ffffffff" },
  });
}

type BakongApiResponse<T> = {
  responseCode?: number;
  responseMessage?: string;
  errorCode?: number | null;
  data?: T;
};

async function bakongRequest<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<BakongApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${BAKONG_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BAKONG_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await response.text();
    try {
      return JSON.parse(text) as BakongApiResponse<T>;
    } catch {
      return { responseCode: response.status, responseMessage: text.slice(0, 200) };
    }
  } finally {
    clearTimeout(timeout);
  }
}

export type TransactionData = {
  hash?: string;
  fromAccountId?: string;
  toAccountId?: string;
  currency?: string;
  amount?: string;
  description?: string;
  externalRef?: string;
  createdDateMs?: number;
  acknowledgedDateMs?: number;
};

export type CheckResult = {
  paid: boolean;
  responseCode: number;
  message: string;
  data?: TransactionData;
};

/** Official Bakong Open API – check transaction by 32-char MD5 of the KHQR. */
export async function checkTransactionByMd5(md5: string): Promise<CheckResult> {
  const result = await bakongRequest<TransactionData>("/v1/check_transaction_by_md5", { md5 });
  const responseCode = Number(result.responseCode ?? -1);
  return {
    paid: responseCode === 0 && Boolean(result.data),
    responseCode,
    message: result.responseMessage ?? (responseCode === 0 ? "Success" : "Unknown response"),
    data: result.data,
  };
}

/** Optional: generate a Bakong mobile-banking deeplink for the KHQR payload. */
export async function generateDeeplink(qr: string): Promise<string | null> {
  if (!isBakongLive()) return null;
  try {
    const result = await bakongRequest<{ shortLink?: string; deepLink?: string }>(
      "/v1/generate_deeplink_by_qr",
      {
        qr,
        sourceInfo: {
          appIconUrl: process.env.BAKONG_APP_ICON_URL ?? "https://khmer-topup.com/icon.png",
          appName: "Tratopup",
          appDeepLinkCallback: process.env.BAKONG_DEEPLINK_CALLBACK ?? "https://khmer-topup.com/",
        },
      },
    );
    return result.data?.shortLink ?? result.data?.deepLink ?? null;
  } catch {
    return null;
  }
}

export async function bakongHealth() {
  return {
    mode: bakongMode(),
    baseUrl: BAKONG_BASE_URL,
    accountId: BAKONG_ACCOUNT_ID,
    merchantName: BAKONG_MERCHANT_NAME,
    merchantCity: BAKONG_MERCHANT_CITY,
    currency: BAKONG_CURRENCY,
    tokenConfigured: isBakongLive(),
  };
}
