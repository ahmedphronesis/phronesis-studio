"use client";

import { Reveal, FadeUp, Tilt3D } from "../anim";
import { motion } from "framer-motion";
import { GraduationCap, Code2, Compass, type LucideIcon } from "lucide-react";

const DISCIPLINES: {
  icon: LucideIcon;
  index: string;
  title: string;
  range: string;
  description: string;
  capabilities: string[];
  proof: string;
  accent: "teal" | "gold" | "terracotta";
  bgTint: string;
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
    bgTint: "rgba(15, 92, 94, 0.08)",
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
    bgTint: "rgba(180, 141, 60, 0.08)",
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
    bgTint: "rgba(181, 83, 42, 0.08)",
  },
];

const accentColor = {
  gold: "var(--gold)",
  teal: "var(--teal-bright)",
  terracotta: "var(--terracotta-bright)",
} as const;

export function Practice() {
  return (
    <section id="practice" className="relative overflow-hidden">
      {/* Section header — full-bleed */}
      <div className="w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Practice</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2
              className="display text-cream leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Three disciplines,<br />
              <span className="display-italic text-gold">one method.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-base md:text-lg text-cream/75 leading-relaxed">
              Most professionals specialize in one craft. I have spent a decade deliberately working across three. The disciplines are different. The method is the same: perceive the gap, diagnose with rigor, close with precision.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed alternating discipline bands */}
      <div className="flex flex-col">
        {DISCIPLINES.map((d, i) => {
          const Icon = d.icon;
          const color = accentColor[d.accent];
          const isReversed = i % 2 === 1;

          return (
            <FadeUp key={d.index}>
              <div
                className="relative w-full py-20 md:py-32 border-t border-border/40 overflow-hidden"
                style={{ backgroundColor: d.bgTint }}
              >
                {/* Giant background number — full-bleed */}
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
                  whileInView={{ opacity: 0.04, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none ${isReversed ? "right-[-4%]" : "left-[-4%]"}`}
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "min(40vw, 32rem)",
                    lineHeight: 0.85,
                    color,
                  }}
                >
                  {d.index}
                </motion.div>

                <div className="relative w-full px-6 md:px-12 lg:px-20">
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start ${isReversed ? "lg:flex-row-reverse" : ""}`}>
                    {/* Left: icon + index + title */}
                    <div className={`lg:col-span-5 ${isReversed ? "lg:order-2 lg:col-start-8" : ""}`}>
                      <div className="flex items-center gap-5 mb-8">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                          style={{
                            background: `linear-gradient(135deg, ${color}20, transparent)`,
                            borderColor: `${color}40`,
                            color,
                          }}
                        >
                          <Icon size={26} strokeWidth={1.5} />
                        </div>
                        <span
                          className="display text-6xl md:text-7xl leading-none opacity-40"
                          style={{ color }}
                        >
                          {d.index}
                        </span>
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color }}>
                        {d.range}
                      </p>
                      <h3
                        className="display text-cream leading-[1.05]"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                      >
                        {d.title}
                      </h3>
                    </div>

                    {/* Right: description + capabilities */}
                    <div className={`lg:col-span-6 ${isReversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                      <p className="text-base md:text-lg text-cream/80 leading-relaxed mb-8">
                        {d.description}
                      </p>

                      <div className="gold-rule opacity-30 mb-6" />

                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-4">
                        Capabilities
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                        {d.capabilities.map((c) => (
                          <div key={c} className="flex items-start gap-3 text-xs text-cream/70 leading-relaxed">
                            <span className="mt-[2px] flex-shrink-0" style={{ color }}>·</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-5 border-t border-border/60">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-1">
                          Proof of work
                        </p>
                        <p className="text-sm md:text-base text-cream/85 display-italic">
                          {d.proof}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
