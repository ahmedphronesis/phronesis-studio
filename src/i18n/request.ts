import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { db } from "@/lib/db";

/**
 * Load messages by MERGING the static JSON file with the SiteContent DB rows.
 *
 * Strategy:
 *   1. Start with the full JSON file (messages/{locale}.json) as the base.
 *      This ensures every namespace — including new ones not yet in the DB —
 *      is always available.
 *   2. Override with DB rows for the same namespaces. This means admin edits
 *      (made via /admin/content) take precedence over the JSON defaults.
 *   3. If the DB is unreachable, fall back to JSON-only (site never breaks).
 *
 * This merge pattern allows:
 *   - New namespaces (e.g. 'neural', 'metadata') to ship via JSON immediately
 *     without requiring a DB migration or admin seed.
 *   - Admin to override any namespace by creating a DB row for it.
 *   - The site to remain fully functional even if Neon is down.
 */
async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  // Always load the JSON base — this is the source of truth for new namespaces
  const base = (await import(`../messages/${locale}.json`)).default;

  try {
    const rows = await db.siteContent.findMany({ where: { locale } });
    if (rows.length === 0) {
      // DB has no content for this locale — use JSON only
      return base;
    }
    // Merge: start with JSON base, then override with DB rows
    const out: Record<string, unknown> = { ...base };
    for (const row of rows) {
      out[row.namespace] = row.value;
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
