"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal, FadeUp, Magnetic, EASE } from "../anim";
import {
  ArrowUpRight, ExternalLink, Hammer, GraduationCap, Building2, Landmark,
  type LucideIcon
} from "lucide-react";

type Project = {
  name: string;
  category: string;
  url?: string;
  metric: string;
  metricLabel: string;
  description: string;
  features: string[];
  stack: string;
};

export function Work() {
  const t = useTranslations("work");
  const [activeTab, setActiveTab] = useState<"projects" | "education" | "realestate" | "finance">("projects");

  const tabs = [
    { id: "projects" as const, icon: Hammer, label: t("tabProjects"), desc: t("tabProjectsDesc") },
    { id: "education" as const, icon: GraduationCap, label: t("tabEducation"), desc: t("tabEducationDesc") },
    { id: "realestate" as const, icon: Building2, label: t("tabRealEstate"), desc: t("tabRealEstateDesc") },
    { id: "finance" as const, icon: Landmark, label: t("tabFinance"), desc: t("tabFinanceDesc") },
  ];

  return (
    <section id="work" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(180, 141, 60, 0.06), transparent 70%)",
        }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="display text-ink leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("title")}<br />
              <span className="display-italic text-teal">{t("titleItalic")}</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        {/* Tab navigation */}
        <Reveal delay={0.15}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 p-2 rounded-2xl bg-paper-warm border border-border">
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

      {/* Tab content */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {activeTab === "projects" && <ProjectsTab />}
            {activeTab === "education" && <EducationTab />}
            {activeTab === "realestate" && <RealEstateTab />}
            {activeTab === "finance" && <FinanceTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ==================== PROJECTS TAB ==================== */
function ProjectsTab() {
  const projects: Project[] = [
    {
      name: "Real Estate Emperor",
      category: "Property Management SaaS",
      url: "https://real-estate-emperor.vercel.app",
      metric: "400+",
      metricLabel: "units managed",
      description: "Cloud-based property management platform running in production for a paying client in Al Ain. Rent collection with payment allocation, per-building P&L, role-based access, multi-language.",
      features: ["400+ units managed live", "4 roles: owner, admin, accountant, staff", "Multi-language: EN, AR, BN, UR", "Automated daily backups with SHA-256"],
      stack: "Next.js 16 · React 19 · Prisma · PostgreSQL · Vercel",
    },
    {
      name: "MSCS Academy",
      category: "Educational Learning Platform",
      url: "https://mscs-academy.vercel.app",
      metric: "390+",
      metricLabel: "activities",
      description: "Interactive learning platform for UAE Moral, Social & Cultural Studies, Grades 6 to 9. Standards-aligned, 130 lessons, 390+ activities.",
      features: ["4 grades, 130 lessons", "390+ interactive activities", "UAE curriculum aligned", "PDPL compliant"],
      stack: "Next.js · React · TypeScript · Tailwind · Vercel",
    },
    {
      name: "DiplomatiQ",
      category: "Model United Nations Platform",
      url: "https://mun-diplomatiq.vercel.app",
      metric: "7-tier",
      metricLabel: "competency framework",
      description: "The operating system for MUN programs. AI-powered diplomatic assessments, 8 immersive courses, 40+ lessons, conference management.",
      features: ["7-tier AI competency framework", "8 immersive courses", "Conference management", "AI research paper evaluation"],
      stack: "Next.js · React · TypeScript · AI · Vercel",
    },
    {
      name: "Echoes of Wisdom",
      category: "Philosophy Podcast · أصداء الحكمة",
      metric: "∞",
      metricLabel: "ongoing broadcast",
      description: "Independent educational podcast promoting philosophy as accessible field of education. Bridges academic philosophy and public discourse.",
      features: ["Bridges academic and public discourse", "Ethics, logic, epistemology", "Arabic & English", "Cultural flagship of the studio"],
      stack: "Independent production · 2026 to present",
    },
  ];

  return (
    <div className="space-y-12 md:space-y-16">
      {projects.map((p, i) => (
        <ProjectRow key={p.name} project={p} isReversed={i % 2 === 1} />
      ))}
    </div>
  );
}

function ProjectRow({ project, isReversed }: { project: Project; isReversed: boolean }) {
  const isLink = Boolean(project.url);
  const CardContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      <div className={`lg:col-span-4 ${isReversed ? "lg:order-2 lg:col-start-9" : ""}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE }}
          className="display text-teal leading-none"
          style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
        >
          {project.metric}
        </motion.div>
        <div className="text-xs uppercase tracking-[0.22em] text-ink-dim mt-3 font-mono">
          {project.metricLabel}
        </div>
      </div>

      <div className={`lg:col-span-7 ${isReversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
        <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">
          {project.category}
        </p>
        <h3
          className={`display text-ink flex items-center gap-4 transition-colors ${isLink ? "group-hover:text-teal" : ""}`}
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}
        >
          {project.name}
          {isLink && (
            <ArrowUpRight size={36} strokeWidth={1.5} className="text-teal opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          )}
        </h3>
        <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed mt-6 max-w-2xl">
          {project.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-8">
          {project.features.map((f) => (
            <div key={f} className="flex items-start gap-3 text-xs text-ink-dim leading-relaxed body-serif">
              <span className="text-teal mt-[2px] flex-shrink-0">·</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim mb-2 font-mono">Stack</p>
          <p className="text-xs text-ink-dim leading-relaxed body-serif">{project.stack}</p>
        </div>
        {isLink && (
          <Magnetic strength={0.3}>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-teal">
              <ExternalLink size={14} />
              <span className="link-underline">Visit live site</span>
            </div>
          </Magnetic>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full py-12 md:py-16 border-t border-border/40 transition-colors hover:bg-paper-warm/50"
      >
        {CardContent}
      </a>
    );
  }
  return <div className="w-full py-12 md:py-16 border-t border-border/40">{CardContent}</div>;
}

/* ==================== EDUCATION TAB ==================== */
function EducationTab() {
  const items = [
    {
      title: "MSCS Academy",
      subtitle: "Interactive Learning Platform · Grades 6 to 9",
      url: "https://mscs-academy.vercel.app",
      body: "A complete interactive learning platform for UAE Moral, Social & Cultural Studies. Four grades, 130 lessons, 390+ activities: quizzes, timelines, maps, drag-and-drop, KWL charts, Venn diagrams. Standards-aligned to the UAE MSCS curriculum. PDPL compliant. Child Digital Safety Law 26/2025 aligned. ADEK Irtiqa'a aligned. Built for my own teaching practice, then refined for general use.",
      stats: ["4 grades", "130 lessons", "390+ activities", "4 activity types"],
    },
    {
      title: "DiplomatiQ",
      subtitle: "MUN Operating System · UAE & GCC Schools",
      url: "https://mun-diplomatiq.vercel.app",
      body: "The operating system for Model United Nations programs. AI-powered diplomatic assessments across a seven-tier progressive framework, from Basic Delegate to Secretary-General. Eight immersive courses, 40+ lessons. Conference management: registrations, committees, delegates, voting. AI-powered research paper evaluation with originality detection. Built for UAE and GCC schools.",
      stats: ["7-tier framework", "8 courses", "40+ lessons", "AI evaluation"],
    },
    {
      title: "Bilingual Mathematics Curriculum",
      subtitle: "Original Works · The Library",
      body: "A complete bilingual (English & Arabic) mathematics learning guide series, Grades 1 to 4 live, Grades 5 to 12 in production. Each guide: 21 to 31 pages, covering all units and modules per grade. From Zero to Ready-to-Teach. Built for absolute beginners, structured for classroom use, designed for the UAE's bilingual reality.",
      stats: ["Grades 1 to 4 live", "Grades 5 to 12 pending", "21 to 31 pages each", "Bilingual EN/AR"],
    },
    {
      title: "Echoes of Wisdom Podcast",
      subtitle: "أصداء الحكمة · Philosophy for the Public",
      body: "An independent educational podcast that promotes philosophy as an accessible field of education with practical relevance to everyday life, critical thinking, and personal development. Bridges academic philosophy and public discourse, making complex ideas in ethics, logic, and epistemology understandable and actionable for diverse audiences. The cultural flagship of the studio.",
      stats: ["Ongoing broadcast", "Arabic & English", "Independent", "Cultural flagship"],
    },
    {
      title: "Ain Al Khaleej School",
      subtitle: "Current Teaching Role · Al Ain, UAE",
      body: "MSC Studies and Islamic Education Teacher at Ain Al Khaleej Private School, UAE. American Curriculum, Grades 1 to 12, ADEK-approved. Inquiry-based, standards-aligned lessons meeting ADEK and Irtiqa'a quality expectations. Differentiated instruction for ELLs and gifted learners. Faculty Head for Model United Nations program for 2025/2026 and 2026/2027 academic years.",
      stats: ["Grades 1 to 12", "American Curriculum", "ADEK licensed", "MUN Faculty Head"],
    },
  ];

  return (
    <div className="space-y-12 md:space-y-16">
      {items.map((item, i) => (
        <FadeUp key={item.title}>
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10 md:py-14 border-t border-border/40 ${i === items.length - 1 ? "border-b" : ""}`}>
            <div className="lg:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{item.subtitle}</p>
              <h3 className="display text-ink text-3xl md:text-5xl leading-[1.05]">{item.title}</h3>
              <div className="flex flex-wrap gap-2 mt-5">
                {item.stats.map((s) => (
                  <span key={s} className="text-[10px] uppercase tracking-wider text-ink-dim border border-border rounded-full px-2.5 py-1 font-mono">
                    {s}
                  </span>
                ))}
              </div>
              {item.url && (
                <Magnetic strength={0.3}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-teal">
                    <ExternalLink size={14} />
                    <span className="link-underline">Visit live site</span>
                  </a>
                </Magnetic>
              )}
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="body-serif text-sm md:text-base text-ink-soft leading-relaxed">{item.body}</p>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}

/* ==================== REAL ESTATE TAB ==================== */
function RealEstateTab() {
  const pillars = [
    {
      n: "01",
      title: "Rent Collection Intelligence",
      body: "Every payment recorded with allocation logic — current rent, advance, or historical debt. No more guessing who paid what. The system calculates collection rate per building as a clean percentage.",
      replaces: "Replaces: Excel + paper receipts",
    },
    {
      n: "02",
      title: "Per-Building Performance",
      body: "Monthly P&L per property. Collection rate per building. Problem buildings surface themselves. Now you can decide — keep, raise rent, or sell — with numbers, not gut feel.",
      replaces: "Replaces: manual reporting",
    },
    {
      n: "03",
      title: "Tenant Command Center",
      body: "Full tenant ledger, payment history, 0 to 100 tenant score, multi-unit groups with auto-split payments, deposit reservations. A ledger that never forgets.",
      replaces: "Replaces: WhatsApp + memory",
    },
    {
      n: "04",
      title: "Operations & Trust",
      body: "Expense tracking, recurring utility bills (TAQA, DEWA, Etisalat, du), role-based access (owner, admin, accountant, staff), audit trail, automated daily backups with SHA-256, 4 languages.",
      replaces: "Replaces: tally + paper trail",
    },
  ];

  return (
    <div>
      {/* Hero band */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-12 md:py-16 border-t border-border/40">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">UAE Property Management · Cloud Platform</p>
          <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02]">Real Estate Emperor</h3>
          <p className="display-italic text-teal text-xl md:text-2xl mt-3">The operating system for UAE property portfolios.</p>
          <p className="body-serif text-sm text-ink-dim mt-5">One dashboard for rent collection, tenant ledgers, building P&L, and multi-role operations — built for landlords managing 20 to 500 units across the Emirates.</p>
          <Magnetic strength={0.4}>
            <a href="https://real-estate-emperor.vercel.app" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-5 py-3 rounded-full font-medium">
              <ExternalLink size={14} />
              Visit live demo
            </a>
          </Magnetic>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { v: "400+", l: "Units managed" },
              { v: "26+", l: "Properties" },
              { v: "4", l: "Roles" },
              { v: "4", l: "Languages" },
            ].map((s) => (
              <div key={s.l} className="p-5 rounded-xl bg-paper-warm border border-border">
                <div className="display text-teal text-4xl md:text-5xl leading-none">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-dim mt-2 font-mono">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="body-serif text-sm text-ink-soft leading-relaxed mt-8">
            Real Estate Emperor is live in production, today, managing a real UAE portfolio. The client pays for it. They use it daily. Their accountant logs in every morning. Their receptionist enters payments in three languages. This is not a demo. This is a proven, production-grade platform.
          </p>
        </div>
      </div>

      {/* Four pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-12 md:py-16 border-t border-border/40">
        {pillars.map((p, i) => (
          <FadeUp key={p.n}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="p-7 md:p-8 rounded-2xl bg-paper-warm border border-border hover:border-teal/40 transition-colors h-full"
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="display text-teal/40 text-5xl md:text-6xl leading-none">{p.n}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">Pillar {p.n}/04</span>
              </div>
              <h4 className="display text-ink text-2xl md:text-3xl mb-4">{p.title}</h4>
              <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5">{p.body}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-mono">{p.replaces}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>

      {/* ROI section */}
      <div className="py-12 md:py-16 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">Five stakeholders. Everyone wins.</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { role: "Owner / CEO", win: "See entire portfolio's financial health in 30 seconds.", metric: "Decisions in minutes" },
            { role: "CFO / MD", win: "Real per-building P&L, auto-generated reports for partners, banks, auditors.", metric: "Month-end in zero days" },
            { role: "Accountant", win: "No more chasing receipts. Every payment entered once, allocated correctly.", metric: "One missed payment pays for everything" },
            { role: "Staff / Reception", win: "Simple interface in their own language. Enter a payment in 10 seconds.", metric: "Accountability without bureaucracy" },
            { role: "IT / Technical", win: "No servers, no software, no updates. Bank-grade encryption, 99.9% uptime.", metric: "Zero IT burden" },
          ].map((s) => (
            <div key={s.role} className="p-5 rounded-xl border border-border bg-paper-warm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal mb-2 font-mono">{s.role}</p>
              <p className="body-serif text-xs text-ink-soft leading-relaxed mb-3">{s.win}</p>
              <p className="display-italic text-terracotta text-sm">{s.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust */}
      <div className="py-12 md:py-16 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">Bank-grade infrastructure. Zero IT burden.</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { t: "Encryption", d: "TLS 1.3 in transit, AES-256 at rest" },
            { t: "99.9% Uptime", d: "Vercel global CDN" },
            { t: "Daily Backups", d: "2 AM GST, 90-day retention, SHA-256" },
            { t: "Any Device", d: "Desktop, tablet, phone. No install." },
            { t: "Audit Trail", d: "Every action logged: who, what, when" },
            { t: "Multi-language", d: "English, Arabic, Bengali, Urdu" },
          ].map((s) => (
            <div key={s.t} className="p-4 rounded-xl bg-paper-warm border border-border">
              <p className="text-xs font-medium text-ink mb-1">{s.t}</p>
              <p className="body-serif text-[11px] text-ink-dim leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== FINANCE TAB (Treasury Emperor — invented) ==================== */
function FinanceTab() {
  return (
    <div>
      {/* Hero band */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-12 md:py-16 border-t border-border/40">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta mb-3 font-mono">Financial Operations · Cloud Platform · Forthcoming</p>
          <h3 className="display text-ink text-4xl md:text-6xl leading-[1.02]">Treasury Emperor</h3>
          <p className="display-italic text-terracotta text-xl md:text-2xl mt-3">The financial nervous system for multi-branch businesses.</p>
          <p className="body-serif text-sm text-ink-dim mt-5">
            One dashboard for petty cash across every branch, invoice lifecycle, real-time P&L consolidation, debt service ratio monitoring, and cash flow forecasting. Built for SMEs and large companies that have outgrown spreadsheets but cannot afford an ERP.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-terracotta/5 border border-terracotta/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta mb-1 font-mono">Status</p>
            <p className="body-serif text-sm text-ink-soft">In design. Available for founding clients who want to shape the architecture.</p>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed">
            Most multi-branch businesses in the UAE run their daily finances on a fragile stack of Excel sheets, WhatsApp approvals, paper receipts, and the office manager's memory. Each branch is a financial island. The owner sees the truth only at month-end, when it is too late to act. Treasury Emperor closes that gap.
          </p>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed mt-5">
            The platform sits between every branch and every stakeholder. Petty cash entries in Al Ain appear on the owner's dashboard in Sharjah within seconds. Invoices flow through approval chains automatically. P&L consolidates across branches without manual rollup. Debt service ratio warns you before the bank does. This is the operating system for company finance.
          </p>
        </div>
      </div>

      {/* Six pillars */}
      <div className="py-12 md:py-16 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-10">Six pillars. One financial truth.</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              n: "01",
              title: "Multi-Branch Petty Cash",
              body: "Real-time petty cash ledger per branch, per staff member. Every entry geo-stamped and timestamped. Approval chains configurable per branch. The owner sees every branch's cash position on one screen, updated live.",
              replaces: "Replaces: Excel + WhatsApp approvals",
            },
            {
              n: "02",
              title: "Invoice Lifecycle",
              body: "From issuance to payment, every invoice tracked. Auto-aging buckets (0 to 30, 31 to 60, 61 to 90, 90+). Recurring invoices for retainer clients. Late payment reminders sent automatically. E-invoice compliance ready.",
              replaces: "Replaces: manual invoice tracking",
            },
            {
              n: "03",
              title: "Real-Time P&L Consolidation",
              body: "Per-branch P&L generated automatically. Portfolio-wide rollup across all branches, all currencies, all cost centers. Drill down from the group view to a single transaction in three clicks. Month-end close: zero days.",
              replaces: "Replaces: monthly manual consolidation",
            },
            {
              n: "04",
              title: "Debt Service Ratio (DSR) Monitor",
              body: "Live DSR calculation across all loans, all branches. Early warning when DSR approaches covenant thresholds. Bank-ready reports generated on demand. Never be surprised by your banker again.",
              replaces: "Replaces: annual DSR surprises",
            },
            {
              n: "05",
              title: "Cash Flow Forecasting",
              body: "13-week rolling cash flow forecast based on receivables aging, payable schedules, and recurring obligations. Scenario modeling: what if Branch B's largest client pays 30 days late? Know before it happens.",
              replaces: "Replaces: gut-feel cash management",
            },
            {
              n: "06",
              title: "Audit-Grade Trail",
              body: "Every transaction, every approval, every edit logged with user, timestamp, IP, and device. Role-based access per branch. SHA-256 verified daily backups. Bank-grade encryption. Ready for any auditor, any bank, any partner.",
              replaces: "Replaces: paper trail + hope",
            },
          ].map((p) => (
            <FadeUp key={p.n}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="p-7 rounded-2xl bg-paper-warm border border-border hover:border-terracotta/40 transition-colors h-full"
              >
                <div className="flex items-baseline justify-between mb-5">
                  <span className="display text-terracotta/40 text-5xl leading-none">{p.n}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">Pillar {p.n}/06</span>
                </div>
                <h4 className="display text-ink text-xl md:text-2xl mb-3">{p.title}</h4>
                <p className="body-serif text-xs md:text-sm text-ink-soft leading-relaxed mb-4">{p.body}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-mono">{p.replaces}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Stakeholders */}
      <div className="py-12 md:py-16 border-t border-border/40">
        <h4 className="display text-ink text-3xl md:text-4xl mb-8">Who Treasury Emperor serves.</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: "Owner / CEO", win: "See every branch's cash position, P&L, and DSR on one screen. Decide in seconds, not days.", metric: "Group visibility, live" },
            { role: "CFO / Finance Head", win: "Auto-consolidated P&L, rolling cash flow forecast, bank-ready reports. Month-end closes itself.", metric: "Month-end in zero days" },
            { role: "Branch Manager", win: "Enter petty cash in 10 seconds. Approve invoices from your phone. See your branch's position in real time.", metric: "Branch autonomy, group control" },
            { role: "Accountant", win: "No more chasing receipts across branches. Every entry flows into consolidated reports automatically.", metric: "One source of truth" },
          ].map((s) => (
            <div key={s.role} className="p-5 rounded-xl border border-border bg-paper-warm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta mb-2 font-mono">{s.role}</p>
              <p className="body-serif text-xs text-ink-soft leading-relaxed mb-3">{s.win}</p>
              <p className="display-italic text-teal text-sm">{s.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement CTA */}
      <div className="py-12 md:py-16 border-t border-border/40">
        <div className="p-8 md:p-10 rounded-2xl border border-terracotta/30 bg-gradient-to-br from-terracotta/5 to-transparent">
          <h4 className="display text-ink text-2xl md:text-3xl mb-3">Founding clients wanted.</h4>
          <p className="body-serif text-sm text-ink-soft leading-relaxed max-w-2xl mb-6">
            Treasury Emperor is in active design. I am seeking two to three founding clients — multi-branch businesses in the UAE who want to shape the architecture from day one. Founding clients receive preferred pricing, priority features, and direct input on the roadmap. In exchange, they commit to being the first production deployment.
          </p>
          <Magnetic strength={0.4}>
            <a href="/correspondence" className="inline-flex items-center gap-2 text-sm text-paper bg-terracotta hover:bg-terracotta-bright transition-colors px-5 py-3 rounded-full font-medium">
              Become a founding client
              <ArrowUpRight size={14} />
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
