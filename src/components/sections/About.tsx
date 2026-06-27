"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal, FadeUp, EASE } from "../anim";
import {
  User, Briefcase, GraduationCap, Lightbulb, Award, type LucideIcon
} from "lucide-react";

type TabId = "profile" | "experience" | "education" | "initiatives" | "skills";

export function About() {
  const t = useTranslations("about");
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const tabs: { id: TabId; icon: LucideIcon; label: string; desc: string }[] = [
    { id: "profile", icon: User, label: t("tabProfile"), desc: t("tabProfileDesc") },
    { id: "experience", icon: Briefcase, label: t("tabExperience"), desc: t("tabExperienceDesc") },
    { id: "education", icon: GraduationCap, label: t("tabEducation"), desc: t("tabEducationDesc") },
    { id: "initiatives", icon: Lightbulb, label: t("tabInitiatives"), desc: t("tabInitiativesDesc") },
    { id: "skills", icon: Award, label: t("tabSkills"), desc: t("tabSkillsDesc") },
  ];

  return (
    <section id="about" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(15, 92, 94, 0.06), transparent 70%)" }}
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
              {t("title")}{" "}<br className="br-rtl-hide" />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{t("intro")}</p>
          </Reveal>
        </div>

        {/* Tab navigation */}
        <Reveal delay={0.15}>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 p-2 rounded-2xl bg-paper-warm border border-border">
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
                      layoutId="aboutActiveTab"
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
                  <p className="relative z-10 text-[10px] md:text-xs text-ink-dim leading-snug body-serif hidden lg:block">
                    {tab.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Tab content */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "experience" && <ExperienceTab />}
            {activeTab === "education" && <EducationTab />}
            {activeTab === "initiatives" && <InitiativesTab />}
            {activeTab === "skills" && <SkillsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ==================== PROFILE TAB ==================== */
function ProfileTab() {
  const t = useTranslations("about");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
      <div className="lg:col-span-7">
        {/* Portrait + tagline — stacked on mobile, side by side on desktop */}
        <FadeUp delay={0.05}>
          <div className="mb-8 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8 justify-center lg:justify-start text-center md:text-left">
            {/* Circular portrait with gold ring */}
            <div className="relative flex-shrink-0" style={{ width: "160px", height: "160px", minWidth: "160px" }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "3px solid var(--gold)", opacity: 0.5 }}
              />
              <div
                className="absolute rounded-full"
                style={{ inset: "6px", border: "1px solid var(--gold)", opacity: 0.3 }}
              />
              <img
                src="/founder-portrait.jpg"
                alt="Ahmed Ali — Founder of Studio of Phronesis"
                className="absolute rounded-full object-cover"
                style={{ inset: "10px", width: "calc(100% - 20px)", height: "calc(100% - 20px)" }}
              />
            </div>
            {/* Tagline beside the photo (or below on mobile) */}
            <div className="w-full md:w-auto">
              <p className="display-italic text-teal leading-[1.2] md:max-w-[400px]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                {t("profileTitle")}
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mb-6">{t("profileBody1")}</p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mb-6">{t("profileBody2")}</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">{t("profileBody3")}</p>
        </FadeUp>
      </div>
      <div className="lg:col-span-5 space-y-6">
        <FadeUp delay={0.25}>
          <div className="p-6 md:p-7 rounded-2xl bg-paper-warm border border-border">
            <p className="eyebrow mb-4">Professional Summary</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("profileSummary")}</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="p-6 md:p-7 rounded-2xl bg-paper-warm border border-border">
            <p className="eyebrow mb-4">Teaching Expertise</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("profileTeachingExpertise")}</p>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

/* ==================== EXPERIENCE TAB ==================== */
function ExperienceTab() {
  const t = useTranslations("about");
  const roles = [
    { role: t("exp1Role"), org: t("exp1Org"), date: t("exp1Date"), body: t("exp1Body"), bullets: t.raw("exp1Bullets") as string[] },
    { role: t("exp2Role"), org: t("exp2Org"), date: t("exp2Date"), body: t("exp2Body"), bullets: t.raw("exp2Bullets") as string[] },
    { role: t("exp3Role"), org: t("exp3Org"), date: t("exp3Date"), body: t("exp3Body"), bullets: t.raw("exp3Bullets") as string[] },
    { role: t("exp4Role"), org: t("exp4Org"), date: t("exp4Date"), body: t("exp4Body"), bullets: t.raw("exp4Bullets") as string[] },
    { role: t("exp5Role"), org: t("exp5Org"), date: t("exp5Date"), body: t("exp5Body"), bullets: t.raw("exp5Bullets") as string[] },
    { role: t("exp6Role"), org: t("exp6Org"), date: t("exp6Date"), body: t("exp6Body"), bullets: t.raw("exp6Bullets") as string[] },
  ];

  return (
    <div>
      <FadeUp>
        <h3 className="display text-ink text-3xl md:text-4xl mb-10">{t("experienceLabel")}</h3>
      </FadeUp>
      <div className="space-y-0">
        {roles.map((r, i) => (
          <FadeUp key={i} delay={i * 0.05}>
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-6 md:py-8 border-t border-border/40 ${i === roles.length - 1 ? "border-b" : ""}`}>
              <div className="lg:col-span-3">
                <p className="text-xs uppercase tracking-[0.18em] text-teal font-mono mb-2">{r.date}</p>
              </div>
              <div className="lg:col-span-5">
                <h4 className="display text-ink text-xl md:text-2xl mb-2 leading-tight">{r.role}</h4>
                <p className="body-serif text-sm text-ink-dim">{r.org}</p>
              </div>
              <div className="lg:col-span-4">
                <p className="body-serif text-sm text-ink-soft leading-relaxed mb-4">{r.body}</p>
                <ul className="space-y-1.5">
                  {r.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-ink-dim leading-relaxed body-serif">
                      <span className="text-teal mt-[2px] flex-shrink-0">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

/* ==================== EDUCATION TAB ==================== */
function EducationTab() {
  const t = useTranslations("about");
  const certs = t.raw("certs") as { name: string; issuer: string; date: string }[];

  return (
    <div>
      <FadeUp>
        <h3 className="display text-ink text-3xl md:text-4xl mb-10">{t("educationLabel")}</h3>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <FadeUp delay={0.05}>
          <div className="p-7 md:p-8 rounded-2xl bg-paper-warm border border-border h-full">
            <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal mb-5">
              <GraduationCap size={22} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-teal font-mono mb-2">{t("edu1Date")}</p>
            <h4 className="display text-ink text-2xl md:text-3xl mb-2 leading-tight">{t("edu1Degree")}</h4>
            <p className="body-serif text-sm text-ink-dim mb-4">{t("edu1Institution")}</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("edu1Body")}</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="p-7 md:p-8 rounded-2xl bg-paper-warm border border-border h-full">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 border border-terracotta/30 flex items-center justify-center text-terracotta mb-5">
              <GraduationCap size={22} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-terracotta font-mono mb-2">{t("edu2Date")}</p>
            <h4 className="display text-ink text-2xl md:text-3xl mb-2 leading-tight">{t("edu2Degree")}</h4>
            <p className="body-serif text-sm text-ink-dim mb-4">{t("edu2Institution")}</p>
            <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("edu2Body")}</p>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <h4 className="display text-ink text-2xl md:text-3xl mb-6">{t("certificationsLabel")}</h4>
      </FadeUp>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {certs.map((c, i) => (
          <FadeUp key={i} delay={0.05 + i * 0.03}>
            <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-paper-warm hover:border-teal/30 transition-colors">
              <div className="w-2 h-2 rounded-full bg-teal mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="body-serif text-sm text-ink font-medium leading-tight mb-1">{c.name}</p>
                <p className="text-xs text-ink-dim body-serif">{c.issuer} · {c.date}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

/* ==================== INITIATIVES TAB ==================== */
function InitiativesTab() {
  const t = useTranslations("about");
  const inits = [
    { title: t("init1Title"), subtitle: t("init1Subtitle"), body: t("init1Body") },
    { title: t("init2Title"), subtitle: t("init2Subtitle"), body: t("init2Body") },
    { title: t("init3Title"), subtitle: t("init3Subtitle"), body: t("init3Body") },
    { title: t("init4Title"), subtitle: t("init4Subtitle"), body: t("init4Body") },
  ];

  return (
    <div>
      <FadeUp>
        <h3 className="display text-ink text-3xl md:text-4xl mb-10">{t("initiativesLabel")}</h3>
      </FadeUp>
      <div className="space-y-6 md:space-y-8">
        {inits.map((init, i) => (
          <FadeUp key={i} delay={i * 0.05}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 md:p-8 rounded-2xl bg-paper-warm border border-border hover:border-teal/30 transition-colors">
              <div className="lg:col-span-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
                  <Lightbulb size={22} strokeWidth={1.5} />
                </div>
                <h4 className="display text-ink text-xl md:text-2xl mb-2 leading-tight">{init.title}</h4>
                <p className="text-xs text-teal body-serif">{init.subtitle}</p>
              </div>
              <div className="lg:col-span-8">
                <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{init.body}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

/* ==================== SKILLS TAB ==================== */
function SkillsTab() {
  const t = useTranslations("about");
  const skills = t.raw("skills") as string[];
  const languages = t.raw("languages") as { name: string; level: string }[];
  const affiliations = t.raw("affiliations") as { name: string; date: string }[];

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Core Competencies */}
      <div>
        <FadeUp>
          <h3 className="display text-ink text-3xl md:text-4xl mb-8">{t("skillsLabel")}</h3>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((s, i) => (
            <FadeUp key={i} delay={i * 0.03}>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-paper-warm">
                <span className="text-teal mt-1 flex-shrink-0">·</span>
                <span className="body-serif text-sm text-ink-soft leading-relaxed">{s}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Languages + Affiliations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <FadeUp>
            <h3 className="display text-ink text-2xl md:text-3xl mb-6">{t("languagesLabel")}</h3>
          </FadeUp>
          <div className="space-y-3">
            {languages.map((l, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-paper-warm">
                  <span className="body-serif text-base text-ink">{l.name}</span>
                  <span className="text-sm text-teal font-mono leading-relaxed">{l.level}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <div>
          <FadeUp>
            <h3 className="display text-ink text-2xl md:text-3xl mb-6">{t("affiliationsLabel")}</h3>
          </FadeUp>
          <div className="space-y-3 mb-8">
            {affiliations.map((a, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-paper-warm">
                  <span className="body-serif text-base text-ink">{a.name}</span>
                  <span className="text-sm text-ink-dim font-mono">{a.date}</span>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2}>
            <div className="p-4 rounded-xl border border-border bg-paper-warm mb-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-1 font-mono">{t("sportsLabel")}</p>
              <p className="body-serif text-sm text-ink-soft">{t("sports")}</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="p-4 rounded-xl border border-border bg-paper-warm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-1 font-mono">{t("itSkillsLabel")}</p>
              <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("itSkills")}</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
