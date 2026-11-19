"use client";

import { useTranslations, useLocale } from "next-intl";
import { Reveal, FadeUp, EASE } from "../anim";

/**
 * EngagementsPageContent — the full Professional Engagements page.
 * Renders the same EngagementsSection content as on the Work page,
 * but as a standalone page with its own header.
 */
export function EngagementsPageContent() {
  const t = useTranslations("work");
  const locale = useLocale();
  const isAR = locale === "ar";

  const modules = [
    { title: t("engagementsModule1"), desc: t("engagementsModule1Desc"), date: t("engagementsModule1Date"), delivered: true },
    { title: t("engagementsModule2"), desc: t("engagementsModule2Desc"), date: t("engagementsModule2Date"), delivered: true },
    { title: t("engagementsModule3"), desc: t("engagementsModule3Desc"), date: t("engagementsModule3Date"), delivered: true },
    { title: t("engagementsModule4"), desc: t("engagementsModule4Desc"), date: t("engagementsModule4Date"), delivered: false },
    { title: t("engagementsModule5"), desc: t("engagementsModule5Desc"), date: t("engagementsModule5Date"), delivered: false },
    { title: t("engagementsModule6"), desc: t("engagementsModule6Desc"), date: t("engagementsModule6Date"), delivered: false },
    { title: t("engagementsModule7"), desc: t("engagementsModule7Desc"), date: t("engagementsModule7Date"), delivered: false },
    { title: t("engagementsModule8"), desc: t("engagementsModule8Desc"), date: t("engagementsModule8Date"), delivered: false },
  ];

  const photos = [
    { src: "/engagements/clic-module1-group.jpg", caption: t("engagementsPhoto1Caption") },
    { src: "/engagements/clic-module1-training.jpg", caption: t("engagementsPhoto2Caption") },
    { src: "/engagements/clic-module1-workshop.jpg", caption: t("engagementsPhoto3Caption") },
    { src: "/engagements/clic-module2-group.jpg", caption: t("engagementsPhoto4Caption") },
    { src: "/engagements/clic-module3-group.jpg", caption: t("engagementsPhoto5Caption") },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(180, 141, 60, 0.06), transparent 70%)" }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-8 md:pb-12">
        <Reveal>
          <div className={`flex items-center gap-4 mb-8 ${isAR ? "flex-row-reverse" : ""}`}>
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("engagementsEyebrow")}</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="display text-ink leading-[1.05] mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>
            {t("engagementsTitle")}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className={`body-serif text-base md:text-lg text-ink-soft leading-relaxed max-w-4xl ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            {t("engagementsIntro")}
          </p>
        </Reveal>
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

        {/* Program modules */}
        <FadeUp delay={0.2}>
          <div className={`mt-8 md:mt-10 ${isAR ? "text-right" : ""}`} dir={isAR ? "rtl" : "ltr"}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono mb-4">{t("engagementsModulesLabel")}</p>
            <div className="space-y-4">
              {modules.map((m, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-2 md:gap-4 p-4 rounded-xl border ${m.delivered ? "bg-teal/5 border-teal/20" : "bg-paper-warm/50 border-border/40"} ${isAR ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${m.delivered ? "bg-teal/10 border border-teal/30 text-teal" : "bg-gold/10 border border-gold/30 text-gold/70"}`}>
                    {m.delivered ? "\u2713" : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center gap-2 flex-wrap ${isAR ? "flex-row-reverse" : ""}`}>
                      <p className="display text-ink text-sm md:text-base font-medium" style={{ fontFamily: isAR ? "var(--font-amiri)" : "var(--font-cormorant)" }}>{m.title}</p>
                      {m.delivered && <span className="text-[10px] uppercase tracking-wider text-teal font-mono bg-teal/10 px-2 py-0.5 rounded-full">Delivered</span>}
                    </div>
                    <p className="body-serif text-xs md:text-sm text-ink-dim mt-1 leading-relaxed">{m.desc}</p>
                    <p className={`text-[11px] text-ink-dim/70 font-mono mt-1.5 ${isAR ? "text-right" : ""}`}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Photo gallery — horizontal auto-scroll carousel, pauses on hover/touch */}
        <FadeUp delay={0.3}>
          <div
            className="mt-8 overflow-hidden relative"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)",
            }}
          >
            <div
              className="flex gap-4 w-max"
              style={{
                animation: "engagements-scroll 40s linear infinite",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
              onTouchStart={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
              onTouchEnd={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
            >
              {[...photos, ...photos].map((photo, i) => (
                <div key={i} className="flex-shrink-0 w-64 md:w-72 rounded-xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-44 md:h-48 object-cover"
                  />
                  <p className="body-serif text-xs text-ink-dim p-3 bg-paper-warm border-t border-border/40">
                    {photo.caption}
                  </p>
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
    </section>
  );
}
