import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const games = pgTable(
  "games",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    nameKm: varchar("name_km", { length: 200 }).notNull(),
    publisher: varchar("publisher", { length: 120 }).notNull().default(""),
    image: varchar("image", { length: 255 }).notNull(),
    category: varchar("category", { length: 40 }).notNull().default("game"),
    popular: boolean("popular").notNull().default(false),
    badge: varchar("badge", { length: 40 }),
    fields: jsonb("fields")
      .$type<{ userId: boolean; zoneId: boolean; serverId: boolean; phone: boolean }>()
      .notNull()
      .default({ userId: true, zoneId: false, serverId: false, phone: false }),
    idHintKm: text("id_hint_km").notNull().default(""),
    idHintEn: text("id_hint_en").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("games_slug_idx").on(table.slug)],
);

export const packages = pgTable(
  "packages",
  {
    id: serial("id").primaryKey(),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    packageId: integer("package_id").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    priceCents: integer("price_cents").notNull(),
    oldPriceCents: integer("old_price_cents"),
    popular: boolean("popular").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("packages_game_idx").on(table.gameId),
    uniqueIndex("packages_game_package_idx").on(table.gameId, table.packageId),
  ],
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull().default(""),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 24 }).notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    gameSlug: varchar("game_slug", { length: 120 }).notNull(),
    gameName: varchar("game_name", { length: 160 }).notNull(),
    packageId: integer("package_id").notNull(),
    packageName: varchar("package_name", { length: 160 }).notNull(),
    playerId: varchar("player_id", { length: 120 }).notNull(),
    serverId: varchar("server_id", { length: 120 }).notNull().default(""),
    playerName: varchar("player_name", { length: 160 }).notNull().default(""),
    contact: varchar("contact", { length: 190 }).notNull().default(""),
    amountCents: integer("amount_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    rielAmount: integer("riel_amount").notNull().default(0),
    qrString: text("qr_string").notNull().default(""),
    md5: varchar("md5", { length: 64 }).notNull().default(""),
    deeplink: text("deeplink").notNull().default(""),
    paymentMode: varchar("payment_mode", { length: 20 }).notNull().default("demo"),
    paymentRef: varchar("payment_ref", { length: 120 }).notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("orders_code_idx").on(table.code),
    index("orders_md5_idx").on(table.md5),
    index("orders_user_idx").on(table.userId),
  ],
);

export const recentPurchases = pgTable("recent_purchases", {
  id: serial("id").primaryKey(),
  gameSlug: varchar("game_slug", { length: 120 }).notNull(),
  gameName: varchar("game_name", { length: 160 }).notNull(),
  packageName: varchar("package_name", { length: 160 }).notNull(),
  maskedPlayer: varchar("masked_player", { length: 40 }).notNull(),
  priceCents: integer("price_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Game = typeof games.$inferSelect;
export type GamePackage = typeof packages.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
export type RecentPurchase = typeof recentPurchases.$inferSelect;
