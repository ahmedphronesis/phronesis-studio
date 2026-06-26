"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { EASE } from "../anim";

/**
 * Neural Network of Clouds — Work Visualization
 *
 * Concept: All programs built by the Studio of Phronesis are manifestations
 * of ONE METHOD (phronesis). The visualization renders each program as a
 * "cloud" node connected to a central "ΦΡΟΝΗΣΙΣ" node via animated neural
 * pathways. This makes the philosophical claim visible: one discipline,
 * many expressions.
 *
 * Implementation:
 * - SVG layer: animated connection paths (curved beziers with flowing dashes)
 * - HTML layer: absolutely-positioned cloud divs (easier for text + shadows)
 * - Hover on a cloud: scales up, highlights its connection, shows rationale
 * - Mobile: switches to a stacked vertical layout with simplified connectors
 * - RTL-aware: layout mirrors for Arabic
 */

type CloudId = "realestate" | "mscs" | "diplomatiq" | "math" | "echoes" | "treasury";

type Cloud = {
  id: CloudId;
  /** Position on desktop (percentages of the SVG viewBox) */
  x: number;
  y: number;
  /** Domain color */
  hue: "teal" | "terracotta" | "gold" | "forest";
  /** i18n keys under workContent.neural */
  nameKey: string;
  descKey: string;
  rationaleKey: string;
  /** Optional external URL */
  url?: string;
};

const CLOUDS: Cloud[] = [
  {
    id: "realestate",
    x: 50, y: 12,
    hue: "teal",
    nameKey: "neural.clouds.realestate.name",
    descKey: "neural.clouds.realestate.desc",
    rationaleKey: "neural.clouds.realestate.rationale",
    url: "https://real-estate-emperor.vercel.app",
  },
  {
    id: "mscs",
    x: 88, y: 32,
    hue: "gold",
    nameKey: "neural.clouds.mscs.name",
    descKey: "neural.clouds.mscs.desc",
    rationaleKey: "neural.clouds.mscs.rationale",
    url: "https://mscs-academy.vercel.app",
  },
  {
    id: "diplomatiq",
    x: 88, y: 68,
    hue: "gold",
    nameKey: "neural.clouds.diplomatiq.name",
    descKey: "neural.clouds.diplomatiq.desc",
    rationaleKey: "neural.clouds.diplomatiq.rationale",
    url: "https://mun-diplomatiq.vercel.app",
  },
  {
    id: "treasury",
    x: 50, y: 88,
    hue: "terracotta",
    nameKey: "neural.clouds.treasury.name",
    descKey: "neural.clouds.treasury.desc",
    rationaleKey: "neural.clouds.treasury.rationale",
  },
  {
    id: "math",
    x: 12, y: 68,
    hue: "gold",
    nameKey: "neural.clouds.math.name",
    descKey: "neural.clouds.math.desc",
    rationaleKey: "neural.clouds.math.rationale",
  },
  {
    id: "echoes",
    x: 12, y: 32,
    hue: "forest",
    nameKey: "neural.clouds.echoes.name",
    descKey: "neural.clouds.echoes.desc",
    rationaleKey: "neural.clouds.echoes.rationale",
  },
];

const HUE_COLORS: Record<Cloud["hue"], { stroke: string; glow: string; text: string; bg: string }> = {
  teal: { stroke: "#0F5C5E", glow: "rgba(15,92,94,0.25)", text: "text-teal", bg: "bg-teal/5" },
  terracotta: { stroke: "#B5462A", glow: "rgba(181,70,42,0.25)", text: "text-terracotta", bg: "bg-terracotta/5" },
  gold: { stroke: "#B48D3C", glow: "rgba(180,141,60,0.25)", text: "text-gold", bg: "bg-gold/5" },
  forest: { stroke: "#2D6A4F", glow: "rgba(45,106,79,0.25)", text: "text-forest", bg: "bg-forest/5" },
};

/** Center node coordinates */
const CENTER = { x: 50, y: 50 };

export function NeuralWork() {
  const t = useTranslations("workContent");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [active, setActive] = useState<CloudId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeCloud = CLOUDS.find((c) => c.id === active);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Eyebrow + title */}
      <div className="text-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <span className="h-px w-8 bg-teal/40" />
          <span className="eyebrow">{t("neural.eyebrow")}</span>
          <span className="h-px w-8 bg-teal/40" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="display text-ink leading-[1.05] mb-5"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
        >
          {t("neural.title")}{" "}
          <span className="display-italic text-teal">{t("neural.titleItalic")}</span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="body-serif text-sm md:text-base text-ink-soft leading-relaxed max-w-2xl mx-auto"
        >
          {t("neural.intro")}
        </motion.p>
      </div>

      {/* Desktop: radial neural network */}
      {!isMobile && (
        <div className="relative w-full" style={{ aspectRatio: "1 / 1", maxWidth: "900px", margin: "0 auto" }}>
          {/* SVG layer — animated connection paths */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            {/* Glow filter for paths */}
            <defs>
              <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection paths from center to each cloud */}
            {CLOUDS.map((cloud) => {
              const isActive = active === cloud.id;
              const isDimmed = active !== null && !isActive;
              const color = HUE_COLORS[cloud.hue];
              // Curved bezier from center to cloud
              const midX = (CENTER.x + cloud.x) / 2;
              const midY = (CENTER.y + cloud.y) / 2;
              const offset = 8;
              const cpX = midX + (cloud.y - CENTER.y) / 10;
              const cpY = midY - (cloud.x - CENTER.x) / 10;
              const path = `M ${CENTER.x} ${CENTER.y} Q ${cpX} ${cpY} ${cloud.x} ${cloud.y}`;
              return (
                <g key={cloud.id}>
                  {/* Static faint line */}
                  <path
                    d={path}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={isActive ? 0.5 : 0.25}
                    strokeOpacity={isDimmed ? 0.1 : isActive ? 0.4 : 0.2}
                    style={{ transition: "stroke-opacity 0.4s, stroke-width 0.4s" }}
                  />
                  {/* Animated flowing dashes */}
                  <path
                    d={path}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={isActive ? 0.6 : 0.35}
                    strokeOpacity={isDimmed ? 0 : isActive ? 0.9 : 0.5}
                    strokeDasharray="2 4"
                    style={{
                      transition: "stroke-opacity 0.4s",
                      filter: isActive ? "url(#neuralGlow)" : "none",
                    }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-12"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Pulsing dot at cloud endpoint */}
                  <circle
                    cx={cloud.x}
                    cy={cloud.y}
                    r={isActive ? 1.2 : 0.6}
                    fill={color.stroke}
                    opacity={isDimmed ? 0.2 : 1}
                    style={{ transition: "r 0.4s, opacity 0.4s" }}
                  >
                    <animate
                      attributeName="r"
                      values={isActive ? "1.2;1.8;1.2" : "0.6;0.9;0.6"}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Cross-connections between adjacent clouds (subtle) */}
            {CLOUDS.map((cloud, i) => {
              const next = CLOUDS[(i + 1) % CLOUDS.length];
              const isAnyActive = active !== null;
              const opacity = isAnyActive ? 0.02 : 0.06;
              const path = `M ${cloud.x} ${cloud.y} Q ${CENTER.x} ${CENTER.y} ${next.x} ${next.y}`;
              return (
                <path
                  key={`cross-${cloud.id}`}
                  d={path}
                  fill="none"
                  stroke="#B48D3C"
                  strokeWidth={0.12}
                  strokeOpacity={opacity}
                  strokeDasharray="0.5 2"
                />
              );
            })}
          </svg>

          {/* Center node — ΦΡΟΝΗΣΙΣ / ONE METHOD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
            className="absolute"
            style={{
              left: `${CENTER.x}%`,
              top: `${CENTER.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <div className="relative">
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border border-teal/30"
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                style={{ width: "120px", height: "120px", left: "-60px", top: "-60px" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border border-teal/20"
                animate={{ scale: [1, 1.9, 1.9], opacity: [0.4, 0, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
                style={{ width: "120px", height: "120px", left: "-60px", top: "-60px" }}
              />
              {/* Core */}
              <motion.div
                animate={{ scale: active ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-paper border-2 border-teal/40 flex flex-col items-center justify-center text-center shadow-lg"
                style={{ boxShadow: "0 0 60px rgba(15,92,94,0.15), 0 0 120px rgba(15,92,94,0.08)" }}
              >
                <div
                  className="text-2xl md:text-3xl text-gold leading-none mb-1"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
                >
                  ΦΡΟΝΗΣΙΣ
                </div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-teal font-mono">
                  {t("neural.centerMethod")}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Cloud nodes */}
          {CLOUDS.map((cloud, i) => {
            const isActive = active === cloud.id;
            const isDimmed = active !== null && !isActive;
            const color = HUE_COLORS[cloud.hue];
            return (
              <motion.div
                key={cloud.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.4 + i * 0.1 }}
                className="absolute"
                style={{
                  left: `${cloud.x}%`,
                  top: `${cloud.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isActive ? 20 : 5,
                }}
              >
                <motion.button
                  onMouseEnter={() => setActive(cloud.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(isActive ? null : cloud.id)}
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    opacity: isDimmed ? 0.45 : 1,
                  }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="group relative block text-center cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  {/* Cloud shape */}
                  <div
                    className={`relative px-5 py-3 md:px-6 md:py-4 rounded-[2rem] bg-paper border ${color.bg} transition-all duration-500`}
                    style={{
                      borderColor: isActive ? color.stroke : "var(--border)",
                      boxShadow: isActive
                        ? `0 8px 32px ${color.glow}, 0 0 0 1px ${color.stroke}`
                        : "0 2px 8px rgba(0,0,0,0.04)",
                      minWidth: "140px",
                    }}
                  >
                    {/* Cloud "puff" decorations */}
                    <div
                      className="absolute -top-2 left-4 w-6 h-6 rounded-full bg-paper"
                      style={{ borderTop: "1px solid var(--border)" }}
                    />
                    <div
                      className="absolute -top-1 right-6 w-4 h-4 rounded-full bg-paper"
                      style={{ borderTop: "1px solid var(--border)" }}
                    />

                    <div className={`text-[9px] uppercase tracking-[0.22em] ${color.text} font-mono mb-1`}>
                      {t(`neural.clouds.${cloud.id}.domain`)}
                    </div>
                    <div
                      className="display text-ink leading-tight"
                      style={{ fontSize: "1.05rem", fontWeight: 500 }}
                    >
                      {t(cloud.nameKey)}
                    </div>
                    <div className="body-serif text-[11px] text-ink-dim mt-1 leading-snug max-w-[180px]">
                      {t(cloud.descKey)}
                    </div>

                    {/* Hover hint */}
                    <div className={`mt-2 text-[9px] uppercase tracking-[0.2em] ${color.text} font-mono opacity-0 group-hover:opacity-70 transition-opacity`}>
                      {t("neural.clickToExpand")}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Mobile: stacked vertical layout with simplified connectors */}
      {isMobile && (
        <div className="relative">
          {/* Center node at top */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full bg-paper border-2 border-teal/40 flex flex-col items-center justify-center text-center shadow-lg">
              <div
                className="text-xl text-gold leading-none mb-1"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
              >
                ΦΡΟΝΗΣΙΣ
              </div>
              <div className="text-[8px] uppercase tracking-[0.22em] text-teal font-mono">
                {t("neural.centerMethod")}
              </div>
            </div>
            <div className="w-px h-8 bg-teal/20 mt-2" />
          </div>

          {/* Stacked clouds */}
          <div className="space-y-4">
            {CLOUDS.map((cloud, i) => {
              const isActive = active === cloud.id;
              const color = HUE_COLORS[cloud.hue];
              return (
                <motion.div
                  key={cloud.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                >
                  <button
                    onClick={() => setActive(isActive ? null : cloud.id)}
                    className="w-full text-right"
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <div
                      className={`relative px-5 py-4 rounded-[1.5rem] bg-paper border transition-all duration-400 ${color.bg}`}
                      style={{
                        borderColor: isActive ? color.stroke : "var(--border)",
                        boxShadow: isActive ? `0 8px 24px ${color.glow}` : "0 1px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className={`text-[9px] uppercase tracking-[0.22em] ${color.text} font-mono mb-1`}>
                        {t(`neural.clouds.${cloud.id}.domain`)}
                      </div>
                      <div className="display text-ink text-lg leading-tight">{t(cloud.nameKey)}</div>
                      <div className="body-serif text-xs text-ink-dim mt-1 leading-snug">
                        {t(cloud.descKey)}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rationale panel — appears below the visualization when a cloud is active */}
      <AnimatePresence mode="wait">
        {activeCloud && (
          <motion.div
            key={activeCloud.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-16 md:mt-24 max-w-4xl mx-auto"
          >
            <div
              className="relative p-8 md:p-12 rounded-3xl bg-paper-warm border overflow-hidden"
              style={{ borderColor: `${HUE_COLORS[activeCloud.hue].stroke}40` }}
            >
              {/* Decorative corner accent */}
              <div
                className="absolute top-0 left-0 w-32 h-32 rounded-br-[6rem] opacity-10"
                style={{ backgroundColor: HUE_COLORS[activeCloud.hue].stroke }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="h-px w-12"
                    style={{ backgroundColor: HUE_COLORS[activeCloud.hue].stroke }}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-[0.25em] font-mono ${HUE_COLORS[activeCloud.hue].text}`}
                  >
                    {t("neural.rationaleLabel")}
                  </span>
                </div>

                <h4
                  className="display text-ink leading-[1.05] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  {t(activeCloud.nameKey)}
                </h4>

                <p className="body-serif text-base md:text-lg text-ink-soft leading-[1.8] mb-8">
                  {t(activeCloud.rationaleKey)}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                    {t("neural.domainLabel")}:{" "}
                    <span className={HUE_COLORS[activeCloud.hue].text}>
                      {t(`neural.clouds.${activeCloud.id}.domain`)}
                    </span>
                  </div>
                  {activeCloud.url && (
                    <a
                      href={activeCloud.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm ${HUE_COLORS[activeCloud.hue].text} ml-auto`}
                    >
                      <span className="link-underline">{t("visitSite")}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text when nothing is selected */}
      {!activeCloud && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-[11px] uppercase tracking-[0.25em] text-ink-dim font-mono"
        >
          {t("neural.hoverHint")}
        </motion.div>
      )}
    </div>
  );
}
