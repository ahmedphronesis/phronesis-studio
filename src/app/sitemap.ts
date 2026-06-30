import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";

const BASE_URL = "https://phronesis-studio.com";

const STATIC_ROUTES = ["", "/about", "/work", "/echoes", "/library", "/method", "/correspondence"];

// Guide slugs (must match library/[slug]/page.tsx)
const GUIDE_SLUGS = [
  "grade-1-mathematics",
  "grade-2-mathematics",
  "grade-3-mathematics",
  "grade-4-mathematics",
];

// Project slugs (must match work/[slug]/page.tsx)
const PROJECT_SLUGS = [
  "real-estate-emperor",
  "mscs-academy",
  "diplomatiq",
  "bilingual-mathematics",
  "echoes-of-wisdom",
  "treasury-emperor",
  "history-of-philosophy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Fetch episode numbers from DB
  let episodeNumbers: number[] = [];
  try {
    const episodes = await db.episode.findMany({ select: { number: true } });
    episodeNumbers = episodes.map((e) => e.number);
  } catch {
    // DB might be unavailable during build — use fallback
    episodeNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
  }

  for (const locale of routing.locales) {
    // Static routes
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    // Episode routes: /{locale}/echoes/{number}
    for (const num of episodeNumbers) {
      entries.push({
        url: `${BASE_URL}/${locale}/echoes/${num}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Season route
    entries.push({
      url: `${BASE_URL}/${locale}/echoes/season-1`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    // Library guide routes
    for (const slug of GUIDE_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/library/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Work project routes
    for (const slug of PROJECT_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/work/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Vouches letter routes (3 letters — slugs based on university names)
    // Emory University, Alexandria University, Bibliotheca Alexandrina
    entries.push({
      url: `${BASE_URL}/${locale}/vouches/emory-university`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    entries.push({
      url: `${BASE_URL}/${locale}/vouches/alexandria-university`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    entries.push({
      url: `${BASE_URL}/${locale}/vouches/bibliotheca-alexandrina`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Root
  entries.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  });

  return entries;
}
