import { cookies } from "next/headers";
import type { Currency, Locale } from "@/lib/format";

export const LANG_COOKIE = "kt_lang";
export const CURRENCY_COOKIE = "kt_currency";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "en" ? "en" : "km";
}

export async function getCurrency(): Promise<Currency> {
  const store = await cookies();
  return store.get(CURRENCY_COOKIE)?.value === "KHR" ? "KHR" : "USD";
}

export async function getPrefs() {
  const store = await cookies();
  const locale: Locale = store.get(LANG_COOKIE)?.value === "en" ? "en" : "km";
  const currency: Currency = store.get(CURRENCY_COOKIE)?.value === "KHR" ? "KHR" : "USD";
  return { locale, currency };
}
