"use client";

import { Reveal, Stagger, FadeUp, Magnetic } from "../anim";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { SUBJECTS } from "@/lib/library-subjects";

export function Library() {
  const t = useTranslations("library");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section id="library" className="relative overflow-hidden bg-paper-warm/40">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(180, 141, 60, 0.08), transparent 70%)" }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-8 md:pb-12">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("title")}{" "}<br className="br-rtl-hide" />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-4" delay={0.1}>
            <div className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
              {renderIntro(t("intro"), isRTL)}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Subject categories — each card links to /library/[subject] */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-5 font-mono">{t("subjectsLabel")}</p>
        </Reveal>
        <Stagger gap={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SUBJECTS.map((subject) => {
            const name = t(subject.key);
            const desc = t(`${subject.key}Desc`);
            const isLive = subject.live;
            const href = `/${locale}/library/${subject.slug}`;

            return (
              <FadeUp key={subject.slug}>
                <a
                  href={href}
                  className={`group block h-full rounded-2xl border transition-all overflow-hidden ${
                    isLive
                      ? "bg-paper border-teal/30 hover:border-teal/50 hover:shadow-lg"
                      : "bg-paper-warm/50 border-border hover:border-teal/30 hover:bg-paper"
                  }`}
                >
                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isLive ? "bg-teal/10 border border-teal/30 text-teal" : "bg-ink-dim/5 border border-border text-ink-dim/40"
                      }`}>
                        <BookOpen size={20} strokeWidth={1.5} />
                      </div>
                      <span className={`text-[10px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 rounded-full ${
                        isLive ? "bg-teal/10 text-teal border border-teal/30" : "bg-ink-dim/5 text-ink-dim border border-border"
                      }`}>
                        {isLive ? t("liveLabel") : t("forthcomingLabel")}
                      </span>
                    </div>
                    <h3 className="display text-ink text-xl md:text-2xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {name}
                    </h3>
                    <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed mb-4">
                      {desc}
                    </p>
                    <div className="flex items-center gap-2 text-xs pt-3 border-t border-border">
                      {isLive ? (
                        <>
                          <span className="text-teal font-mono">{4}</span>
                          <span className="text-teal">{t("guidesAvailable")}</span>
                          {!isRTL && <ArrowRight size={14} className="ml-auto text-teal group-hover:translate-x-1 transition-transform" />}
                          {isRTL && <ArrowLeft size={14} className="mr-auto text-teal group-hover:-translate-x-1 transition-transform" />}
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} className="text-ink-dim/40" />
                          <span className="text-ink-dim/60">{t("comingSoonGeneric")}</span>
                          {!isRTL && <ArrowRight size={14} className="ml-auto text-ink-dim/40 group-hover:text-teal group-hover:translate-x-1 transition-all" />}
                          {isRTL && <ArrowLeft size={14} className="mr-auto text-ink-dim/40 group-hover:text-teal group-hover:-translate-x-1 transition-all" />}
                        </>
                      )}
                    </div>
                  </div>
                </a>
              </FadeUp>
            );
          })}
        </Stagger>

        {/* Philosophy note */}
        <Reveal delay={0.15} className="mt-6">
          <div className="flex items-start gap-3 text-xs text-ink-dim body-serif italic max-w-2xl">
            <span className="text-gold/60 mt-0.5">* </span>
            <p>{t("philosophyNote")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Render the Library intro text with:
 *   - Paragraph breaks (split on \n\n)
 *   - Scholar name highlighting: [[Name]] markers are rendered in gold,
 *     italic, Cormorant Garamond (English) or gold + Amiri (Arabic).
 *     This gives the scholar names a gilded, manuscript-quality appearance
 *     matching the scholarly aesthetic of the site.
 */
function renderIntro(text: string, isRTL: boolean) {
  const paragraphs = text.split("\n\n");
  return paragraphs.map((para, i) => {
    // Split by [[...]] markers and render scholar names in gold italic
    const parts = para.split(/(\[\[[^\]]+\]\])/g);
    const rendered = parts.map((part, j) => {
      const match = part.match(/^\[\[([^\]]+)\]\]$/);
      if (match) {
        // Scholar name — render in gold, italic, display font
        const name = match[1];
        if (isRTL) {
          // Arabic: gold, Amiri font (Arabic doesn't use italic)
          return (
            <span
              key={j}
              className="text-gold"
              style={{ fontFamily: "var(--font-amiri)", fontWeight: 700 }}
            >
              {name}
            </span>
          );
        }
        // English: gold, italic, Cormorant Garamond
        return (
          <span
            key={j}
            className="text-gold italic"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
          >
            {name}
          </span>
        );
      }
      return part;
    });

    return (
      <p key={i} className={i > 0 ? "mt-4" : undefined}>
        {rendered}
      </p>
    );
  });
}
