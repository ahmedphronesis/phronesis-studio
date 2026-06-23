"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { GraduationCap, Building2, BookOpen } from "lucide-react";

const AUDIENCES = [
  {
    icon: GraduationCap,
    eyebrow: "Audience I",
    title: "Schools & Educational Institutions",
    range: "30K – 150K AED · per project",
    description:
      "Custom educational platforms — LMS, MUN systems, assessment tools, parent portals, curriculum-aligned learning experiences. Built to ADEK and Irtiqa'a standards, PDPL-compliant, and shaped by someone inside the classroom.",
    advantages: [
      "ADEK-licensed teacher (Grades 1–12, American Curriculum)",
      "Built MSCS Academy and DiplomatiQ — both live",
      "Faculty Head for MUN at his own school",
      "Understands ELL differentiation, gifted learners, and what teachers actually need",
    ],
    proof: "MSCS Academy · DiplomatiQ",
  },
  {
    icon: Building2,
    eyebrow: "Audience II",
    title: "SMEs & Property Companies",
    range: "15K – 100K AED · per project",
    description:
      "Custom operational systems — property management, finance and invoice tracking, CRM, booking systems, anything that today runs on Excel and prayer. Built by someone who has run operations under ISO 9001 and ISO 45001.",
    advantages: [
      "Real Estate Emperor: 400+ units managed live for a paying client",
      "ISO 9001 / 45001 operations background",
      "Former Branch Operations Manager (UAE)",
      "Understands rent allocation, P&L, reconciliation — not just code",
    ],
    proof: "Real Estate Emperor · Al Reef (production)",
  },
  {
    icon: BookOpen,
    eyebrow: "Audience III",
    title: "Cultural & Philosophical Organizations",
    range: "20K – 80K AED · per project",
    description:
      "Digital platforms for knowledge organizations — research repositories, member portals, podcast infrastructure, event systems, multilingual publishing. Built by a philosopher who has done manuscript work at Bibliotheca Alexandrina and research for Emory University.",
    advantages: [
      "BA Philosophy, Alexandria University",
      "Member, British Philosophical Association (BPA)",
      "Creator and host of Echoes of Wisdom podcast",
      "Published research assistant (Emory University, Islamic Civilization)",
    ],
    proof: "Echoes of Wisdom · Bibliotheca Alexandrina",
  },
];

export function Audiences() {
  return (
    <section id="audiences" className="relative py-32 md:py-44 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Whom I Serve</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.2rem,5vw,4rem)] max-w-4xl mb-6">
            Three audiences. One method.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            I don't take every project. I take the ones where I have an unfair advantage — where my lived experience inside the domain meets my ability to build. These are the three rooms I know how to read.
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-3 gap-6 lg:gap-8">
          <Stagger gap={0.16}>
            {AUDIENCES.map((a) => {
              const Icon = a.icon;
              return (
                <FadeUp key={a.title}>
                  <article className="group h-full p-8 md:p-9 rounded-2xl bg-charcoal border border-border hover:border-gold/40 transition-all duration-500 hover:translate-y-[-4px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim">
                        {a.eyebrow}
                      </span>
                    </div>

                    <h3 className="display text-cream text-2xl md:text-[1.7rem] leading-tight mb-3">
                      {a.title}
                    </h3>

                    <p className="text-xs uppercase tracking-[0.18em] text-gold mb-5">
                      {a.range}
                    </p>

                    <p className="text-sm text-cream/75 leading-relaxed mb-7">
                      {a.description}
                    </p>

                    <div className="gold-rule opacity-30 mb-6" />

                    <ul className="space-y-2.5 mb-7">
                      {a.advantages.map((adv) => (
                        <li key={adv} className="flex items-start gap-3 text-xs text-cream/65 leading-relaxed">
                          <span className="text-gold mt-[2px] flex-shrink-0">·</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-5 border-t border-border/60">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim mb-1">
                        Proof of work
                      </p>
                      <p className="text-sm text-cream/85 display-italic">
                        {a.proof}
                      </p>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
