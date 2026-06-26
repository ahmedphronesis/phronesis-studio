"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal, FadeUp, Magnetic, EASE } from "../anim";
import { NeuralWork } from "./NeuralWork";
import {
  ArrowUpRight, ExternalLink, GraduationCap, Building2, Landmark,
  type LucideIcon
} from "lucide-react";

type TabId = "education" | "realestate" | "finance";

export function Work() {
  const t = useTranslations("work");
  const [activeTab, setActiveTab] = useState<TabId>("education");

  const tabs: { id: TabId; icon: LucideIcon; label: string; desc: string }[] = [
    { id: "education", icon: GraduationCap, label: t("tabEducation"), desc: t("tabEducationDesc") },
    { id: "realestate", icon: Building2, label: t("tabRealEstate"), desc: t("tabRealEstateDesc") },
    { id: "finance", icon: Landmark, label: t("tabFinance"), desc: t("tabFinanceDesc") },
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("title")}<br className="br-rtl-hide" />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
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

      {/* Detailed breakdown tabs — Education, Real Estate, Finance */}
      <div className="relative w-full px-6 md:px-12 lg:px-20">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 p-2 rounded-2xl bg-paper-warm border border-border">
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
            {activeTab === "finance" && <FinanceTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
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
                  <Magnetic strength={0.3}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-teal">
                      <ExternalLink size={14} />
                      <span className="link-underline">{tc("visitSite")}</span>
                    </a>
                  </Magnetic>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 py-6 md:py-8 border-t border-border/40">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{tc("realEstate.category")}</p>
          <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02]">{tc("realEstate.name")}</h3>
          <p className="display-italic text-teal text-xl md:text-2xl mt-3">{tc("realEstate.tagline")}</p>
          <p className="body-serif text-sm text-ink-dim mt-5">{tc("realEstate.description")}</p>
          <Magnetic strength={0.4}>
            <a href="https://real-estate-emperor.vercel.app" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-5 py-3 rounded-full font-medium">
              <ExternalLink size={14} />
              {tc("visitDemo")}
            </a>
          </Magnetic>
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

/* ==================== FINANCE TAB ==================== */
function FinanceTab() {
  const tc = useTranslations("workContent");
  const pillars = tc.raw("finance.pillars") as { title: string; body: string; replaces: string }[];
  const stakeholders = tc.raw("finance.stakeholders") as { role: string; win: string; metric: string }[];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 py-6 md:py-8 border-t border-border/40">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta mb-3 font-mono">{tc("finance.category")}</p>
          <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02]">{tc("finance.name")}</h3>
          <p className="display-italic text-terracotta text-xl md:text-2xl mt-3">{tc("finance.tagline")}</p>
          <p className="body-serif text-sm text-ink-dim mt-5">{tc("finance.description")}</p>
          <div className="mt-6 p-4 rounded-xl bg-terracotta/5 border border-terracotta/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta mb-1 font-mono">{tc("finance.statusLabel")}</p>
            <p className="body-serif text-sm text-ink-soft">{tc("finance.statusBody")}</p>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{tc("finance.body1")}</p>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mt-5">{tc("finance.body2")}</p>
        </div>
      </div>

      <div className="py-6 md:py-8 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-10">{tc("finance.pillarsTitle")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <FadeUp key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="p-7 rounded-2xl bg-paper-warm border border-border hover:border-terracotta/40 transition-colors h-full"
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span className="display text-terracotta/40 text-5xl leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">{tc("pillar")} {i + 1}/06</span>
                </div>
                <h4 className="display text-ink text-xl md:text-2xl mb-3">{p.title}</h4>
                <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed mb-4">{p.body}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-mono">{p.replaces}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>

      <div className="py-6 md:py-8 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">{tc("finance.stakeholdersTitle")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stakeholders.map((s, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-paper-warm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta mb-2 font-mono">{s.role}</p>
              <p className="body-serif text-xs text-ink-soft leading-relaxed mb-3">{s.win}</p>
              <p className="display-italic text-teal text-sm">{s.metric}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6 md:py-8 border-t border-border/40">
        <div className="p-8 md:p-10 rounded-2xl border border-terracotta/30 bg-gradient-to-br from-terracotta/5 to-transparent">
          <h4 className="display text-ink text-2xl md:text-3xl mb-3">{tc("finance.ctaTitle")}</h4>
          <p className="body-serif text-sm text-ink-soft leading-relaxed max-w-2xl mb-6">{tc("finance.ctaBody")}</p>
          <Magnetic strength={0.4}>
            <a href="/correspondence" className="inline-flex items-center gap-2 text-sm text-paper bg-terracotta hover:bg-terracotta-bright transition-colors px-5 py-3 rounded-full font-medium">
              {tc("finance.ctaButton")}
              <ArrowUpRight size={14} />
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
