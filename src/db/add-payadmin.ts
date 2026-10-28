import { db } from "@/db";
import { games, packages } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function main() {
  const [game] = await db.select().from(games).where(eq(games.slug, "mobile-legends")).limit(1);
  if (!game) throw new Error("game mobile-legends not found");

  const [exists] = await db
    .select()
    .from(packages)
    .where(and(eq(packages.gameId, game.id), eq(packages.name, "payadmin")))
    .limit(1);

  if (exists) {
    await db.update(packages).set({ priceUsd: "0.01" }).where(eq(packages.id, exists.id));
    console.log("updated payadmin -> 0.01");
  } else {
    await db.insert(packages).values({
      gameId: game.id,
      name: "payadmin",
      amount: 1,
      priceUsd: "0.01",
      sortOrder: 99,
    });
    console.log("added payadmin 0.01");
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
