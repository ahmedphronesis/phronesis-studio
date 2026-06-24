/**
 * Seed SiteContent table from src/messages/{en,ar}.json
 * Also seeds Episode table from public/echoes-data.json
 *
 * Run with: bun run scripts/seed-content.ts
 *
 * Idempotent: upserts rows. Safe to re-run.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seeding SiteContent from src/messages/*.json");

  for (const locale of ["en", "ar"] as const) {
    const path = resolve(process.cwd(), `src/messages/${locale}.json`);
    const data = JSON.parse(readFileSync(path, "utf8"));

    for (const [namespace, value] of Object.entries(data)) {
      await prisma.siteContent.upsert({
        where: { locale_namespace: { locale, namespace } },
        create: { locale, namespace, value: value as object },
        update: { value: value as object },
      });
      console.log(`  ✓ ${locale}/${namespace}`);
    }
  }

  console.log("\n→ Seeding Episode from public/echoes-data.json");
  const echoesPath = resolve(process.cwd(), "public/echoes-data.json");
  const episodes: Array<{
    number: number;
    en_title: string;
    ar_title: string;
    en_excerpt: string;
    ar_excerpt: string;
    en_full: string;
    ar_full: string;
  }> = JSON.parse(readFileSync(echoesPath, "utf8"));

  for (const ep of episodes) {
    await prisma.episode.upsert({
      where: { number: ep.number },
      create: {
        number: ep.number,
        enTitle: ep.en_title,
        arTitle: ep.ar_title,
        enExcerpt: ep.en_excerpt,
        arExcerpt: ep.ar_excerpt,
        enFull: ep.en_full,
        arFull: ep.ar_full,
      },
      update: {
        enTitle: ep.en_title,
        arTitle: ep.ar_title,
        enExcerpt: ep.en_excerpt,
        arExcerpt: ep.ar_excerpt,
        enFull: ep.en_full,
        arFull: ep.ar_full,
      },
    });
    console.log(`  ✓ Episode ${ep.number}: ${ep.en_title.slice(0, 50)}…`);
  }

  console.log("\n→ Verifying");
  const contentCount = await prisma.siteContent.count();
  const episodeCount = await prisma.episode.count();
  const leadCount = await prisma.lead.count();
  console.log(`  SiteContent rows: ${contentCount}`);
  console.log(`  Episode rows: ${episodeCount}`);
  console.log(`  Lead rows: ${leadCount}`);
  console.log("\n✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
