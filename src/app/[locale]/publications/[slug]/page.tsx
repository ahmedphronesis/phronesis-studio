import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, ExternalLink, BookOpen, Check } from "lucide-react";
import { BOOKS, getBookBySlug } from "@/lib/publications";
import Link from "next/link";

export const runtime = "nodejs";

export async function generateStaticParams() {
  return BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "publications" });
  const title = isAR
    ? `${book.titleAr}: ${book.subtitleAr} · Studio of Phronesis`
    : `${book.title}: ${book.subtitle} · Studio of Phronesis`;
  const description = isAR ? book.descriptionAr[0] : book.description[0];
  const ogImage = `https://phronesis-studio.com${book.coverFront}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "book",
      url: `https://phronesis-studio.com/${locale}/publications/${slug}`,
      siteName: "Studio of Phronesis",
      locale: isAR ? "ar_AR" : "en_US",
      images: [{
        url: ogImage,
        secureUrl: ogImage,
        width: 1000,
        height: 1499,
        alt: isAR
          ? `${book.titleAr} — الغلاف الأمامي`
          : `${book.title} — front cover`,
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
      canonical: `/${locale}/publications/${slug}`,
      languages: { en: `/en/publications/${slug}`, ar: `/ar/publications/${slug}` },
    },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "publications" });
  const book = getBookBySlug(slug);

  if (!book) notFound();

  // Pick locale-appropriate fields
  const title = isAR ? book.titleAr : book.title;
  const subtitle = isAR ? book.subtitleAr : book.subtitle;
  const author = isAR ? book.authorAr : book.author;
  const description = isAR ? book.descriptionAr : book.description;
  const edition = isAR ? book.editionAr : book.edition;
  const language = isAR ? book.languageAr : book.language;
  const formats = isAR ? book.formatsAr : book.formats;
  const publisher = isAR ? book.publisherAr : book.publisher;
  const chapters = isAR ? book.chaptersAr : book.chapters;
  const extras = isAR ? book.extrasAr : book.extras;
  const audience = isAR ? book.audienceAr : book.audience;
  const aboutAuthor = isAR ? book.aboutAuthorAr : book.aboutAuthor;

  // Arabic font for headings
  const headingFont = isAR
    ? { fontFamily: "var(--font-amiri)" as const }
    : { fontFamily: "var(--font-cormorant)" as const };

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Back link */}
            <Link
              href={`/${locale}/publications`}
              className={`inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8 ${isAR ? "flex-row-reverse" : ""}`}
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {t("backToPublications")}
            </Link>

            {/* Hero section — cover + key details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
              {/* Covers */}
              <div className="lg:col-span-4">
                <div className="sticky top-8 space-y-4">
                  <div className="rounded-2xl overflow-hidden border-2 border-gold/40 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)]">
                    <img
                      src={book.coverFront}
                      alt={`${title} — ${isAR ? "الغلاف الأمامي" : "front cover"}`}
                      className="w-full h-auto"
                    />
                  </div>
                  <details className="group">
                    <summary className={`cursor-pointer text-xs text-ink-dim hover:text-teal transition-colors flex items-center gap-2 font-mono uppercase tracking-wider ${isAR ? "flex-row-reverse" : ""}`}>
                      <BookOpen size={12} />
                      {t("viewBackCover")}
                    </summary>
                    <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                      <img
                        src={book.coverBack}
                        alt={`${title} — ${isAR ? "الغلاف الخلفي" : "back cover"}`}
                        className="w-full h-auto"
                      />
                    </div>
                  </details>
                </div>
              </div>

              {/* Details */}
              <div className={`lg:col-span-8 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
                <div className={`flex items-center gap-2 mb-3 ${isAR ? "flex-row-reverse" : ""}`}>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono px-2.5 py-1 rounded-full bg-teal/10 border border-teal/30">
                    {edition}
                  </span>
                  {book.featured && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono">
                      {t("featuredLabel")}
                    </span>
                  )}
                </div>

                <h1 className="display text-ink text-4xl md:text-5xl leading-[1.05] mb-2" style={headingFont}>
                  {title}
                </h1>
                <p className="display-italic text-teal text-xl md:text-2xl mb-4 leading-snug">
                  {subtitle}
                </p>
                <p className="body-serif text-sm text-ink-dim mb-6">
                  {t("by")} {author}
                </p>

                {/* Editions + buy buttons */}
                <div className={`flex flex-col gap-3 mb-8 p-5 rounded-2xl bg-paper-warm border border-teal/20 ${isAR ? "items-end" : "items-start"}`}>
                  <div className={`text-xs text-ink-dim mb-1 ${isAR ? "text-right" : ""}`}>
                    {t("availableGlobally")}
                  </div>
                  {book.editions.map((ed, i) => (
                    <div key={i} className={`flex items-center gap-4 w-full ${isAR ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs uppercase tracking-[0.15em] text-ink-dim font-mono min-w-[80px] flex-shrink-0">
                        {isAR ? ed.formatAr : ed.format}
                      </span>
                      <span className="text-sm text-ink font-medium font-mono flex-shrink-0">
                        {ed.price}
                      </span>
                      <a
                        href={ed.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isAR ? "mr-auto" : "ml-auto"} inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0`}
                      >
                        <ExternalLink size={14} />
                        {isAR ? ed.buyLabelAr : ed.buyLabel}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Spec grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  <Spec label={t("specIsbn")} value={book.isbn} isAR={isAR} />
                  <Spec label={t("specPages")} value={`${book.pages}`} isAR={isAR} />
                  <Spec label={t("specLanguage")} value={language} isAR={isAR} />
                  <Spec label={t("specFormat")} value={book.editions.map((e) => isAR ? e.formatAr : e.format).join(", ")} isAR={isAR} />
                </div>

                {/* Publisher (added for completeness) */}
                <div className={`mb-8 text-xs text-ink-dim body-serif ${isAR ? "text-right" : ""}`}>
                  {isAR ? "الناشر: " : "Publisher: "}{publisher}
                </div>

                {/* Description */}
                <div className="mb-10">
                  <h2 className="display text-ink text-2xl mb-4" style={headingFont}>
                    {t("aboutBook")}
                  </h2>
                  <div className="body-serif text-sm md:text-base text-ink-soft leading-relaxed space-y-4">
                    {description.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Inside — chapters */}
            <div className={`max-w-4xl mb-12 pt-8 border-t border-border ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
              <h2 className="display text-ink text-2xl md:text-3xl mb-6" style={headingFont}>
                {t("whatsInside")}
              </h2>
              <p className="body-serif text-sm text-ink-dim mb-4">
                {t("chaptersCount", { count: chapters.length })}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {chapters.map((chapter, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40 ${isAR ? "flex-row-reverse" : ""}`}>
                    <Check size={14} className="text-teal mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{chapter}</span>
                  </div>
                ))}
              </div>

              {/* Extras */}
              <h3 className="display text-ink text-lg mb-3" style={headingFont}>
                {t("extrasTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {extras.map((extra, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40 ${isAR ? "flex-row-reverse" : ""}`}>
                    <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{extra}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who this is for */}
            <div className={`max-w-4xl mb-12 pt-8 border-t border-border ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
              <h2 className="display text-ink text-2xl md:text-3xl mb-6" style={headingFont}>
                {t("whoFor")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {audience.map((item, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40 ${isAR ? "flex-row-reverse" : ""}`}>
                    <Check size={14} className="text-teal mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About the author */}
            <div className={`max-w-4xl mb-12 pt-8 border-t border-border ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
              <h2 className="display text-ink text-2xl md:text-3xl mb-4" style={headingFont}>
                {t("aboutAuthor")}
              </h2>
              <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
                {aboutAuthor}
              </p>
            </div>

            {/* Final buy CTA */}
            <div className="max-w-4xl pt-8 border-t border-border">
              <div className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br from-teal/5 to-transparent border border-teal/20 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
                <h3 className="display text-ink text-xl md:text-2xl mb-4" style={headingFont}>
                  {t("buyTitle")}
                </h3>
                <div className="flex flex-col gap-3">
                  {book.editions.map((ed, i) => (
                    <div key={i} className={`flex items-center gap-4 ${isAR ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs uppercase tracking-[0.15em] text-ink-dim font-mono min-w-[80px] flex-shrink-0">
                        {isAR ? ed.formatAr : ed.format}
                      </span>
                      <span className="text-sm text-ink font-medium font-mono flex-shrink-0">
                        {ed.price}
                      </span>
                      <a
                        href={ed.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${isAR ? "mr-auto" : "ml-auto"} inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0`}
                      >
                        <ExternalLink size={14} />
                        {isAR ? ed.buyLabelAr : ed.buyLabel}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="body-serif text-xs text-ink-dim mt-4">
                  {t("availableGlobally")}
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className={`max-w-4xl mt-12 pt-6 border-t border-border ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
              <p className="text-xs text-ink-dim body-serif">
                © {book.publishYear} {author}. {t("allRightsReserved")}.
              </p>
            </div>
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
