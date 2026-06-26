"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Reveal, FadeUp, EASE } from "../anim";
import { Headphones, X, Globe, ArrowRight, ArrowLeft } from "lucide-react";

type Episode = {
  number: number;
  en_title: string;
  ar_title: string;
  en_excerpt: string;
  ar_excerpt: string;
  en_full: string;
  ar_full: string;
};

type Season = {
  id: string;
  name: string;
  nameArabic: string;
  tagline: string;
  taglineArabic: string;
  description: string;
  seasonLabel: string;
  episodesLabel: string;
  episodes: Episode[];
};

export function Echoes({ episodes }: { episodes: Episode[] }) {
  const t = useTranslations("echoes");
  const locale = useLocale();
  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const [selected, setSelected] = useState<Episode | null>(null);
  const [viewLang, setViewLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    if (locale === "ar") {
      setViewLang("ar");
    }
  }, [locale]);

  // Build seasons (currently only Season 1, structured for future expansion)
  const seasons: Season[] = [
    {
      id: "season-1",
      name: t("project1Name"),
      nameArabic: t("project1NameArabic"),
      tagline: t("project1Tagline"),
      taglineArabic: t("project1TaglineArabic"),
      description: t("project1Description"),
      seasonLabel: t("project1Season"),
      episodesLabel: t("project1Episodes"),
      episodes: episodes,
    },
  ];

  const currentSeason = seasons.find((s) => s.id === activeSeason);

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
              {t("title")}<br className="br-rtl-hide" />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>
      </div>

      {/* Season cards — clickable containers */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
          {seasons.map((season, i) => (
            <FadeUp key={season.id} delay={i * 0.1}>
              <motion.button
                onClick={() => setActiveSeason(season.id)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="group w-full text-left p-8 md:p-10 rounded-3xl bg-paper-warm border border-border hover:border-teal/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
                    <Headphones size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs uppercase tracking-wider text-ink-dim border border-border rounded-full px-3 py-1.5 font-mono">
                      {season.seasonLabel}
                    </span>
                  </div>
                </div>

                <h3 className="display text-ink text-3xl md:text-4xl leading-tight mb-2">
                  {season.name}
                </h3>
                <p
                  className="display text-gold text-xl md:text-2xl mb-4"
                  style={{ fontFamily: "var(--font-amiri)", direction: "rtl" }}
                >
                  {season.nameArabic}
                </p>
                <p className="display-italic text-ink-dim text-base mb-5">
                  {season.tagline}
                </p>
                <p className="body-serif text-sm text-ink-soft leading-relaxed mb-6">
                  {season.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div className="flex gap-2">
                    <span className="text-xs uppercase tracking-wider text-teal border border-teal/30 rounded-full px-3 py-1.5 font-mono">
                      {season.episodesLabel}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-ink-dim border border-border rounded-full px-3 py-1.5 font-mono">
                      Bilingual
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm text-teal group-hover:text-teal-bright transition-colors">
                    {t("readEpisode")}
                    {locale === "ar" ? (
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                </div>
              </motion.button>
            </FadeUp>
          ))}
        </div>

        {/* ── Separator: distinct visual break between Echoes seasons and
            the History of Philosophy project, so they never get mixed ── */}
        <div className="max-w-4xl mt-16 md:mt-20 mb-12 md:mb-16">
          <div className="flex items-center gap-6">
            <span className="h-px flex-1 bg-gold/30" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70 font-mono whitespace-nowrap">
              {t("separateProjectLabel")}
            </span>
            <span className="h-px flex-1 bg-gold/30" />
          </div>
        </div>

        {/* History of Philosophy — A to Z
            Separate project card (NOT an Echoes season).
            Always visible (no FadeUp/whileInView animation that could hide it).
            Distinct gold-themed design to differentiate from Echoes teal cards. */}
        <div className="max-w-4xl p-8 md:p-10 rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/8 to-transparent relative overflow-hidden">
          {/* Decorative background mark */}
          <div
            aria-hidden
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.04]"
            style={{ backgroundColor: "var(--gold)", transform: "translate(30%, -30%)" }}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <Globe size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs uppercase tracking-wider text-gold border border-gold/40 rounded-full px-3 py-1.5 font-mono bg-gold/5">
                {t("forthcomingStatus")}
              </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-2 font-mono">
              {t("forthcomingSubtitle")}
            </p>
            <h3 className="display text-ink text-3xl md:text-4xl leading-tight mb-3">
              {t("forthcomingTitle")}
            </h3>
            {locale === "ar" && (
              <p className="display text-gold/70 text-lg mb-5" style={{ fontFamily: "var(--font-cormorant)" }}>
                History of Philosophy — From A to Z
              </p>
            )}
            {locale === "en" && (
              <p className="display text-gold/70 text-lg mb-5" style={{ fontFamily: "var(--font-amiri)", direction: "rtl" }}>
                تاريخ الفلسفة — من الألف إلى الياء
              </p>
            )}
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
              {t("forthcomingBody")}
            </p>
          </div>
        </div>
      </div>

      {/* Season episode list — slides in when a season is clicked */}
      <AnimatePresence>
        {currentSeason && !selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-charcoal-darkest/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setActiveSeason(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="bg-paper rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur-md px-6 md:px-10 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-1">
                    {currentSeason.seasonLabel} · {currentSeason.episodesLabel}
                  </p>
                  <h3 className="display text-ink text-2xl md:text-3xl">{currentSeason.name}</h3>
                </div>
                <button
                  onClick={() => setActiveSeason(null)}
                  className="w-10 h-10 rounded-full border border-border hover:border-teal/40 flex items-center justify-center text-ink-soft hover:text-teal transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Episode list */}
              <div className="px-6 md:px-10 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSeason.episodes.map((ep, i) => (
                    <motion.button
                      key={ep.number}
                      onClick={() => setSelected(ep)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
                      whileHover={{ y: -4 }}
                      className="group text-left p-5 rounded-2xl bg-paper-warm border border-border hover:border-teal/40 transition-colors"
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="display text-teal/40 text-3xl leading-none">
                          {String(ep.number).padStart(2, "0")}
                        </span>
                        <Headphones size={16} className="text-ink-dim group-hover:text-teal transition-colors" strokeWidth={1.5} />
                      </div>
                      <h4 className="display text-ink text-base md:text-lg leading-tight mb-2">
                        {viewLang === "ar" ? ep.ar_title : ep.en_title}
                      </h4>
                      {viewLang === "ar" && (
                        <p className="text-xs text-ink-dim body-serif mb-2">{ep.en_title}</p>
                      )}
                      <p className={`body-serif text-xs text-ink-dim leading-relaxed ${viewLang === "ar" ? "text-right" : ""}`} style={viewLang === "ar" ? { fontFamily: "var(--font-amiri)", direction: "rtl" } : {}}>
                        {(viewLang === "ar" ? ep.ar_excerpt : ep.en_excerpt).substring(0, 100)}...
                      </p>
                      <div className="mt-3 pt-2 border-t border-border/60">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">
                          {t("readEpisode")}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode reader — full text modal */}
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
                  <button
                    onClick={() => setSelected(null)}
                    className="w-10 h-10 rounded-full border border-border hover:border-teal/40 flex items-center justify-center text-ink-soft hover:text-teal transition-colors"
                  >
                    <ArrowLeft size={18} strokeWidth={1.5} />
                  </button>
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
                    onClick={() => { setSelected(null); setActiveSeason(null); }}
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
