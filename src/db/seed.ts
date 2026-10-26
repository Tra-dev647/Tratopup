import { sql } from "drizzle-orm";
import { db } from "@/db";
import { games, packages, recentPurchases } from "@/db/schema";

type SeedGame = {
  slug: string;
  name: string;
  nameKm: string;
  publisher: string;
  image: string;
  category?: "game" | "social";
  popular?: boolean;
  badge?: string;
  fields?: { userId?: boolean; zoneId?: boolean; serverId?: boolean; phone?: boolean };
  hintKm: string;
  hintEn: string;
  packs: Array<[name: string, usd: number, popular?: boolean, oldUsd?: number]>;
};

const ML_HINT_KM =
  "ចុចលើរូបតំណាងនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើ បើក Profile នោះ User ID និង Zone ID នឹងបង្ហាញជាមួយគ្នា ដូចជា 12345678(1234)។";
const FF_HINT_KM =
  "បើកហ្គេម ហើយចុចលើរូបតំណាងរបស់អ្នកនៅជ្រុងខាងឆ្វេងផ្នែកខាងលើ។ លេខ ID 8–12 ខ្ទង់នឹងបង្ហាញនៅក្រោមឈ្មោះរបស់អ្នក។";

const mlPacks: SeedGame["packs"] = [
  ["55 Diamonds", 0.77],
  ["86 Diamonds", 1.27],
  ["165 Diamonds", 2.31],
  ["172 Diamonds", 2.51],
  ["257 Diamonds", 3.61],
  ["275 Diamonds", 3.75],
  ["343 Diamonds", 4.86, true],
  ["344 Diamonds", 5.02],
  ["429 Diamonds", 6.11],
  ["514 Diamonds", 7.19],
  ["565 Diamonds", 7.69],
  ["706 Diamonds", 9.86, true],
  ["792 Diamonds", 11.12],
  ["878 Diamonds", 12.36],
  ["963 Diamonds", 13.45],
  ["1050 Diamonds", 14.87],
  ["1136 Diamonds", 16.13],
  ["1222 Diamonds", 17.37],
  ["1308 Diamonds", 18.63],
  ["1412 Diamonds", 19.72],
  ["1584 Diamonds", 22.22],
  ["1842 Diamonds", 25.99],
  ["2195 Diamonds", 29.83],
  ["2453 Diamonds", 33.59],
  ["2901 Diamonds", 39.68],
  ["3503 Diamonds", 48.46],
  ["4290 Diamonds", 58.54],
  ["5688 Diamonds", 74.99],
  ["Weekly Diamond Pass", 2.29],
  ["3x Weekly Diamond Pass", 4.53],
  ["Twilight Pass", 9.99],
];

const ffIndonesia: SeedGame["packs"] = [
  ["5 Diamonds", 0.05],
  ["12 Diamonds", 0.11],
  ["70 Diamonds", 0.59],
  ["140 Diamonds", 1.09],
  ["355 Diamonds", 2.59],
  ["720 Diamonds", 4.99],
  ["1450 Diamonds", 9.49],
  ["Weekly Membership", 1.49],
  ["Monthly Membership", 7.99],
];

const ffGlobal: SeedGame["packs"] = [
  ["110 Diamonds", 0.69],
  ["220 Diamonds", 1.35],
  ["341 Diamonds", 1.99],
  ["572 Diamonds", 3.35],
  ["1166 Diamonds", 6.75],
  ["2398 Diamonds", 13.49],
  ["Weekly Membership", 1.49],
  ["Monthly Membership", 7.99],
  ["Level Up Pass", 0.99],
  ["Elite Pass", 4.99],
];

const pubgPacks: SeedGame["packs"] = [
  ["60 UC", 0.99],
  ["325 UC", 4.99],
  ["660 UC", 9.99],
  ["1800 UC", 24.99],
  ["3850 UC", 49.99],
  ["8100 UC", 99.99],
  ["Elite Pass Plus", 9.99],
];

const telegramPacks: SeedGame["packs"] = [
  ["50 Stars", 1.15],
  ["100 Stars", 2.25],
  ["250 Stars", 5.49],
  ["500 Stars", 10.75],
  ["1000 Stars", 20.99],
  ["Premium 3 Months", 12.49],
  ["Premium 6 Months", 21.99],
  ["Premium 12 Months", 39.99],
];

const catalog: SeedGame[] = [
  {
    slug: "free-fire",
    name: "Free Fire",
    nameKm: "Free Fire",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    popular: true,
    badge: "ពេញនិយម",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left. Your numeric ID (8–12 digits) appears under your name.",
    packs: ffGlobal,
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends Cambodia",
    nameKm: "Mobile Legends កម្ពុជា",
    publisher: "Moonton",
    image: "/images/games/mobile-legends-real.webp",
    popular: true,
    badge: "ពេញនិយម",
    fields: { userId: true, zoneId: true },
    hintKm: ML_HINT_KM,
    hintEn: "Tap your avatar top-left, open Profile, and your User ID and Zone ID show together like 12345678(1234).",
    packs: mlPacks,
  },
  {
    slug: "telegram",
    name: "Telegram",
    nameKm: "Telegram Stars",
    publisher: "Telegram FZ-LLC",
    image: "/images/games/telegram-0d8b2c.webp",
    category: "social",
    popular: true,
    badge: "ពេញនិយម",
    fields: { phone: true },
    hintKm: "ដាក់លេខទូរស័ព្ទ Telegram របស់អ្នក (រួមទាំងកូដប្រទេស) ឧទាហរណ៍ +85512xxxxxx។",
    hintEn: "Enter your Telegram phone number with country code, e.g. +85512xxxxxx.",
    packs: telegramPacks,
  },
  {
    slug: "freefire-indonesia",
    name: "Freefire Indonesia",
    nameKm: "Free Fire ឥណ្ឌូនេស៊ី",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    popular: true,
    badge: "ពេញនិយម",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffIndonesia,
  },
  {
    slug: "mobile-legends-special",
    name: "Mobile Legends Special",
    nameKm: "Mobile Legends ពិសេស",
    publisher: "Moonton",
    image: "/images/games/mobile-legends-exclusive-e26b73bc.webp",
    popular: true,
    badge: "ពេញនិយម",
    fields: { userId: true, zoneId: true },
    hintKm: ML_HINT_KM,
    hintEn: "Tap your avatar top-left, open Profile, and copy your User ID and Zone ID.",
    packs: mlPacks.slice(0, 14),
  },
  {
    slug: "freefire-latam",
    name: "Freefire LATAM",
    nameKm: "Free Fire អាមេរិកឡាទីន",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    popular: true,
    badge: "ពេញនិយម",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal,
  },
  {
    slug: "mobile-legends-exclusive",
    name: "Mobile Legends Exclusive Cambodia",
    nameKm: "Mobile Legends Exclusive កម្ពុជា",
    publisher: "Moonton",
    image: "/images/games/mobile-legends-exclusive-e26b73bc.webp",
    popular: true,
    badge: "ពេញនិយម",
    fields: { userId: true, zoneId: true },
    hintKm: ML_HINT_KM,
    hintEn: "Tap your avatar top-left, open Profile, and copy your User ID and Zone ID.",
    packs: mlPacks.slice(0, 20),
  },
  {
    slug: "freefire-sg",
    name: "Freefire SG",
    nameKm: "Free Fire សិង្ហបុរី",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal,
  },
  {
    slug: "freefire-taiwan",
    name: "Freefire Taiwan",
    nameKm: "Free Fire តៃវ៉ាន់",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal,
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile Global",
    nameKm: "PUBG Mobile សកល",
    publisher: "Level Infinite",
    image: "/images/games/pubg-mobile-real.webp",
    hintKm: "លេខ Character ID របស់អ្នកមាននៅក្នុងផ្ទាំង Profile ក្នុងហ្គេម។",
    hintEn: "Find your Character ID in the in-game Profile screen.",
    packs: pubgPacks,
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    nameKm: "Honor of Kings",
    publisher: "Level Infinite",
    image: "/images/games/honor-of-kings-real.webp",
    hintKm: "Player ID បង្ហាញនៅក្នុង Settings > Profile របស់ហ្គេម។",
    hintEn: "Your Player ID is shown in Settings > Profile.",
    packs: [
      ["16 Tokens", 0.29],
      ["57 Tokens", 0.99],
      ["115 Tokens", 1.99],
      ["240 Tokens", 3.99],
      ["480 Tokens", 7.99],
      ["960 Tokens", 15.49],
      ["Weekly Card", 1.99],
      ["Monthly Card", 7.99],
    ],
  },
  {
    slug: "eafc-mobile-cambodia",
    name: "EAFC Mobile Cambodia",
    nameKm: "EA FC Mobile កម្ពុជា",
    publisher: "Electronic Arts",
    image: "/images/games/eafc-mobile-cambodia-8be68c.webp",
    hintKm: "បើកហ្គេម ហើយចូលទៅ Settings > Account ដើម្បីយក Player ID។",
    hintEn: "Open the game and go to Settings > Account to find your Player ID.",
    packs: [
      ["100 FC Points", 0.99],
      ["250 FC Points", 2.49],
      ["520 FC Points", 4.99],
      ["1050 FC Points", 9.99],
      ["2200 FC Points", 19.99],
      ["5600 FC Points", 49.99],
    ],
  },
  {
    slug: "magic-chess-gogo",
    name: "Magic Chess GoGo",
    nameKm: "Magic Chess GoGo",
    publisher: "Moonton",
    image: "/images/games/magic-chess-gogo-real.webp",
    hintKm: ML_HINT_KM,
    hintEn: "Tap your avatar top-left, open Profile, and copy your User ID and Zone ID.",
    fields: { userId: true, zoneId: true },
    packs: mlPacks.slice(0, 12),
  },
  {
    slug: "freefire-vietnam",
    name: "Freefire Vietnam",
    nameKm: "Free Fire វៀតណាម",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal,
  },
  {
    slug: "freefire-brazil",
    name: "Freefire Brazil",
    nameKm: "Free Fire ប្រេស៊ីល",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal,
  },
  {
    slug: "blood-strike",
    name: "Blood Strike",
    nameKm: "Blood Strike",
    publisher: "Netease",
    image: "/images/games/blood-strike-real.webp",
    hintKm: "Player ID មាននៅក្នុង Profile របស់ហ្គេម។",
    hintEn: "Your Player ID appears on the in-game profile.",
    packs: [
      ["60 Gold", 0.99],
      ["300 Gold", 4.79],
      ["620 Gold", 9.49],
      ["1300 Gold", 19.49],
      ["2800 Gold", 39.99],
    ],
  },
  {
    slug: "dragonheir-silent-gods",
    name: "Dragonheir: Silent Gods",
    nameKm: "Dragonheir: Silent Gods",
    publisher: "SGRA Studio",
    image: "/images/games/dragonheir-silent-gods-8290b3.webp",
    hintKm: "ដាក់ UID ដែលបង្ហាញនៅផ្ទាំងដំបូងនៃហ្គេម។",
    hintEn: "Enter the UID shown on the game's start screen.",
    packs: [
      ["60 Heliolite", 0.99],
      ["300 Heliolite", 4.99],
      ["980 Heliolite", 14.99],
      ["1980 Heliolite", 29.99],
    ],
  },
  {
    slug: "8-ball-pool",
    name: "8 Ball Pool",
    nameKm: "8 Ball Pool",
    publisher: "Miniclip",
    image: "/images/games/8-ball-pool-ee52e7.webp",
    hintKm: "ដាក់ Unique ID ដែលមាននៅក្នុង Profile ផ្ទាល់ខ្លួនរបស់អ្នក។",
    hintEn: "Enter the Unique ID from your in-game profile.",
    packs: [
      ["25,000 Coins", 1.99],
      ["100,000 Coins", 6.99],
      ["300,000 Coins", 17.99],
      ["1,000 Cash", 9.99],
    ],
  },
  {
    slug: "racing-master-sea",
    name: "Racing Master SEA",
    nameKm: "Racing Master SEA",
    publisher: "NetEase",
    image: "/images/games/racing-master-sea-9d951a.webp",
    hintKm: "បើក Settings > Account ដើម្បីយក Player ID។",
    hintEn: "Open Settings > Account to copy your Player ID.",
    packs: [
      ["60 Gems", 0.99],
      ["300 Gems", 4.79],
      ["680 Gems", 9.99],
      ["1280 Gems", 18.99],
    ],
  },
  {
    slug: "freefire-bonuse",
    name: "Free Fire Bonus",
    nameKm: "Free Fire Bonus",
    publisher: "Garena",
    image: "/images/games/free-fire-real.webp",
    hintKm: FF_HINT_KM,
    hintEn: "Open the game, tap your avatar top-left and copy your numeric Player ID.",
    packs: ffGlobal.slice(0, 6),
  },
];

const feed = [
  ["mobile-legends", 3393177, "343 Diamonds", 486],
  ["mobile-legends", 3393177, "706 Diamonds", 986],
  ["freefire-latam", 80867689, "110 Diamonds", 69],
  ["freefire-latam", 80867689, "110 Diamonds", 69],
  ["mobile-legends", 13217950, "878 Diamonds", 1236],
  ["mobile-legends", 13099044, "3x Weekly Diamond Pass", 453],
  ["freefire-indonesia", 172613530, "5 Diamonds", 5],
  ["freefire-indonesia", 172613530, "12 Diamonds", 11],
  ["mobile-legends", 9370060, "55 Diamonds", 77],
  ["telegram", 855123456, "250 Stars", 549],
  ["pubg-mobile", 5123456789, "660 UC", 999],
  ["free-fire", 667788990, "572 Diamonds", 335],
];

const mask = (value: number) => {
  const str = String(value);
  if (str.length <= 5) return `${str.slice(0, 2)}**${str.slice(-1)}`;
  return `${str.slice(0, 4)}**${str.slice(-3)}`;
};

async function seed() {
  let packageId = 101;
  for (let index = 0; index < catalog.length; index += 1) {
    const item = catalog[index];
    const [game] = await db
      .insert(games)
      .values({
        slug: item.slug,
        name: item.name,
        nameKm: item.nameKm,
        publisher: item.publisher,
        image: item.image,
        category: item.category ?? "game",
        popular: item.popular ?? false,
        badge: item.badge ?? null,
        fields: {
          userId: item.fields?.userId ?? true,
          zoneId: item.fields?.zoneId ?? false,
          serverId: item.fields?.serverId ?? false,
          phone: item.fields?.phone ?? false,
        },
        idHintKm: item.hintKm,
        idHintEn: item.hintEn,
        sortOrder: index,
      })
      .returning();

    await db.insert(packages).values(
      item.packs.map(([name, usd, popular, oldUsd], packIndex) => ({
        gameId: game.id,
        packageId: packageId + packIndex,
        name,
        priceCents: Math.round(usd * 100),
        oldPriceCents: oldUsd ? Math.round(oldUsd * 100) : null,
        popular: popular ?? false,
        sortOrder: packIndex,
      })),
    );
    packageId += item.packs.length;
  }

  const gameRows = await db.select({ slug: games.slug, name: games.name }).from(games);
  const nameBySlug = new Map(gameRows.map((row) => [row.slug, row.name]));

  await db.insert(recentPurchases).values(
    feed.map(([slug, player, pack, priceCents], i) => ({
      gameSlug: slug as string,
      gameName: nameBySlug.get(slug as string) ?? "Game",
      packageName: pack as string,
      maskedPlayer: mask(player as number),
      priceCents: priceCents as number,
      createdAt: new Date(Date.now() - i * 37_000),
    })),
  );
}

let seedPromise: Promise<void> | null = null;

export async function ensureSeed() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const initial = await db.execute<{ count: string }>(sql`select count(*)::text as count from games`);
      const count = Number(initial.rows[0]?.count ?? 0);
      if (count > 0) return;
      // Serialize seeding across concurrent server instances.
      await db.execute(sql`select pg_advisory_lock(918273645)`);
      try {
        const again = await db.execute<{ count: string }>(sql`select count(*)::text as count from games`);
        if (Number(again.rows[0]?.count ?? 0) === 0) await seed();
      } finally {
        await db.execute(sql`select pg_advisory_unlock(918273645)`);
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
