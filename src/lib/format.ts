export const KHR_RATE = 4100;

export function formatUsd(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  return `$${n.toFixed(2)}`;
}

export function formatKhr(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  return `៛${Math.round(n * KHR_RATE).toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAmount(amount: number, bonus: number, currency: string) {
  if (amount === 1 && !bonus) return currency;
  const base = amount.toLocaleString("en-US");
  return bonus > 0 ? `${base} + ${bonus.toLocaleString("en-US")} ${currency}` : `${base} ${currency}`;
}
