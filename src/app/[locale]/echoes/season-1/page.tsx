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
  return {
    title: `${t("project1Name")} · ${t("project1Season")}`,
    description: locale === "ar" ? "جميع حلقات الموسم الأول من أصداء الحكمة" : "All episodes from Season 1 of Echoes of Wisdom",
    openGraph: {
      title: `${t("project1Name")} · ${t("project1Season")}`,
      description: locale === "ar" ? "جميع حلقات الموسم الأول من أصداء الحكمة" : "All episodes from Season 1 of Echoes of Wisdom",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Echoes of Wisdom Season 1" }],
    },
    alternates: {
      canonical: `/${locale}/echoes/season-1`,
      languages: { en: "/en/echoes/season-1", ar: "/ar/echoes/season-1" },
    },
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const episodes = await getEpisodes();
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
                {t("project1Season")} · {episodes.length} {t("project1Episodes")}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1]">
                {t("project1Name")}
              </h1>
              {isAR && (
                <p className="display text-ink-dim text-xl mt-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {t("project1NameArabic")}
                </p>
              )}
              <p className="body-serif text-sm text-ink-dim mt-4 italic">{t("project1Tagline")}</p>
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

            {/* YouTube link */}
            <div className="mt-8">
              <a
                href={t("season1YoutubeUrl")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-700 hover:bg-red-600/20 transition-colors text-sm font-medium"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                {t("listenOnYoutube")}
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
