export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  accent: string;
  short: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "khqr",
    name: "KHQR (Bakong)",
    description: "Scan with any Cambodian banking app",
    accent: "from-red-500 to-rose-600",
    short: "QR",
  },
];

export function getPaymentMethod(id: string) {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
