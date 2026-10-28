import { db } from "@/db";
import { games, packages } from "@/db/schema";
import { count, eq } from "drizzle-orm";

type SeedPackage = {
  name: string;
  amount: number;
  bonus?: number;
  priceUsd: string;
  isPopular?: boolean;
};

type SeedGame = {
  slug: string;
  name: string;
  publisher: string;
  category: string;
  currencyName: string;
  description: string;
  imageUrl: string;
  playerIdLabel?: string;
  requiresZone?: boolean;
  zoneLabel?: string;
  isFeatured?: boolean;
  packages: SeedPackage[];
};

const SEED_GAMES: SeedGame[] = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    publisher: "MOONTON Games",
    category: "MOBA",
    currencyName: "Diamonds",
    description:
      "Top up Mobile Legends: Bang Bang Diamonds and passes. Enter your Player ID and Zone ID carefully before placing an order.",
    imageUrl: "/images/games/mobile-legends.jpg",
    playerIdLabel: "User ID",
    requiresZone: true,
    zoneLabel: "Zone ID",
    isFeatured: true,
    packages: [
      { name: "Diamonds", amount: 86, priceUsd: "1.49" },
      { name: "Diamonds", amount: 172, priceUsd: "2.89" },
      { name: "Diamonds", amount: 257, priceUsd: "4.29", isPopular: true },
      { name: "Diamonds", amount: 514, priceUsd: "8.49" },
      { name: "Diamonds", amount: 706, priceUsd: "11.49" },
      { name: "Diamonds", amount: 1412, priceUsd: "22.49" },
      { name: "Diamonds", amount: 2195, priceUsd: "34.99" },
      { name: "Weekly Diamond Pass", amount: 1, priceUsd: "1.59" },
      { name: "Twilight Pass", amount: 1, priceUsd: "8.99" },
    ],
  },
];

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedIfEmpty().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function seedIfEmpty() {
  const [row] = await db.select({ value: count() }).from(games);
  if (row && Number(row.value) > 0) {
    // Upgrade the previous demo catalog in-place so an existing deployment can switch to Tratopup.
    const [existingMlbb] = await db.select().from(games).where(eq(games.slug, "mobile-legends")).limit(1);
    const [oldDemoMlbb] = await db.select().from(games).where(eq(games.slug, "mythic-legends")).limit(1);
    const target = existingMlbb ?? oldDemoMlbb;
    if (target) {
      await db.update(games).set({
        slug: "mobile-legends",
        name: "Mobile Legends: Bang Bang",
        publisher: "MOONTON Games",
        category: "MOBA",
        currencyName: "Diamonds",
        description: "Top up Mobile Legends: Bang Bang Diamonds and passes. Enter your Player ID and Zone ID carefully before placing an order.",
        imageUrl: "/images/games/mobile-legends.jpg",
        playerIdLabel: "User ID",
        requiresZone: true,
        zoneLabel: "Zone ID",
        isFeatured: true,
        sortOrder: 0,
      }).where(eq(games.id, target.id));
    }
    return;
  }

  await db.transaction(async (tx) => {
    for (const [index, g] of SEED_GAMES.entries()) {
      const [inserted] = await tx
        .insert(games)
        .values({
          slug: g.slug,
          name: g.name,
          publisher: g.publisher,
          category: g.category,
          currencyName: g.currencyName,
          description: g.description,
          imageUrl: g.imageUrl,
          playerIdLabel: g.playerIdLabel ?? "Player ID",
          requiresZone: g.requiresZone ?? false,
          zoneLabel: g.zoneLabel ?? null,
          isFeatured: g.isFeatured ?? false,
          sortOrder: index,
        })
        .onConflictDoNothing()
        .returning({ id: games.id });

      if (!inserted) continue;

      await tx.insert(packages).values(
        g.packages.map((p, i) => ({
          gameId: inserted.id,
          name: p.name,
          amount: p.amount,
          bonus: p.bonus ?? 0,
          priceUsd: p.priceUsd,
          isPopular: p.isPopular ?? false,
          sortOrder: i,
        })),
      );
    }
  });
}
