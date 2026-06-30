import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

export const runtime = "nodejs";

// Project slugs mapped to their data
const PROJECTS: Record<string, {
  nameKey: string; descKey: string; rationaleKey: string; url?: string;
  isForthcoming?: boolean; domain?: string;
}> = {
  "real-estate-emperor": {
    nameKey: "neural.clouds.realestate.name",
    descKey: "neural.clouds.realestate.desc",
    rationaleKey: "neural.clouds.realestate.rationale",
    domain: "neural.clouds.realestate.domain",
    url: "https://real-estate-emperor.vercel.app",
  },
  "mscs-academy": {
    nameKey: "neural.clouds.mscs.name",
    descKey: "neural.clouds.mscs.desc",
    rationaleKey: "neural.clouds.mscs.rationale",
    domain: "neural.clouds.mscs.domain",
    url: "https://mscs-academy.vercel.app",
  },
  "diplomatiq": {
    nameKey: "neural.clouds.diplomatiq.name",
    descKey: "neural.clouds.diplomatiq.desc",
    rationaleKey: "neural.clouds.diplomatiq.rationale",
    domain: "neural.clouds.diplomatiq.domain",
    url: "https://mun-diplomatiq.vercel.app",
  },
  "bilingual-mathematics": {
    nameKey: "neural.clouds.math.name",
    descKey: "neural.clouds.math.desc",
    rationaleKey: "neural.clouds.math.rationale",
    domain: "neural.clouds.math.domain",
  },
  "echoes-of-wisdom": {
    nameKey: "neural.clouds.echoes.name",
    descKey: "neural.clouds.echoes.desc",
    rationaleKey: "neural.clouds.echoes.rationale",
    domain: "neural.clouds.echoes.domain",
  },
  "treasury-emperor": {
    nameKey: "neural.clouds.treasury.name",
    descKey: "neural.clouds.treasury.desc",
    rationaleKey: "neural.clouds.treasury.rationale",
    domain: "neural.clouds.treasury.domain",
  },
  "history-of-philosophy": {
    nameKey: "neural.clouds.realestate.name", // placeholder — overridden below
    descKey: "neural.clouds.realestate.desc",  // placeholder
    rationaleKey: "neural.clouds.realestate.rationale", // placeholder
    domain: "neural.clouds.echoes.domain",
    isForthcoming: true,
  },
};

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

// NOTE: `export` is REQUIRED — Next.js only invokes a named export named
// `generateMetadata`. Without `export`, this function is silently ignored,
// and the page falls back to the locale-layout default metadata (wrong OG
// image, wrong title). This was the root cause of the OG image bug on
// /work/history-of-philosophy.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return {};

  const ogImage = slug === "history-of-philosophy" ? "/og-philosophy.png" : "/og-image.png";

  if (project.isForthcoming) {
    // Load from echoes namespace for forthcoming projects
    const tEchoes = await getTranslations({ locale, namespace: "echoes" });
    const title = `${tEchoes("forthcomingTitle")} · Studio of Phronesis`;
    const description = tEchoes("forthcomingBody");
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://phronesis-studio.com/${locale}/work/${slug}`,
        siteName: "Studio of Phronesis",
        images: [{
          url: `https://phronesis-studio.com${ogImage}`,
          secureUrl: `https://phronesis-studio.com${ogImage}`,
          width: 1200,
          height: 630,
          alt: tEchoes("forthcomingTitle"),
          type: "image/png",
        }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`https://phronesis-studio.com${ogImage}`],
      },
      alternates: {
        canonical: `/${locale}/work/${slug}`,
        languages: { en: `/en/work/${slug}`, ar: `/ar/work/${slug}` },
      },
    };
  }

  const t = await getTranslations({ locale, namespace: "workContent" });
  const title = `${t(project.nameKey)} · Studio of Phronesis`;
  const description = t(project.descKey);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://phronesis-studio.com/${locale}/work/${slug}`,
      siteName: "Studio of Phronesis",
      images: [{
        url: `https://phronesis-studio.com${ogImage}`,
        secureUrl: `https://phronesis-studio.com${ogImage}`,
        width: 1200,
        height: 630,
        alt: t(project.nameKey),
        type: "image/png",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://phronesis-studio.com${ogImage}`],
    },
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { en: `/en/work/${slug}`, ar: `/ar/work/${slug}` },
    },
  };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale, slug } = await params;
  const { from } = await searchParams;
  const project = PROJECTS[slug];
  if (!project) notFound();

  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "workContent" });

  // For forthcoming projects, load from echoes namespace
  const tEchoes = project.isForthcoming
    ? await getTranslations({ locale, namespace: "echoes" })
    : null;

  const name = project.isForthcoming && tEchoes ? tEchoes("forthcomingTitle") : t(project.nameKey);
  const desc = project.isForthcoming && tEchoes ? tEchoes("forthcomingBody") : t(project.descKey);
  const rationale = project.isForthcoming && tEchoes ? tEchoes("forthcomingBody") : t(project.rationaleKey);
  const domain = project.isForthcoming && tEchoes
    ? (isAR ? "الفلسفة · الثقافة" : "Philosophy · Cultural")
    : t(project.domain || "neural.clouds.echoes.domain");

  // Context-aware back link:
  //   ?from=echoes  → back to /{locale}/echoes (preserves user flow)
  //   otherwise     → back to /{locale}/work (default)
  const cameFromEchoes = from === "echoes";
  const backHref = cameFromEchoes
    ? `/${locale}/echoes`
    : `/${locale}/work`;
  const backLabel = cameFromEchoes
    ? (isAR ? "أصداء الحكمة" : "Echoes")
    : (isAR ? "كل الأعمال" : "All Work");

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">
            <a
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors mb-8"
            >
              {isAR ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="rotate-180" />}
              {backLabel}
            </a>

            {/* Faded painting — full-width showcase for History of Philosophy.
                Rendered OUTSIDE the max-w-4xl text column so it can breathe at
                the full container width (up to lg:px-20). The text column below
                stays narrower for readability. */}
            {project.isForthcoming && (
              <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 mb-10 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)]">
                <img
                  src="/school-of-athens-faded.jpg"
                  alt="School of Athens by Raphael — fresco, 1509–1511, Apostolic Palace, Vatican City"
                  className="w-full h-auto block"
                />
                {/* Subtle cream wash so the Coming Soon badge stays legible
                    without dimming the painting itself. */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5EFE4]/70 via-[#F5EFE4]/10 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.2em] text-gold font-mono">
                      {isAR ? "قريبًا" : "Coming Soon!"}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft/70 font-mono bg-paper/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                    {isAR ? "رفائيل · مدرسة أثينا" : "Raphael · School of Athens"}
                  </span>
                </div>
              </div>
            )}

            <div className="max-w-4xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-2">
                {domain}
              </p>
              <h1 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-4">
                {name}
              </h1>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mb-6">
                {desc}
              </p>

              {/* Rationale — only for non-forthcoming projects */}
              {!project.isForthcoming && (
                <div className="mt-8 p-6 md:p-8 rounded-2xl bg-paper-warm border border-border">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-teal font-mono mb-4">
                    {t("neural.rationaleLabel")}
                  </p>
                  <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
                    {rationale}
                  </p>
                </div>
              )}

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
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="display text-ink text-xl md:text-2xl mb-4">
                {isAR ? "أعمال أخرى" : "Other Projects"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(PROJECTS).filter(([s]) => s !== slug).map(([s, p]) => {
                  const otherName = p.isForthcoming && tEchoes
                    ? tEchoes("forthcomingTitle")
                    : t(p.nameKey);
                  return (
                    <a
                      key={s}
                      href={`/${locale}/work/${s}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-teal/40 hover:text-teal transition-colors text-sm"
                    >
                      {otherName}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
