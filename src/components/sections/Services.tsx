"use client";

import { Reveal, FadeUp, Magnetic } from "../anim";
import { motion } from "framer-motion";
import { Hammer, Eye, BookOpen, ArrowUpRight, type LucideIcon } from "lucide-react";

const SERVICES: {
  icon: LucideIcon;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  includes: string[];
  accent: "gold" | "teal" | "terracotta";
  bgTint: string;
}[] = [
  {
    icon: Hammer,
    index: "I",
    eyebrow: "Engagement I",
    title: "Custom Build",
    description:
      "A production-grade system designed, shipped, and deployed for your institution. Software, learning platform, operational tool, or end-to-end product. Built alone, delivered in weeks, owned by you. Annual license plus setup fee, never one-off. Minimum engagement 8,000 AED.",
    includes: [
      "Discovery, diagnosis, and a written one-page spec",
      "Two-week build cycles with visible progress",
      "Production-grade from day one: auth, backups, audit trails",
      "Mobile-responsive, multi-language when needed",
      "Annual license covers updates, security, and support",
    ],
    accent: "gold",
    bgTint: "rgba(180, 141, 60, 0.06)",
  },
  {
    icon: Eye,
    index: "II",
    eyebrow: "Engagement II",
    title: "Consultation",
    description:
      "Strategic consultation for institutions that need a second mind on a hard problem. Curriculum design, operational audit, software selection, team structure, vendor evaluation. You receive a written diagnosis and a clear set of recommendations. Hourly or fixed-scope. Minimum 90 minutes.",
    includes: [
      "Structured diagnostic session (90 to 180 minutes)",
      "Written diagnosis and prioritized recommendations",
      "Vendor and tooling evaluation, with reasoning",
      "Follow-up support during implementation",
      "Available in person (UAE) or remote (anywhere)",
    ],
    accent: "teal",
    bgTint: "rgba(15, 92, 94, 0.08)",
  },
  {
    icon: BookOpen,
    index: "III",
    eyebrow: "Engagement III",
    title: "Tutoring",
    description:
      "Focused, one-on-one tutoring for students and professionals. Philosophy, critical thinking, English (IELTS Band 7), academic writing, Model United Nations preparation, and foundational computer science. Sessions are structured, deliberate, and adjusted to the learner. Available in person (Al Ain) or online.",
    includes: [
      "Philosophy, logic, critical thinking, and academic writing",
      "MUN preparation, resolution writing, parliamentary procedure",
      "English language, IELTS Academic preparation",
      "Foundational computer science and software thinking",
      "In person in Al Ain, or online anywhere in the world",
    ],
    accent: "terracotta",
    bgTint: "rgba(181, 83, 42, 0.06)",
  },
];

const accentColor = {
  gold: "var(--gold)",
  teal: "var(--teal-bright)",
  terracotta: "var(--terracotta-bright)",
} as const;

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden">
      {/* Section header — full-bleed */}
      <div className="w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Ways to Engage</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2
              className="display text-cream leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Three ways to<br />
              <span className="display-italic text-gold">work together.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-base md:text-lg text-cream/75 leading-relaxed">
              Every engagement begins with a conversation. From there, the work takes one of three shapes, each with its own scope, cadence, and commercial structure. None is better than the others; the right choice depends on the gap.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed alternating engagement bands */}
      <div className="flex flex-col">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          const color = accentColor[s.accent];
          const isReversed = i % 2 === 1;

          return (
            <FadeUp key={s.title}>
              <div
                className="relative w-full py-20 md:py-32 border-t border-border/40 overflow-hidden"
                style={{ backgroundColor: s.bgTint }}
              >
                {/* Giant background Roman numeral */}
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
                  whileInView={{ opacity: 0.05, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none ${isReversed ? "right-[-2%]" : "left-[-2%]"}`}
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontSize: "min(35vw, 28rem)",
                    lineHeight: 0.85,
                    color,
                  }}
                >
                  {s.index}
                </motion.div>

                <div className="relative w-full px-6 md:px-12 lg:px-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left: index + icon + title */}
                    <div className={`lg:col-span-5 ${isReversed ? "lg:order-2 lg:col-start-8" : ""}`}>
                      <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color }}>
                        {s.eyebrow}
                      </p>
                      <div className="flex items-center gap-5 mb-6">
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
                      </div>
                      <h3
                        className="display text-cream leading-[1.05]"
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                      >
                        {s.title}
                      </h3>
                    </div>

                    {/* Right: description + includes + CTA */}
                    <div className={`lg:col-span-6 ${isReversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                      <p className="text-base md:text-lg text-cream/80 leading-relaxed mb-8">
                        {s.description}
                      </p>

                      <div className="gold-rule opacity-30 mb-6" />

                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-4">
                        What it includes
                      </p>
                      <ul className="space-y-2.5 mb-10">
                        {s.includes.map((it) => (
                          <li key={it} className="flex items-start gap-3 text-sm text-cream/70 leading-relaxed">
                            <span className="mt-[3px] flex-shrink-0" style={{ color }}>·</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>

                      <Magnetic strength={0.4}>
                        <a
                          href="#contact"
                          className="group inline-flex items-center gap-2 text-base transition-colors pt-2"
                          style={{ color }}
                        >
                          Start a {s.title.toLowerCase()} engagement
                          <ArrowUpRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </a>
                      </Magnetic>
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
