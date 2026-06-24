"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Magnetic, TextReveal, EASE } from "../anim";
import { MeshBackground } from "../MeshBackground";

// Arabic is the only RTL locale in this build.
// Letter-by-letter TextReveal breaks Arabic character connections,
// so we fall back to a single fade for RTL.
export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Animated mesh gradient background — paper-warm tones */}
      <MeshBackground />

      {/* Massive decorative Φ, full-bleed right side */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85, x: 100 }}
        animate={{ opacity: 0.06, scale: 1, x: 0 }}
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

      {/* Full-bleed content */}
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
              className="h-px w-12 bg-gradient-to-r from-transparent via-teal to-teal"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </motion.div>

          {/* Massive name — fills width on desktop */}
          <h1
            className="display text-ink perspective-1000"
            style={{ fontSize: "clamp(4rem, 14vw, 13rem)", lineHeight: 0.9 }}
          >
            {isRTL ? (
              // For RTL languages (Arabic, Persian), don't split letters — it breaks character connection
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                style={{ display: "inline-block" }}
              >
                {t("name")}
              </motion.span>
            ) : (
              <TextReveal text={t("name")} delay={0.6} stagger={0.06} />
            )}
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
              <p className="display-italic text-teal text-[clamp(1.5rem,3.6vw,2.8rem)] leading-[1.1]">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="lg:col-span-6 lg:col-start-7"
            >
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
                {t("body")}
              </p>

              {/* CTAs — magnetic */}
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Magnetic strength={0.5}>
                  <a
                    href="/correspondence"
                    className="group inline-flex items-center gap-3 bg-teal hover:bg-teal-bright text-paper font-medium px-7 py-4 rounded-full transition-all duration-300 glow-teal"
                  >
                    {t("ctaPrimary")}
                    <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="/work"
                    className="link-underline inline-flex items-center gap-2 text-ink hover:text-teal transition-colors text-base px-3 py-2"
                  >
                    {t("ctaSecondary")}
                    <ArrowUpRight size={16} />
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
              <ArrowDown size={16} className="text-teal mt-1" />
            </motion.div>
            <p className="text-xs text-ink-dim leading-relaxed body-serif-italic">
              {t("footnote")}
            </p>
          </div>
          <div className="text-xs text-ink-dim uppercase tracking-[0.25em] font-mono">
            {t("location")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
