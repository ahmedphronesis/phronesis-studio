"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type Project = {
  index: string;
  name: string;
  category: string;
  url?: string;
  metric: string;
  metricLabel: string;
  description: string;
  features: string[];
  stack: string;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Real Estate Emperor",
    category: "Property Management SaaS",
    url: "https://real-estate-emperor.vercel.app",
    metric: "400+",
    metricLabel: "units managed · live",
    description:
      "A cloud-based property management platform running in production for a paying client in Al Ain. Rent collection with payment allocation across current, advance, and historical debt. Per-building P&L. Role-based access for owners, admins, accountants, and staff. Multi-language (EN / AR / BN / UR). Automated daily backups with SHA-256 verification.",
    features: [
      "Multi-unit tenant groups with auto-split payments",
      "Recurring utility bills: TAQA, DEWA, Etisalat, du",
      "Per-building P&L in real time",
      "Tenant scoring and historical debt tracking",
      "Multi-month advance payment allocation",
    ],
    stack: "Next.js 16 · React 19 · Prisma · PostgreSQL (Neon) · TypeScript · Tailwind 4 · shadcn/ui · NextAuth · Vercel",
  },
  {
    index: "02",
    name: "MSCS Academy",
    category: "Educational Learning Platform",
    url: "https://mscs-academy.vercel.app",
    metric: "390+",
    metricLabel: "interactive activities",
    description:
      "An interactive learning platform for UAE Moral, Social & Cultural Studies, built for Grades 6 to 9. Standards-aligned to the UAE MSCS curriculum. Four grades, 130 lessons, 390+ activities: quizzes, timelines, maps, drag-and-drop, KWL charts, Venn diagrams, built-in timers, instant feedback. PDPL-compliant. Child Digital Safety Law 26/2025 aligned. ADEK Irtiqa'a aligned. Built for my own teaching practice.",
    features: [
      "Interactive quizzes with instant feedback",
      "Timelines, maps, drag-and-drop activities",
      "KWL charts and Venn diagrams",
      "Student-centered design, standards-aligned",
      "UAE compliance: PDPL, Wadeema's Law, ADEK Irtiqa'a",
    ],
    stack: "Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · Vercel",
  },
  {
    index: "03",
    name: "DiplomatiQ",
    category: "Model United Nations Platform",
    url: "https://mun-diplomatiq.vercel.app",
    metric: "7-tier",
    metricLabel: "competency framework",
    description:
      "The operating system for Model United Nations programs. AI-powered diplomatic assessments across a seven-tier progressive framework, from Basic Delegate to Secretary-General. Eight immersive courses, 40+ lessons. Conference management: registrations, committees, delegates, voting. AI-powered research paper evaluation with originality detection. Performance analytics with XP, badges, progression. Built for UAE and GCC schools.",
    features: [
      "AI-powered diplomatic assessments (7 tiers)",
      "8 immersive courses, 40+ lessons",
      "Conference management: registrations, voting, committees",
      "AI research paper evaluation with originality detection",
      "Verified UAE/GCC school directory",
    ],
    stack: "Next.js · React · TypeScript · Tailwind CSS · shadcn/ui · AI · Vercel",
  },
  {
    index: "04",
    name: "Echoes of Wisdom",
    category: "Philosophy Podcast · أصداء الحكمة",
    metric: "∞",
    metricLabel: "ongoing broadcast",
    description:
      "An independent educational podcast that promotes philosophy as an accessible field of education with practical relevance to everyday life, critical thinking, and personal development. Bridges academic philosophy and public discourse, making complex ideas in ethics, logic, and epistemology understandable and actionable for diverse audiences. The cultural flagship of the studio.",
    features: [
      "Bridges academic philosophy and public discourse",
      "Ethics, logic, epistemology, made actionable",
      "Independent educational initiative",
      "Audience: diverse Arabic and English speakers",
      "Foundation for the Studio's cultural-organization work",
    ],
    stack: "Independent production · Arabic & English · 2026 to present",
  },
];

export function Work() {
  return (
    <section id="work" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Selected Work</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.2rem,5vw,4rem)] max-w-4xl mb-6">
            Four systems. Live. In production.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            Not mockups. Not portfolios. Four real platforms, three of them live on the web today, the fourth broadcasting weekly. Each one started by perceiving a gap that someone else had stopped seeing.
          </p>
        </Reveal>

        {/* Project list: editorial layout */}
        <div className="mt-24">
          <Stagger gap={0.18}>
            {PROJECTS.map((p) => (
              <FadeUp key={p.index}>
                <ProjectRow project={p} />
              </FadeUp>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const isLink = Boolean(project.url);
  const Tag = isLink ? "a" : "div";
  const tagProps = isLink
    ? {
        href: project.url,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Tag
      {...tagProps}
      className={`group block py-12 md:py-16 border-t border-border/70 ${
        isLink ? "cursor-pointer" : ""
      }`}
    >
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Index + metric */}
        <div className="md:col-span-3">
          <div className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-6">
            <span
              className="display text-gold/40 text-5xl md:text-6xl leading-none"
            >
              {project.index}
            </span>
            <div>
              <div
                className="display text-cream text-4xl md:text-5xl leading-none"
              >
                {project.metric}
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-cream-dim mt-2">
                {project.metricLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Title + category */}
        <div className="md:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">
            {project.category}
          </p>
          <h3
            className={`display text-cream text-[clamp(2rem,3.5vw,3rem)] flex items-center gap-3 ${
              isLink ? "group-hover:text-gold transition-colors" : ""
            }`}
          >
            {project.name}
            {isLink && (
              <ArrowUpRight
                size={28}
                strokeWidth={1.5}
                className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
              />
            )}
          </h3>
          <p className="text-sm md:text-base text-cream/80 leading-relaxed mt-5 max-w-xl">
            {project.description}
          </p>
        </div>

        {/* Features + stack */}
        <div className="md:col-span-4">
          <ul className="space-y-2 mb-7">
            {project.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-xs text-cream/70 leading-relaxed"
              >
                <span className="text-gold mt-[2px] flex-shrink-0">·</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="pt-5 border-t border-border/60">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-2">
              Stack
            </p>
            <p className="text-xs text-cream/65 leading-relaxed">{project.stack}</p>
          </div>
          {isLink && (
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-gold/80">
              <ExternalLink size={12} />
              <span className="link-underline">Visit live site</span>
            </div>
          )}
        </div>
      </div>
    </Tag>
  );
}
