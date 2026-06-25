/**
 * Remove em-dashes (—) from all Echoes episode transcripts in the database.
 * Replaces with appropriate punctuation (comma for parenthetical, period for pause).
 * 
 * Usage: bun run scripts/clean-episodes-emdashes.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const episodes = await prisma.episode.findMany();
  console.log(`Found ${episodes.length} episodes`);

  let totalReplaced = 0;

  for (const ep of episodes) {
    const fields = ["enTitle", "arTitle", "enExcerpt", "arExcerpt", "enFull", "arFull"] as const;
    const updates: Record<string, string> = {};
    let epCount = 0;

    for (const field of fields) {
      const value = ep[field];
      if (value && value.includes("—")) {
        // Context-aware replacement:
        // ' — ' → ', ' (parenthetical aside)
        // '— ' at start → '' (remove)
        // ' —' at end → ''
        // standalone '—' → ', '
        let newValue = value.replace(/ — /g, ", ");
        newValue = newValue.replace(/^— /g, "");
        newValue = newValue.replace(/ —$/gm, "");
        newValue = newValue.replace(/—/g, ", ");

        if (newValue !== value) {
          updates[field] = newValue;
          epCount += (value.match(/—/g) || []).length;
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.episode.update({
        where: { number: ep.number },
        data: updates,
      });
      console.log(`  Episode ${ep.number}: removed ${epCount} em-dash(es)`);
      totalReplaced += epCount;
    }
  }

  console.log(`\n✓ Total: removed ${totalReplaced} em-dashes from ${episodes.length} episodes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
