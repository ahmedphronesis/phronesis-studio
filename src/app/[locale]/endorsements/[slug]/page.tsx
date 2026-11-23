import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { Download, ExternalLink, Quote, FileText } from "lucide-react";
import Link from "next/link";

export const runtime = "nodejs";

// Static list of endorsement slugs (so we can statically generate them)
const ENDORSEMENTS = [
  {
    slug: "dr-frank-hoselbarth",
    pdf: "/endorsements/Endorsement_Hoselbarth_2026.pdf",
    labelEn: "Letter of Endorsement",
    labelAr: "رسالةُ تزكية",
    author: "Dr. Frank Höselbarth",
    authorAr: "د. فرانك هوزلبارث",
    titleLineEn:
      "Philosopher · Author of The Education Revolution in the Gulf and the German Industry (2026) · Founder of Nxtgn-Academic-Industrial-Cooperations Ltd., Abu Dhabi",
    titleLineAr:
      "فيلسوف · مؤلِّف كتاب «الثورة التعليمية في الخليج والصناعة الألمانية» (2026) · مؤسِّس شركة Nxtgn-Academic-Industrial-Cooperations Ltd.، أبوظبي",
    dateLocation: "Abu Dhabi, November 2026",
    dateLocationAr: "أبوظبي، نوفمبر 2026",
    excerptEn:
      "The very subtitle of the book serves as a salutary provocation in an age when the capacity for independent thought is in danger of being lost. The author, an Egyptian philosopher and experienced educator in the UAE, cannot be praised highly enough for this ingenious choice of title alone.",
    excerptAr:
      "إنّ عنوان الكتاب الفرعيّ نفسَه ليُعدّ استفزازًا مفيدًا في عصرٍ باتت فيه قدرةُ التفكير المستقلّ مُهدَّدةً بالضياع. ولا تكفي الثناءَ كلهُ كلمتُه على هذا الاختيار العبقريّ للعنوان وحده، وهو فيلسوفٌ مصريٌّ ومربٍّ خبيرٌ في الإمارات.",
    bookTitleEn: "Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI",
    bookTitleAr: "العمق المعرفي: دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي",
    bookSlug: "depth-of-knowledge",
  },
];

export async function generateStaticParams() {
  return ENDORSEMENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = ENDORSEMENTS.find((x) => x.slug === slug);
  if (!e) return {};

  const isAR = locale === "ar";
  // Note: layout.tsx has title.template = "%s · Studio of Phronesis", so we
  // must NOT include "Studio of Phronesis" in the title string here, or
  // it will be doubled.
  const title = isAR
    ? `${e.labelAr} · ${e.authorAr}`
    : `${e.labelEn} · ${e.author}`;
  const description = isAR
    ? `تزكيةٌ علميةٌ لكتاب «${e.bookTitleAr}» من ${e.authorAr}. ${e.dateLocationAr}.`
    : `Scholarly endorsement of "${e.bookTitleEn}" by ${e.author}. ${e.dateLocation}.`;
  const ogTitle = title;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: "article",
      url: `https://phronesis-studio.com/${locale}/endorsements/${slug}`,
      siteName: "Studio of Phronesis",
      locale: isAR ? "ar_AR" : "en_US",
      images: [
        {
          url: `https://phronesis-studio.com/${locale}/endorsements/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: isAR
            ? `${e.labelAr} · ${e.authorAr}`
            : `${e.labelEn} · ${e.author}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [
        `https://phronesis-studio.com/${locale}/endorsements/${slug}/opengraph-image`,
      ],
    },
    alternates: {
      canonical: `/${locale}/endorsements/${slug}`,
      languages: {
        en: `/en/endorsements/${slug}`,
        ar: `/ar/endorsements/${slug}`,
      },
    },
  };
}

export default async function EndorsementPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "endorsements" });
  const e = ENDORSEMENTS.find((x) => x.slug === slug);
  if (!e) notFound();

  const label = isAR ? e.labelAr : e.labelEn;
  const author = isAR ? e.authorAr : e.author;
  const titleLine = isAR ? e.titleLineAr : e.titleLineEn;
  const dateLocation = isAR ? e.dateLocationAr : e.dateLocation;
  const excerpt = isAR ? e.excerptAr : e.excerptEn;
  const bookTitle = isAR ? e.bookTitleAr : e.bookTitleEn;
  const dir = isAR ? "rtl" : "ltr";

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
              href={`/${locale}/publications/${e.bookSlug}`}
              className={`inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8 ${isAR ? "flex-row-reverse" : ""}`}
            >
              {isAR ? "←" : "←"}
              {t("backToBook")}
            </Link>

            {/* Eyebrow */}
            <div className={`flex items-center gap-4 mb-6 ${isAR ? "flex-row-reverse" : ""}`}>
              <span className="h-px w-12 bg-gold/60" />
              <span className="eyebrow text-gold">{t("eyebrow")}</span>
            </div>

            <h1 className="display text-ink text-4xl md:text-5xl leading-[1.05] mb-3" style={headingFont} dir={dir}>
              {t("title")}
            </h1>
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed mb-10 max-w-2xl">
              {t("intro")}
            </p>

            {/* Endorsement card */}
            <div className="max-w-4xl rounded-2xl overflow-hidden border border-gold/30 bg-paper-warm shadow-[0_20px_60px_-20px_rgba(15,92,94,0.25)]">
              {/* Header strip */}
              <div
                className={`flex items-start justify-between gap-3 px-5 md:px-7 py-5 border-b border-gold/20 bg-gradient-to-r from-teal/5 to-transparent ${isAR ? "flex-row-reverse" : ""}`}
                dir={dir}
              >
                <div className={isAR ? "text-right" : ""}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono mb-2">
                    {label}
                  </p>
                  <p className="display text-ink text-xl md:text-2xl font-medium" style={headingFont}>
                    {author}
                  </p>
                  <p className="body-serif text-xs md:text-sm text-ink-dim mt-2 leading-relaxed max-w-2xl">
                    {titleLine}
                  </p>
                </div>
                <p className="body-serif text-xs text-ink-dim italic whitespace-nowrap flex-shrink-0">
                  {dateLocation}
                </p>
              </div>

              {/* Pull-quote */}
              <div className="relative px-5 md:px-7 py-6 border-b border-gold/20 bg-paper-warm/40" dir={dir}>
                <Quote
                  className={`absolute ${isAR ? "left-5" : "right-5"} top-5 text-gold/20`}
                  size={40}
                  strokeWidth={1}
                />
                <blockquote
                  className={`body-serif text-base md:text-lg text-ink leading-relaxed italic ${isAR ? "text-right" : ""} pr-12`}
                >
                  &ldquo;{excerpt}&rdquo;
                </blockquote>
              </div>

              {/* Embedded PDF viewer */}
              <div className="bg-white">
                <iframe
                  src={`${e.pdf}#view=FitH&toolbar=1&navpanes=0`}
                  title={`${label} · ${author}`}
                  className="w-full"
                  style={{ height: "780px", border: "0", display: "block" }}
                />
              </div>

              {/* Download button footer */}
              <div
                className={`flex items-center justify-between gap-3 px-5 md:px-7 py-5 border-t border-gold/20 bg-paper-warm flex-wrap ${isAR ? "flex-row-reverse" : ""}`}
                dir={dir}
              >
                <a
                  href={e.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 bg-teal hover:bg-teal-bright text-paper text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                >
                  <Download size={14} className="flex-shrink-0" />
                  {t("downloadPdf")}
                </a>
                <Link
                  href={`/${locale}/publications/${e.bookSlug}`}
                  className={`inline-flex items-center gap-2 text-xs sm:text-sm text-teal hover:text-teal-bright transition-colors ${isAR ? "flex-row-reverse" : ""}`}
                >
                  <FileText size={14} />
                  {t("viewBookPage")}
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
