import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { FadeUp } from "@/components/anim";
import { Download, ArrowRight, ArrowLeft, ExternalLink, Quote } from "lucide-react";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vouches" });
  return {
    title: `${t("title")} ${t("titleItalic")} · Studio of Phronesis`,
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/vouches`,
      languages: { en: "/en/vouches", ar: "/ar/vouches" },
    },
  };
}

export default async function VouchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vouches" });
  const isAR = locale === "ar";
  const letters = t.raw("letters") as {
    title: string; subtitle: string; author: string; authorTitle: string;
    date: string; excerpt: string; file: string;
  }[];

  // Generate slugs from letter titles
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px w-12 bg-teal/60" />
                <span className="eyebrow">{t("eyebrow")}</span>
              </div>
              <h1 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
                {t("title")}{" "}<span className="display-italic text-teal">{t("titleItalic")}</span>
              </h1>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mt-6 max-w-2xl">
                {t("intro")}
              </p>
            </div>

            <h3 className="display text-ink text-2xl md:text-3xl mb-6">
              {t("formalLettersTitle")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {letters.map((letter, i) => {
                const slug = slugify(letter.title);
                return (
                  <FadeUp key={i} delay={i * 0.1}>
                    <Link
                      href={`/${locale}/vouches/${slug}`}
                      className="group block h-full p-7 rounded-2xl bg-paper border border-border hover:border-teal/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
                          <Download size={20} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                          {letter.subtitle}
                        </span>
                      </div>
                      <h4 className="display text-ink text-2xl md:text-3xl mb-3 leading-tight group-hover:text-teal transition-colors">
                        {letter.title}
                      </h4>
                      <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5 italic">
                        &ldquo;{letter.excerpt.split("\n")[0].substring(0, 120)}...&rdquo;
                      </p>
                      <div className="pt-5 border-t border-border">
                        <p className="text-sm text-ink font-medium body-serif">{letter.author}</p>
                        <p className="text-xs text-ink-dim body-serif mt-1">{letter.authorTitle}</p>
                        <p className="text-xs text-ink-dim body-serif mt-1">{letter.date}</p>
                      </div>
                    </Link>
                  </FadeUp>
                );
              })}
            </div>

            {/* LinkedIn recommendation */}
            <div className="mt-8">
              <h3 className="display text-ink text-2xl md:text-3xl mb-6">
                {t("linkedin.author")} — {t("linkedin.title")}
              </h3>
              <FadeUp>
                <div className="relative max-w-3xl p-6 md:p-8 rounded-2xl bg-paper border border-teal/20 overflow-hidden">
                  <Quote className="absolute top-3 right-3 text-teal/10" size={48} strokeWidth={1} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                        <Quote size={15} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">LinkedIn Recommendation</p>
                        <p className="text-xs text-ink-dim body-serif">{t("linkedin.date")}</p>
                      </div>
                    </div>
                    <blockquote className="body-serif text-sm md:text-base text-ink-soft leading-snug mb-4 whitespace-pre-line">
                      {t("linkedin.quote")}
                    </blockquote>
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="display text-ink text-lg md:text-xl">{t("linkedin.author")}</p>
                        <p className="text-xs text-ink-dim body-serif">{t("linkedin.title")}</p>
                        <p className="text-xs text-teal body-serif">{t("linkedin.company")}</p>
                      </div>
                      <a
                        href={t("linkedin.linkedinUrl")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-paper bg-teal hover:bg-teal-bright transition-colors px-4 py-2 rounded-full font-medium whitespace-nowrap"
                      >
                        <ExternalLink size={12} />
                        {t("viewOnLinkedIn")}
                      </a>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
