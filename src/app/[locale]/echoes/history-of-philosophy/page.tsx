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
  const ogImage = "/og-philosophy.png";
  const canonical = `/${locale}/echoes/history-of-philosophy`;
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
      images: [{
        url: `https://phronesis-studio.com${ogImage}`,
        secureUrl: `https://phronesis-studio.com${ogImage}`,
        width: 1200,
        height: 630,
        alt: tEchoes("forthcomingTitle"),
        type: "image/png",
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
        en: "/en/echoes/history-of-philosophy",
        ar: "/ar/echoes/history-of-philosophy",
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
            {/* Back to /echoes — single, predictable destination.
                No query-param trickery; the URL itself tells the whole story. */}
            <a
              href={`/${locale}/echoes`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "أصداء الحكمة" : "Echoes"}
            </a>

            {/* Faded painting — full-width showcase.
                Rendered OUTSIDE the max-w-4xl text column so it can breathe at
                the full container width (up to lg:px-20). The text column
                below stays narrower for readability. */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 mb-10 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)]">
              <img
                src="/school-of-athens-faded.jpg"
                alt="School of Athens by Raphael — fresco, 1509–1511, Apostolic Palace, Vatican City"
                className="w-full h-auto block"
              />
              {/* Subtle cream wash so the Coming Soon badge stays legible
                  without dimming the painting itself. */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5EFE4]/70 via-[#F5EFE4]/10 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.2em] text-gold font-mono">
                    {isAR ? "قريبًا" : "Coming Soon!"}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft/70 font-mono bg-paper/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                  {isAR ? "رفائيل · مدرسة أثينا" : "Raphael · School of Athens"}
                </span>
              </div>
            </div>

            <div className="max-w-4xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {domain}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4">
                {name}
              </h1>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mb-6">
                {desc}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
