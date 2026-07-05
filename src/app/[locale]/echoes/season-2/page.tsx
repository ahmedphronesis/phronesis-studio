import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { getEpisodes } from "@/lib/episodes";
import { ArrowRight, ArrowLeft, Headphones } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "echoes" });
  const title = `${t("project2Name")} · ${t("project2Season")}`;
  const description = locale === "ar"
    ? "جميع حلقات الموسم الثاني من أصداء الحكمة — رحلة في الوجود"
    : "All episodes from Season 2 of Echoes of Wisdom — A Journey into Existence";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/og-philosophy.png", width: 1200, height: 630, alt: "Echoes of Wisdom Season 2" }],
    },
    alternates: {
      canonical: `/${locale}/echoes/season-2`,
      languages: { en: "/en/echoes/season-2", ar: "/ar/echoes/season-2" },
    },
  };
}

export default async function Season2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const allEpisodes = await getEpisodes();
  // Season 2 = episodes 9-16
  const episodes = allEpisodes.filter((e) => e.number >= 9 && e.number <= 16);
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "echoes" });

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <a
              href={`/${locale}/echoes`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "كل المواسم" : "All Seasons"}
            </a>

            <div className="mb-8 pb-6 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {t("project2Season")} · {episodes.length} {t("project2Episodes")}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1]">
                {t("project2Name")}
              </h1>
              {isAR && (
                <p className="display text-ink-dim text-xl mt-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {t("project2NameArabic")}
                </p>
              )}
              <p className="body-serif text-sm text-ink-dim mt-4 italic">{t("project2Tagline")}</p>
              <p className="body-serif text-sm text-ink-dim mt-2" style={isAR ? { fontFamily: "var(--font-amiri)", direction: "rtl" } : {}}>
                {t("project2TaglineArabic")}
              </p>
            </div>

            {/* Episode list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {episodes.map((ep) => (
                <a
                  key={ep.number}
                  href={`/${locale}/echoes/${ep.number}`}
                  className="group block p-5 rounded-2xl bg-paper-warm border border-border hover:border-teal/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                      <Headphones size={18} strokeWidth={1.5} />
                    </div>
                    <span className="display text-teal text-2xl">{String(ep.number).padStart(2, "0")}</span>
                  </div>
                  <h3 className="display text-ink text-lg md:text-xl leading-tight group-hover:text-teal transition-colors">
                    {isAR ? ep.ar_title : ep.en_title}
                  </h3>
                  <p className="body-serif text-xs text-ink-dim mt-1 line-clamp-2">
                    {isAR ? ep.ar_excerpt : ep.en_excerpt}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
