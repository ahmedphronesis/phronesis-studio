"use client";

import { Reveal, Stagger, FadeUp } from "../anim";

const PILLARS = [
  {
    n: "I",
    title: "Perceive the gap",
    body: "Before any build, any class, any consultation, I sit with the situation until I see what others have stopped noticing. The spreadsheet nobody trusts. The lesson that never lands. The team that works hard without a system to compound its effort. The gap is always there. Most professionals never look for it.",
  },
  {
    n: "II",
    title: "Diagnose with rigor",
    body: "A gap is not a request. I map the actors, the incentives, the failure modes, the compliance envelope, the data flows. I refuse to act on a misdiagnosis. The philosopher's discipline applied to a classroom, a codebase, or an operation's anatomy.",
  },
  {
    n: "III",
    title: "Close with precision",
    body: "The right system, the right curriculum, the right operating cadence. Shipped in weeks, not quarters. Production-grade from day one. Built to outlive the engagement, and to strengthen the institution that commissioned it.",
  },
];

export function Thesis() {
  return (
    <section id="thesis" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Eyebrow */}
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-12 bg-brass/60" />
            <span className="eyebrow">The Thesis</span>
          </div>
        </Reveal>

        {/* Lead statement — replaces the deleted "Most builders ask..." paragraph */}
        <Reveal delay={0.05}>
          <p
            className="display text-cream text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.15] max-w-5xl"
          >
            Every institution carries a gap. A school that teaches well but records poorly. A business that serves customers but bleeds quietly to invisible leaks. A team that works hard without a system to compound its effort. The gap is always there. The question is whether you have someone who can see it, name it, and close it without leaving a worse mess behind.
          </p>
        </Reveal>

        <div className="gold-rule my-20" />

        {/* Two-column body */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          <Reveal className="md:col-span-5" delay={0.05}>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed">
              I am not a developer who happens to teach, nor a teacher who happens to code. I am a philosopher who has spent years learning to see gaps in systems, in workflows, in classrooms, in people, and to close them with precision.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              The Greeks had a word for this. <em className="display-italic text-brass">Phronesis</em>: practical wisdom, the virtue of perceiving the right action in the right moment. It is not theory. It is not technique. It is the trained capacity to look at a messy reality and see what is missing.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              I work across three disciplines. Education, where I teach and build learning platforms. Software, where I ship production systems for real clients. Leadership and operations, where I help teams and processes run with intent. Each engagement is shaped to the gap at hand.
            </p>
          </Reveal>

          {/* Three pillars */}
          <div className="md:col-span-7">
            <Stagger gap={0.18} className="space-y-12">
              {PILLARS.map((p) => (
                <FadeUp key={p.n}>
                  <div className="flex gap-6 md:gap-8">
                    <div
                      className="display-italic text-brass text-3xl md:text-4xl flex-shrink-0 w-12 md:w-16 leading-none"
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
