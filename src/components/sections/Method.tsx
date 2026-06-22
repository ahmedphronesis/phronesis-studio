"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Perceive",
    subtitle: "The diagnostic",
    body: "We sit together. I watch how work actually happens, not how the SOP says it does. I ask the questions nobody has asked: why does this take three days? Why does nobody trust this number? Why are you paying for software that doesn't do the one thing you need? The gap reveals itself in the silence after each question.",
    question: "What is actually broken, that you have stopped noticing?",
    duration: "Day 1 to 3",
  },
  {
    n: "02",
    title: "Diagnose",
    subtitle: "The anatomy",
    body: "A gap is not a feature request. I map the actors, the incentives, the failure modes, the compliance envelope, the data flows. I write a one-page diagnosis you can take to your board. I refuse to build on a misdiagnosis. Most failed software projects die here, killed by builders who never diagnosed.",
    question: "What is the smallest system that closes this gap, and no more?",
    duration: "Day 4 to 7",
  },
  {
    n: "03",
    title: "Close",
    subtitle: "The build",
    body: "Production-grade from day one. Encrypted backups. Role-based access. Audit trails. Mobile-responsive. Multi-language when you need it. No 'we'll add that in v2'. If it's needed, it ships in v1. I work in two-week cycles so you see real software every fourteen days, not slideware.",
    question: "What can I ship in fourteen days that proves the diagnosis was right?",
    duration: "Day 8 to 21",
  },
  {
    n: "04",
    title: "Refine",
    subtitle: "The partnership",
    body: "Software that ships and is forgotten is software that decays. I stay, not as a vendor, as a partner. Annual license includes updates, security patches, and the next gap I notice before you do. The contract is structured so my incentives stay aligned with yours: I only win when the system keeps closing the gap.",
    question: "What is the next gap this system is now ready to absorb?",
    duration: "Year 1 and beyond",
  },
];

export function Method() {
  return (
    <section id="method" className="relative py-32 md:py-44 overflow-hidden bg-charcoal-dark/40">
      {/* Full-bleed content */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Method</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-24">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2
              className="display text-cream leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Phronesis,<br />
              <span className="display-italic text-gold">as a process.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-base md:text-lg text-cream/75 leading-relaxed">
              Four movements. The same discipline Aristotle described, applied to a system instead of a soul. None of the four can be skipped. Most builders skip the first two.
            </p>
          </Reveal>
        </div>

        {/* Full-width 4-column timeline on desktop */}
        <Stagger gap={0.16} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STEPS.map((s) => (
            <FadeUp key={s.n}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full p-6 md:p-7 rounded-2xl bg-charcoal-dark border border-border hover:border-gold/40 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="display text-gold text-6xl md:text-7xl leading-none">
                    {s.n}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                    {s.duration}
                  </span>
                </div>

                <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70 mb-2">
                  {s.subtitle}
                </p>
                <h3 className="display text-cream text-3xl md:text-4xl mb-5">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm text-cream/75 leading-relaxed mb-7">
                  {s.body}
                </p>

                <div className="pt-5 border-t border-border/60">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cream-dim mb-2">
                    The question
                  </p>
                  <p className="display-italic text-gold text-base leading-snug">
                    {s.question}
                  </p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
