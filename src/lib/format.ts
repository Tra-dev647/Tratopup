export const USD_TO_KHR = 4100;

export type Currency = "USD" | "KHR";
export type Locale = "km" | "en";

export function rielFromCents(cents: number): number {
  // 1 USD = 4,100 KHR — kept exactly in sync with the KHQR amount.
  return Math.round((cents / 100) * USD_TO_KHR);
}

export function amountForCurrency(cents: number, currency: Currency): number {
  if (currency === "KHR") return rielFromCents(cents);
  return cents / 100;
}

export function formatMoney(cents: number, currency: Currency = "USD"): string {
  if (currency === "KHR") {
    return `៛${rielFromCents(cents).toLocaleString("en-US")}`;
  }
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function maskPlayer(value: string): string {
  const str = value.replace(/\s+/g, "");
  if (str.length <= 4) return `${str.slice(0, 1)}**${str.slice(-1)}`;
  return `${str.slice(0, 4)}**${str.slice(-3)}`;
}

export function orderStatusLabel(status: string, locale: Locale = "km"): string {
  const map: Record<string, [string, string]> = {
    pending: ["រង់ចាំការបង់ប្រាក់", "Awaiting payment"],
    paid: ["បានបង់ប្រាក់", "Paid"],
    expired: ["ផុតកំណត់", "Expired"],
    failed: ["បរាជ័យ", "Failed"],
  };
  const entry = map[status] ?? [status, status];
  return locale === "km" ? entry[0] : entry[1];
}
