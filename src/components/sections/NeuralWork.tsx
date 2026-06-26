"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { EASE } from "../anim";

/**
 * Neural Network of Clouds — Vitruvian Edition
 *
 * Inspired by Leonardo's Vitruvian Man: a central principle (ΦΡΟΝΗΣΙΣ) inscribed
 * in sacred geometry (circle + square), with six program-clouds radiating outward
 * like limbs of one body. The neural pathways are not simple lines — they are
 * branching, synapse-bearing connections with marching-color gradients that flow
 * from the center to each cloud, symbolizing the one method animating every
 * expression.
 *
 * Visual layers (bottom to top):
 *   1. Faint Vitruvian circle + inscribed square + compass axes
 *   2. Neural connection paths (curved beziers with synapse nodes)
 *   3. Marching-color gradient flow (animated dashes traveling along paths)
 *   4. Cloud silhouettes (real SVG cumulus paths, not rectangles)
 *   5. Cloud text content (HTML overlay — name, domain, description)
 *   6. Center node (ΦΡΟΝΗΣΙΣ · One Method) with pulsing rings
 *
 * Interaction:
 *   - Hover/tap a cloud → highlights its connection, dims others
 *   - Click a cloud → smooth-scrolls to the always-visible rationale panel below
 *
 * Layout:
 *   - Desktop: wide 16:9 aspect ratio, fills container width
 *   - Mobile: stacked vertical with simplified connectors
 */

type CloudId = "realestate" | "mscs" | "diplomatiq" | "math" | "echoes" | "treasury";

type Cloud = {
  id: CloudId;
  /** Position in the 100×56 viewBox (16:9 ratio) */
  x: number;
  y: number;
  /** Domain color */
  hue: "teal" | "terracotta" | "gold" | "forest";
  nameKey: string;
  descKey: string;
  rationaleKey: string;
  url?: string;
};

// Cloud positions in a 16:9 viewBox (100 wide × 56.25 tall)
// Arranged in an oval — wider than tall — to fill the desktop width
const CLOUDS: Cloud[] = [
  { id: "realestate", x: 50, y: 7,  hue: "teal",       nameKey: "neural.clouds.realestate.name",    descKey: "neural.clouds.realestate.desc",    rationaleKey: "neural.clouds.realestate.rationale",    url: "https://real-estate-emperor.vercel.app" },
  { id: "mscs",       x: 87, y: 20, hue: "gold",       nameKey: "neural.clouds.mscs.name",          descKey: "neural.clouds.mscs.desc",          rationaleKey: "neural.clouds.mscs.rationale",          url: "https://mscs-academy.vercel.app" },
  { id: "diplomatiq", x: 87, y: 38, hue: "gold",       nameKey: "neural.clouds.diplomatiq.name",    descKey: "neural.clouds.diplomatiq.desc",    rationaleKey: "neural.clouds.diplomatiq.rationale",    url: "https://mun-diplomatiq.vercel.app" },
  { id: "treasury",   x: 50, y: 50, hue: "terracotta", nameKey: "neural.clouds.treasury.name",      descKey: "neural.clouds.treasury.desc",      rationaleKey: "neural.clouds.treasury.rationale" },
  { id: "math",       x: 13, y: 38, hue: "gold",       nameKey: "neural.clouds.math.name",          descKey: "neural.clouds.math.desc",          rationaleKey: "neural.clouds.math.rationale" },
  { id: "echoes",     x: 13, y: 20, hue: "forest",     nameKey: "neural.clouds.echoes.name",        descKey: "neural.clouds.echoes.desc",        rationaleKey: "neural.clouds.echoes.rationale" },
];

const CENTER = { x: 50, y: 28 };

const HUE_HEX: Record<Cloud["hue"], string> = {
  teal: "#0F5C5E",
  terracotta: "#B5462A",
  gold: "#B48D3C",
  forest: "#2D6A4F",
};

const HUE_TEXT: Record<Cloud["hue"], string> = {
  teal: "text-teal",
  terracotta: "text-terracotta",
  gold: "text-gold",
  forest: "text-forest",
};

/** Cloud SVG path — a cumulus silhouette in a 100×60 viewBox.
 *  Drawn as a closed path with organic bumps. */
const CLOUD_PATH =
  "M 25,52 " +
  "C 18,52 12,47 13,40 " +
  "C 5,38 3,28 12,24 " +
  "C 12,12 28,8 36,16 " +
  "C 42,6 58,6 64,16 " +
  "C 72,8 88,12 88,24 " +
  "C 97,28 95,38 87,40 " +
  "C 88,47 82,52 75,52 " +
  "Z";

/** Generate a curved bezier path from center to a cloud, with a slight S-curve */
function neuralPath(cx: number, cy: number, tx: number, ty: number): string {
  const dx = tx - cx;
  const dy = ty - cy;
  // Two control points for an organic S-curve
  const cp1x = cx + dx * 0.35 + dy * 0.08;
  const cp1y = cy + dy * 0.35 - dx * 0.08;
  const cp2x = cx + dx * 0.65 - dy * 0.08;
  const cp2y = cy + dy * 0.65 + dx * 0.08;
  return `M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

/** Points along a bezier for synapse node placement */
function bezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const mt = 1 - t;
  const x = mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0];
  const y = mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1];
  return [x, y];
}

function getControlPoints(cx: number, cy: number, tx: number, ty: number): [[number, number], [number, number]] {
  const dx = tx - cx;
  const dy = ty - cy;
  return [
    [cx + dx * 0.35 + dy * 0.08, cy + dy * 0.35 - dx * 0.08],
    [cx + dx * 0.65 - dy * 0.08, cy + dy * 0.65 + dx * 0.08],
  ];
}

export function NeuralWork() {
  const t = useTranslations("workContent");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [active, setActive] = useState<CloudId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rationaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeCloud = CLOUDS.find((c) => c.id === active) || CLOUDS[0];

  const handleCloudClick = (cloud: Cloud) => {
    setActive(cloud.id);
    setTimeout(() => {
      rationaleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="relative w-full">
      {/* Eyebrow + title */}
      <div className="text-center mb-10 md:mb-14">
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

      {/* ─── DESKTOP: Wide Vitruvian neural field ─── */}
      {!isMobile && (
        <div
          className="relative w-full mx-auto"
          style={{ maxWidth: "1100px" }}
        >
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {/* SVG layer — geometry, connections, cloud silhouettes */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 56.25"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "visible" }}
            >
              <defs>
                {/* Marching-color gradient — flows along connection paths */}
                <linearGradient id="marchingFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0F5C5E" />
                  <stop offset="25%" stopColor="#B48D3C" />
                  <stop offset="50%" stopColor="#B5462A" />
                  <stop offset="75%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#0F5C5E" />
                </linearGradient>

                {/* Cloud gradient — soft paper fill with domain tint */}
                <radialGradient id="cloudFillTeal" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0F5C5E" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient id="cloudFillGold" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B48D3C" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient id="cloudFillTerracotta" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B5462A" stopOpacity="0.08" />
                </radialGradient>
                <radialGradient id="cloudFillForest" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.08" />
                </radialGradient>

                {/* Glow filter */}
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Cloud path definition */}
                <path id="cloudShape" d={CLOUD_PATH} />
              </defs>

              {/* ── Vitruvian geometry: circle + square + axes ── */}
              <g opacity="0.12">
                {/* Outer circle */}
              <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="24"
                  fill="none"
                  stroke="#0F5C5E"
                  strokeWidth="0.15"
                  strokeDasharray="0.5 1"
                />
                {/* Inscribed square (Vitruvian reference) */}
                <rect
                  x={CENTER.x - 20}
                  y={CENTER.y - 20}
                  width="40"
                  height="40"
                  fill="none"
                  stroke="#B48D3C"
                  strokeWidth="0.12"
                  strokeDasharray="0.3 0.8"
                  opacity="0.6"
                />
                {/* Compass axes */}
                <line x1={CENTER.x} y1={CENTER.y - 26} x2={CENTER.x} y2={CENTER.y + 26} stroke="#0F5C5E" strokeWidth="0.08" strokeDasharray="0.3 0.6" />
                <line x1={CENTER.x - 26} y1={CENTER.y} x2={CENTER.x + 26} y2={CENTER.y} stroke="#0F5C5E" strokeWidth="0.08" strokeDasharray="0.3 0.6" />
                {/* Tick marks on circle (compass rose) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = CENTER.x + Math.cos(rad) * 23;
                  const y1 = CENTER.y + Math.sin(rad) * 23;
                  const x2 = CENTER.x + Math.cos(rad) * 25;
                  const y2 = CENTER.y + Math.sin(rad) * 25;
                  return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0F5C5E" strokeWidth="0.1" />;
                })}
              </g>

              {/* ── Neural connection paths ── */}
              {CLOUDS.map((cloud) => {
                const isActive = active === cloud.id;
                const isDimmed = active !== null && !isActive;
                const hueHex = HUE_HEX[cloud.hue];
                const path = neuralPath(CENTER.x, CENTER.y, cloud.x, cloud.y);
                const [cp1, cp2] = getControlPoints(CENTER.x, CENTER.y, cloud.x, cloud.y);
                // Synapse node positions along the bezier
                const synapsePositions = [0.25, 0.5, 0.75].map((tt) =>
                  bezierPoint(tt, [CENTER.x, CENTER.y], cp1, cp2, [cloud.x, cloud.y])
                );

                return (
                  <g key={cloud.id}>
                    {/* Base wire — faint static line */}
                    <path
                      d={path}
                      fill="none"
                      stroke={hueHex}
                      strokeWidth={isActive ? 0.35 : 0.18}
                      strokeOpacity={isDimmed ? 0.08 : isActive ? 0.35 : 0.18}
                      style={{ transition: "stroke-opacity 0.4s, stroke-width 0.4s" }}
                    />

                    {/* Marching-color flow — animated dashed gradient */}
                    <path
                      d={path}
                      fill="none"
                      stroke="url(#marchingFlow)"
                      strokeWidth={isActive ? 0.5 : 0.3}
                      strokeOpacity={isDimmed ? 0 : isActive ? 0.95 : 0.6}
                      strokeDasharray="1.5 3"
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-opacity 0.4s, stroke-width 0.4s",
                        filter: isActive ? "url(#softGlow)" : "none",
                      }}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-9"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Synapse nodes — glowing dots along the path */}
                    {synapsePositions.map(([sx, sy], i) => (
                      <g key={i}>
                        <circle
                          cx={sx}
                          cy={sy}
                          r={isActive ? 0.5 : 0.3}
                          fill={hueHex}
                          opacity={isDimmed ? 0.1 : isActive ? 0.9 : 0.5}
                          style={{ transition: "r 0.4s, opacity 0.4s" }}
                        >
                          <animate
                            attributeName="r"
                            values={isActive ? "0.5;0.8;0.5" : "0.3;0.45;0.3"}
                            dur="2s"
                            begin={`${i * 0.3}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* Synapse halo */}
                        <circle
                          cx={sx}
                          cy={sy}
                          r={isActive ? 1.2 : 0.7}
                          fill="none"
                          stroke={hueHex}
                          strokeWidth="0.08"
                          opacity={isDimmed ? 0.05 : isActive ? 0.3 : 0.15}
                          style={{ transition: "r 0.4s, opacity 0.4s" }}
                        />
                      </g>
                    ))}

                    {/* Connection endpoint — where the path meets the cloud */}
                    <circle
                      cx={cloud.x}
                      cy={cloud.y}
                      r={isActive ? 0.8 : 0.5}
                      fill={hueHex}
                      opacity={isDimmed ? 0.2 : 1}
                      style={{ transition: "r 0.4s, opacity 0.4s" }}
                    >
                      <animate
                        attributeName="r"
                        values={isActive ? "0.8;1.2;0.8" : "0.5;0.7;0.5"}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

              {/* ── Cloud silhouettes ── */}
              {CLOUDS.map((cloud) => {
                const isActive = active === cloud.id;
                const isDimmed = active !== null && !isActive;
                const hueHex = HUE_HEX[cloud.hue];
                const fillId =
                  cloud.hue === "teal" ? "cloudFillTeal" :
                  cloud.hue === "gold" ? "cloudFillGold" :
                  cloud.hue === "terracotta" ? "cloudFillTerracotta" : "cloudFillForest";
                // Cloud is 22 units wide, 13 tall, centered on cloud.x, cloud.y
                const scale = isActive ? 0.26 : 0.22;
                const tx = cloud.x - 50 * scale;
                const ty = cloud.y - 30 * scale;

                return (
                  <g key={`cloud-${cloud.id}`}>
                    <use
                      href="#cloudShape"
                      transform={`translate(${tx} ${ty}) scale(${scale})`}
                      fill={`url(#${fillId})`}
                      stroke={hueHex}
                      strokeWidth={isActive ? 0.5 / scale : 0.3 / scale}
                      strokeOpacity={isDimmed ? 0.15 : isActive ? 0.7 : 0.35}
                      style={{
                        transition: "stroke-opacity 0.4s, stroke-width 0.4s",
                        filter: isActive ? `drop-shadow(0 0 1px ${hueHex}40)` : "none",
                      }}
                    />
                    {/* Cloud shadow — soft drop below */}
                    <ellipse
                      cx={cloud.x}
                      cy={cloud.y + 5 * scale}
                      rx={35 * scale}
                      ry={3 * scale}
                      fill={hueHex}
                      opacity={isDimmed ? 0.02 : 0.06}
                      style={{ transition: "opacity 0.4s" }}
                    />
                  </g>
                );
              })}

              {/* ── Center node — Vitruvian circle with ΦΡΟΝΗΣΙΣ ── */}
              <g>
                {/* Pulsing rings */}
                <circle cx={CENTER.x} cy={CENTER.y} r="8" fill="none" stroke="#0F5C5E" strokeWidth="0.15" opacity="0.3">
                  <animate attributeName="r" values="8;14;14" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={CENTER.x} cy={CENTER.y} r="8" fill="none" stroke="#0F5C5E" strokeWidth="0.12" opacity="0.2">
                  <animate attributeName="r" values="8;16;16" dur="3s" begin="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0" dur="3s" begin="1s" repeatCount="indefinite" />
                </circle>

                {/* Core circle */}
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="7"
                  fill="#FFFFFF"
                  stroke="#0F5C5E"
                  strokeWidth="0.35"
                  opacity={active ? 1 : 0.95}
                />
                {/* Inner gold ring */}
                <circle cx={CENTER.x} cy={CENTER.y} r="5.5" fill="none" stroke="#B48D3C" strokeWidth="0.15" opacity="0.5" />

                {/* Greek text */}
                <text
                  x={CENTER.x}
                  y={CENTER.y - 1.5}
                  textAnchor="middle"
                  fill="#B48D3C"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2.2px", fontWeight: 500 }}
                >
                  ΦΡΟΝΗΣΙΣ
                </text>
                {/* One Method label */}
                <text
                  x={CENTER.x}
                  y={CENTER.y + 2.5}
                  textAnchor="middle"
                  fill="#0F5C5E"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "1px", letterSpacing: "0.3px" }}
                >
                  {t("neural.centerMethod").toUpperCase()}
                </text>
              </g>
            </svg>

            {/* ── HTML overlay — cloud text content ── */}
            {CLOUDS.map((cloud, i) => {
              const isActive = active === cloud.id;
              const isDimmed = active !== null && !isActive;
              const hueHex = HUE_HEX[cloud.hue];
              // Convert SVG coordinates to percentages for HTML positioning
              const leftPct = (cloud.x / 100) * 100;
              const topPct = (cloud.y / 56.25) * 100;

              return (
                <motion.button
                  key={`text-${cloud.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.4 + i * 0.1 }}
                  onMouseEnter={() => setActive(cloud.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => handleCloudClick(cloud)}
                  className="absolute z-20 cursor-pointer text-center"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: isDimmed ? 0.5 : 1,
                    transition: "opacity 0.4s",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <div style={{ width: "150px" }}>
                    <div
                      className="text-[8px] uppercase tracking-[0.2em] font-mono mb-0.5"
                      style={{ color: hueHex, opacity: 0.8 }}
                    >
                      {t(`neural.clouds.${cloud.id}.domain`)}
                    </div>
                    <div
                      className="display text-ink leading-tight"
                      style={{ fontSize: "0.95rem", fontWeight: 500 }}
                    >
                      {t(cloud.nameKey)}
                    </div>
                    <div className="body-serif text-[10px] text-ink-dim mt-0.5 leading-snug">
                      {t(cloud.descKey)}
                    </div>
                    {/* Click hint */}
                    <div
                      className="mt-1 text-[7px] uppercase tracking-[0.25em] font-mono opacity-0 transition-opacity hover:opacity-70"
                      style={{ color: hueHex }}
                    >
                      {isActive ? "↓ " + t("neural.clickToExpand") : t("neural.clickToExpand")}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MOBILE: Stacked vertical with cloud shapes ─── */}
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
          <div className="space-y-5">
            {CLOUDS.map((cloud, i) => {
              const isActive = active === cloud.id;
              const hueHex = HUE_HEX[cloud.hue];
              return (
                <motion.div
                  key={cloud.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                >
                  <button
                    onClick={() => handleCloudClick(cloud)}
                    className="w-full"
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <div
                      className="relative px-6 py-5 rounded-[2rem] bg-paper border-2 transition-all duration-400"
                      style={{
                        borderColor: isActive ? hueHex : "var(--border)",
                        boxShadow: isActive ? `0 8px 24px ${hueHex}30` : "0 1px 4px rgba(0,0,0,0.04)",
                        borderRadius: "2rem 2rem 2rem 2rem",
                      }}
                    >
                      <div className="text-[9px] uppercase tracking-[0.22em] font-mono mb-1" style={{ color: hueHex }}>
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

      {/* ─── Always-visible rationale panel ─── */}
      <div ref={rationaleRef} className="mt-20 md:mt-28 scroll-mt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCloud.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="relative p-8 md:p-12 rounded-3xl bg-paper-warm border overflow-hidden"
              style={{ borderColor: `${HUE_HEX[activeCloud.hue]}40` }}
            >
              {/* Decorative corner accent — cloud echo */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
                style={{ backgroundColor: HUE_HEX[activeCloud.hue], transform: "translate(30%, -30%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: HUE_HEX[activeCloud.hue], transform: "translate(-30%, 30%)" }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="h-px w-12"
                    style={{ backgroundColor: HUE_HEX[activeCloud.hue] }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-mono"
                    style={{ color: HUE_HEX[activeCloud.hue] }}
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
                    <span style={{ color: HUE_HEX[activeCloud.hue] }}>
                      {t(`neural.clouds.${activeCloud.id}.domain`)}
                    </span>
                  </div>
                  {activeCloud.url && (
                    <a
                      href={activeCloud.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm ml-auto"
                      style={{ color: HUE_HEX[activeCloud.hue] }}
                    >
                      <span className="link-underline">{t("visitSite")}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cloud selector dots — quick navigation between rationales */}
        <div className="flex justify-center gap-3 mt-8">
          {CLOUDS.map((cloud) => {
            const isActive = activeCloud.id === cloud.id;
            const hueHex = HUE_HEX[cloud.hue];
            return (
              <button
                key={cloud.id}
                onClick={() => {
                  setActive(cloud.id);
                  setTimeout(() => {
                    rationaleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}
                className="transition-all duration-300"
                style={{
                  width: isActive ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  backgroundColor: isActive ? hueHex : "var(--border)",
                }}
                aria-label={t(cloud.nameKey)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
