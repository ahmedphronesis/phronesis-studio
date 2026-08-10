import { db } from "@/lib/db";

/**
 * Fetch all Echoes episodes from the DB (admin-editable).
 * Sorted by episode number ascending.
 * Returns shape compatible with the original echoes-data.json schema
 * so the Echoes component can consume it without changes.
 */
export async function getEpisodes() {
  const rows = await db.episode.findMany({ orderBy: { number: "asc" } });
  return rows.map((e) => ({
    number: e.number,
    en_title: e.enTitle,
    ar_title: e.arTitle,
    en_excerpt: e.enExcerpt,
    ar_excerpt: e.arExcerpt,
    en_full: e.enFull,
    ar_full: e.arFull,
  }));
}

export type Episode = Awaited<ReturnType<typeof getEpisodes>>[number];
