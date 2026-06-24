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

      {/* Full-bleed content */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-32 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          className="w-full"
        >
          {/* The eagle as centerpiece — gold, heraldic, leading the page */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.85 },
              visible: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE } },
            }}
            className="flex items-center gap-5 mb-8"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
              className="h-px w-16 bg-gradient-to-r from-transparent via-teal to-teal"
              style={{ transformOrigin: "left" }}
            />
            <img
              src="/logo-eagle.png"
              alt=""
              aria-hidden
              className="h-[clamp(4rem,9vw,7rem)] w-auto"
              style={{ filter: "drop-shadow(0 2px 8px rgba(180, 141, 60, 0.18))" }}
            />
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.6 }}
              className="h-px w-16 bg-gradient-to-l from-transparent via-teal to-teal hidden sm:block"
              style={{ transformOrigin: "right" }}
            />
          </motion.div>

          {/* Studio name in small caps, refined */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.2 } },
            }}
            className="mb-6"
          >
            <p
              className="text-[clamp(0.95rem,1.4vw,1.15rem)] text-ink-soft tracking-[0.4em] uppercase"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
            >
              Studio of Phronesis
            </p>
          </motion.div>

          {/* The name — large but no longer dominant */}
          <h1
            className="display text-ink perspective-1000"
            style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", lineHeight: 0.95 }}
          >
            {isRTL ? (
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
                style={{ display: "inline-block" }}
              >
                {t("name")}
              </motion.span>
            ) : (
              <TextReveal text={t("name")} delay={0.6} stagger={0.05} />
            )}
          </h1>

          {/* Aphoristic subtitle — italic, teal, sets the philosophical tone */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.1 } },
            }}
            className="mt-8 lg:mt-10 max-w-3xl"
          >
            <p
              className="display-italic text-teal text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.15]"
            >
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Eyebrow + body in a two-column split (asymmetric, editorial) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-12 lg:mt-16">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px w-8 bg-teal/60" />
                <span className="eyebrow">{t("eyebrow")}</span>
              </div>
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
                {t("body")}
              </p>

              {/* Single CTA — a threshold, not a sales pitch */}
              <div className="mt-10">
                <Magnetic strength={0.4}>
                  <a
                    href="/correspondence"
                    className="group inline-flex items-center gap-3 bg-teal hover:bg-teal-bright text-paper font-medium px-7 py-4 rounded-full transition-all duration-300 glow-teal"
                  >
                    {t("ctaPrimary")}
                    <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
              </div>
            </motion.div>

            {/* Right column: Greek motto + scholarly convention */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.15 } },
              }}
              className="lg:col-span-5 lg:col-start-8"
            >
              <div className="border-l-2 border-gold/40 pl-6 py-2">
                <p
                  className="text-[clamp(1.4rem,2.4vw,2rem)] text-gold leading-tight mb-2"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                  aria-label="Phronesis — practical wisdom"
                >
                  ΦΡΟΝΗΣΙΣ
                </p>
                <p className="text-xs text-ink-dim body-serif-italic leading-relaxed">
                  Greek: practical wisdom — the virtue of perceiving the right
                  action in the right moment. Aristotle, <em>Nicomachean Ethics</em>, Book VI.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar — scholarly convention: established year + location */}
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
          <div className="text-[10px] text-ink-dim uppercase tracking-[0.3em] font-mono">
            EST. MMXXIV · {t("location")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
