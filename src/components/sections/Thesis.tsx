"use client";

import { Reveal, Stagger, FadeUp } from "../anim";

const PILLARS = [
  {
    n: "I",
    title: "Perceive the gap",
    body: "Before a single line of code, I sit with your workflow until I see what you have stopped noticing. The spreadsheet that nobody trusts. The reconciliation that takes three days. The student data that lives in five places. The gap is always there — most builders never look for it.",
  },
  {
    n: "II",
    title: "Diagnose with rigor",
    body: "A gap is not a feature request. I map the actors, the incentives, the failure modes, the compliance envelope, the data flows. I refuse to build on a misdiagnosis. A philosopher's discipline applied to a system's anatomy.",
  },
  {
    n: "III",
    title: "Close with precision",
    body: "The right system, shipped in weeks, not quarters. Production-grade from day one: encrypted backups, role-based access, audit trails, mobile-responsive, multi-language when you need it. Built to outlive the contract.",
  },
];

export function Thesis() {
  return (
    <section id="thesis" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Eyebrow */}
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Thesis</span>
          </div>
        </Reveal>

        {/* Lead statement */}
        <Reveal delay={0.05}>
          <p
            className="display text-cream text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.15] max-w-5xl"
          >
            Most builders ask <span className="display-italic text-gold">what should I build?</span>{" "}
            The philosopher-builder asks first{" "}
            <span className="display-italic text-gold">what gap exists</span> — between what-is
            and what-should-be — and only then decides what to build, and why.
          </p>
        </Reveal>

        <div className="gold-rule my-20" />

        {/* Two-column body */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          <Reveal className="md:col-span-5" delay={0.05}>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed">
              I am not a developer who happens to teach. I am not a teacher who happens to code. I am a philosopher who has spent years learning to see the gaps in systems, in workflows, in institutions, in people — and to close them with precision.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              The Greeks had a word for this. <em className="display-italic text-gold">Phronesis</em> — practical wisdom, the virtue of perceiving the right action in the right moment. It is not theory. It is not technique. It is the trained capacity to look at a messy reality and see what is missing.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              Every business has a gap. Every school has a gap. Every institution carries one. The question is whether you have someone who can see it, name it, and close it without leaving a worse mess behind.
            </p>
          </Reveal>

          {/* Three pillars */}
          <div className="md:col-span-7">
            <Stagger gap={0.18} className="space-y-12">
              {PILLARS.map((p) => (
                <FadeUp key={p.n}>
                  <div className="flex gap-6 md:gap-8">
                    <div
                      className="display-italic text-gold text-3xl md:text-4xl flex-shrink-0 w-12 md:w-16 leading-none"
                    >
                      {p.n}
                    </div>
                    <div>
                      <h3
                        className="display text-cream text-2xl md:text-3xl mb-3"
                      >
                        {p.title}
                      </h3>
                      <p className="text-sm md:text-base text-cream/75 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
