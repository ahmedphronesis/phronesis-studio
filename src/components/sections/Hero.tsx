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
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201, 163, 92, 0.10), transparent 70%)",
        }}
      />

      {/* Decorative serif Φ in background */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2.4, ease: EASE, delay: 0.2 }}
        className="absolute right-[-8%] top-[12%] hidden lg:block pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "44rem",
          lineHeight: 1,
          color: "var(--gold)",
        }}
      >
        Φ
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full pt-32 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          className="max-w-5xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Studio of Phronesis · Est. 2026</span>
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

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="display-italic text-gold text-[clamp(1.5rem,3.6vw,2.6rem)] mt-2"
          >
            A philosopher who builds systems.
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-cream/85 leading-relaxed"
          >
            Aristotle called it <em className="text-gold not-italic" style={{ fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>phronesis</em> — the practical wisdom to perceive the gap between what-is and what-should-be, then close it with precision. I build software the same way: I see the gap inside your business, your school, your system. Then I close it.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-bright text-charcoal-dark font-medium px-7 py-4 rounded-full transition-all duration-300"
            >
              Begin a conversation
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#work"
              className="link-underline inline-flex items-center gap-2 text-cream hover:text-gold transition-colors text-base"
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
            <ArrowDown size={16} className="text-gold mt-1 animate-pulse" />
            <p className="text-xs text-cream-dim leading-relaxed">
              Four production-grade platforms live. Property management, educational systems, diplomatic training, and a philosophy podcast — built alone, deployed, in use.
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
