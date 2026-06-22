"use client";

import { Reveal, Stagger, FadeUp, Tilt3D } from "../anim";
import { GraduationCap, Code2, Compass, type LucideIcon } from "lucide-react";

const DISCIPLINES: {
  icon: LucideIcon;
  index: string;
  title: string;
  range: string;
  description: string;
  capabilities: string[];
  proof: string;
  accent: "gold" | "teal" | "terracotta";
}[] = [
  {
    icon: GraduationCap,
    index: "01",
    title: "Education",
    range: "Teaching · Curriculum · Learning Platforms",
    description:
      "I am an ADEK-licensed teacher (Grades 1 through 12, American Curriculum) and Faculty Head for Model United Nations at my school. I design inquiry-based, standards-aligned lessons that meet Irtiqa'a expectations, differentiate for ELLs and gifted learners, and translate curriculum into something students actually engage with. I also build learning platforms that compress weeks of administrative work into minutes.",
    capabilities: [
      "ADEK-licensed, Grades 1 to 12, American Curriculum",
      "Faculty Head, Model United Nations program",
      "MSC Studies and Islamic Education teacher",
      "Builder of MSCS Academy (390+ activities) and DiplomatiQ",
      "Curriculum design, ELL differentiation, gifted learner support",
    ],
    proof: "MSCS Academy · DiplomatiQ · Ain Al Khaleej School",
    accent: "teal",
  },
  {
    icon: Code2,
    index: "02",
    title: "Systems Architecture",
    range: "Custom builds · SaaS platforms · Operational systems",
    description:
      "I architect production-grade software for schools, businesses, and institutions. Property management platforms managing 400+ units for paying clients. Educational platforms with 390+ interactive activities. MUN operating systems with AI-powered assessments. Each shipped, in use, built alone. The work is Next.js, React, TypeScript, Prisma, PostgreSQL, deployed on Vercel. The discipline is philosopher's rigor applied to a codebase.",
    capabilities: [
      "Real Estate Emperor: 400+ units managed live for a paying client",
      "MSCS Academy: 130 lessons, 390+ activities, UAE-curriculum aligned",
      "DiplomatiQ: 7-tier AI competency framework for MUN programs",
      "Next.js 16, React 19, TypeScript, Prisma, Neon, Vercel",
      "Production-grade: encrypted backups, role-based access, audit trails",
    ],
    proof: "Real Estate Emperor · MSCS Academy · DiplomatiQ",
    accent: "gold",
  },
  {
    icon: Compass,
    index: "03",
    title: "Leadership & Operations",
    range: "ISO standards · Team leadership · Operational excellence",
    description:
      "I have run operations under ISO 9001 and ISO 45001. I have led teams in education, telecom, and child-focused facilities. I have been the highest-performing sales executive across multiple KPIs at Etisalat, and introduced the Net Promoter Score framework that drove it. I bring operational discipline to every engagement, whether the deliverable is software, a curriculum, or a strategic consultation.",
    capabilities: [
      "Branch Operations Manager, ISO-certified facility (UAE)",
      "ISO 9001 and ISO 45001 operational discipline",
      "Former Sales Executive and Duty Manager, e& Etisalat",
      "Team Leader at FEED (Alexandria) and faculty leadership roles",
      "Net Promoter Score framework design and deployment",
    ],
    proof: "ISO 9001 / 45001 · Etisalat · Ain Al Khaleej School",
    accent: "terracotta",
  },
];

const accentColor = {
  gold: "var(--gold)",
  teal: "var(--teal-bright)",
  terracotta: "var(--terracotta-bright)",
} as const;

const accentGlow = {
  gold: "rgba(214, 175, 100, 0.20)",
  teal: "rgba(15, 92, 94, 0.30)",
  terracotta: "rgba(181, 83, 42, 0.25)",
} as const;

export function Practice() {
  return (
    <section id="practice" className="relative py-32 md:py-44 overflow-hidden">
      {/* Subtle teal radial in background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(15, 92, 94, 0.15), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Practice</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.2rem,5vw,4rem)] max-w-4xl mb-6">
            Three disciplines, one method.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            Most professionals specialize in one craft. I have spent a decade deliberately working across three. The disciplines are different. The method is the same: perceive the gap, diagnose with rigor, close with precision.
          </p>
        </Reveal>

        {/* 3D tilt cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 lg:gap-8 perspective-2000">
          <Stagger gap={0.16}>
            {DISCIPLINES.map((d) => {
              const Icon = d.icon;
              const color = accentColor[d.accent];
              const glow = accentGlow[d.accent];
              return (
                <FadeUp key={d.index}>
                  <Tilt3D max={8} className="h-full">
                    <article
                      className="group h-full p-8 md:p-9 rounded-2xl bg-charcoal-dark border border-border relative overflow-hidden transition-all duration-500 hover:border-[color:var(--gold)]/40"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Accent glow that follows card */}
                      <div
                        aria-hidden
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                          filter: "blur(40px)",
                        }}
                      />

                      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                        <div className="flex items-center justify-between mb-8 relative">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
                            style={{
                              background: `linear-gradient(135deg, ${glow}, transparent)`,
                              borderColor: `${color}40`,
                              color,
                            }}
                          >
                            <Icon size={22} strokeWidth={1.5} />
                          </div>
                          <span
                            className="display text-5xl leading-none opacity-30"
                            style={{ color }}
                          >
                            {d.index}
                          </span>
                        </div>

                        <p className="text-[11px] uppercase tracking-[0.22em] mb-3" style={{ color }}>
                          {d.range}
                        </p>

                        <h3 className="display text-cream text-3xl md:text-4xl mb-5 leading-tight">
                          {d.title}
                        </h3>

                        <p className="text-sm text-cream/75 leading-relaxed mb-7">
                          {d.description}
                        </p>

                        <div className="gold-rule opacity-30 mb-6" />

                        <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-3">
                          Capabilities
                        </p>
                        <ul className="space-y-2.5 mb-7">
                          {d.capabilities.map((c) => (
                            <li key={c} className="flex items-start gap-3 text-xs text-cream/65 leading-relaxed">
                              <span className="mt-[2px] flex-shrink-0" style={{ color }}>·</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-5 border-t border-border/60">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-1">
                            Proof of work
                          </p>
                          <p className="text-sm text-cream/85 display-italic">
                            {d.proof}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Tilt3D>
                </FadeUp>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
