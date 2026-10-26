import Image from "next/image";
import { AuthForm } from "@/components/auth-form";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { locale } = await getPrefs();
  const dict = getDict(locale);
  const km = locale === "km";

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <Image src="/images/brand/logo-00a6427d.png" alt="Tratopup" width={64} height={64} className="h-16 w-16 rounded-full" />
        <h1 className="kt-khmer mt-4 text-[26px] font-extrabold leading-tight">
          {km ? "សូមស្វាគមន៍មកកាន់ Tratopup" : "Welcome back to Tratopup"}
        </h1>
        <p className="kt-khmer mt-2 text-[13px] leading-6 text-[var(--muted)]">
          {km
            ? "ចូលដើម្បីរក្សាទុកប្រវត្តិបញ្ជាទិញ និងទទួលបានការគាំទ្រលឿន។ អ្នកក៏អាចថបអាប់ដោយមិនចូលក៏បានដែរ។"
            : "Sign in to keep your order history and get faster support. You can also top up as a guest."}
        </p>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg2)] p-3">
          <Image src="/images/pay/khqr.png" alt="KHQR" width={46} height={28} className="h-7 w-auto" />
          <p className="kt-khmer text-[11.5px] text-[var(--muted)]">{dict.poweredBy}</p>
        </div>
      </div>
      <div className="kt-card p-6">
        <h2 className="kt-khmer text-[19px] font-extrabold">{dict.login}</h2>
        <p className="kt-khmer mt-1 text-[12px] text-[var(--muted)]">
          {km ? "បញ្ចូលអ៊ីមែល និងលេខសម្ងាត់របស់អ្នក" : "Enter your email and password"}
        </p>
        <div className="mt-4">
          <AuthForm mode="login" dict={dict} />
        </div>
      </div>
    </div>
  );
}
