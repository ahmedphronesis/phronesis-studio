"use client";

import { Reveal, FadeUp, Stagger, Magnetic } from "../anim";
import { motion } from "framer-motion";
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
    <section id="work" className="relative overflow-hidden">
      {/* Section header — full-bleed */}
      <div className="w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Selected Work</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2
              className="display text-cream leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Four systems.<br />
              <span className="display-italic text-gold">Live. In production.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-base md:text-lg text-cream/75 leading-relaxed">
              Not mockups. Not portfolios. Four real platforms, three of them live on the web today, the fourth broadcasting weekly. Each one started by perceiving a gap that someone else had stopped seeing.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed project rows */}
      <div className="flex flex-col">
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.index} project={p} isReversed={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project, isReversed }: { project: Project; isReversed: boolean }) {
  const isLink = Boolean(project.url);

  const CardContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      {/* Left: massive number + metric */}
      <div className={`lg:col-span-4 ${isReversed ? "lg:order-2 lg:col-start-9" : ""}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="display text-gold leading-none"
          style={{ fontSize: "clamp(5rem, 12vw, 11rem)" }}
        >
          {project.metric}
        </motion.div>
        <div className="text-xs uppercase tracking-[0.22em] text-cream-dim mt-3">
          {project.metricLabel}
        </div>
        <div className="display text-cream/30 text-3xl mt-6">{project.index}</div>
      </div>

      {/* Right: content */}
      <div className={`lg:col-span-7 ${isReversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">
          {project.category}
        </p>
        <h3
          className={`display text-cream flex items-center gap-4 transition-colors ${isLink ? "group-hover:text-gold" : ""}`}
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
        >
          {project.name}
          {isLink && (
            <ArrowUpRight
              size={36}
              strokeWidth={1.5}
              className="text-gold opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
            />
          )}
        </h3>
        <p className="text-sm md:text-base text-cream/80 leading-relaxed mt-6 max-w-2xl">
          {project.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-8">
          {project.features.map((f) => (
            <div
              key={f}
              className="flex items-start gap-3 text-xs text-cream/70 leading-relaxed"
            >
              <span className="text-gold mt-[2px] flex-shrink-0">·</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/60">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-2">
            Stack
          </p>
          <p className="text-xs text-cream/65 leading-relaxed">{project.stack}</p>
        </div>

        {isLink && (
          <Magnetic strength={0.3}>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gold/90">
              <ExternalLink size={14} />
              <span className="link-underline">Visit live site</span>
            </div>
          </Magnetic>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full py-16 md:py-24 border-t border-border/40 px-6 md:px-12 lg:px-20 cursor-pointer transition-colors hover:bg-charcoal-dark/40"
      >
        {CardContent}
      </a>
    );
  }
  return (
    <div className="w-full py-16 md:py-24 border-t border-border/40 px-6 md:px-12 lg:px-20">
      {CardContent}
    </div>
  );
}
