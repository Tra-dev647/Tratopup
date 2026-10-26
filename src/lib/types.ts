export type OrderInfo = {
  code: string;
  gameSlug: string;
  gameName: string;
  packageId: number;
  packageName: string;
  playerId: string;
  serverId: string;
  playerName: string;
  amountCents: number;
  currency: "USD" | "KHR";
  rielAmount: number;
  md5: string;
  status: "pending" | "paid" | "expired" | "failed";
  paymentMode: "demo" | "live";
  paymentRef: string;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
  deliveredAt: string | null;
};

export type PackageInfo = {
  packageId: number;
  name: string;
  priceCents: number;
  oldPriceCents: number | null;
  popular: boolean;
};

export type GameInfo = {
  slug: string;
  name: string;
  nameKm: string;
  image: string;
  publisher: string;
  fields: { userId: boolean; zoneId: boolean; serverId: boolean; phone: boolean };
  idHintKm: string;
  idHintEn: string;
};
