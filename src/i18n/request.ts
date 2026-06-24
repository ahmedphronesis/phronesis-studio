import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { db } from "@/lib/db";

/**
 * Load messages from the SiteContent table (editable via /admin).
 * Falls back to the static JSON file if the DB is unreachable or empty,
 * so the site never breaks even if the DB is down.
 *
 * Per-request caching: Next.js's React cache() dedupes within a single request,
 * so multiple useTranslations() calls in the same render only hit the DB once.
 */
async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    const rows = await db.siteContent.findMany({ where: { locale } });
    if (rows.length === 0) {
      // DB has no content for this locale — fall back to JSON file
      return (await import(`../messages/${locale}.json`)).default;
    }
    const out: Record<string, unknown> = {};
    for (const row of rows) {
      out[row.namespace] = row.value;
    }
    return out;
  } catch (err) {
    console.error(`[i18n] DB load failed for ${locale}, falling back to JSON:`, err);
    return (await import(`../messages/${locale}.json`)).default;
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
