"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Reveal, FadeUp, EASE } from "../anim";
import { NeuralWork } from "./NeuralWork";
import {
  ExternalLink, GraduationCap, Building2,
  type LucideIcon
} from "lucide-react";

type TabId = "education" | "realestate";

export function Work() {
  const t = useTranslations("work");
  const [activeTab, setActiveTab] = useState<TabId>("education");

  const tabs: { id: TabId; icon: LucideIcon; label: string; desc: string }[] = [
    { id: "education", icon: GraduationCap, label: t("tabEducation"), desc: t("tabEducationDesc") },
    { id: "realestate", icon: Building2, label: t("tabRealEstate"), desc: t("tabRealEstateDesc") },
  ];

  return (
    <section id="work" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(180, 141, 60, 0.06), transparent 70%)" }}
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
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Neural Network Visualization — the hero centerpiece */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <NeuralWork />
      </div>

      {/* Divider before detailed breakdown */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-6 py-6 md:py-8">
            <span className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-dim font-mono whitespace-nowrap">
              {t("detailedBreakdown")}
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
        </Reveal>
      </div>

      {/* Detailed breakdown tabs — Education, Real Estate */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 p-2 rounded-2xl bg-paper-warm border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-start gap-2 p-4 md:p-5 rounded-xl transition-colors text-left ${
                    isActive ? "bg-paper" : "hover:bg-paper-dark/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl border border-teal/30 bg-paper"
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={18} strokeWidth={1.5} className={isActive ? "text-teal" : "text-ink-dim"} />
                    <span className={`text-sm md:text-base font-medium ${isActive ? "text-teal" : "text-ink-soft"}`}>
                      {tab.label}
                    </span>
                  </div>
                  <p className="relative z-10 text-[10px] md:text-xs text-ink-dim leading-snug body-serif">
                    {tab.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {activeTab === "education" && <EducationTab />}
            {activeTab === "realestate" && <RealEstateTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Professional Engagements — on-site case studies with proof photos */}
      <EngagementsSection />
    </section>
  );
}

/* ==================== ENGAGEMENTS SECTION ==================== */
function EngagementsSection() {
  const t = useTranslations("work");
  const locale = useLocale();
  const isAR = locale === "ar";

  const modules = [
    { title: t("engagementsModule1"), desc: t("engagementsModule1Desc") },
    { title: t("engagementsModule2"), desc: t("engagementsModule2Desc") },
    { title: t("engagementsModule3"), desc: t("engagementsModule3Desc") },
  ];

  const photos = [
    { src: "/engagements/clic-module1-group.jpg", caption: t("engagementsPhoto1Caption") },
    { src: "/engagements/clic-module1-training.jpg", caption: t("engagementsPhoto2Caption") },
    { src: "/engagements/clic-module1-workshop.jpg", caption: t("engagementsPhoto3Caption") },
    { src: "/engagements/clic-module2-group.jpg", caption: t("engagementsPhoto4Caption") },
  ];

  return (
    <>
      {/* Divider */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="flex items-center gap-6 py-6 md:py-8">
            <span className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-dim font-mono whitespace-nowrap">
              {t("engagementsEyebrow")}
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
        </Reveal>
      </div>

      {/* Section header */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
        <FadeUp>
          <h3 className="display text-ink text-3xl md:text-4xl leading-[1.1] mb-4" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
            {t("engagementsTitle")}
          </h3>
        </FadeUp>
        <FadeUp delay={0.05}>
          <p className={`body-serif text-sm md:text-base text-ink-soft leading-relaxed max-w-4xl ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            {t("engagementsIntro")}
          </p>
        </FadeUp>
      </div>

      {/* Case study card */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Details */}
          <FadeUp delay={0.1}>
            <div className={`p-6 md:p-8 rounded-2xl bg-paper-warm border border-border space-y-5 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">{t("engagementsCaseStudy")}</span>
                <h4 className="display text-ink text-xl md:text-2xl mt-2" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
                  {t("engagementsInstitution")}
                </h4>
                <p className="body-serif text-sm text-ink-dim mt-1">{t("engagementsLocation")}</p>
                <p className="body-serif text-sm text-ink-dim">{t("engagementsPrincipal")}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <p className="body-serif text-sm text-ink-soft">{t("engagementsProgram")}</p>
                <p className="body-serif text-sm text-ink-soft">{t("engagementsDuration")}</p>
                <p className="body-serif text-sm text-teal font-medium">{t("engagementsStatus")}</p>
              </div>

              <div className="pt-2 border-t border-border/40">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-2">{t("engagementsFoundationLabel")}</p>
                <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed">{t("engagementsFoundation")}</p>
              </div>
            </div>
          </FadeUp>

          {/* Right: Photo */}
          <FadeUp delay={0.15}>
            <div className="rounded-2xl overflow-hidden border-2 border-gold/30 shadow-[0_20px_60px_-20px_rgba(15,92,94,0.35)]">
              <img
                src={photos[0].src}
                alt={photos[0].caption}
                className="w-full h-auto object-cover"
              />
              <p className="body-serif text-xs text-ink-dim p-4 bg-paper-warm border-t border-border/40">
                {photos[0].caption}
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Delivered modules */}
        <FadeUp delay={0.2}>
          <div className={`mt-8 md:mt-10 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono mb-4">{t("engagementsModulesLabel")}</p>
            <div className="space-y-4">
              {modules.map((m, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-2 md:gap-4 p-4 rounded-xl bg-paper-warm/50 border border-border/40 ${isAR ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal text-xs font-mono font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="display text-ink text-sm md:text-base font-medium" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>{m.title}</p>
                    <p className="body-serif text-xs md:text-sm text-ink-dim mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Outcomes */}
        <FadeUp delay={0.25}>
          <div className={`mt-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-teal/5 to-transparent border border-teal/20 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono mb-3">{t("engagementsOutcomesLabel")}</p>
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{t("engagementsOutcomes")}</p>
          </div>
        </FadeUp>

        {/* Photo gallery — 3 remaining photos */}
        <FadeUp delay={0.3}>
          <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 ${isAR ? "text-right" : ""}`}>
            {photos.slice(1).map((photo, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border shadow-lg">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-48 md:h-56 object-cover"
                />
                <p className="body-serif text-xs text-ink-dim p-3 bg-paper-warm border-t border-border/40">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delay={0.35}>
          <div className={`mt-10 p-6 md:p-8 rounded-2xl border border-gold/30 bg-gold/5 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{t("engagementsCTA")}</p>
            <a
              href="mailto:ahmed@phronesis-studio.com"
              className={`inline-flex items-center gap-2 mt-4 text-sm text-teal hover:text-teal-bright transition-colors font-medium ${isAR ? "flex-row-reverse" : ""}`}
            >
              ahmed@phronesis-studio.com
            </a>
          </div>
        </FadeUp>
      </div>
    </>
  );
}

/* ==================== EDUCATION TAB ==================== */
function EducationTab() {
  const tc = useTranslations("workContent");
  const eduKeys = ["e1", "e2", "e3", "e4", "e5"] as const;
  const urls: Record<string, string | undefined> = {
    e1: "https://mscs-academy.vercel.app",
    e2: "https://mun-diplomatiq.vercel.app",
    e3: undefined,
    e4: undefined,
    e5: undefined,
  };

  return (
    <div className="space-y-0">
      {eduKeys.map((key, i) => {
        const item = {
          title: tc(`education.${key}.title`),
          subtitle: tc(`education.${key}.subtitle`),
          url: urls[key],
          body: tc(`education.${key}.body`),
          stats: tc.raw(`education.${key}.stats`) as string[],
        };
        return (
          <FadeUp key={key} delay={i * 0.05}>
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 py-5 md:py-6 border-t border-border/40 ${i === eduKeys.length - 1 ? "border-b" : ""}`}>
              <div className="lg:col-span-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{item.subtitle}</p>
                <h3 className="display text-ink text-3xl md:text-4xl leading-[1.05]">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.stats.map((s, j) => (
                    <span key={j} className="text-[10px] uppercase tracking-wider text-ink-dim border border-border rounded-full px-2.5 py-1 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-teal">
                    <ExternalLink size={14} />
                    <span className="link-underline">{tc("visitSite")}</span>
                  </a>
                )}
              </div>
              <div className="lg:col-span-7">
                <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">
                  {item.body.split("\n\n").map((para, i, arr) => (
                    <span key={i}>
                      {para}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </FadeUp>
        );
      })}
    </div>
  );
}

/* ==================== REAL ESTATE TAB ==================== */
function RealEstateTab() {
  const tc = useTranslations("workContent");
  const pillars = tc.raw("realEstate.pillars") as { title: string; body: string; replaces: string }[];
  const roi = tc.raw("realEstate.roi") as { role: string; win: string; metric: string }[];
  const trust = tc.raw("realEstate.trust") as { t: string; d: string }[];
  const stats = tc.raw("realEstate.stats") as { v: string; l: string }[];

  return (
    <div>
      {/* Two-project summary — Al Ain Real Estate (production) + Real Estate Emperor (SaaS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-6 md:py-8 border-t border-border/40">
        <FadeUp>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="p-7 md:p-8 rounded-2xl bg-paper border border-teal/30 hover:border-teal/50 transition-colors h-full"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2 font-mono">{tc("realEstate.alAinRoomBadge")}</p>
            <h4 className="display text-ink text-2xl md:text-3xl mb-3 leading-tight">{tc("realEstate.alAinRoomName")}</h4>
            <p className="display-italic text-teal text-base md:text-lg mb-4">{tc("realEstate.alAinRoomTagline")}</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5">{tc("realEstate.alAinRoomBody")}</p>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {(tc.raw("realEstate.alAinRoomStats") as string[]).map((s, i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider text-ink-dim border border-border rounded-full px-2.5 py-1 font-mono">
                  {s}
                </span>
              ))}
            </div>
            <a
              href="https://alainroomforrent.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-5 py-3 rounded-full font-medium"
            >
              <ExternalLink size={14} />
              {tc("realEstate.alAinRoomCta")}
            </a>
          </motion.div>
        </FadeUp>
        <FadeUp delay={0.05}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="p-7 md:p-8 rounded-2xl bg-paper-warm border border-border hover:border-teal/40 transition-colors h-full"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2 font-mono">{tc("realEstate.category")}</p>
            <h4 className="display text-ink text-2xl md:text-3xl mb-3 leading-tight">{tc("realEstate.name")}</h4>
            <p className="display-italic text-teal text-base md:text-lg mb-4">{tc("realEstate.tagline")}</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5">{tc("realEstate.description")}</p>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {stats.map((s, i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider text-ink-dim border border-border rounded-full px-2.5 py-1 font-mono">
                  {s.v} {s.l}
                </span>
              ))}
            </div>
            <a
              href="https://real-estate-emperor.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-teal border border-teal/40 hover:bg-teal/10 transition-colors px-5 py-3 rounded-full font-medium"
            >
              <ExternalLink size={14} />
              {tc("visitDemo")}
            </a>
          </motion.div>
        </FadeUp>
      </div>

      {/* Detailed breakdown — Real Estate Emperor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 py-6 md:py-8 border-t border-border/40">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{tc("realEstate.category")}</p>
          <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02]">{tc("realEstate.name")}</h3>
          <p className="display-italic text-teal text-xl md:text-2xl mt-3">{tc("realEstate.tagline")}</p>
          <p className="body-serif text-sm text-ink-dim mt-5">{tc("realEstate.description")}</p>
          <a href="https://real-estate-emperor.vercel.app" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-5 py-3 rounded-full font-medium">
            <ExternalLink size={14} />
            {tc("visitDemo")}
          </a>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="p-5 rounded-xl bg-paper-warm border border-border">
                <div className="display text-teal text-4xl md:text-5xl leading-none">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-dim mt-2 font-mono">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="body-serif text-sm text-ink-soft leading-relaxed mt-8">{tc("realEstate.proofBody")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-6 md:py-8 border-t border-border/40">
        {pillars.map((p, i) => (
          <FadeUp key={i}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="p-7 md:p-8 rounded-2xl bg-paper-warm border border-border hover:border-teal/40 transition-colors h-full"
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="display text-teal/40 text-5xl md:text-6xl leading-none">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">{tc("pillar")} {i + 1}/04</span>
              </div>
              <h4 className="display text-ink text-2xl md:text-3xl mb-4">{p.title}</h4>
              <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5">{p.body}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-mono">{p.replaces}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>

      <div className="py-6 md:py-8 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">{tc("realEstate.roiTitle")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {roi.map((s, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-paper-warm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2 font-mono">{s.role}</p>
              <p className="body-serif text-xs text-ink-soft leading-relaxed mb-3">{s.win}</p>
              <p className="display-italic text-terracotta text-sm">{s.metric}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6 md:py-8 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">{tc("realEstate.trustTitle")}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trust.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-paper-warm border border-border">
              <p className="text-xs font-medium text-ink mb-1">{s.t}</p>
              <p className="body-serif text-[11px] text-ink-dim leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== FINANCE TAB — REMOVED ==================== */
/* The Finance tab (Treasury Emperor) has been removed entirely from the site.
   The finance i18n entries are also removed from en.json and ar.json.
   The treasury-emperor project slug in /work/[slug]/page.tsx has been removed,
   and the treasury cloud has been removed from NeuralWork.tsx.
*/
