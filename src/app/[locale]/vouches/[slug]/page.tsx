import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, Download } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "vouches" });
  const letters = t.raw("letters") as { title: string; file: string }[];
  const letter = letters.find((l) => slugify(l.title) === slug);
  if (!letter) return {};

  return {
    title: `${letter.title} · Recommendation for Ahmed Ali`,
    description: `Formal letter of recommendation from ${letter.title}.`,
    alternates: {
      canonical: `/${locale}/vouches/${slug}`,
      languages: { en: `/en/vouches/${slug}`, ar: `/ar/vouches/${slug}` },
    },
  };
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "vouches" });
  const isAR = locale === "ar";
  const letters = t.raw("letters") as {
    title: string; subtitle: string; author: string; authorTitle: string;
    date: string; excerpt: string; file: string;
  }[];

  const letter = letters.find((l) => slugify(l.title) === slug);
  if (!letter) notFound();

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <a
              href={`/${locale}/vouches`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "كل التزكيات" : "All Vouches"}
            </a>

            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {letter.subtitle}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4">
                {letter.title}
              </h1>
              <p className="text-xs text-ink-dim body-serif mb-6">{letter.date}</p>

              {/* Excerpt */}
              <div className="p-6 md:p-8 rounded-2xl bg-paper-warm border border-border mb-6">
                <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed whitespace-pre-line italic">
                  &ldquo;{letter.excerpt}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="pt-6 border-t border-border mb-8">
                <p className="display text-ink text-xl md:text-2xl">{letter.author}</p>
                <p className="text-sm text-ink-dim body-serif mt-1">{letter.authorTitle}</p>
              </div>

              {/* Download */}
              <a
                href={letter.file}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-3 bg-teal hover:bg-teal-bright text-paper font-medium px-7 py-4 rounded-full transition-all duration-300 glow-teal"
              >
                <Download size={18} />
                {t("downloadLetter")}
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
