"use client";

import { useState } from "react";
import { Reveal, Stagger, FadeUp, Magnetic } from "../anim";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Download, BookOpen, Sparkles, ChevronDown } from "lucide-react";

type Guide = {
  grade: string;
  gradeArabic: string;
  cover: string;
  pdf: string;
  pages: number;
  units: number;
  modules: number;
  highlight: string;
};

const GUIDES: Guide[] = [
  { grade: "Grade 1", gradeArabic: "الصف الأول", cover: "/guides/grade-1-mathematics-cover.png", pdf: "/guides/grade-1-mathematics.pdf", pages: 21, units: 6, modules: 18, highlight: "Foundations" },
  { grade: "Grade 2", gradeArabic: "الصف الثاني", cover: "/guides/grade-2-mathematics-cover.png", pdf: "/guides/grade-2-mathematics.pdf", pages: 21, units: 7, modules: 22, highlight: "Real-Life Connections" },
  { grade: "Grade 3", gradeArabic: "الصف الثالث", cover: "/guides/grade-3-mathematics-cover.png", pdf: "/guides/grade-3-mathematics.pdf", pages: 27, units: 6, modules: 20, highlight: "Real-Life Applications" },
  { grade: "Grade 4", gradeArabic: "الصف الرابع", cover: "/guides/grade-4-mathematics-cover.png", pdf: "/guides/grade-4-mathematics.pdf", pages: 31, units: 7, modules: 21, highlight: "Real-Life Applications" },
];

// Subject categories for the Library.
// Mathematics is live with 4 guides; others are forthcoming.
// Philosophy is NOT included here because it has its own section (Echoes of Wisdom).
// Each card is expandable: click to reveal the guides/content inside.
type Subject = {
  key: string;
  live: boolean;
  guideCount?: number;
};

const SUBJECTS: Subject[] = [
  { key: "subjectMath", live: true, guideCount: 4 },
  { key: "subjectScience", live: false },
  { key: "subjectHistory", live: false },
  { key: "subjectLiterature", live: false },
  { key: "subjectAgriculture", live: false },
  { key: "subjectPermaculture", live: false },
  { key: "subjectPsychology", live: false },
  { key: "subjectTheology", live: false },
  { key: "subjectEconomics", live: false },
];

export function Library() {
  const t = useTranslations("library");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

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
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>
      </div>

      {/* Subject categories — expandable accordion cards */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-5 font-mono">{t("subjectsLabel")}</p>
        </Reveal>
        <Stagger gap={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SUBJECTS.map((subject) => {
            const name = t(subject.key);
            const desc = t(`${subject.key}Desc`);
            const isLive = subject.live;
            const isExpanded = expandedSubject === subject.key;
            const canExpand = isLive; // Only live subjects have content to show

            return (
              <FadeUp key={subject.key}>
                <div
                  className={`group rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? "bg-paper border-teal/50 shadow-lg"
                      : isLive
                        ? "bg-paper border-teal/30 hover:border-teal/50 cursor-pointer"
                        : "bg-paper-warm/50 border-border"
                  }`}
                  onClick={() => {
                    if (canExpand) {
                      setExpandedSubject(isExpanded ? null : subject.key);
                    }
                  }}
                  role={canExpand ? "button" : undefined}
                  tabIndex={canExpand ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (canExpand && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setExpandedSubject(isExpanded ? null : subject.key);
                    }
                  }}
                >
                  {/* Card header */}
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
                      {isLive && subject.guideCount ? (
                        <>
                          <span className="text-teal font-mono">{subject.guideCount}</span>
                          <span className="text-teal">{t("guidesAvailable")}</span>
                          <ChevronDown
                            size={14}
                            className={`ml-auto text-teal transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} className="text-ink-dim/40" />
                          <span className="text-ink-dim/60">{t("comingSoonGeneric")}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded content — appears INSIDE the card when clicked */}
                  <AnimatePresence>
                    {isExpanded && isLive && subject.key === "subjectMath" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-teal/20"
                      >
                        <div className="p-6 md:p-7 bg-paper-warm/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {GUIDES.map((g) => (
                              <a
                                key={g.grade}
                                href={g.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="group/guide flex gap-3 p-3 rounded-xl bg-paper border border-border hover:border-teal/50 transition-colors"
                              >
                                <div className="w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-paper-warm">
                                  <img
                                    src={g.cover}
                                    alt={`${g.grade} Mathematics cover`}
                                    className="w-full h-full object-cover group-hover/guide:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between mb-1">
                                    <span className="display text-ink text-base" style={{ fontFamily: "var(--font-cormorant)" }}>{g.grade}</span>
                                    <span className="text-[10px] text-ink-dim" style={{ fontFamily: "var(--font-amiri)" }} dir="rtl" lang="ar">{g.gradeArabic}</span>
                                  </div>
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2 font-mono">{g.highlight}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-ink-dim mb-2">
                                    <span>{g.pages} {t("pages")}</span>
                                    <span className="text-teal/40">·</span>
                                    <span>{g.units} {t("units")}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-teal group-hover/guide:text-teal-bright transition-colors">
                                    <Download size={11} />
                                    <span className="link-underline">{t("downloadPdf")}</span>
                                    <span className="text-[9px] text-ink-dim uppercase tracking-[0.15em] font-mono ml-auto">{t("free")}</span>
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                          {/* Grades 5-12 note inside the expanded card */}
                          <div className="mt-4 p-3 rounded-xl bg-teal/5 border border-teal/20 flex items-center gap-2.5">
                            <Sparkles size={14} className="text-teal flex-shrink-0" />
                            <p className="text-xs text-ink-soft body-serif">{t("comingSoonBody")}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

      {/* Request access banner (for forthcoming subjects) */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <Reveal delay={0.2} className="mt-4">
          <div className="relative p-8 md:p-10 rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/5 to-transparent overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, rgba(15, 92, 94, 0.4), transparent 70%)", filter: "blur(40px)" }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                  <BookOpen size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="display text-ink text-2xl md:text-3xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{t("requestAccess")}</h3>
                  <p className="body-serif text-sm text-ink-soft leading-relaxed max-w-2xl">{t("comingSoonBody")}</p>
                </div>
              </div>
              <Magnetic strength={0.3}>
                <a href="/correspondence" className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors whitespace-nowrap">
                  <BookOpen size={14} />
                  <span className="link-underline">{t("requestAccess")}</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
