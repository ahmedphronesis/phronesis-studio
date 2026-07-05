"use client";

import { Reveal, Stagger, FadeUp, Magnetic } from "../anim";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Download, BookOpen, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

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
// Mathematics is live; others are forthcoming.
// Philosophy is NOT included here because it has its own section (Echoes of Wisdom).
// Each forthcoming subject links to /correspondence so visitors can express interest.
type Subject = {
  key: string;
  live: boolean;
  guideCount?: number;
  href?: string;
};

const SUBJECTS: Subject[] = [
  { key: "subjectMath", live: true, guideCount: 4, href: "#mathematics-guides" },
  { key: "subjectScience", live: false },
  { key: "subjectAgriculture", live: false },
  { key: "subjectPermaculture", live: false },
  { key: "subjectPsychology", live: false },
  { key: "subjectTheology", live: false },
];

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
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>
      </div>

      {/* Subject categories grid */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-5 font-mono">{t("subjectsLabel")}</p>
        </Reveal>
        <Stagger gap={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SUBJECTS.map((subject) => {
            const name = t(subject.key);
            const desc = t(`${subject.key}Desc`);
            const isLive = subject.live;

            const content = (
              <div className={`group block h-full rounded-2xl border transition-colors overflow-hidden ${isLive ? "bg-paper border-teal/40 hover:border-teal/60 cursor-pointer" : "bg-paper-warm/50 border-border cursor-default"}`}>
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isLive ? "bg-teal/10 border border-teal/30 text-teal" : "bg-ink-dim/5 border border-border text-ink-dim/40"}`}>
                      <BookOpen size={20} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 rounded-full ${isLive ? "bg-teal/10 text-teal border border-teal/30" : "bg-ink-dim/5 text-ink-dim border border-border"}`}>
                      {isLive ? t("liveLabel") : t("forthcomingLabel")}
                    </span>
                  </div>
                  <h3 className="display text-ink text-xl md:text-2xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {name}
                  </h3>
                  <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed mb-4">
                    {desc}
                  </p>
                  {isLive && subject.guideCount && (
                    <div className="flex items-center gap-2 text-xs text-teal pt-3 border-t border-border">
                      <span className="font-mono">{subject.guideCount}</span>
                      <span>{t("guidesAvailable")}</span>
                      {!isRTL && <ArrowRight size={12} className="ml-auto group-hover:translate-x-1 transition-transform" />}
                      {isRTL && <ArrowLeft size={12} className="mr-auto group-hover:-translate-x-1 transition-transform" />}
                    </div>
                  )}
                  {!isLive && (
                    <div className="flex items-center gap-2 text-xs text-ink-dim/60 pt-3 border-t border-border">
                      <Sparkles size={12} />
                      <span>{t("comingSoonGeneric")}</span>
                    </div>
                  )}
                </div>
              </div>
            );

            if (isLive && subject.href) {
              return (
                <FadeUp key={subject.key}>
                  <a href={subject.href} onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("mathematics-guides")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    {content}
                  </a>
                </FadeUp>
              );
            }
            return (
              <FadeUp key={subject.key}>
                {content}
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

      {/* Mathematics guides (live) */}
      <div id="mathematics-guides" className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12 scroll-mt-20">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="display text-ink text-2xl md:text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              {t("subjectMath")}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono px-2.5 py-1 rounded-full bg-teal/10 border border-teal/30">
              {t("liveLabel")}
            </span>
          </div>
        </Reveal>
        <Stagger gap={0.14} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {GUIDES.map((g) => (
            <FadeUp key={g.grade}>
              <motion.a
                href={g.pdf}
                target="_blank"
                rel="noopener noreferrer"
                download
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group block h-full rounded-2xl bg-paper border border-border hover:border-teal/50 transition-colors overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-paper-warm">
                  <img
                    src={g.cover}
                    alt={`${g.grade} Mathematics cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-teal/90 text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <Download size={16} strokeWidth={2} />
                  </div>
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-paper/90 backdrop-blur-sm border border-teal/30">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">{g.highlight}</span>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="display text-ink text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>{g.grade}</h4>
                    <span className="text-sm text-ink-dim" style={{ fontFamily: "var(--font-amiri)" }} dir="rtl" lang="ar">{g.gradeArabic}</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-teal mb-3 font-mono">Mathematics</p>
                  <p className="body-serif text-[11px] text-ink-dim leading-relaxed mb-4">{t("subtitle")}</p>
                  <div className="flex items-center gap-3 text-[10px] text-ink-dim pt-3 border-t border-border">
                    <span>{g.pages} {t("pages")}</span>
                    <span className="text-teal/40">·</span>
                    <span>{g.units} {t("units")}</span>
                    <span className="text-teal/40">·</span>
                    <span>{g.modules} {t("modules")}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs text-teal group-hover:text-teal-bright transition-colors">
                      <Download size={12} />
                      <span className="link-underline">{t("downloadPdf")}</span>
                    </span>
                    <span className="text-[10px] text-ink-dim uppercase tracking-[0.18em] font-mono">{t("free")}</span>
                  </div>
                </div>
              </motion.a>
            </FadeUp>
          ))}
        </Stagger>
      </div>

      {/* Coming soon banner — Grades 5-12 for Mathematics */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <Reveal delay={0.2} className="mt-8">
          <div className="relative p-8 md:p-10 rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/5 to-transparent overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, rgba(15, 92, 94, 0.4), transparent 70%)", filter: "blur(40px)" }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="display text-ink text-2xl md:text-3xl mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{t("comingSoon")}</h3>
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
