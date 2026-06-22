"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { motion } from "framer-motion";

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
    <section id="thesis" className="relative py-32 md:py-44 overflow-hidden">
      {/* Full-bleed background tint */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(15, 92, 94, 0.10), transparent 70%)",
        }}
      />

      {/* Full-bleed content */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Thesis</span>
          </div>
        </Reveal>

        {/* Massive lead statement — fills width */}
        <Reveal delay={0.05}>
          <p
            className="display text-cream leading-[1.1]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", maxWidth: "100%" }}
          >
            Every institution carries a gap. A school that teaches well but records poorly. A business that serves customers but bleeds quietly to invisible leaks. A team that works hard without a system to compound its effort. The gap is always there. The question is whether you have someone who can see it, name it, and close it without leaving a worse mess behind.
          </p>
        </Reveal>

        <div className="gold-rule my-20" />

        {/* Asymmetric 5/7 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-5" delay={0.05}>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed">
              I am not a developer who happens to teach, nor a teacher who happens to code. I am a philosopher who has spent years learning to see gaps in systems, in workflows, in classrooms, in people, and to close them with precision.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              The Greeks had a word for this. <em className="display-italic text-gold">Phronesis</em>: practical wisdom, the virtue of perceiving the right action in the right moment. It is not theory. It is not technique. It is the trained capacity to look at a messy reality and see what is missing.
            </p>
            <p className="text-base md:text-lg text-cream/85 leading-relaxed mt-6">
              I work across three disciplines. Education, where I teach and build learning platforms. Software, where I ship production systems for real clients. Leadership and operations, where I help teams and processes run with intent. Each engagement is shaped to the gap at hand.
            </p>
          </Reveal>

          {/* Three pillars — full-width stack on the right */}
          <div className="lg:col-span-7">
            <Stagger gap={0.18} className="space-y-12">
              {PILLARS.map((p) => (
                <FadeUp key={p.n}>
                  <motion.div
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-6 md:gap-10"
                  >
                    <div className="display-italic text-gold text-5xl md:text-7xl flex-shrink-0 w-16 md:w-24 leading-none">
                      {p.n}
                    </div>
                    <div className="flex-1">
                      <h3 className="display text-cream text-3xl md:text-5xl mb-4">
                        {p.title}
                      </h3>
                      <p className="text-sm md:text-base text-cream/75 leading-relaxed max-w-2xl">
                        {p.body}
                      </p>
                    </div>
                  </motion.div>
                </FadeUp>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
