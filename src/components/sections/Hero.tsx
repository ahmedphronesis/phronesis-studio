"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grain"
    >
      {/* Ambient gold glow — richer, warmer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(214, 175, 100, 0.14), transparent 70%)",
        }}
      />

      {/* Slowly drifting gradient layer — adds life without distraction */}
      <motion.div
        aria-hidden
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 80% 60%, rgba(214, 175, 100, 0.08), transparent 60%)",
        }}
      />

      {/* Decorative serif Φ in background */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE, delay: 0.2 }}
        className="absolute right-[-8%] top-[12%] hidden lg:block pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "44rem",
          lineHeight: 1,
          color: "var(--brass)",
        }}
      >
        Φ
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full pt-32 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          className="max-w-5xl"
        >
          {/* Eyebrow — no longer repeats the nav wordmark */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="flex items-center gap-4 mb-12"
          >
            <span className="h-px w-12 bg-brass/60" />
            <span className="eyebrow">Educator · Systems Architect · Leadership Professional</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
            }}
            className="display text-cream text-[clamp(3.5rem,11vw,9rem)]"
          >
            Ahmed Ali
          </motion.h1>

          {/* Subtitle — clear, marketing-friendly, multidisciplinary */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="display-italic text-brass text-[clamp(1.5rem,3.6vw,2.6rem)] mt-3"
          >
            I build systems, shape minds, and lead teams.
          </motion.p>

          {/* Body — phronesis intro, multidisciplinary, no em dashes */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-cream/85 leading-relaxed"
          >
            Aristotle called it <em className="text-brass not-italic" style={{ fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>phronesis</em>: the practical wisdom to perceive the gap between what is and what should be, and close it well. I bring that discipline to three crafts. In education, I teach and design learning systems. In software, I build production platforms for schools, businesses, and institutions. In leadership, I help operations and teams run with precision. Each is available as a custom engagement, a structured consultation, or focused tutoring.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-brass hover:bg-brass-bright text-charcoal-darkest font-medium px-7 py-4 rounded-full transition-all duration-300"
            >
              Begin a conversation
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#work"
              className="link-underline inline-flex items-center gap-2 text-cream hover:text-brass transition-colors text-base"
            >
              See selected work
            </a>
          </motion.div>
        </motion.div>

        {/* Footnote row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.6 }}
          className="absolute bottom-10 left-6 lg:left-10 right-6 lg:right-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="flex items-start gap-3 max-w-sm">
            <ArrowDown size={16} className="text-brass mt-1 animate-pulse" />
            <p className="text-xs text-cream-dim leading-relaxed">
              Four production platforms live. A decade across classrooms, operations, and code. Available for selective engagements.
            </p>
          </div>
          <div className="text-xs text-cream-dim uppercase tracking-[0.25em]">
            Al Ain · UAE
          </div>
        </motion.div>
      </div>
    </section>
  );
}
