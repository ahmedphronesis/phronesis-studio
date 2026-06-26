"use client";

import { Reveal, Stagger, FadeUp, Magnetic } from "../anim";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, BookOpen, Sparkles } from "lucide-react";

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

export function Library() {
  const t = useTranslations("library");
  const tCommon = useTranslations("nav");

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
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
      </div>

      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
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
                    <h3 className="display text-ink text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>{g.grade}</h3>
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
