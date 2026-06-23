"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Thesis() {
  const t = useTranslations("thesis");

  const pillars = [
    { n: "I", title: t("pillar1Title"), body: t("pillar1Body") },
    { n: "II", title: t("pillar2Title"), body: t("pillar2Body") },
    { n: "III", title: t("pillar3Title"), body: t("pillar3Body") },
  ];

  // Get the lead segments for colored rendering
  // Falls back to plain text if segments aren't available (non-English locales)
  let leadSegments: { text: string; color: string }[] | null = null;
  try {
    leadSegments = t.raw("leadSegments") as { text: string; color: string }[];
  } catch {
    leadSegments = null;
  }

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
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p
            className="display text-ink leading-[1.3] body-serif-italic"
            style={{ fontSize: "clamp(1.6rem, 3.8vw, 3.2rem)", maxWidth: "100%" }}
          >
            {leadSegments ? (
              leadSegments.map((seg, i) => {
                if (seg.text.includes("\n")) {
                  // Handle newlines
                  const parts = seg.text.split("\n");
                  return (
                    <span key={i}>
                      {parts.map((part, j) => (
                        <span key={j}>
                          {part && (
                            <span style={{
                              color: seg.color === "gold" ? "var(--gold)" : seg.color === "teal" ? "var(--teal)" : "inherit",
                              fontStyle: seg.color === "gold" || seg.color === "teal" ? "normal" : "italic",
                              fontFamily: seg.color === "gold" || seg.color === "teal" ? "var(--font-cormorant)" : "inherit",
                            }}>
                              {part}
                            </span>
                          )}
                          {j < parts.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  );
                }
                return (
                  <span
                    key={i}
                    style={{
                      color: seg.color === "gold" ? "var(--gold)" : seg.color === "teal" ? "var(--teal)" : "inherit",
                      fontStyle: seg.color === "gold" || seg.color === "teal" ? "normal" : "italic",
                      fontFamily: seg.color === "gold" || seg.color === "teal" ? "var(--font-cormorant)" : "inherit",
                    }}
                  >
                    {seg.text}
                  </span>
                );
              })
            ) : (
              t("lead")
            )}
          </p>
        </Reveal>

        <div className="gold-rule my-20" />

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
