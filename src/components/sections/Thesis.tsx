"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Colored segments only for English — selective emphasis, not random
const EN_LEAD_SEGMENTS = [
  { text: "Every institution has a ", color: "default" },
  { text: "gap", color: "gold" },
  { text: " between what it is and what it could be.", color: "default" },
];

export function Thesis() {
  const t = useTranslations("thesis");
  const locale = useLocale();
  const isEnglish = locale === "en";

  const pillars = [
    { n: "I", title: t("pillar1Title"), body: t("pillar1Body") },
    { n: "II", title: t("pillar2Title"), body: t("pillar2Body") },
    { n: "III", title: t("pillar3Title"), body: t("pillar3Body") },
  ];

  // Parse the lead text into: opening, examples, closing
  const leadText = t("lead");
  const leadParts = leadText.split("\n\n");
  // leadParts[0] = opening sentence
  // leadParts[1] = school/business/team examples (3 lines)
  // leadParts[2] = closing paragraph
  const opening = leadParts[0] || "";
  const examples = (leadParts[1] || "").split("\n").filter((l) => l.trim());
  const closing = leadParts[2] || "";

  return (
    <section id="thesis" className="relative py-32 md:py-44 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(15, 92, 94, 0.06), transparent 70%)",
        }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-12">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        {/* Opening sentence — large, prominent, with breathing room */}
        <Reveal delay={0.05}>
          <p
            className="display text-ink leading-[1.4] mb-12 md:mb-16"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.4rem)" }}
          >
            {isEnglish ? (
              EN_LEAD_SEGMENTS.map((seg, i) => (
                <span
                  key={i}
                  style={{
                    color: seg.color === "gold" ? "var(--gold)" : "inherit",
                    fontStyle: seg.color === "gold" ? "normal" : "italic",
                    fontFamily: seg.color === "gold" ? "var(--font-cormorant)" : "inherit",
                  }}
                >
                  {seg.text}
                </span>
              ))
            ) : (
              <span className="display-italic">{opening}</span>
            )}
          </p>
        </Reveal>

        {/* Examples — indented, separated, more line height, distinct background */}
        <Reveal delay={0.1}>
          <div
            className="border-l-2 border-teal/30 pl-6 md:pl-10 py-2 mb-12 md:mb-16"
            style={{ marginLeft: "1rem" }}
          >
            <div className="space-y-6 md:space-y-8">
              {examples.map((example, i) => (
                <p
                  key={i}
                  className="body-serif text-base md:text-xl text-ink-soft leading-[1.9]"
                  style={locale === "ar" ? { fontFamily: "var(--font-amiri)", direction: "rtl", fontSize: "1.3rem", lineHeight: 2.2 } : {}}
                >
                  {example}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Closing paragraph — distinct, slightly different treatment */}
        <Reveal delay={0.15}>
          <div className="pt-8 border-t border-border/40">
            <p
              className="body-serif-italic text-ink leading-[1.9] max-w-3xl"
              style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
            >
              {closing}
            </p>
          </div>
        </Reveal>

        <div className="gold-rule my-20" />

        {/* Three pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-5" delay={0.05}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
              {t("body1")}
            </p>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mt-6">
              {t("body2")}
            </p>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mt-6">
              {t("body3")}
            </p>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger gap={0.18} className="space-y-12">
              {pillars.map((p) => (
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
                      <h3 className="display text-ink text-3xl md:text-5xl mb-4">
                        {p.title}
                      </h3>
                      <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed max-w-2xl">
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
