"use client";

import { Reveal, Stagger, FadeUp } from "../anim";

const STEPS = [
  {
    n: "01",
    title: "Perceive",
    subtitle: "The diagnostic",
    body: "We sit together. I watch how work actually happens — not how the SOP says it does. I ask the questions nobody has asked: why does this take three days? Why does nobody trust this number? Why are you paying for software that doesn't do the one thing you need? The gap reveals itself in the silence after each question.",
    question: "What is actually broken, that you have stopped noticing?",
    duration: "Day 1 – 3",
  },
  {
    n: "02",
    title: "Diagnose",
    subtitle: "The anatomy",
    body: "A gap is not a feature request. I map the actors, the incentives, the failure modes, the compliance envelope, the data flows. I write a one-page diagnosis you can take to your board. I refuse to build on a misdiagnosis — most failed software projects die here, killed by builders who never diagnosed.",
    question: "What is the smallest system that closes this gap, and no more?",
    duration: "Day 4 – 7",
  },
  {
    n: "03",
    title: "Close",
    subtitle: "The build",
    body: "Production-grade from day one. Encrypted backups. Role-based access. Audit trails. Mobile-responsive. Multi-language when you need it. No 'we'll add that in v2' — if it's needed, it ships in v1. I work in two-week cycles so you see real software every fourteen days, not slideware.",
    question: "What can I ship in fourteen days that proves the diagnosis was right?",
    duration: "Day 8 – 21",
  },
  {
    n: "04",
    title: "Refine",
    subtitle: "The partnership",
    body: "Software that ships and is forgotten is software that decays. I stay — not as a vendor, as a partner. Annual license includes updates, security patches, and the next gap I notice before you do. The contract is structured so my incentives stay aligned with yours: I only win when the system keeps closing the gap.",
    question: "What is the next gap this system is now ready to absorb?",
    duration: "Year 1 and beyond",
  },
];

export function Method() {
  return (
    <section id="method" className="relative py-32 md:py-44 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Method</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.2rem,5vw,4rem)] max-w-4xl mb-6">
            Phronesis, as a process.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            Four movements. The same discipline Aristotle described — applied to a system instead of a soul. None of the four can be skipped. Most builders skip the first two.
          </p>
        </Reveal>

        {/* Timeline */}
        <div className="mt-24 relative">
          {/* Vertical line on the left for desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[7.5rem] top-4 bottom-4 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent"
          />

          <Stagger gap={0.18} className="space-y-16 md:space-y-24">
            {STEPS.map((s) => (
              <FadeUp key={s.n}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                  {/* Number + duration */}
                  <div className="md:col-span-3">
                    <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-2 relative">
                      {/* Dot on the timeline */}
                      <div
                        aria-hidden
                        className="hidden md:block absolute left-[-7.65rem] top-2 w-3 h-3 rounded-full bg-gold border-2 border-charcoal-dark"
                      />
                      <span
                        className="display text-gold text-5xl md:text-6xl leading-none"
                      >
                        {s.n}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim md:mt-3">
                        {s.duration}
                      </span>
                    </div>
                  </div>

                  {/* Title + body */}
                  <div className="md:col-span-9 md:pl-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-gold/70 mb-2">
                      {s.subtitle}
                    </p>
                    <h3 className="display text-cream text-3xl md:text-4xl mb-5">
                      {s.title}
                    </h3>
                    <p className="text-sm md:text-base text-cream/80 leading-relaxed max-w-2xl">
                      {s.body}
                    </p>

                    {/* Key question */}
                    <div className="mt-7 pl-5 border-l-2 border-gold/40">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-1">
                        The question that drives this step
                      </p>
                      <p className="display-italic text-gold text-lg md:text-xl">
                        {s.question}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
