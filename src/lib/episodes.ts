import { db } from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

/**
 * Fetch all Echoes episodes from the DB (admin-editable).
 * Sorted by episode number ascending.
 * Returns shape compatible with the original echoes-data.json schema
 * so the Echoes component can consume it without changes.
 *
 * Falls back to /public/echoes-data.json when the DB is unavailable
 * (e.g. local dev without DATABASE_URL). On Vercel the DB is always
 * configured, so the fallback never triggers in production.
 */
type EpisodeRow = {
  number: number;
  en_title: string;
  ar_title: string;
  en_excerpt: string;
  ar_excerpt: string;
  en_full: string;
  ar_full: string;
};

async function fromDb(): Promise<EpisodeRow[]> {
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

async function fromFallback(): Promise<EpisodeRow[]> {
  const file = path.join(process.cwd(), "public", "echoes-data.json");
  const data = JSON.parse(await fs.readFile(file, "utf-8"));
  return data as EpisodeRow[];
}

export async function getEpisodes(): Promise<EpisodeRow[]> {
  try {
    if (!process.env.DATABASE_URL) return await fromFallback();
    return await fromDb();
  } catch (e) {
    console.warn("[episodes] DB query failed, falling back to echoes-data.json:", (e as Error)?.message);
    return await fromFallback();
  }
}

export type Episode = Awaited<ReturnType<typeof getEpisodes>>[number];
