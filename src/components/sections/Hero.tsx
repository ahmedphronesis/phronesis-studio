"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Magnetic, Parallax, TextReveal, EASE } from "../anim";
import { MeshBackground } from "../MeshBackground";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grain"
    >
      {/* Animated mesh gradient background */}
      <MeshBackground />

      {/* Decorative serif Φ in background — parallax on scroll */}
      <Parallax speed={0.15} className="absolute right-[-8%] top-[10%] hidden lg:block pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "44rem",
            lineHeight: 1,
            color: "var(--gold)",
          }}
        >
          Φ
        </motion.div>
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full pt-32 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
          className="max-w-5xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="flex items-center gap-4 mb-12"
          >
            <motion.span
              className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
            <span className="eyebrow">Educator · Systems Architect · Leadership Professional</span>
          </motion.div>

          {/* Name with letter-by-letter reveal */}
          <h1 className="display text-cream text-[clamp(3.5rem,11vw,9rem)] perspective-1000">
            <TextReveal text="Ahmed Ali" delay={0.6} stagger={0.06} />
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="display-italic text-gold text-[clamp(1.5rem,3.6vw,2.6rem)] mt-3"
          >
            I build systems, shape minds, and lead teams.
          </motion.p>

          {/* Body */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-cream/85 leading-relaxed"
          >
            Aristotle called it <em className="text-gold not-italic" style={{ fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>phronesis</em>: the practical wisdom to perceive the gap between what is and what should be, and close it well. I bring that discipline to three crafts. In education, I teach and design learning systems. In software, I architect production platforms for schools, businesses, and institutions. In leadership, I help operations and teams run with precision. Each is available as a custom engagement, a structured consultation, or focused tutoring.
          </motion.p>

          {/* CTAs — magnetic */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 22 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
            }}
            className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          >
            <Magnetic strength={0.5}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-bright text-charcoal-darkest font-medium px-7 py-4 rounded-full transition-all duration-300 glow-gold"
              >
                Begin a conversation
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href="#work"
                className="link-underline inline-flex items-center gap-2 text-cream hover:text-gold transition-colors text-base px-3 py-2"
              >
                See selected work
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Footnote row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.8 }}
          className="absolute bottom-10 left-6 lg:left-10 right-6 lg:right-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="flex items-start gap-3 max-w-sm">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={16} className="text-gold mt-1" />
            </motion.div>
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
