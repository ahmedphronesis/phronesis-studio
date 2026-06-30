import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, Download, FileText } from "lucide-react";

export const runtime = "nodejs";

// Guide data (mirrors the Library component)
const GUIDES = [
  { slug: "grade-1-mathematics", grade: "Grade 1", gradeArabic: "الصف الأول", cover: "/guides/grade-1-mathematics-cover.png", pdf: "/guides/grade-1-mathematics.pdf", pages: 21, units: 6, modules: 18, highlight: "Foundations" },
  { slug: "grade-2-mathematics", grade: "Grade 2", gradeArabic: "الصف الثاني", cover: "/guides/grade-2-mathematics-cover.png", pdf: "/guides/grade-2-mathematics.pdf", pages: 21, units: 7, modules: 22, highlight: "Real-Life Connections" },
  { slug: "grade-3-mathematics", grade: "Grade 3", gradeArabic: "الصف الثالث", cover: "/guides/grade-3-mathematics-cover.png", pdf: "/guides/grade-3-mathematics.pdf", pages: 27, units: 6, modules: 20, highlight: "Real-Life Applications" },
  { slug: "grade-4-mathematics", grade: "Grade 4", gradeArabic: "الصف الرابع", cover: "/guides/grade-4-mathematics-cover.png", pdf: "/guides/grade-4-mathematics.pdf", pages: 31, units: 7, modules: 21, highlight: "Real-Life Applications" },
];

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.grade} Mathematics · Bilingual Guide`,
    description: `Bilingual (English & Arabic) mathematics learning guide for ${guide.grade}. ${guide.pages} pages, ${guide.units} units, ${guide.modules} modules. Free PDF download.`,
    alternates: {
      canonical: `/en/library/${slug}`,
      languages: { en: `/en/library/${slug}`, ar: `/ar/library/${slug}` },
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "library" });
  const gradeLabel = isAR ? guide.gradeArabic : guide.grade;

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
              {isAR ? "المكتبة" : "The Library"}
            </a>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cover image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-md">
                  <img
                    src={guide.cover}
                    alt={`${gradeLabel} Mathematics cover`}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="lg:col-span-7">
                <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                  {isAR ? "دليل تعليمي ثنائي اللغة" : "Bilingual Learning Guide"}
                </p>
                <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4">
                  {gradeLabel} {isAR ? "الرياضيات" : "Mathematics"}
                </h1>
                <p className="body-serif text-sm text-ink-dim mb-6 italic">
                  {guide.highlight}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-paper-warm border border-border text-center">
                    <p className="display text-teal text-2xl md:text-3xl">{guide.pages}</p>
                    <p className="text-[10px] uppercase tracking-wider text-ink-dim font-mono mt-1">{t("pages")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-paper-warm border border-border text-center">
                    <p className="display text-teal text-2xl md:text-3xl">{guide.units}</p>
                    <p className="text-[10px] uppercase tracking-wider text-ink-dim font-mono mt-1">{t("units")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-paper-warm border border-border text-center">
                    <p className="display text-teal text-2xl md:text-3xl">{guide.modules}</p>
                    <p className="text-[10px] uppercase tracking-wider text-ink-dim font-mono mt-1">{t("modules")}</p>
                  </div>
                </div>

                {/* Download button */}
                <a
                  href={guide.pdf}
                  download
                  className="inline-flex items-center gap-3 bg-teal hover:bg-teal-bright text-paper font-medium px-7 py-4 rounded-full transition-all duration-300 glow-teal"
                >
                  <Download size={18} />
                  {t("downloadPdf")} · {t("free")}
                </a>

                <p className="body-serif text-xs text-ink-dim mt-4">
                  {isAR
                    ? "دليل ثنائي اللغة (العربية والإنجليزية) للمبتدئ المطلق، مهيّأ للاستخدام الصفّي المباشر."
                    : "Bilingual (English & Arabic) guide for absolute beginners, structured for direct classroom use."}
                </p>
              </div>
            </div>

            {/* Other guides */}
            <div className="mt-16 pt-8 border-t border-border">
              <h3 className="display text-ink text-xl md:text-2xl mb-4">
                {isAR ? "أدلة أخرى" : "Other Guides"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {GUIDES.filter((g) => g.slug !== slug).map((g) => (
                  <a
                    key={g.slug}
                    href={`/${locale}/library/${g.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-teal/40 hover:text-teal transition-colors text-sm"
                  >
                    <FileText size={14} />
                    {isAR ? g.gradeArabic : g.grade}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
