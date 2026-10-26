import Image from "next/image";
import { AuthForm } from "@/components/auth-form";
import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const { locale } = await getPrefs();
  const dict = getDict(locale);
  const km = locale === "km";

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <Image src="/images/brand/logo-00a6427d.png" alt="Tratopup" width={64} height={64} className="h-16 w-16 rounded-full" />
        <h1 className="kt-khmer mt-4 text-[26px] font-extrabold leading-tight">
          {km ? "បង្កើតគណនីឥឡូវនេះ" : "Create your account"}
        </h1>
        <p className="kt-khmer mt-2 text-[13px] leading-6 text-[var(--muted)]">
          {km
            ? "ប្រវត្តិបញ្ជាទិញ វិក័យប័ត្រ និងការគាំទ្ររហ័ស — ទាំងអស់នៅកន្លែងតែមួយ។ សុវត្ថិភាពដោយ KHQR និង Bakong API។"
            : "Order history, receipts and fast support — all in one place. Secured by KHQR and the Bakong API."}
        </p>
        <ul className="kt-khmer mt-4 space-y-2 text-[12.5px] text-[#4c5566]">
          <li>✓ {km ? "ដឹកជញ្ជូនភ្លាមៗ ២៤/៧" : "Instant delivery 24/7"}</li>
          <li>✓ {km ? "បង់ប្រាក់តាម KHQR គ្រប់ធនាគារ" : "Pay with KHQR from any bank"}</li>
          <li>✓ {km ? "ការគាំទ្រតាម Telegram" : "Telegram support"}</li>
        </ul>
      </div>
      <div className="kt-card p-6">
        <h2 className="kt-khmer text-[19px] font-extrabold">{dict.register}</h2>
        <p className="kt-khmer mt-1 text-[12px] text-[var(--muted)]">
          {km ? "បំពេញព័ត៌មានខាងក្រោមដើម្បីចាប់ផ្តើម" : "Fill in the details below to get started"}
        </p>
        <div className="mt-4">
          <AuthForm mode="register" dict={dict} />
        </div>
      </div>
    </div>
  );
}
