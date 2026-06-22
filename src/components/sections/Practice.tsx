"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { GraduationCap, Code2, Compass } from "lucide-react";

const DISCIPLINES = [
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
  },
  {
    icon: Code2,
    index: "02",
    title: "Systems Architecture",
    range: "Custom builds · SaaS platforms · Operational systems",
    description:
      "I build production-grade software for schools, businesses, and institutions. Property management platforms managing 400+ units for paying clients. Educational platforms with 390+ interactive activities. MUN operating systems with AI-powered assessments. Each shipped, in use, built alone. The work is Next.js, React, TypeScript, Prisma, PostgreSQL, deployed on Vercel. The discipline is philosopher's rigor applied to a codebase.",
    capabilities: [
      "Real Estate Emperor: 400+ units managed live for a paying client",
      "MSCS Academy: 130 lessons, 390+ activities, UAE-curriculum aligned",
      "DiplomatiQ: 7-tier AI competency framework for MUN programs",
      "Next.js 16, React 19, TypeScript, Prisma, Neon, Vercel",
      "Production-grade: encrypted backups, role-based access, audit trails",
    ],
    proof: "Real Estate Emperor · MSCS Academy · DiplomatiQ",
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
  },
];

export function Practice() {
  return (
    <section id="practice" className="relative py-32 md:py-44 bg-charcoal-dark/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brass/60" />
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

        {/* Editorial list layout — full-width rows on desktop, stacked on mobile */}
        <div className="mt-24">
          <Stagger gap={0.2}>
            {DISCIPLINES.map((d) => {
              const Icon = d.icon;
              return (
                <FadeUp key={d.index}>
                  <article className="group py-12 md:py-16 border-t border-border/70 last:border-b last:border-b-border/70">
                    <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-start">
                      {/* Index + icon */}
                      <div className="md:col-span-2">
                        <div className="flex md:flex-col items-baseline md:items-start gap-4 md:gap-5">
                          <span className="display text-brass/50 text-5xl md:text-6xl leading-none">
                            {d.index}
                          </span>
                          <div className="w-12 h-12 rounded-full border border-brass/30 flex items-center justify-center text-brass">
                            <Icon size={18} strokeWidth={1.5} />
                          </div>
                        </div>
                      </div>

                      {/* Title + description */}
                      <div className="md:col-span-6">
                        <p className="text-xs uppercase tracking-[0.22em] text-brass mb-3">
                          {d.range}
                        </p>
                        <h3 className="display text-cream text-3xl md:text-5xl mb-5 leading-tight">
                          {d.title}
                        </h3>
                        <p className="text-sm md:text-base text-cream/80 leading-relaxed">
                          {d.description}
                        </p>
                      </div>

                      {/* Capabilities + proof */}
                      <div className="md:col-span-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-4">
                          Capabilities
                        </p>
                        <ul className="space-y-2.5 mb-7">
                          {d.capabilities.map((c) => (
                            <li key={c} className="flex items-start gap-3 text-xs text-cream/70 leading-relaxed">
                              <span className="text-brass mt-[2px] flex-shrink-0">·</span>
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
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
