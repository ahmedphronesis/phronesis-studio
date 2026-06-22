"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { Hammer, Eye, BookOpen } from "lucide-react";

const SERVICES = [
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
    <section id="services" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brass/60" />
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

        {/* Three service cards — horizontal layout on desktop */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 lg:gap-8">
          <Stagger gap={0.16}>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <FadeUp key={s.title}>
                  <article className="group h-full p-8 md:p-9 rounded-2xl bg-charcoal-dark border border-border hover:border-brass/40 transition-all duration-500 hover:translate-y-[-4px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-full bg-brass/10 border border-brass/30 flex items-center justify-center text-brass">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                        {s.eyebrow}
                      </span>
                    </div>

                    <h3 className="display text-cream text-2xl md:text-3xl leading-tight mb-5">
                      {s.title}
                    </h3>

                    <p className="text-sm text-cream/75 leading-relaxed mb-7">
                      {s.description}
                    </p>

                    <div className="gold-rule opacity-30 mb-6" />

                    <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-3">
                      What it includes
                    </p>
                    <ul className="space-y-2.5">
                      {s.includes.map((i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-cream/65 leading-relaxed">
                          <span className="text-brass mt-[2px] flex-shrink-0">·</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
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
