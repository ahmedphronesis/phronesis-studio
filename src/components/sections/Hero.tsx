"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
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
      className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Animated mesh gradient background — paper-warm tones */}
      <MeshBackground />

      {/* Large semi-transparent eagle filling the right side — animated, ghostly */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9, x: 60 }}
        animate={{ opacity: 0.12, scale: 1, x: 0 }}
        transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        className="absolute right-[-8%] top-1/2 -translate-y-1/2 block pointer-events-none select-none"
      >
        <motion.img
          src="/logo-eagle.png"
          alt=""
          className="w-[clamp(16rem,42vw,52rem)] h-auto"
          style={{
            filter: "drop-shadow(0 8px 32px rgba(180, 141, 60, 0.18))",
          }}
          animate={{
            y: [0, -16, 0],
            rotate: [0, 1.5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Full-bleed content — extra bottom padding to clear the absolute footnote bar */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 pb-44 md:pb-52">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
          className="w-full"
        >
          {/* Small eyebrow rule — no duplicate eagle or studio name (Nav handles that) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.4 }}
              className="h-px w-16 bg-gradient-to-r from-transparent via-teal to-teal"
              style={{ transformOrigin: "left" }}
            />
            <span className="eyebrow">{t("eyebrow")}</span>
          </motion.div>

          {/* The name — large, leading the page */}
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
              className="display-italic text-teal text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.2]"
            >
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Two-column split — body left, Greek motto right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-12 lg:mt-8">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="lg:col-span-7"
            >
              <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
                {t("body").split("\n\n").map((para, i, arr) => (
                  <span key={i}>
                    {para}
                    {i < arr.length - 1 && <><br /><br /></>}
                  </span>
                ))}
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
              className="lg:col-span-5"
            >
              <div className="border-l-2 border-gold/40 pl-6 py-2">
                <p
                  className="text-[clamp(1.4rem,2.4vw,2rem)] text-gold leading-tight mb-2"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400 }}
                  aria-label="Phronesis: practical wisdom"
                >
                  {t("mottoWord")}
                  {t("mottoTransliteration") && (
                    <span
                      className="text-[0.6em] text-gold/70 ml-2"
                      style={{ fontFamily: "var(--font-amiri)", fontWeight: 400 }}
                    >
                      {t("mottoTransliteration")}
                    </span>
                  )}
                </p>
                <p className="text-xs text-ink-dim body-serif-italic leading-relaxed">
                  {t("mottoDescription")}
                </p>
                <p
                  className="text-[10px] uppercase tracking-[0.2em] text-gold/60 mt-3 font-mono"
                  dir="ltr"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  {t("mottoSource")}
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
