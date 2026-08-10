import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { db } from "@/lib/db";

/**
 * Deep-merge two values. DB overrides JSON at the leaf level, but JSON
 * fills in any keys the DB doesn't have.
 *
 * - Objects: recursively merge (DB wins on conflicts, JSON fills gaps)
 * - Arrays: DB replaces JSON entirely (no element-level merge)
 * - Primitives: DB replaces JSON
 * - null/undefined: DB value (or JSON if DB is undefined)
 */
function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined) return base;
  if (base === undefined) return override;
  if (Array.isArray(override)) return override;
  if (Array.isArray(base)) return override;
  if (typeof base !== "object" || base === null) return override;
  if (typeof override !== "object" || override === null) return override;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    out[key] = deepMerge(
      (base as Record<string, unknown>)[key],
      (override as Record<string, unknown>)[key]
    );
  }
  return out;
}

/**
 * Load messages by MERGING the static JSON file with the SiteContent DB rows.
 *
 * Strategy:
 *   1. Start with the full JSON file (messages/{locale}.json) as the base.
 *   2. Deep-merge DB rows on top — DB values override JSON at the leaf level,
 *      but JSON fills in any sub-keys the DB doesn't have. This is critical
 *      because the DB `workContent` row was seeded before new sub-namespaces
 *      (like `neural`) were added to the JSON; without deep-merge, the DB
 *      row would shadow the new JSON sub-namespace entirely.
 *   3. If the DB is unreachable, fall back to JSON-only.
 *
 * This merge pattern allows:
 *   - New sub-namespaces (e.g. workContent.neural) to ship via JSON immediately
 *     without requiring a DB re-seed.
 *   - Admin to override any individual value by editing the DB row.
 *   - The site to remain fully functional even if Neon is down.
 */
async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const base = (await import(`../messages/${locale}.json`)).default;

  try {
    const rows = await db.siteContent.findMany({ where: { locale } });
    if (rows.length === 0) {
      return base;
    }
    const out: Record<string, unknown> = { ...base };
    for (const row of rows) {
      out[row.namespace] = deepMerge(out[row.namespace], row.value);
    }
    return out;
  } catch (err) {
    console.error(`[i18n] DB load failed for ${locale}, using JSON only:`, err);
    return base;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: await loadMessages(locale),
  };
});
