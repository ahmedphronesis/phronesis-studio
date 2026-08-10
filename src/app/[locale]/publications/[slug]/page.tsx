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

  const t = await getTranslations({ locale, namespace: "publications" });
  const title = `${book.title}: ${book.subtitle} · Studio of Phronesis`;
  const description = book.description[0];
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
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{
        url: ogImage,
        secureUrl: ogImage,
        width: 1000,
        height: 1499,
        alt: `${book.title} — front cover`,
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

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Back link */}
            <Link
              href={`/${locale}/publications`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
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
                      alt={`${book.title} — front cover`}
                      className="w-full h-auto"
                    />
                  </div>
                  <details className="group">
                    <summary className="cursor-pointer text-xs text-ink-dim hover:text-teal transition-colors flex items-center gap-2 font-mono uppercase tracking-wider">
                      <BookOpen size={12} />
                      {t("viewBackCover")}
                    </summary>
                    <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                      <img
                        src={book.coverBack}
                        alt={`${book.title} — back cover`}
                        className="w-full h-auto"
                      />
                    </div>
                  </details>
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono px-2.5 py-1 rounded-full bg-teal/10 border border-teal/30">
                    {book.edition}
                  </span>
                  {book.featured && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono">
                      {t("featuredLabel")}
                    </span>
                  )}
                </div>

                <h1 className="display text-ink text-4xl md:text-5xl leading-[1.05] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {book.title}
                </h1>
                <p className="display-italic text-teal text-xl md:text-2xl mb-4 leading-snug">
                  {book.subtitle}
                </p>
                <p className="body-serif text-sm text-ink-dim mb-6">
                  {t("by")} {book.author}
                </p>

                {/* Buy button */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-5 rounded-2xl bg-paper-warm border border-teal/20">
                  <div>
                    <div className="text-2xl text-ink font-semibold" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {book.price}
                    </div>
                    <div className="text-xs text-ink-dim">{t("availableGlobally")}</div>
                  </div>
                  <a
                    href={book.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-sm font-medium px-6 py-3 rounded-full transition-colors"
                  >
                    <ExternalLink size={16} />
                    {book.buyLabel}
                  </a>
                </div>

                {/* Spec grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  <Spec label={t("specIsbn")} value={book.isbn} />
                  <Spec label={t("specPages")} value={`${book.pages}`} />
                  <Spec label={t("specLanguage")} value={book.language} />
                  <Spec label={t("specFormat")} value={book.formats.join(", ")} />
                </div>

                {/* Description */}
                <div className="mb-10">
                  <h2 className="display text-ink text-2xl mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {t("aboutBook")}
                  </h2>
                  <div className="body-serif text-sm md:text-base text-ink-soft leading-relaxed space-y-4">
                    {book.description.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* What's Inside — chapters */}
            <div className="max-w-4xl mb-12 pt-8 border-t border-border">
              <h2 className="display text-ink text-2xl md:text-3xl mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                {t("whatsInside")}
              </h2>
              <p className="body-serif text-sm text-ink-dim mb-4">
                {t("chaptersCount", { count: book.chapters.length })}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {book.chapters.map((chapter, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40">
                    <Check size={14} className="text-teal mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{chapter}</span>
                  </div>
                ))}
              </div>

              {/* Extras */}
              <h3 className="display text-ink text-lg mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                {t("extrasTitle")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {book.extras.map((extra, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40">
                    <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{extra}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who this is for */}
            <div className="max-w-4xl mb-12 pt-8 border-t border-border">
              <h2 className="display text-ink text-2xl md:text-3xl mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                {t("whoFor")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {book.audience.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-paper-warm/50 border border-border/40">
                    <Check size={14} className="text-teal mt-0.5 flex-shrink-0" />
                    <span className="body-serif text-sm text-ink-soft">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About the author */}
            <div className="max-w-4xl mb-12 pt-8 border-t border-border">
              <h2 className="display text-ink text-2xl md:text-3xl mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                {t("aboutAuthor")}
              </h2>
              <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
                {book.aboutAuthor}
              </p>
            </div>

            {/* Final buy CTA */}
            <div className="max-w-4xl pt-8 border-t border-border">
              <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-teal/5 to-transparent border border-teal/20">
                <h3 className="display text-ink text-xl md:text-2xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {t("buyTitle")}
                </h3>
                <p className="body-serif text-sm text-ink-soft mb-4">
                  {book.price} · {t("availableGlobally")}
                </p>
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-sm font-medium px-6 py-3 rounded-full transition-colors"
                >
                  <ExternalLink size={16} />
                  {book.buyLabel}
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="max-w-4xl mt-12 pt-6 border-t border-border">
              <p className="text-xs text-ink-dim body-serif">
                © {book.publishYear} {book.author}. {t("allRightsReserved")}.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-paper-warm border border-border">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-dim font-mono mb-1">{label}</div>
      <div className="text-sm text-ink font-medium">{value}</div>
    </div>
  );
}
