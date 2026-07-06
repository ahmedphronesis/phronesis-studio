import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, Download, FileText, BookOpen, Sparkles } from "lucide-react";
import { SUBJECTS, MATH_GUIDES, getSubjectBySlug } from "@/lib/library-subjects";

export const runtime = "nodejs";

// Individual guide slugs (for /library/grade-1-mathematics etc.)
const GUIDE_SLUGS = MATH_GUIDES.map((g) => ({
  slug: g.grade.toLowerCase().replace(/\s+/g, "-") + "-mathematics",
  guide: g,
}));

export async function generateStaticParams() {
  // Subject slugs (e.g. /library/mathematics, /library/history)
  const subjectParams = SUBJECTS.map((s) => ({ slug: s.slug }));
  // Guide slugs (e.g. /library/grade-1-mathematics)
  // Note: these use the actual PDF filenames which already exist in the filesystem
  const guideParams = [
    { slug: "grade-1-mathematics" },
    { slug: "grade-2-mathematics" },
    { slug: "grade-3-mathematics" },
    { slug: "grade-4-mathematics" },
  ];
  return [...subjectParams, ...guideParams];
}

// NOTE: `export` is REQUIRED — Next.js only invokes a named export called
// `generateMetadata`. Without `export`, this function is silently ignored
// and the page falls back to the layout's default metadata (wrong title,
// wrong OG image, wrong description).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "library" });

  // Check if this is a subject page
  const subj = getSubjectBySlug(slug);
  if (subj) {
    const title = t(subj.key);
    const description = t(`${subj.key}Desc`);
    // Use the subject's painting as the OG image when available, so
    // sharing a Library subject page on WhatsApp/Twitter/LinkedIn
    // displays the actual painting (Émile Friant, Millet, da Vinci, etc.)
    // instead of the generic site banner.
    const ogImage = subj.image || "/og-image.png";
    const ogImageAlt = subj.imageAlt || title;
    return {
      title: `${title} · The Library`,
      description,
      openGraph: {
        title: `${title} · The Library`,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} · The Library`,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: `/${locale}/library/${slug}`,
        languages: { en: `/en/library/${slug}`, ar: `/ar/library/${slug}` },
      },
    };
  }

  // Check if this is a guide page
  const guide = MATH_GUIDES.find((g) => g.pdf === `/guides/${slug}.pdf`);
  if (guide) {
    return {
      title: `${guide.grade} Mathematics · Bilingual Guide`,
      description: `Bilingual (English & Arabic) mathematics learning guide for ${guide.grade}. ${guide.pages} pages, ${guide.units} units, ${guide.modules} modules. Free PDF download.`,
      openGraph: {
        title: `${guide.grade} Mathematics · Bilingual Guide`,
        description: `Bilingual (English & Arabic) mathematics learning guide for ${guide.grade}. ${guide.pages} pages, ${guide.units} units, ${guide.modules} modules. Free PDF download.`,
        images: [{ url: guide.cover, width: 1200, height: 630, alt: `${guide.grade} Mathematics Guide` }],
      },
      alternates: {
        canonical: `/${locale}/library/${slug}`,
        languages: { en: `/en/library/${slug}`, ar: `/ar/library/${slug}` },
      },
    };
  }

  return {};
}

export default async function LibrarySlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "library" });

  // Check if this is a subject page
  const subj = getSubjectBySlug(slug);
  if (subj) {
    const title = t(subj.key);
    const description = t(`${subj.key}Desc`);

    return (
      <MouseProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Nav />
          <main className="flex-1">
            <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
              <a
                href={`/${locale}/library`}
                className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
              >
                {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
                {isAR ? "كل المواد" : "All Subjects"}
              </a>

              {/* Hero section — painting as BACKGROUND with content overlaid on top.
                  Same treatment as History of Philosophy: the painting fills the
                  container, a cream gradient ensures text legibility, and the
                  subject title, description, and status badge sit ON TOP of the
                  painting. Attribution chip at the bottom.

                  Mobile fix: use object-cover with a min-height instead of h-auto.
                  Previously, wide paintings produced very short containers on mobile
                  (e.g., 375px wide × 225px tall for a 16:9 image), and the overlaid
                  text (badge + title + description + attribution) needed more vertical
                  space than was available, causing text to cover the entire painting.
                  Now the container has a guaranteed min-height and the image fills it
                  with object-cover, so the painting is always partially visible above
                  the text on all screen sizes. */}
              {subj.image ? (
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 mb-10 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)] min-h-[400px] md:min-h-[450px] lg:min-h-[520px]">
                  {/* Background painting — object-cover fills the min-height container */}
                  <img
                    src={subj.image}
                    alt={subj.imageAlt || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Cream gradient overlay — darker at bottom for text legibility,
                      lighter at top so the painting's details remain visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F5EFE4]/95 via-[#F5EFE4]/55 to-[#F5EFE4]/15" />

                  {/* Content overlaid on top of the painting */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:p-12">
                    <div className="max-w-3xl">
                      {/* Status badge */}
                      <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <span className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 rounded-full ${subj.live ? "bg-teal/90 text-paper border border-teal" : "bg-paper/80 text-ink-dim border border-border backdrop-blur-sm"}`}>
                          {subj.live ? t("liveLabel") : t("forthcomingLabel")}
                        </span>
                      </div>
                      {/* Subject title */}
                      <h1 className="display text-ink text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-2 md:mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {title}
                      </h1>
                      {/* Subject description */}
                      <p className="body-serif text-xs md:text-sm lg:text-base text-ink-soft leading-relaxed max-w-2xl mb-3 md:mb-4">
                        {description}
                      </p>
                      {/* Attribution */}
                      {subj.imageAlt && (
                        <span className={`inline-block text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-ink-soft/70 font-mono bg-paper/70 backdrop-blur-sm rounded-full px-3 py-1.5`}>
                          {subj.imageAlt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* For subjects without an image, render the header without a painting */
                <div className="mb-10 pb-8 border-b border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${subj.live ? "bg-teal/10 border border-teal/30 text-teal" : "bg-ink-dim/5 border border-border text-ink-dim/40"}`}>
                      <BookOpen size={22} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 rounded-full ${subj.live ? "bg-teal/10 text-teal border border-teal/30" : "bg-ink-dim/5 text-ink-dim border border-border"}`}>
                      {subj.live ? t("liveLabel") : t("forthcomingLabel")}
                    </span>
                  </div>
                  <h1 className="display text-ink text-4xl md:text-6xl leading-[1.1] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {title}
                  </h1>
                  <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed max-w-3xl">
                    {description}
                  </p>
                </div>
              )}

              {subj.slug === "mathematics" && subj.live ? (
                <div>
                  <h2 className="display text-ink text-2xl md:text-3xl mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {isAR ? "الدلائل المتاحة" : "Available Guides"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {MATH_GUIDES.map((g) => (
                      <a
                        key={g.grade}
                        href={g.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="group block h-full rounded-2xl bg-paper border border-border hover:border-teal/50 transition-colors overflow-hidden"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden bg-paper-warm">
                          <img src={g.cover} alt={`${g.grade} Mathematics cover`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-teal/90 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <Download size={16} strokeWidth={2} />
                          </div>
                          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-sm border border-teal/30">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">{g.highlight}</span>
                          </div>
                        </div>
                        <div className="p-5 md:p-6">
                          <div className="flex items-baseline justify-between mb-2">
                            <h3 className="display text-ink text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>{g.grade}</h3>
                            <span className="text-sm text-ink-dim" style={{ fontFamily: "var(--font-amiri)" }} dir="rtl" lang="ar">{g.gradeArabic}</span>
                          </div>
                          <p className="text-xs uppercase tracking-[0.2em] text-teal mb-3 font-mono">Mathematics</p>
                          <p className="body-serif text-[11px] text-ink-dim leading-relaxed mb-4">{t("subtitle")}</p>
                          <div className="flex items-center gap-3 text-[10px] text-ink-dim pt-3 border-t border-border">
                            <span>{g.pages} {t("pages")}</span>
                            <span className="text-teal/40">·</span>
                            <span>{g.units} {t("units")}</span>
                            <span className="text-teal/40">·</span>
                            <span>{g.modules} {t("modules")}</span>
                          </div>
                          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                            <span className="inline-flex items-center gap-2 text-xs text-teal group-hover:text-teal-bright transition-colors">
                              <Download size={12} />
                              <span className="link-underline">{t("downloadPdf")}</span>
                            </span>
                            <span className="text-[10px] text-ink-dim uppercase tracking-[0.18em] font-mono">{t("free")}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-10 p-6 md:p-8 rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/5 to-transparent">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                        <Sparkles size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="display text-ink text-xl md:text-2xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{t("comingSoon")}</h3>
                        <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("comingSoonBody")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <div className="p-8 md:p-10 rounded-2xl border border-border bg-paper-warm/50">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-ink-dim/5 border border-border flex items-center justify-center text-ink-dim/50 flex-shrink-0">
                        <Sparkles size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="display text-ink text-2xl md:text-3xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {t("forthcomingLabel")}
                        </h2>
                        <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("comingSoonBody")}</p>
                      </div>
                    </div>
                    <a href={`/${locale}/correspondence`} className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors whitespace-nowrap">
                      <BookOpen size={14} />
                      <span className="link-underline">{t("requestAccess")}</span>
                    </a>
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

  // Check if this is a guide page
  const guide = MATH_GUIDES.find((g) => g.pdf === `/guides/${slug}.pdf`);
  if (guide) {
    return (
      <MouseProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Nav />
          <main className="flex-1">
            <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12 max-w-4xl">
              <a
                href={`/${locale}/library/mathematics`}
                className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
              >
                {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
                {isAR ? "الرياضيات" : "Mathematics"}
              </a>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-paper-warm">
                    <img src={guide.cover} alt={`${guide.grade} Mathematics cover`} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">Mathematics</p>
                  <h1 className="display text-ink text-4xl md:text-5xl leading-[1.1] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {guide.grade}
                  </h1>
                  <p className="display text-ink-dim text-xl mb-6" style={{ fontFamily: "var(--font-amiri)" }} dir="rtl" lang="ar">
                    {guide.gradeArabic}
                  </p>
                  <p className="body-serif text-base text-ink-soft leading-relaxed mb-6">{t("subtitle")}</p>

                  <div className="flex items-center gap-4 text-sm text-ink-dim mb-6 pb-6 border-b border-border">
                    <span>{guide.pages} {t("pages")}</span>
                    <span className="text-teal/40">·</span>
                    <span>{guide.units} {t("units")}</span>
                    <span className="text-teal/40">·</span>
                    <span>{guide.modules} {t("modules")}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <a
                      href={guide.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-sm font-medium px-6 py-3 rounded-full transition-colors"
                    >
                      <Download size={16} />
                      {t("downloadPdf")}
                    </a>
                    <span className="text-[10px] text-ink-dim uppercase tracking-[0.18em] font-mono">{t("free")}</span>
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

  notFound();
}
