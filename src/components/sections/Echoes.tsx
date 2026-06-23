"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Reveal, FadeUp, EASE } from "../anim";
import { Headphones, X, Globe } from "lucide-react";

type Episode = {
  number: number;
  en_title: string;
  ar_title: string;
  en_excerpt: string;
  ar_excerpt: string;
  en_full: string;
  ar_full: string;
};

export function Echoes() {
  const t = useTranslations("echoes");
  const locale = useLocale();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selected, setSelected] = useState<Episode | null>(null);
  const [viewLang, setViewLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    fetch("/echoes-data.json")
      .then((r) => r.json())
      .then((d) => setEpisodes(d))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (locale === "ar" || locale === "fa") {
      setViewLang("ar");
    }
  }, [locale]);

  return (
    <section id="echoes" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(15, 92, 94, 0.06), transparent 70%)" }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-16">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("title")}<br />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>

        {/* Project showcase: Echoes of Wisdom */}
        <Reveal delay={0.15}>
          <div className="p-8 md:p-12 rounded-3xl bg-paper-warm border border-border overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Project identity */}
              <div className="lg:col-span-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-3 font-mono">
                  {t("project1Tagline")}
                </p>
                <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02] mb-3">
                  {t("project1Name")}
                </h3>
                <p
                  className="display text-gold text-2xl md:text-4xl mb-6"
                  style={{ fontFamily: "var(--font-amiri)", direction: "rtl" }}
                >
                  {t("project1NameArabic")}
                </p>
                <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed mb-6">
                  {t("project1Description")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-xs uppercase tracking-wider text-ink-dim border border-border rounded-full px-3 py-1.5 font-mono">
                    {t("project1Season")}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-ink-dim border border-border rounded-full px-3 py-1.5 font-mono">
                    {t("project1Episodes")}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-teal border border-teal/30 rounded-full px-3 py-1.5 font-mono">
                    Bilingual EN / AR
                  </span>
                </div>
              </div>

              {/* Right: Arabic tagline + decorative */}
              <div className="lg:col-span-7 lg:col-start-7 flex items-center justify-center">
                <div className="text-center">
                  <p
                    className="display text-teal/30 text-6xl md:text-8xl lg:text-9xl leading-none mb-4"
                    style={{ fontFamily: "var(--font-amiri)", direction: "rtl" }}
                  >
                    {t("project1TaglineArabic")}
                  </p>
                  <p className="display-italic text-ink-dim text-lg md:text-xl">
                    {t("project1Tagline")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Episode grid */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <Reveal>
          <h3 className="display text-ink text-2xl md:text-3xl mb-10">
            {t("project1Season")} · {t("project1Episodes")}
          </h3>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {episodes.map((ep, i) => (
            <FadeUp key={ep.number} delay={i * 0.06}>
              <motion.button
                onClick={() => setSelected(ep)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="group w-full text-left p-6 rounded-2xl bg-paper border border-border hover:border-teal/40 transition-colors h-full flex flex-col"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span className="display text-teal/40 text-5xl leading-none">
                    {String(ep.number).padStart(2, "0")}
                  </span>
                  <Headphones size={18} className="text-ink-dim group-hover:text-teal transition-colors" strokeWidth={1.5} />
                </div>

                <h3 className="display text-ink text-lg md:text-xl leading-tight mb-3">
                  {viewLang === "ar" ? ep.ar_title : ep.en_title}
                </h3>

                {viewLang === "ar" && (
                  <p className="display text-ink-dim text-base mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {ep.en_title}
                  </p>
                )}

                <p className={`body-serif text-xs text-ink-dim leading-relaxed flex-1 ${viewLang === "ar" ? "text-right" : ""}`} style={viewLang === "ar" ? { fontFamily: "var(--font-amiri)", direction: "rtl" } : {}}>
                  {(viewLang === "ar" ? ep.ar_excerpt : ep.en_excerpt).substring(0, 120)}...
                </p>

                <div className="mt-4 pt-3 border-t border-border/60">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">
                    {t("readEpisode")}
                  </span>
                </div>
              </motion.button>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Episode modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-charcoal-darkest/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="bg-paper rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-md px-6 md:px-10 py-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="display text-teal text-3xl">{String(selected.number).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                      {t("project1Name")} · {t("episode")} {selected.number} · {t("project1Season")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewLang(viewLang === "en" ? "ar" : "en")}
                    className="inline-flex items-center gap-2 text-xs text-ink-soft hover:text-teal transition-colors px-3 py-2 rounded-full border border-border hover:border-teal/40"
                  >
                    <Globe size={14} strokeWidth={1.5} />
                    <span className="font-mono uppercase tracking-wider">
                      {viewLang === "en" ? "العربية" : "English"}
                    </span>
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-10 h-10 rounded-full border border-border hover:border-teal/40 flex items-center justify-center text-ink-soft hover:text-teal transition-colors"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="px-6 md:px-10 py-8 md:py-12">
                <div className="mb-8 pb-6 border-b border-border">
                  <h2 className="display text-ink text-3xl md:text-5xl leading-[1.1] mb-3">
                    {viewLang === "ar" ? selected.ar_title : selected.en_title}
                  </h2>
                  {viewLang === "ar" && (
                    <p className="display text-ink-dim text-xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {selected.en_title}
                    </p>
                  )}
                  {viewLang === "en" && (
                    <p className="display text-ink-dim text-xl" style={{ fontFamily: "var(--font-amiri)", direction: "rtl" }}>
                      {selected.ar_title}
                    </p>
                  )}
                  <p className="text-xs text-ink-dim body-serif mt-4">
                    {t("writtenBy")} · {t("project1Name")} · {t("project1Season")}
                  </p>
                </div>

                <div
                  className={`body-serif text-base md:text-lg text-ink-soft leading-[1.8] whitespace-pre-line ${viewLang === "ar" ? "text-right" : ""}`}
                  style={viewLang === "ar" ? { fontFamily: "var(--font-amiri)", direction: "rtl", fontSize: "1.25rem", lineHeight: 2 } : {}}
                >
                  {viewLang === "ar" ? selected.ar_full : selected.en_full}
                </div>

                <div className="mt-12 pt-8 border-t border-border flex items-center justify-center">
                  <button
                    onClick={() => setViewLang(viewLang === "en" ? "ar" : "en")}
                    className="inline-flex items-center gap-3 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-6 py-3 rounded-full font-medium"
                  >
                    <Globe size={16} strokeWidth={1.5} />
                    {viewLang === "en" ? t("readArabic") : t("readEnglish")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
