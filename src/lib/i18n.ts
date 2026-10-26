import type { Locale } from "@/lib/format";

type Dict = {
  navTopup: string;
  navGames: string;
  navTrack: string;
  navStore: string;
  navServices: string;
  navOrders: string;
  navApi: string;
  login: string;
  register: string;
  logout: string;
  language: string;
  currencyLabel: string;
  heroBadge: string;
  heroTitle: string;
  heroSub: string;
  heroPrimary: string;
  heroSecondary: string;
  statGames: string;
  statDelivery: string;
  statPayment: string;
  searchPlaceholder: string;
  allGames: string;
  popular: string;
  topUpNow: string;
  noResults: string;
  clearFilter: string;
  whyTitle: string;
  whySub: string;
  howTitle: string;
  howSub: string;
  step1: string;
  step1d: string;
  step2: string;
  step2d: string;
  step3: string;
  step3d: string;
  payTitle: string;
  paySub: string;
  packages: string;
  instant: string;
  secure: string;
  verified: string;
  choosePackage: string;
  playerInfo: string;
  userId: string;
  zoneId: string;
  serverId: string;
  phone: string;
  playerIdPlaceholder: string;
  zonePlaceholder: string;
  continuePay: string;
  checkingAccount: string;
  verifiedAccount: string;
  total: string;
  payWith: string;
  scanToPay: string;
  orderCode: string;
  expiresIn: string;
  iPaid: string;
  checking: string;
  paidSuccess: string;
  deliveryDone: string;
  demoNote: string;
  demoPay: string;
  liveNote: string;
  trackTitle: string;
  trackSub: string;
  trackPlaceholder: string;
  trackBtn: string;
  orderNotFound: string;
  views: string;
  footerAbout: string;
  contact: string;
  terms: string;
  rights: string;
  recent: string;
  bought: string;
  searchIdHint: string;
  apiDocs: string;
  poweredBy: string;
};

const km: Dict = {
  navTopup: "ថបអាប់",
  navGames: "ហ្គេម",
  navTrack: "តាមដានការបញ្ជាទិញ",
  navStore: "បង្កើតហាង",
  navServices: "សេវាកម្ម",
  navOrders: "ការបញ្ជាទិញ",
  navApi: "ឯកសារ API",
  login: "ចូល",
  register: "ចុះឈ្មោះ",
  logout: "ចាកចេញ",
  language: "ភាសា",
  currencyLabel: "រូបិយប័ណ្ណ",
  heroBadge: "ដឹកជញ្ជូនភ្លាមៗ · តម្លៃល្អបំផុត",
  heroTitle: "បញ្ចូលទឹកប្រាក់ក្នុងហ្គេមណាមួយ — លឿន សុវត្ថិភាព",
  heroSub:
    "បង់ប្រាក់តាម KHQR គ្រប់ធនាគារ ជាមួយ Bakong API។ ជ្រើសរើសកញ្ចប់ បញ្ចូល ID ហើយទទួលបានភ្លាមៗក្នុងរយៈពេលប៉ុន្មានវិនាទី។",
  heroPrimary: "ចាប់ផ្តើមថបអាប់",
  heroSecondary: "របៀបដំណើរការ",
  statGames: "ហ្គេម & សេវាកម្ម",
  statDelivery: "ដឹកជញ្ជូនភ្លាមៗ",
  statPayment: "KHQR · គ្រប់ធនាគារ",
  searchPlaceholder: "ស្វែងរកហ្គេម…",
  allGames: "ហ្គេមទាំងអស់",
  popular: "ពេញនិយម",
  topUpNow: "TopUp Now",
  noResults: "គ្មានហ្គេមណាត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
  clearFilter: "សម្អាតតម្រង",
  whyTitle: "ហេតុអ្វីជ្រើសរើស Tratopup?",
  whySub: "ប្រព័ន្ធដឹកជញ្ជូនស្វ័យប្រវត្តិ ដែលធ្វើការ ២៤/៧",
  howTitle: "របៀបថបអាប់ក្នុង ៣ ជំហាន",
  howSub: "មិនត្រូវការចុះឈ្មោះ មិនត្រូវការរង់ចាំ",
  step1: "ជ្រើសរើសហ្គេម និងកញ្ចប់",
  step1d: "រកហ្គេមរបស់អ្នក ហើយជ្រើសកញ្ចប់ដែលចង់បាន។",
  step2: "បញ្ចូល Player ID",
  step2d: "ដាក់ ID ត្រឹមត្រូវ — យើងពិនិត្យឈ្មោះគណនីមុនបង់ប្រាក់។",
  step3: "ស្កេន KHQR ហើយបង់",
  step3d: "ស្កេនជាមួយធនាគារណាមួយ ហើយទទួលបានភ្លាមៗ។",
  payTitle: "វិធីបង់ប្រាក់",
  paySub: "គាំទ្រគ្រប់កម្មវិធីធនាគារកម្ពុជាតាមរយៈ KHQR និង Bakong",
  packages: "កញ្ចប់ · ដឹកជញ្ជូនភ្លាមៗ",
  instant: "បញ្ចូលទឹកប្រាក់រហ័ស",
  secure: "សុវត្ថិភាព",
  verified: "ការពិនិត្យគណនីដែលបានផ្ទៀងផ្ទាត់",
  choosePackage: "ជ្រើសរើសកញ្ចប់",
  playerInfo: "ព័ត៌មានអ្នកលេង",
  userId: "User ID",
  zoneId: "Zone ID",
  serverId: "Server ID",
  phone: "លេខទូរស័ព្ទ",
  playerIdPlaceholder: "ឧ. 12345678",
  zonePlaceholder: "ឧ. 1234",
  continuePay: "បន្តទៅបង់ប្រាក់",
  checkingAccount: "កំពុងពិនិត្យគណនី…",
  verifiedAccount: "គណនីបានផ្ទៀងផ្ទាត់",
  total: "សរុប",
  payWith: "បង់ប្រាក់ដោយ",
  scanToPay: "ស្កេន KHQR ដើម្បីបង់ប្រាក់",
  orderCode: "លេខបញ្ជាទិញ",
  expiresIn: "ផុតកំណត់ក្នុង",
  iPaid: "ខ្ញុំបានបង់ប្រាក់ហើយ",
  checking: "កំពុងពិនិត្យ…",
  paidSuccess: "ការបង់ប្រាក់ជោគជ័យ!",
  deliveryDone: "កញ្ចប់របស់អ្នកត្រូវបានដឹកជញ្ជូនរួចរាល់។",
  demoNote:
    "របៀបសាកល្បង៖ BAKONG_API_TOKEN មិនទាន់កំណត់ទេ ដូច្នេះការបង់ប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ក្នុង demo។",
  demoPay: "សាកល្បងបង់ប្រាក់ (Demo)",
  liveNote: "បង់ប្រាក់ពិតតាម Bakong Open API — ប្រព័ន្ធពិនិត្យ MD5 ស្វ័យប្រវត្តិ។",
  trackTitle: "តាមដានការបញ្ជាទិញ",
  trackSub: "ដាក់លេខបញ្ជាទិញ ដើម្បីមើលស្ថានភាព និងវិក័យប័ត្រ",
  trackPlaceholder: "ឧ. KT-8F3K2Q",
  trackBtn: "តាមដាន",
  orderNotFound: "រកមិនឃើញការបញ្ជាទិញនេះទេ។",
  views: "ឯកសារ API",
  footerAbout:
    "Tratopup គឺជាវេទិកាថបអាប់ហ្គេមឈានមុខគេនៅកម្ពុជា ដែលដំណើរការដោយប្រព័ន្ធស្វ័យប្រវត្តិ និងការបង់ប្រាក់ KHQR។",
  contact: "ទំនាក់ទំនង",
  terms: "លក្ខខណ្ឌ",
  rights: "រក្សាសិទ្ធិគ្រប់យ៉ាង",
  recent: "ការទិញថ្មីៗ",
  bought: "បានទិញ",
  searchIdHint: "របៀបស្វែងរក User ID របស់អ្នក",
  apiDocs: "ឯកសារយោង API ពេញលេញ",
  poweredBy: "ដំណើរការដោយ Bakong Open API",
};

const en: Dict = {
  navTopup: "Top Up",
  navGames: "Games",
  navTrack: "Track order",
  navStore: "Create store",
  navServices: "Services",
  navOrders: "Orders",
  navApi: "API docs",
  login: "Log in",
  register: "Sign up",
  logout: "Log out",
  language: "Language",
  currencyLabel: "Currency",
  heroBadge: "Instant delivery · Best prices",
  heroTitle: "Top up any game — fast, safe and instant",
  heroSub:
    "Pay with KHQR from any Cambodian bank, powered by the Bakong API. Pick a package, enter your ID and get your diamonds in seconds.",
  heroPrimary: "Start top-up",
  heroSecondary: "How it works",
  statGames: "Games & services",
  statDelivery: "Instant delivery",
  statPayment: "KHQR · all banks",
  searchPlaceholder: "Search games…",
  allGames: "All games",
  popular: "Popular",
  topUpNow: "TopUp Now",
  noResults: "No games match your search.",
  clearFilter: "Clear filter",
  whyTitle: "Why choose Tratopup?",
  whySub: "Automated delivery that runs 24/7",
  howTitle: "Top up in 3 steps",
  howSub: "No sign-up required, no waiting",
  step1: "Choose game & package",
  step1d: "Find your game and pick the package you need.",
  step2: "Enter Player ID",
  step2d: "Add your correct ID — we verify the account before payment.",
  step3: "Scan KHQR & pay",
  step3d: "Scan with any banking app and receive instantly.",
  payTitle: "Payment methods",
  paySub: "Every Cambodian banking app supported through KHQR and Bakong",
  packages: "Packages · instant delivery",
  instant: "Lightning fast top-up",
  secure: "Secure payments",
  verified: "Verified account check",
  choosePackage: "Choose a package",
  playerInfo: "Player information",
  userId: "User ID",
  zoneId: "Zone ID",
  serverId: "Server ID",
  phone: "Phone number",
  playerIdPlaceholder: "e.g. 12345678",
  zonePlaceholder: "e.g. 1234",
  continuePay: "Continue to payment",
  checkingAccount: "Checking account…",
  verifiedAccount: "Account verified",
  total: "Total",
  payWith: "Pay with",
  scanToPay: "Scan the KHQR to pay",
  orderCode: "Order code",
  expiresIn: "Expires in",
  iPaid: "I have paid",
  checking: "Checking…",
  paidSuccess: "Payment successful!",
  deliveryDone: "Your package has been delivered.",
  demoNote:
    "Demo mode: BAKONG_API_TOKEN is not configured, so payment confirmation is simulated.",
  demoPay: "Simulate payment (Demo)",
  liveNote: "Real payment via the Bakong Open API — MD5 status is verified automatically.",
  trackTitle: "Track your order",
  trackSub: "Enter your order code to see status and receipt",
  trackPlaceholder: "e.g. KT-8F3K2Q",
  trackBtn: "Track",
  orderNotFound: "We could not find that order.",
  views: "API docs",
  footerAbout:
    "Tratopup is Cambodia's leading game top-up platform, running automated delivery and KHQR payments.",
  contact: "Contact",
  terms: "Terms",
  rights: "All rights reserved",
  recent: "Recent purchases",
  bought: "bought",
  searchIdHint: "How to find your User ID",
  apiDocs: "Full API reference",
  poweredBy: "Powered by Bakong Open API",
};

export function getDict(locale: Locale): Dict {
  return locale === "en" ? en : km;
}

export type Dictionary = Dict;

export const LANGUAGES: Array<{ code: Locale; label: string; country: string }> = [
  { code: "km", label: "ខ្មែរ", country: "Cambodia" },
  { code: "en", label: "English", country: "United States" },
];

export const CURRENCIES: Array<{ code: "USD" | "KHR"; symbol: string; label: string }> = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "KHR", symbol: "៛", label: "Cambodian Riel" },
];
