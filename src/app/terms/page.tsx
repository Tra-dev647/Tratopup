import { getDict } from "@/lib/i18n";
import { getPrefs } from "@/lib/locale";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const { locale } = await getPrefs();
  const dict = getDict(locale);
  const km = locale === "km";

  const sections = [
    {
      title: km ? "១. ការបញ្ជាទិញ និងការបង់ប្រាក់" : "1. Orders and payments",
      body: km
        ? "ការបញ្ជាទិញត្រូវបានបង្កើតជាមួយ KHQR ដែលមានសុពលភាព ១០ នាទី។ ការបង់ប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាម Bakong Open API មុនពេលដឹកជញ្ជូន។ សូមកុំបង់ប្រាក់លើ QR ដែលផុតកំណត់។"
        : "Orders generate a KHQR valid for 10 minutes. Payments are verified automatically through the Bakong Open API before delivery. Never pay a QR that has already expired.",
    },
    {
      title: km ? "២. ព័ត៌មានគណនីហ្គេម" : "2. Game account details",
      body: km
        ? "អ្នកទទួលខុសត្រូវលើភាពត្រឹមត្រូវនៃ User ID / Zone ID ឬលេខទូរស័ព្ទដែលបានបញ្ចូល។ ការបញ្ចូល ID ខុសអាចបណ្តាលឲ្យកញ្ចប់មិនដល់គណនី ហើយមិនអាចទាមទារប្រាក់វិញបានទេ។"
        : "You are responsible for the accuracy of the User ID / Zone ID or phone number entered. Incorrect IDs may result in the package not arriving and are not refundable.",
    },
    {
      title: km ? "៣. ការដឹកជញ្ជូន" : "3. Delivery",
      body: km
        ? "កញ្ចប់ត្រូវបានដឹកជញ្ជូនដោយស្វ័យប្រវត្តិក្នុងរយៈពេលប៉ុន្មានវិនាទីបន្ទាប់ពីការបង់ប្រាក់ត្រូវបានបញ្ជាក់។ ក្នុងករណីដែលមានការយឺតយ៉ាវ សូមទាក់ទង Telegram @khmertopup ជាមួយលេខបញ្ជាទិញ។"
        : "Packages are delivered automatically seconds after payment confirmation. If there is any delay, contact @khmertopup on Telegram with your order code.",
    },
    {
      title: km ? "៤. សុវត្ថិភាពទិន្នន័យ" : "4. Data protection",
      body: km
        ? "យើងមិនរក្សាទុកព័ត៌មានកាតធនាគារទេ។ ប្រព័ន្ធរក្សាទុកតែលេខបញ្ជាទិញ MD5 នៃ KHQR និងព័ត៌មានដឹកជញ្ជូនដែលអ្នកបានផ្តល់។"
        : "We never store card details. We keep only the order code, the KHQR MD5 and the delivery details you provide.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="kt-khmer text-[26px] font-extrabold">{dict.terms}</h1>
      <p className="kt-khmer mt-1 text-[12.5px] text-[var(--muted)]">
        {km ? "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ មករា ២០២៦" : "Last updated: January 2026"}
      </p>
      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="kt-card p-5">
            <h2 className="kt-khmer text-[14.5px] font-extrabold">{section.title}</h2>
            <p className="kt-khmer mt-2 text-[12.5px] leading-7 text-[#4c5566]">{section.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-[#fde68a] bg-[#fffbeb] p-4">
        <p className="kt-khmer text-[12px] leading-6 text-[#92400e]">
          {km
            ? "ត្រូវការជំនួយ? ទាក់ទងយើងតាម Telegram @khmertopup។ ក្រុមការងារឆ្លើយតបរហ័ស ២៤/៧។"
            : "Need help? Reach us on Telegram @khmertopup — our team replies fast, 24/7."}
        </p>
      </div>
    </div>
  );
}
