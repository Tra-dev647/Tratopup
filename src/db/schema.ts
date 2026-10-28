import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  publisher: text("publisher").notNull(),
  category: text("category").notNull(),
  currencyName: text("currency_name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  playerIdLabel: text("player_id_label").notNull().default("Player ID"),
  requiresZone: boolean("requires_zone").notNull().default(false),
  zoneLabel: text("zone_label"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  bonus: integer("bonus").notNull().default(0),
  priceUsd: numeric("price_usd", { precision: 10, scale: 2 }).notNull(),
  isPopular: boolean("is_popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  supplierPackageId: integer("supplier_package_id"),
});

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("favorites_session_game_idx").on(t.sessionId, t.gameId)],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNo: text("order_no").notNull().unique(),
  sessionId: text("session_id").notNull(),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id),
  packageId: integer("package_id")
    .notNull()
    .references(() => packages.id),
  playerId: text("player_id").notNull(),
  zoneId: text("zone_id"),
  playerName: text("player_name"),
  paymentMethod: text("payment_method").notNull(),
  amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  md5: text("md5"),
  khqr: text("khqr"),
  paidAt: timestamp("paid_at"),
  supplierOrderCode: text("supplier_order_code"),
  note: text("note"),
});

export type Game = typeof games.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Order = typeof orders.$inferSelect;
