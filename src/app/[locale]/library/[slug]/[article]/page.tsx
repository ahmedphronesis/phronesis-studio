import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getSubjectBySlug } from "@/lib/library-subjects";
import { ARTICLES, getArticleBySlug, getArticlesBySubject } from "@/lib/library-articles";

export const runtime = "nodejs";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.subjectSlug, article: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; article: string }>;
}): Promise<Metadata> {
  const { locale, slug, article } = await params;
  const subj = getSubjectBySlug(slug);
  const art = getArticleBySlug(article);
  if (!subj || !art || art.subjectSlug !== slug) return {};

  const t = await getTranslations({ locale, namespace: "library" });
  const subjectTitle = t(subj.key);
  const articleTitle = locale === "ar" ? art.titleAr : art.titleEn;
  const description = locale === "ar"
    ? `مقال بقلم ${art.authorAr} في ${subjectTitle}`
    : `Article by ${art.authorEn} in ${subjectTitle}`;
  const ogImage = subj.image ? `https://phronesis-studio.com${subj.image}` : "https://phronesis-studio.com/og-image.png";

  return {
    title: `${articleTitle} · ${subjectTitle}`,
    description,
    openGraph: {
      title: `${articleTitle} · ${subjectTitle}`,
      description,
      type: "article",
      url: `https://phronesis-studio.com/${locale}/library/${slug}/${article}`,
      siteName: "Studio of Phronesis",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{
        url: ogImage,
        secureUrl: ogImage,
        width: 1200,
        height: 630,
        alt: subj.imageAlt || articleTitle,
        type: "image/jpeg",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${articleTitle} · ${subjectTitle}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${locale}/library/${slug}/${article}`,
      languages: {
        en: `/en/library/${slug}/${article}`,
        ar: `/ar/library/${slug}/${article}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; article: string }>;
}) {
  const { locale, slug, article } = await params;
  const isAR = locale === "ar";
  const subj = getSubjectBySlug(slug);
  const art = getArticleBySlug(article);

  if (!subj || !art || art.subjectSlug !== slug) notFound();

  const t = await getTranslations({ locale, namespace: "library" });
  const subjectTitle = t(subj.key);
  const title = isAR ? art.titleAr : art.titleEn;
  const author = isAR ? art.authorAr : art.authorEn;
  const date = isAR ? art.dateAr : art.dateEn;
  const readingTime = isAR ? art.readingTimeAr : art.readingTimeEn;
  const body = isAR ? art.bodyAr : art.bodyEn;

  // Find next/prev articles in the same subject
  const subjectArticles = getArticlesBySubject(slug);
  const currentIndex = subjectArticles.findIndex((a) => a.slug === article);
  const prevArticle = currentIndex > 0 ? subjectArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < subjectArticles.length - 1 ? subjectArticles[currentIndex + 1] : null;

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <a
              href={`/${locale}/library/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {subjectTitle}
            </a>

            <div className="mb-8 pb-6 border-b border-border max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-3">
                {subjectTitle} · {isAR ? "مقال" : "Article"}
              </p>
              <h1
                className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4"
                style={isAR ? { fontFamily: "var(--font-amiri)", direction: "rtl" } : { fontFamily: "var(--font-cormorant)" }}
              >
                {title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-ink-dim flex-wrap">
                <span className="body-serif">{author}</span>
                <span className="text-teal/40">·</span>
                <span className="font-mono">{date}</span>
                <span className="text-teal/40">·</span>
                <span className="font-mono">{readingTime}</span>
              </div>
            </div>

            <div
              className={`body-serif text-base md:text-lg text-ink-soft leading-[1.8] whitespace-pre-line max-w-3xl ${isAR ? "text-right" : ""}`}
              style={isAR ? { fontFamily: "var(--font-amiri)", direction: "rtl", fontSize: "1.15rem", lineHeight: 2 } : {}}
            >
              {body}
            </div>

            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center max-w-3xl">
              {prevArticle ? (
                <a
                  href={`/${locale}/library/${slug}/${prevArticle.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                >
                  {isAR ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                  <span className="link-underline truncate max-w-xs">
                    {isAR ? prevArticle.titleAr : prevArticle.titleEn}
                  </span>
                </a>
              ) : (
                <span />
              )}
              <a
                href={`/${locale}/library/${slug}`}
                className="text-sm text-ink-dim hover:text-teal transition-colors"
              >
                {subjectTitle}
              </a>
              {nextArticle ? (
                <a
                  href={`/${locale}/library/${slug}/${nextArticle.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                >
                  <span className="link-underline truncate max-w-xs">
                    {isAR ? nextArticle.titleAr : nextArticle.titleEn}
                  </span>
                  {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </a>
              ) : (
                <span />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
