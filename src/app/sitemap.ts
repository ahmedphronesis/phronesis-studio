import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://phronesis-studio.com";

const ROUTES = ["", "/about", "/work", "/echoes", "/library", "/method", "/correspondence"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of ROUTES) {
      const path = `/${locale}${route}`;
      entries.push({
        url: `${BASE_URL}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Root redirect (so Google knows / exists)
  entries.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  });

  return entries;
}
