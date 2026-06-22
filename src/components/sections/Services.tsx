"use client";

import { Reveal, Stagger, FadeUp, Tilt3D, Magnetic } from "../anim";
import { Hammer, Eye, BookOpen, ArrowUpRight, type LucideIcon } from "lucide-react";

const SERVICES: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  includes: string[];
}[] = [
  {
    icon: Hammer,
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
  },
  {
    icon: Eye,
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
  },
  {
    icon: BookOpen,
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
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-32 md:py-44 overflow-hidden">
      {/* Warm terracotta glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(181, 83, 42, 0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Ways to Engage</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.2rem,5vw,4rem)] max-w-4xl mb-6">
            Three ways to work together.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            Every engagement begins with a conversation. From there, the work takes one of three shapes, each with its own scope, cadence, and commercial structure. None is better than the others; the right choice depends on the gap.
          </p>
        </Reveal>

        {/* Service cards with 3D tilt and animated gradient borders on hover */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 lg:gap-8 perspective-2000">
          <Stagger gap={0.16}>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <FadeUp key={s.title}>
                  <Tilt3D max={6} className="h-full">
                    <article className="group h-full p-8 md:p-9 rounded-2xl bg-charcoal-dark border border-border hover:border-gold/50 transition-all duration-500 hover:translate-y-[-6px] flex flex-col relative overflow-hidden">
                      {/* Animated gradient border on hover */}
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: "linear-gradient(135deg, var(--gold), var(--teal), var(--terracotta))",
                          padding: "1px",
                          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                        }}
                      />

                      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-teal/10 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500">
                            <Icon size={22} strokeWidth={1.5} />
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                            {s.eyebrow}
                          </span>
                        </div>

                        <h3 className="display text-cream text-3xl md:text-4xl leading-tight mb-5">
                          {s.title}
                        </h3>

                        <p className="text-sm text-cream/75 leading-relaxed mb-7">
                          {s.description}
                        </p>

                        <div className="gold-rule opacity-30 mb-6" />

                        <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-3">
                          What it includes
                        </p>
                        <ul className="space-y-2.5 mb-7 flex-1">
                          {s.includes.map((i) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-cream/65 leading-relaxed">
                              <span className="text-gold mt-[2px] flex-shrink-0">·</span>
                              <span>{i}</span>
                            </li>
                          ))}
                        </ul>

                        <Magnetic strength={0.4}>
                          <a
                            href="#contact"
                            className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright transition-colors pt-2"
                          >
                            Start a {s.title.toLowerCase()} engagement
                            <ArrowUpRight size={14} />
                          </a>
                        </Magnetic>
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
