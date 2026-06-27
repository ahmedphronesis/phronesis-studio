"use client";

import { Reveal, FadeUp, Magnetic } from "../anim";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, ExternalLink, Quote } from "lucide-react";

export function Vouches() {
  const t = useTranslations("vouches");
  const letters = t.raw("letters") as {
    title: string;
    subtitle: string;
    author: string;
    authorTitle: string;
    date: string;
    excerpt: string;
    file: string;
  }[];

  const linkedIn = {
    quote: t("linkedin.quote"),
    author: t("linkedin.author"),
    title: t("linkedin.title"),
    company: t("linkedin.company"),
    date: t("linkedin.date"),
    url: t("linkedin.linkedinUrl"),
  };

  return (
    <section id="vouches" className="relative overflow-hidden bg-paper-warm/40">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(180, 141, 60, 0.06), transparent 70%)" }}
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
      </div>

      {/* LinkedIn recommendation — compact quote */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8 md:pb-10">
        <FadeUp>
          <div className="relative max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-paper border border-teal/20 overflow-hidden">
            <Quote
              className="absolute top-3 right-3 text-teal/10"
              size={60}
              strokeWidth={1}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal flex-shrink-0">
                  <Quote size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">LinkedIn Recommendation</p>
                  <p className="text-xs text-ink-dim body-serif">{linkedIn.date}</p>
                </div>
              </div>

              <blockquote className="body-serif text-sm md:text-base text-ink-soft leading-relaxed mb-5 whitespace-pre-line line-clamp-4">
                {linkedIn.quote}
              </blockquote>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                <div>
                  <p className="display text-ink text-lg md:text-xl">{linkedIn.author}</p>
                  <p className="text-xs text-ink-dim body-serif">{linkedIn.title}</p>
                </div>
                <Magnetic strength={0.4}>
                  <a
                    href={linkedIn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-paper bg-teal hover:bg-teal-bright transition-colors px-4 py-2 rounded-full font-medium whitespace-nowrap"
                  >
                    <ExternalLink size={12} />
                    {t("viewOnLinkedIn")}
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Formal recommendation letters — downloadable cards */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
        <Reveal>
          <h3 className="display text-ink text-2xl md:text-3xl mb-10">
            {t("formalLettersTitle")}
          </h3>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {letters.map((letter, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <motion.a
                href={letter.file}
                target="_blank"
                rel="noopener noreferrer"
                download
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group block h-full p-7 rounded-2xl bg-paper border border-border hover:border-teal/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
                    <Download size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                    {letter.subtitle}
                  </span>
                </div>

                <h4 className="display text-ink text-2xl md:text-3xl mb-3 leading-tight">{letter.title}</h4>

                <p className="body-serif text-sm text-ink-soft leading-relaxed mb-5 italic">
                  &ldquo;{letter.excerpt}&rdquo;
                </p>

                <div className="pt-5 border-t border-border">
                  <p className="text-sm text-ink font-medium body-serif">{letter.author}</p>
                  <p className="text-xs text-ink-dim body-serif mt-1">{letter.authorTitle}</p>
                  <p className="text-xs text-ink-dim body-serif mt-1">{letter.date}</p>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-xs text-teal group-hover:text-teal-bright transition-colors">
                  <Download size={12} />
                  <span className="link-underline">{t("downloadLetter")}</span>
                </div>
              </motion.a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
