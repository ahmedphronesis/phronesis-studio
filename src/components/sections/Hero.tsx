"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Magnetic, TextReveal, EASE } from "../anim";
import { MeshBackground } from "../MeshBackground";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grain"
    >
      {/* Animated mesh gradient background — full bleed */}
      <MeshBackground />

      {/* Massive decorative Φ, full-bleed right side */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85, x: 100 }}
        animate={{ opacity: 0.05, scale: 1, x: 0 }}
        transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        className="absolute right-[-12%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "min(70vw, 60rem)",
          lineHeight: 0.85,
          color: "var(--gold)",
        }}
      >
        Φ
      </motion.div>

      {/* Full-bleed content — no max-width container */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-32 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
          className="w-full"
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
            className="flex items-center gap-4 mb-10"
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

          {/* Massive name — fills width on desktop */}
          <h1
            className="display text-cream perspective-1000"
            style={{ fontSize: "clamp(4rem, 14vw, 13rem)", lineHeight: 0.9 }}
          >
            <TextReveal text="Ahmed Ali" delay={0.6} stagger={0.06} />
          </h1>

          {/* Two-column split — subtitle left, body right (asymmetric) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-8 lg:mt-12">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="lg:col-span-5"
            >
              <p className="display-italic text-gold text-[clamp(1.5rem,3.6vw,2.8rem)] leading-[1.1]">
                I build systems, shape minds, and lead teams.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="lg:col-span-6 lg:col-start-7"
            >
              <p className="text-base md:text-lg text-cream/85 leading-relaxed">
                Aristotle called it <em className="text-gold not-italic" style={{ fontStyle: "italic", fontFamily: "var(--font-cormorant)" }}>phronesis</em>: the practical wisdom to perceive the gap between what is and what should be, and close it well. I bring that discipline to three crafts. In education, I teach and design learning systems. In software, I architect production platforms for schools, businesses, and institutions. In leadership, I help operations and teams run with precision. Each is available as a custom engagement, a structured consultation, or focused tutoring.
              </p>

              {/* CTAs — magnetic */}
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Magnetic strength={0.5}>
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-bright text-charcoal-darkest font-medium px-7 py-4 rounded-full transition-all duration-300 glow-gold"
                  >
                    Begin a conversation
                    <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
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
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar — full width */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.8 }}
          className="absolute bottom-10 left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
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
