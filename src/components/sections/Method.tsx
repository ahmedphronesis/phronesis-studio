"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Method() {
  const t = useTranslations("method");

  const steps = [
    { n: "01", title: t("step1Title"), subtitle: t("step1Subtitle"), body: t("step1Body"), question: t("step1Question"), duration: t("step1Duration") },
    { n: "02", title: t("step2Title"), subtitle: t("step2Subtitle"), body: t("step2Body"), question: t("step2Question"), duration: t("step2Duration") },
    { n: "03", title: t("step3Title"), subtitle: t("step3Subtitle"), body: t("step3Body"), question: t("step3Question"), duration: t("step3Duration") },
    { n: "04", title: t("step4Title"), subtitle: t("step4Subtitle"), body: t("step4Body"), question: t("step4Question"), duration: t("step4Duration") },
  ];

  return (
    <section id="method" className="relative py-32 md:py-44 overflow-hidden bg-paper-warm/40">
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("title")}<br className="br-rtl-hide" />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>

        <Stagger gap={0.16} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((s) => (
            <FadeUp key={s.n}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full p-6 md:p-7 rounded-2xl bg-paper border border-border hover:border-teal/40 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="display text-teal text-6xl md:text-7xl leading-none">{s.n}</span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ink-dim font-mono">{s.duration}</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-teal/70 mb-2 font-mono">{s.subtitle}</p>
                <h3 className="display text-ink text-3xl md:text-4xl mb-5">{s.title}</h3>
                <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed mb-7">{s.body}</p>
                <div className="pt-5 border-t border-border">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-ink-dim mb-2 font-mono">{t("theQuestion")}</p>
                  <p className="display-italic text-teal text-base leading-snug">{s.question}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
