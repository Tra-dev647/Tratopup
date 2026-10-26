import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PrefsProvider } from "@/components/prefs";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/auth";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Tratopup — ថបអាប់ហ្គេមលឿន តម្លៃល្អបំផុត",
  description:
    "Tratopup — បញ្ចូលពេជ្រ UC និង token សម្រាប់ Mobile Legends, Free Fire, PUBG, Honor of Kings និងហ្គេមជាង 160។ ដឹកជញ្ជូនភ្លាមៗ បង់ប្រាក់តាម KHQR និង Bakong API។",
  openGraph: {
    title: "Tratopup — Fast Game Top-up, Best Prices",
    description: "Instant game top-up in Cambodia with KHQR payments powered by the Bakong API.",
    siteName: "Tratopup",
    locale: "km_KH",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [{ locale, currency }, user] = await Promise.all([getPrefs(), getCurrentUser()]);
  const dict = getDict(locale);

  return (
    <html lang={locale === "km" ? "km" : "en"} dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Kantumruy+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-screen bg-white text-[var(--text)] antialiased">
        <PrefsProvider locale={locale} currency={currency}>
          <SiteHeader
            locale={locale}
            dict={dict}
            user={user ? { id: user.id, name: user.name, email: user.email } : null}
          />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter dict={dict} />
        </PrefsProvider>
      </body>
    </html>
  );
}
