import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

export const runtime = "nodejs";

// Project slugs mapped to their data keys
const PROJECTS: Record<string, { nameKey: string; descKey: string; rationaleKey: string; url?: string; isForthcoming?: boolean }> = {
  "real-estate-emperor": { nameKey: "neural.clouds.realestate.name", descKey: "neural.clouds.realestate.desc", rationaleKey: "neural.clouds.realestate.rationale", url: "https://real-estate-emperor.vercel.app" },
  "mscs-academy": { nameKey: "neural.clouds.mscs.name", descKey: "neural.clouds.mscs.desc", rationaleKey: "neural.clouds.mscs.rationale", url: "https://mscs-academy.vercel.app" },
  "diplomatiq": { nameKey: "neural.clouds.diplomatiq.name", descKey: "neural.clouds.diplomatiq.desc", rationaleKey: "neural.clouds.diplomatiq.rationale", url: "https://mun-diplomatiq.vercel.app" },
  "bilingual-mathematics": { nameKey: "neural.clouds.math.name", descKey: "neural.clouds.math.desc", rationaleKey: "neural.clouds.math.rationale" },
  "echoes-of-wisdom": { nameKey: "neural.clouds.echoes.name", descKey: "neural.clouds.echoes.desc", rationaleKey: "neural.clouds.echoes.rationale" },
  "treasury-emperor": { nameKey: "neural.clouds.treasury.name", descKey: "neural.clouds.treasury.desc", rationaleKey: "neural.clouds.treasury.rationale" },
  "history-of-philosophy": { nameKey: "echoes.forthcomingTitle", descKey: "echoes.forthcomingBody", rationaleKey: "echoes.forthcomingBody", isForthcoming: true },
};

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "workContent" });
  const ogImage = slug === "history-of-philosophy" ? "/og-philosophy.png" : "/og-image.png";
  return {
    title: `${t(project.nameKey)} · Studio of Phronesis`,
    description: t(project.descKey),
    openGraph: {
      title: `${t(project.nameKey)} · Studio of Phronesis`,
      description: t(project.descKey),
      images: [{ url: ogImage, width: 1200, height: 630, alt: t(project.nameKey) }],
    },
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, ar: `/ar/work/${slug}` },
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = PROJECTS[slug];
  if (!project) notFound();

  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "workContent" });

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <a
              href={`/${locale}/work`}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {isAR ? "كل الأعمال" : "All Work"}
            </a>

            <div className="max-w-4xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {t(project.nameKey.includes("realestate") ? "neural.clouds.realestate.domain" : project.nameKey.includes("mscs") ? "neural.clouds.mscs.domain" : project.nameKey.includes("diplomatiq") ? "neural.clouds.diplomatiq.domain" : project.nameKey.includes("math") ? "neural.clouds.math.domain" : project.nameKey.includes("echoes") ? "neural.clouds.echoes.domain" : "neural.clouds.treasury.domain")}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4">
                {t(project.nameKey)}
              </h1>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mb-6">
                {t(project.descKey)}
              </p>

              {/* Rationale */}
              <div className="mt-8 p-6 md:p-8 rounded-2xl bg-paper-warm border border-border">
                <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-4">
                  {t("neural.rationaleLabel")}
                </p>
                <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
                  {t(project.rationaleKey)}
                </p>
              </div>

              {/* Visit link */}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="link-underline">{t("visitSite")}</span>
                </a>
              )}
            </div>

            {/* Other projects */}
            <div className="mt-16 pt-8 border-t border-border">
              <h3 className="display text-ink text-xl md:text-2xl mb-4">
                {isAR ? "أعمال أخرى" : "Other Projects"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(PROJECTS).filter(([s]) => s !== slug).map(([s, p]) => (
                  <a
                    key={s}
                    href={`/${locale}/work/${s}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-teal/40 hover:text-teal transition-colors text-sm"
                  >
                    {t(p.nameKey)}
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
