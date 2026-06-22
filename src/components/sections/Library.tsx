"use client";

import { Reveal, Stagger, FadeUp, Magnetic } from "../anim";
import { motion } from "framer-motion";
import { Download, BookOpen, Sparkles } from "lucide-react";

type Guide = {
  grade: string;
  gradeArabic: string;
  title: string;
  subtitle: string;
  cover: string;
  pdf: string;
  pages: number;
  units: number;
  modules: number;
  highlight: string;
};

const GUIDES: Guide[] = [
  {
    grade: "Grade 1",
    gradeArabic: "الصف الأول",
    title: "Mathematics",
    subtitle: "A Bilingual Learning Guide for Absolute Beginners",
    cover: "/guides/grade-1-mathematics-cover.png",
    pdf: "/guides/grade-1-mathematics.pdf",
    pages: 21,
    units: 6,
    modules: 18,
    highlight: "Foundations",
  },
  {
    grade: "Grade 2",
    gradeArabic: "الصف الثاني",
    title: "Mathematics",
    subtitle: "A Bilingual Learning Guide for Absolute Beginners",
    cover: "/guides/grade-2-mathematics-cover.png",
    pdf: "/guides/grade-2-mathematics.pdf",
    pages: 21,
    units: 7,
    modules: 22,
    highlight: "Real-Life Connections",
  },
  {
    grade: "Grade 3",
    gradeArabic: "الصف الثالث",
    title: "Mathematics",
    subtitle: "A Bilingual Learning Guide for Absolute Beginners",
    cover: "/guides/grade-3-mathematics-cover.png",
    pdf: "/guides/grade-3-mathematics.pdf",
    pages: 27,
    units: 6,
    modules: 20,
    highlight: "Real-Life Applications",
  },
  {
    grade: "Grade 4",
    gradeArabic: "الصف الرابع",
    title: "Mathematics",
    subtitle: "A Bilingual Learning Guide for Absolute Beginners",
    cover: "/guides/grade-4-mathematics-cover.png",
    pdf: "/guides/grade-4-mathematics.pdf",
    pages: 31,
    units: 7,
    modules: 21,
    highlight: "Real-Life Applications",
  },
];

export function Library() {
  return (
    <section id="library" className="relative overflow-hidden bg-charcoal-dark/40">
      {/* Warm gold glow background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(180, 141, 60, 0.10), transparent 70%)",
        }}
      />

      {/* Section header — full-bleed */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-16 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Library · Original Works</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2
              className="display text-cream leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Original curriculum,<br />
              <span className="display-italic text-gold">built bilingual.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <p className="text-base md:text-lg text-cream/75 leading-relaxed">
              I am working toward the polymath ideal of our ancestors: a teacher who can build the curriculum, not just deliver it. This library is the proof. The first four guides cover Mathematics, Grades 1 to 4, in English and Arabic. Grades 5 to 12 are in production. More subjects will follow.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Guide grid — full-bleed, 4 columns on desktop */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-24 md:pb-32">
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
                className="group block h-full rounded-2xl bg-charcoal-dark border border-border hover:border-gold/50 transition-colors overflow-hidden"
              >
                {/* Cover image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
                  <img
                    src={g.cover}
                    alt={`${g.grade} ${g.title} cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-darkest/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Download icon on hover */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold/90 text-charcoal-darkest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <Download size={16} strokeWidth={2} />
                  </div>
                  {/* Grade badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-charcoal-darkest/80 backdrop-blur-sm border border-gold/30">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      {g.highlight}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 md:p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3
                      className="display text-cream text-2xl"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {g.grade}
                    </h3>
                    <span
                      className="text-sm text-cream-dim"
                      style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
                      dir="rtl"
                      lang="ar"
                    >
                      {g.gradeArabic}
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
                    {g.title}
                  </p>

                  <p className="text-[11px] text-cream-dim leading-relaxed mb-4">
                    {g.subtitle}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-cream-faint pt-3 border-t border-border/60">
                    <span>{g.pages} pp</span>
                    <span className="text-gold/40">·</span>
                    <span>{g.units} units</span>
                    <span className="text-gold/40">·</span>
                    <span>{g.modules} modules</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs text-gold group-hover:text-gold-bright transition-colors">
                      <Download size={12} />
                      <span className="link-underline">Download PDF</span>
                    </span>
                    <span className="text-[10px] text-cream-faint uppercase tracking-[0.18em]">
                      Free
                    </span>
                  </div>
                </div>
              </motion.a>
            </FadeUp>
          ))}
        </Stagger>

        {/* In-progress note */}
        <Reveal delay={0.2} className="mt-16">
          <div className="relative p-8 md:p-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(180, 141, 60, 0.4), transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    className="display text-cream text-2xl md:text-3xl mb-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Grades 5 to 12 in production
                  </h3>
                  <p className="text-sm text-cream/75 leading-relaxed max-w-2xl">
                    Mathematics is the first subject. The complete Grade 1 to 12 series will be released as it is finalized. Additional subjects, including science, philosophy for young learners, and critical thinking, will follow the same bilingual format.
                  </p>
                </div>
              </div>
              <Magnetic strength={0.3}>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-bright transition-colors whitespace-nowrap"
                >
                  <BookOpen size={14} />
                  <span className="link-underline">Request early access</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
