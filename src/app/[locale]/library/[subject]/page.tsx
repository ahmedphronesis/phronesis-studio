import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, Download, BookOpen, Sparkles } from "lucide-react";
import { SUBJECTS, MATH_GUIDES, getSubjectBySlug } from "@/lib/library-subjects";

export const runtime = "nodejs";

export async function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.slug }));
}

async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subject: string }>;
}): Promise<Metadata> {
  const { locale, subject } = await params;
  const subj = getSubjectBySlug(subject);
  if (!subj) return {};

  const t = await getTranslations({ locale, namespace: "library" });
  const title = t(subj.key);
  const description = t(`${subj.key}Desc`);

  return {
    title: `${title} · The Library`,
    description,
    openGraph: {
      title: `${title} · The Library`,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    alternates: {
      canonical: `/${locale}/library/${subject}`,
      languages: { en: `/en/library/${subject}`, ar: `/ar/library/${subject}` },
    },
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ locale: string; subject: string }>;
}) {
  const { locale, subject } = await params;
  const subj = getSubjectBySlug(subject);
  if (!subj) notFound();

  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "library" });
  const title = t(subj.key);
  const description = t(`${subj.key}Desc`);

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            {/* Back link */}
            <a
              href={`/${locale}/library`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "كل المواد" : "All Subjects"}
            </a>

            {/* Subject header */}
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

            {/* Content: if Mathematics (live), show guides. Otherwise show forthcoming notice. */}
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
                        <img
                          src={g.cover}
                          alt={`${g.grade} Mathematics cover`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
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

                {/* Grades 5-12 in production note */}
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
              /* Forthcoming subjects */
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
                  <a
                    href={`/${locale}/correspondence`}
                    className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors whitespace-nowrap"
                  >
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
