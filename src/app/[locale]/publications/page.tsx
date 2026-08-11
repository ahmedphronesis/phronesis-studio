import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { BOOKS, getFeaturedBook } from "@/lib/publications";
import Link from "next/link";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "publications" });
  const title = `${t("title")} · Studio of Phronesis`;
  const description = t("metaDescription");
  const featured = getFeaturedBook();
  const ogImage = featured
    ? `https://phronesis-studio.com${featured.coverFront}`
    : "https://phronesis-studio.com/og-image.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://phronesis-studio.com/${locale}/publications`,
      siteName: "Studio of Phronesis",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{
        url: ogImage,
        secureUrl: ogImage,
        width: 1000,
        height: 1499,
        alt: featured ? (locale === "ar" ? featured.titleAr : featured.title) : "Studio of Phronesis Publications",
        type: "image/jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${locale}/publications`,
      languages: { en: "/en/publications", ar: "/ar/publications" },
    },
  };
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "publications" });

  const featured = getFeaturedBook();
  const otherBooks = BOOKS.filter((b) => b.slug !== featured?.slug);

  // Pick locale-appropriate fields
  const fTitle = isAR ? featured!.titleAr : featured!.title;
  const fSubtitle = isAR ? featured!.subtitleAr : featured!.subtitle;
  const fAuthor = isAR ? featured!.authorAr : featured!.author;
  const fDescription = isAR ? featured!.descriptionAr : featured!.description;
  const fEdition = isAR ? featured!.editionAr : featured!.edition;
  const fLanguage = isAR ? featured!.languageAr : featured!.language;
  const fFormats = isAR ? featured!.formatsAr : featured!.formats;

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Header */}
            <div className={`max-w-4xl mb-12 ${isAR ? "text-right" : ""}`}>
              <div className={`flex items-center gap-4 mb-6 ${isAR ? "flex-row-reverse" : ""}`}>
                <span className="h-px w-12 bg-teal/60" />
                <span className="eyebrow">{t("eyebrow")}</span>
              </div>
              <h1 className="display text-ink text-4xl md:text-6xl leading-[1.05] mb-4" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
                {t("title")}
              </h1>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed max-w-2xl" dir={isAR ? "rtl" : "ltr"}>
                {t("intro")}
              </p>
            </div>

            {/* Featured book */}
            {featured && (
              <div className="max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Cover image */}
                  <div className="lg:col-span-4">
                    <Link
                      href={`/${locale}/publications/${featured.slug}`}
                      className="group block relative rounded-2xl overflow-hidden border-2 border-gold/40 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)]"
                    >
                      <img
                        src={featured.coverFront}
                        alt={`${fTitle} — ${isAR ? "الغلاف الأمامي" : "front cover"}`}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                  </div>

                  {/* Book details */}
                  <div className={`lg:col-span-8 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
                    <div className={`flex items-center gap-2 mb-3 ${isAR ? "flex-row-reverse" : ""}`}>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono px-2.5 py-1 rounded-full bg-teal/10 border border-teal/30">
                        {t("featuredLabel")}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                        {fEdition}
                      </span>
                    </div>

                    <h2 className="display text-ink text-3xl md:text-4xl leading-[1.1] mb-2" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
                      {fTitle}
                    </h2>
                    <p className="display-italic text-teal text-lg md:text-xl mb-4 leading-snug">
                      {fSubtitle}
                    </p>
                    <p className="body-serif text-sm text-ink-dim mb-6">
                      {t("by")} {fAuthor}
                    </p>

                    {/* Description (first 2 paragraphs) */}
                    <div className="body-serif text-sm md:text-base text-ink-soft leading-relaxed mb-6 space-y-4">
                      {fDescription.slice(0, 2).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Quick specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <Spec label={t("specPages")} value={`${featured.pages}`} isAR={isAR} />
                      <Spec label={t("specLanguage")} value={fLanguage} isAR={isAR} />
                      <Spec label={t("specFormat")} value={featured.editions.map((e) => isAR ? e.formatAr : e.format).join(", ")} isAR={isAR} />
                      <Spec label={t("specIsbn")} value={featured.isbn} isAR={isAR} />
                    </div>

                    {/* Editions + buy buttons — clean boxed layout matching the detail page */}
                    <div className={`mb-4 p-4 rounded-xl bg-paper-warm border border-teal/20 ${isAR ? "text-right" : ""}`}>
                      <div className={`flex flex-col gap-2.5`}>
                        {featured.editions.map((ed, i) => (
                          <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full ${isAR ? "sm:flex-row-reverse" : ""}`}>
                            <div className={`flex items-center gap-3 sm:gap-3 ${isAR ? "flex-row-reverse" : ""}`}>
                              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-dim font-mono min-w-[70px] flex-shrink-0">
                                {isAR ? ed.formatAr : ed.format}
                              </span>
                              <span className="text-sm text-ink font-medium font-mono flex-shrink-0">
                                {ed.price}
                              </span>
                            </div>
                            <a
                              href={ed.buyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${isAR ? "sm:mr-auto" : "sm:ml-auto"} inline-flex items-center justify-center gap-1.5 bg-teal hover:bg-teal-bright text-paper text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap w-full sm:w-auto sm:flex-shrink-0`}
                            >
                              <ExternalLink size={12} />
                              {isAR ? ed.buyLabelAr : ed.buyLabel}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* View details link */}
                    <div className={isAR ? "text-right" : ""}>
                      <Link
                        href={`/${locale}/publications/${featured.slug}`}
                        className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                      >
                        {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        <span className="link-underline">{t("viewDetails")}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other books (future publications) */}
            {otherBooks.length > 0 && (
              <div className="max-w-6xl mt-16 pt-12 border-t border-border">
                <h3 className={`display text-ink text-2xl md:text-3xl mb-6 ${isAR ? "text-right" : ""}`} style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
                  {t("moreTitle")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {otherBooks.map((book) => {
                    const bTitle = isAR ? book.titleAr : book.title;
                    const bSubtitle = isAR ? book.subtitleAr : book.subtitle;
                    return (
                      <Link
                        key={book.slug}
                        href={`/${locale}/publications/${book.slug}`}
                        className="group block p-6 rounded-2xl bg-paper border border-border hover:border-teal/40 transition-colors"
                        dir={isAR ? "rtl" : "ltr"}
                      >
                        {book.forthcoming && (
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono mb-2 block">
                            {t("forthcomingLabel")}
                          </span>
                        )}
                        <h4 className="display text-ink text-xl mb-1 group-hover:text-teal transition-colors" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
                          {bTitle}
                        </h4>
                        <p className="body-serif text-sm text-ink-soft">{bSubtitle}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty future note */}
            {otherBooks.length === 0 && (
              <div className="max-w-6xl mt-16 pt-12 border-t border-border">
                <div className={`flex items-start gap-3 text-sm text-ink-dim body-serif italic ${isAR ? "flex-row-reverse text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
                  <BookOpen size={16} className="text-gold/60 mt-0.5 flex-shrink-0" />
                  <p>{t("forthcomingNote")}</p>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}

function Spec({ label, value, isAR }: { label: string; value: string; isAR: boolean }) {
  return (
    <div className={`p-3 rounded-lg bg-paper-warm border border-border ${isAR ? "text-right" : ""}`}>
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-dim font-mono mb-1">{label}</div>
      <div className="text-sm text-ink font-medium">{value}</div>
    </div>
  );
}
