import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { db } from "@/lib/db";
import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale, number } = await params;
  const epNumber = parseInt(number, 10);
  if (isNaN(epNumber)) return {};

  const episode = await db.episode.findUnique({ where: { number: epNumber } });
  if (!episode) return {};

  const title = locale === "ar" ? episode.arTitle : episode.enTitle;
  const excerpt = locale === "ar" ? episode.arExcerpt : episode.enExcerpt;

  return {
    title: `${title} · Echoes of Wisdom Episode ${epNumber}`,
    description: excerpt,
    alternates: {
      canonical: `/${locale}/echoes/${number}`,
      languages: { en: `/en/echoes/${number}`, ar: `/ar/echoes/${number}` },
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale, number } = await params;
  const epNumber = parseInt(number, 10);
  if (isNaN(epNumber)) notFound();

  const episode = await db.episode.findUnique({ where: { number: epNumber } });
  if (!episode) notFound();

  const isAR = locale === "ar";
  const title = isAR ? episode.arTitle : episode.enTitle;
  const altTitle = isAR ? episode.enTitle : episode.arTitle;
  const excerpt = isAR ? episode.arExcerpt : episode.enExcerpt;
  const fullText = isAR ? episode.arFull : episode.enFull;
  const t = await getTranslations({ locale, namespace: "echoes" });
  const otherLocale = isAR ? "en" : "ar";

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Back link */}
            <a
              href={`/${locale}/echoes`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "كل الحلقات" : "All Episodes"}
            </a>

            {/* Episode header */}
            <div className="mb-8 pb-6 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {t("project1Name")} · {t("episode")} {episode.number} · {t("project1Season")}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-3">
                {title}
              </h1>
              <p
                className={`display text-ink-dim text-xl md:text-2xl ${isAR ? "" : ""}`}
                style={isAR ? { fontFamily: "var(--font-cormorant)" } : { fontFamily: "var(--font-amiri)", direction: "rtl" }}
              >
                {altTitle}
              </p>
              <p className="body-serif text-sm text-ink-dim mt-4 italic">{excerpt}</p>
            </div>

            {/* Full transcript */}
            <div
              className={`body-serif text-base md:text-lg text-ink-soft leading-[1.8] whitespace-pre-line max-w-3xl ${isAR ? "text-right" : ""}`}
              style={isAR ? { fontFamily: "var(--font-amiri)", direction: "rtl", fontSize: "1.25rem", lineHeight: 2 } : {}}
            >
              {fullText}
            </div>

            {/* Language toggle — switch between EN and AR version */}
            <div className="mt-8 flex justify-center">
              <a
                href={`/${otherLocale}/echoes/${episode.number}`}
                className="inline-flex items-center gap-3 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-6 py-3 rounded-full font-medium"
              >
                <Globe size={16} strokeWidth={1.5} />
                {isAR ? "Read in English" : "اقرأ بالعربية"}
              </a>
            </div>

            {/* Navigation between episodes */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
              {episode.number > 1 ? (
                <a
                  href={`/${locale}/echoes/${episode.number - 1}`}
                  className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                >
                  {isAR ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                  {isAR ? `الحلقة ${episode.number - 1}` : `Episode ${episode.number - 1}`}
                </a>
              ) : (
                <span />
              )}
              <a
                href={`/${locale}/echoes/season-1`}
                className="text-sm text-ink-dim hover:text-teal transition-colors"
              >
                {t("project1Season")}
              </a>
              <a
                href={`/${locale}/echoes/${episode.number + 1}`}
                className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
              >
                {isAR ? `الحلقة ${episode.number + 1}` : `Episode ${episode.number + 1}`}
                {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
