import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const runtime = "nodejs";

// `export` is REQUIRED — Next.js only invokes a named export named
// `generateMetadata`. Without `export`, this function is silently ignored
// and the page falls back to the locale-layout default metadata (wrong OG
// image, wrong title). This was the root cause of the OG image bug.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tEchoes = await getTranslations({ locale, namespace: "echoes" });
  const title = `${tEchoes("forthcomingTitle")} · Studio of Phronesis`;
  const description = tEchoes("forthcomingBody");
  const ogImage = "/school-of-athens-faded.jpg";
  const canonical = `/${locale}/philosophy/history-of-philosophy`;
  const url = `https://phronesis-studio.com${canonical}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "Studio of Phronesis",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{
        url: `https://phronesis-studio.com${ogImage}`,
        secureUrl: `https://phronesis-studio.com${ogImage}`,
        width: 1200,
        height: 630,
        alt: tEchoes("forthcomingTitle"),
        type: "image/jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://phronesis-studio.com${ogImage}`],
    },
    alternates: {
      canonical,
      languages: {
        en: "/en/philosophy/history-of-philosophy",
        ar: "/ar/philosophy/history-of-philosophy",
      },
    },
  };
}

export default async function HistoryOfPhilosophyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAR = locale === "ar";
  const tEchoes = await getTranslations({ locale, namespace: "echoes" });

  const name = tEchoes("forthcomingTitle");
  const desc = tEchoes("forthcomingBody");
  const domain = isAR ? "الفلسفة · الثقافة" : "Philosophy · Cultural";

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Back to /philosophy — single, predictable destination.
                No query-param trickery; the URL itself tells the whole story. */}
            <a
              href={`/${locale}/philosophy`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "أصداء الحكمة" : "Echoes"}
            </a>

            {/* Faded painting — background with content overlaid on top.
                Mobile fix: use object-cover with min-height (same treatment as
                Library subject pages). Previously used w-full h-auto which
                produced a too-short container on mobile, causing the text to
                cover the entire painting. Now the container has a guaranteed
                min-height and the image fills it with object-cover. */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 mb-10 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)] min-h-[400px] md:min-h-[450px] lg:min-h-[520px]">
              <img
                src="/school-of-athens-faded.jpg"
                alt="School of Athens by Raphael — fresco, 1509–1511, Apostolic Palace, Vatican City"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Cream gradient overlay — darker at bottom for text legibility,
                  lighter at top so the painting's details remain visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5EFE4]/95 via-[#F5EFE4]/55 to-[#F5EFE4]/15" />

              {/* Content overlaid on top of the painting */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:p-12">
                <div className="max-w-4xl">
                  {/* Domain label */}
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-3 md:mb-4">
                    {domain}
                  </p>
                  {/* Title */}
                  <h1 className="display text-ink text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-2 md:mb-4">
                    {name}
                  </h1>
                  {/* Description */}
                  <p className="body-serif text-xs md:text-sm lg:text-base text-ink-soft leading-relaxed max-w-2xl mb-3 md:mb-6">
                    {desc}
                  </p>
                  {/* Coming Soon badge + attribution */}
                  <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-gold font-mono">
                        {isAR ? "قريبًا" : "Coming Soon!"}
                      </span>
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-ink-soft/70 font-mono bg-paper/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                      {isAR ? "رفائيل · مدرسة أثينا" : "Raphael · School of Athens"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
