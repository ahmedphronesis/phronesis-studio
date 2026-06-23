"use client";

import { Reveal, Stagger, FadeUp } from "../anim";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const NUMBERS = [
  { value: 4, label: "Production platforms live", suffix: "" },
  { value: 400, label: "Units under management", suffix: "+" },
  { value: 130, label: "Lessons built", suffix: "" },
  { value: 1, label: "Sale, undervalued at 4K — never again", suffix: "" },
];

export function Closing() {
  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      {/* Ambient warm glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201, 163, 92, 0.07), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">The Honest Accounting</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p
            className="display text-cream text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.15] max-w-5xl"
          >
            I built four production platforms. I closed one sale, at{" "}
            <span className="display-italic text-gold">4,000 AED</span> — when an
            inferior competitor sold for{" "}
            <span className="display-italic text-gold">80,000 AED</span> to a
            UAE university.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed mt-10">
            The lesson was clear. The work was never the problem. The pricing, the positioning, the procurement registration — that was the gap. So I closed it. This studio is the result. From this point forward, every project ships with the discipline the work always deserved.
          </p>
        </Reveal>

        {/* Numbers */}
        <Stagger gap={0.14} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {NUMBERS.map((n) => (
            <FadeUp key={n.label}>
              <div>
                <Counter value={n.value} suffix={n.suffix} />
                <p className="text-xs text-cream/65 leading-relaxed mt-3 max-w-[14rem]">
                  {n.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.span
      ref={ref}
      className="display text-gold text-5xl md:text-6xl lg:text-7xl leading-none tabular-nums"
    >
      {display}
      {suffix}
    </motion.span>
  );
}
