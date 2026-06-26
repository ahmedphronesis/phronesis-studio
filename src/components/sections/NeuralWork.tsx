"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { EASE } from "../anim";

/**
 * Neural Network of Clouds — Vitruvian Edition v2
 *
 * Fixes:
 * 1. Clouds are 60% larger (scale 0.36 vs 0.22)
 * 2. Text is rendered INSIDE the SVG <g> so it's perfectly contained within
 *    each cloud silhouette — no more overflow
 * 3. Center node uses the actual Vitruvian Man image at low opacity (18%)
 *    with a sepia-teal duotone, so it reads as a watermark/scholarly ghost
 *    without competing with the floating eagle
 * 4. Separated `hovered` (visual highlight) from `selected` (rationale panel)
 *    — clicking a cloud sets `selected`, which persists even when the mouse
 *    leaves. The panel now shows the correct project.
 */

type CloudId = "realestate" | "mscs" | "diplomatiq" | "math" | "echoes" | "treasury";

type Cloud = {
  id: CloudId;
  x: number;
  y: number;
  hue: "teal" | "terracotta" | "gold" | "forest";
  nameKey: string;
  descKey: string;
  rationaleKey: string;
  url?: string;
};

// 16:9 viewBox (100 × 56.25). Clouds arranged in a wide oval, pushed outward
// to accommodate the larger cloud sizes (scale 0.48) and the central Vitruvian Man.
const CLOUDS: Cloud[] = [
  { id: "realestate", x: 50, y: 6,  hue: "teal",       nameKey: "neural.clouds.realestate.name",    descKey: "neural.clouds.realestate.desc",    rationaleKey: "neural.clouds.realestate.rationale",    url: "https://real-estate-emperor.vercel.app" },
  { id: "mscs",       x: 90, y: 18, hue: "gold",       nameKey: "neural.clouds.mscs.name",          descKey: "neural.clouds.mscs.desc",          rationaleKey: "neural.clouds.mscs.rationale",          url: "https://mscs-academy.vercel.app" },
  { id: "diplomatiq", x: 90, y: 40, hue: "gold",       nameKey: "neural.clouds.diplomatiq.name",    descKey: "neural.clouds.diplomatiq.desc",    rationaleKey: "neural.clouds.diplomatiq.rationale",    url: "https://mun-diplomatiq.vercel.app" },
  { id: "treasury",   x: 50, y: 52, hue: "terracotta", nameKey: "neural.clouds.treasury.name",      descKey: "neural.clouds.treasury.desc",      rationaleKey: "neural.clouds.treasury.rationale" },
  { id: "math",       x: 10, y: 40, hue: "gold",       nameKey: "neural.clouds.math.name",          descKey: "neural.clouds.math.desc",          rationaleKey: "neural.clouds.math.rationale" },
  { id: "echoes",     x: 10, y: 18, hue: "forest",     nameKey: "neural.clouds.echoes.name",        descKey: "neural.clouds.echoes.desc",        rationaleKey: "neural.clouds.echoes.rationale" },
];

const CENTER = { x: 50, y: 28 };

const HUE_HEX: Record<Cloud["hue"], string> = {
  teal: "#0F5C5E",
  terracotta: "#B5462A",
  gold: "#B48D3C",
  forest: "#2D6A4F",
};

/** Cloud SVG path — a cumulus silhouette in a 100×60 viewBox. */
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

function neuralPath(cx: number, cy: number, tx: number, ty: number): string {
  const dx = tx - cx;
  const dy = ty - cy;
  const cp1x = cx + dx * 0.35 + dy * 0.08;
  const cp1y = cy + dy * 0.35 - dx * 0.08;
  const cp2x = cx + dx * 0.65 - dy * 0.08;
  const cp2y = cy + dy * 0.65 + dx * 0.08;
  return `M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tx} ${ty}`;
}

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
  // FIX #4: separated hovered (visual) from selected (rationale panel)
  const [hovered, setHovered] = useState<CloudId | null>(null);
  const [selected, setSelected] = useState<CloudId>("realestate");
  const [isMobile, setIsMobile] = useState(false);
  const rationaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // The cloud shown in the rationale panel = selected (persistent)
  const selectedCloud = CLOUDS.find((c) => c.id === selected) || CLOUDS[0];
  // The visually highlighted cloud = hovered (if any) else selected
  const active = hovered ?? selected;

  const handleCloudClick = (cloud: Cloud) => {
    setSelected(cloud.id);
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
          {t("neural.intro").split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </motion.p>
      </div>

      {/* ─── DESKTOP: Wide Vitruvian neural field ─── */}
      {!isMobile && (
        <div className="relative w-full mx-auto" style={{ maxWidth: "850px" }}>
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 56.25"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="marchingFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0F5C5E" />
                  <stop offset="25%" stopColor="#B48D3C" />
                  <stop offset="50%" stopColor="#B5462A" />
                  <stop offset="75%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#0F5C5E" />
                </linearGradient>
                <radialGradient id="cloudFillTeal" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0F5C5E" stopOpacity="0.10" />
                </radialGradient>
                <radialGradient id="cloudFillGold" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B48D3C" stopOpacity="0.10" />
                </radialGradient>
                <radialGradient id="cloudFillTerracotta" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#B5462A" stopOpacity="0.10" />
                </radialGradient>
                <radialGradient id="cloudFillForest" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#F5EFE4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.10" />
                </radialGradient>
                {/* Vitruvian Man duotone filter — sepia + teal tint */}
                <filter id="vitruvianDuotone" x="-10%" y="-10%" width="120%" height="120%">
                  <feColorMatrix type="matrix" values="
                    0.3 0 0 0 0.06
                    0.3 0 0 0 0.36
                    0.3 0 0 0 0.37
                    0   0 0 1 0" />
                </filter>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path id="cloudShape" d={CLOUD_PATH} />
              </defs>

              {/* ── Vitruvian geometry ── */}
              <g opacity="0.10">
                <circle cx={CENTER.x} cy={CENTER.y} r="24" fill="none" stroke="#0F5C5E" strokeWidth="0.15" strokeDasharray="0.5 1" />
                <rect x={CENTER.x - 20} y={CENTER.y - 20} width="40" height="40" fill="none" stroke="#B48D3C" strokeWidth="0.12" strokeDasharray="0.3 0.8" opacity="0.6" />
                <line x1={CENTER.x} y1={CENTER.y - 26} x2={CENTER.x} y2={CENTER.y + 26} stroke="#0F5C5E" strokeWidth="0.08" strokeDasharray="0.3 0.6" />
                <line x1={CENTER.x - 26} y1={CENTER.y} x2={CENTER.x + 26} y2={CENTER.y} stroke="#0F5C5E" strokeWidth="0.08" strokeDasharray="0.3 0.6" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={deg}
                      x1={CENTER.x + Math.cos(rad) * 23}
                      y1={CENTER.y + Math.sin(rad) * 23}
                      x2={CENTER.x + Math.cos(rad) * 25}
                      y2={CENTER.y + Math.sin(rad) * 25}
                      stroke="#0F5C5E"
                      strokeWidth="0.1"
                    />
                  );
                })}
              </g>

              {/* ── Neural connection paths ── */}
              {CLOUDS.map((cloud) => {
                const isActive = active === cloud.id;
                const isDimmed = active !== cloud.id;
                const hueHex = HUE_HEX[cloud.hue];
                const path = neuralPath(CENTER.x, CENTER.y, cloud.x, cloud.y);
                const [cp1, cp2] = getControlPoints(CENTER.x, CENTER.y, cloud.x, cloud.y);
                const synapsePositions = [0.25, 0.5, 0.75].map((tt) =>
                  bezierPoint(tt, [CENTER.x, CENTER.y], cp1, cp2, [cloud.x, cloud.y])
                );

                return (
                  <g key={cloud.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke={hueHex}
                      strokeWidth={isActive ? 0.35 : 0.18}
                      strokeOpacity={isDimmed ? 0.08 : 0.35}
                      style={{ transition: "stroke-opacity 0.4s, stroke-width 0.4s" }}
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="url(#marchingFlow)"
                      strokeWidth={isActive ? 0.5 : 0.3}
                      strokeOpacity={isDimmed ? 0 : 0.9}
                      strokeDasharray="1.5 3"
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-opacity 0.4s, stroke-width 0.4s",
                        filter: isActive ? "url(#softGlow)" : "none",
                      }}
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-9" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    {synapsePositions.map(([sx, sy], i) => (
                      <g key={i}>
                        <circle
                          cx={sx}
                          cy={sy}
                          r={isActive ? 0.5 : 0.3}
                          fill={hueHex}
                          opacity={isDimmed ? 0.1 : 0.9}
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
                        <circle
                          cx={sx}
                          cy={sy}
                          r={isActive ? 1.2 : 0.7}
                          fill="none"
                          stroke={hueHex}
                          strokeWidth="0.08"
                          opacity={isDimmed ? 0.05 : 0.3}
                          style={{ transition: "r 0.4s, opacity 0.4s" }}
                        />
                      </g>
                    ))}
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

              {/* ── Center: Vitruvian Man image as the primary visual ── */}
              <g>
                {/* Pulsing rings — emit from the image */}
                <circle cx={CENTER.x} cy={CENTER.y} r="14" fill="none" stroke="#0F5C5E" strokeWidth="0.18" opacity="0.3">
                  <animate attributeName="r" values="14;22;22" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={CENTER.x} cy={CENTER.y} r="14" fill="none" stroke="#0F5C5E" strokeWidth="0.15" opacity="0.2">
                  <animate attributeName="r" values="14;25;25" dur="3s" begin="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0" dur="3s" begin="1s" repeatCount="indefinite" />
                </circle>

                {/* Vitruvian Man image — compact, properly centered, visible */}
                <image
                  href="/vitruvian-man.jpg"
                  x={CENTER.x - 13}
                  y={CENTER.y - 13}
                  width="26"
                  height="26"
                  opacity="0.32"
                  filter="url(#vitruvianDuotone)"
                  preserveAspectRatio="xMidYMid meet"
                  clipPath="circle(13px at 50% 50%)"
                />

                {/* Decorative ring around the Vitruvian Man image */}
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="14"
                  fill="none"
                  stroke="#B48D3C"
                  strokeWidth="0.2"
                  opacity="0.5"
                />
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="15"
                  fill="none"
                  stroke="#0F5C5E"
                  strokeWidth="0.15"
                  opacity="0.4"
                  strokeDasharray="0.5 1.5"
                />

                {/* ΦΡΟΝΗΣΙΣ label — EXACTLY at the center of the circle */}
                {/* White backdrop circle for legibility over the image */}
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="5.5"
                  fill="#FFFFFF"
                  opacity="0.92"
                />
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r="5.5"
                  fill="none"
                  stroke="#B48D3C"
                  strokeWidth="0.15"
                  opacity="0.5"
                />
                <text
                  x={CENTER.x}
                  y={CENTER.y + 0.8}
                  textAnchor="middle"
                  fill="#B48D3C"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2.6px", fontWeight: 600, letterSpacing: "0.2px" }}
                >
                  ΦΡΟΝΗΣΙΣ
                </text>
                <text
                  x={CENTER.x}
                  y={CENTER.y + 2.5}
                  textAnchor="middle"
                  fill="#0F5C5E"
                  style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: "0.85px", letterSpacing: "0.2px" }}
                >
                  {t("neural.centerMethod").toUpperCase()}
                </text>
              </g>

              {/* ── FIX #1 & #2: Clouds 60% larger, text INSIDE the SVG group ── */}
              {CLOUDS.map((cloud, i) => {
                const isActive = active === cloud.id;
                const isSelected = selected === cloud.id;
                const isDimmed = active !== cloud.id;
                const hueHex = HUE_HEX[cloud.hue];
                const fillId =
                  cloud.hue === "teal" ? "cloudFillTeal" :
                  cloud.hue === "gold" ? "cloudFillGold" :
                  cloud.hue === "terracotta" ? "cloudFillTerracotta" : "cloudFillForest";
                // Clouds — compact scale so the visualization doesn't dominate the page
                const scale = isActive ? 0.38 : 0.34;
                const tx = cloud.x - 50 * scale;
                const ty = cloud.y - 30 * scale;

                return (
                  <g
                    key={`cloud-${cloud.id}`}
                    style={{ cursor: "pointer", transition: "opacity 0.4s" }}
                    opacity={isDimmed ? 0.5 : 1}
                    onMouseEnter={() => setHovered(cloud.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleCloudClick(cloud)}
                  >
                    {/* Cloud shadow */}
                    <ellipse
                      cx={cloud.x}
                      cy={cloud.y + 6 * scale}
                      rx={38 * scale}
                      ry={3 * scale}
                      fill={hueHex}
                      opacity={isDimmed ? 0.02 : 0.08}
                      style={{ transition: "opacity 0.4s" }}
                    />
                    {/* Cloud silhouette */}
                    <use
                      href="#cloudShape"
                      transform={`translate(${tx} ${ty}) scale(${scale})`}
                      fill={`url(#${fillId})`}
                      stroke={hueHex}
                      strokeWidth={(isActive ? 0.6 : 0.35) / scale}
                      strokeOpacity={isDimmed ? 0.2 : 0.7}
                      style={{
                        transition: "stroke-opacity 0.4s, stroke-width 0.4s",
                        filter: isActive ? `drop-shadow(0 0 1.5px ${hueHex}50)` : "none",
                      }}
                    />

                    {/* FIX #2: Text rendered INSIDE the SVG, positioned at cloud center.
                        FIX #1 (this round): font sizes increased ~80% for readability. */}
                    {/* Domain label — top of cloud */}
                    <text
                      x={cloud.x}
                      y={cloud.y - 5.5}
                      textAnchor="middle"
                      fill={hueHex}
                      opacity={isDimmed ? 0.5 : 0.85}
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        fontSize: "1.1px",
                        letterSpacing: "0.15px",
                        textTransform: "uppercase",
                        transition: "opacity 0.4s",
                      }}
                    >
                      {t(`neural.clouds.${cloud.id}.domain`).length > 28
                        ? t(`neural.clouds.${cloud.id}.domain`).substring(0, 25) + "…"
                        : t(`neural.clouds.${cloud.id}.domain`)}
                    </text>
                    {/* Program name — center of cloud */}
                    <text
                      x={cloud.x}
                      y={cloud.y - 2.5}
                      textAnchor="middle"
                      fill="#1A1A1A"
                      opacity={isDimmed ? 0.6 : 1}
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "2.3px",
                        fontWeight: 600,
                        transition: "opacity 0.4s",
                      }}
                    >
                      {t(cloud.nameKey).length > 22
                        ? t(cloud.nameKey).substring(0, 19) + "…"
                        : t(cloud.nameKey)}
                    </text>
                    {/* Short description — below name */}
                    <text
                      x={cloud.x}
                      y={cloud.y + 0.5}
                      textAnchor="middle"
                      fill="#4A4A4A"
                      opacity={isDimmed ? 0.4 : 0.7}
                      style={{
                        fontFamily: "var(--font-source-serif), serif",
                        fontSize: "1.2px",
                        transition: "opacity 0.4s",
                      }}
                    >
                      {t(cloud.descKey).length > 28
                        ? t(cloud.descKey).substring(0, 25) + "…"
                        : t(cloud.descKey)}
                    </text>
                    {/* Click hint — only on active cloud */}
                    {isActive && (
                      <text
                        x={cloud.x}
                        y={cloud.y + 4}
                        textAnchor="middle"
                        fill={hueHex}
                        opacity="0.85"
                        style={{
                          fontFamily: "var(--font-jetbrains), monospace",
                          fontSize: "0.9px",
                          letterSpacing: "0.2px",
                          textTransform: "uppercase",
                        }}
                      >
                        ↓ {t("neural.clickToExpand")}
                      </text>
                    )}
                    {/* Selected indicator — small dot below cloud */}
                    {isSelected && !isActive && (
                      <circle
                        cx={cloud.x}
                        cy={cloud.y + 5}
                        r="0.5"
                        fill={hueHex}
                        opacity="0.7"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ─── MOBILE: Stacked vertical with cloud shapes ─── */}
      {isMobile && (
        <div className="relative">
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

          <div className="space-y-5">
            {CLOUDS.map((cloud, i) => {
              const isSelected = selected === cloud.id;
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
                      className="relative px-6 py-5 border-2 transition-all duration-400"
                      style={{
                        borderColor: isSelected ? hueHex : "var(--border)",
                        boxShadow: isSelected ? `0 8px 24px ${hueHex}30` : "0 1px 4px rgba(0,0,0,0.04)",
                        borderRadius: "2rem",
                        backgroundColor: "var(--paper)",
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

      {/* ─── Always-visible rationale panel — shows SELECTED cloud ─── */}
      <div ref={rationaleRef} className="mt-20 md:mt-28 scroll-mt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCloud.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-4xl mx-auto"
          >
            <div
              className="relative p-8 md:p-12 rounded-3xl bg-paper-warm border overflow-hidden"
              style={{ borderColor: `${HUE_HEX[selectedCloud.hue]}40` }}
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5"
                style={{ backgroundColor: HUE_HEX[selectedCloud.hue], transform: "translate(30%, -30%)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: HUE_HEX[selectedCloud.hue], transform: "translate(-30%, 30%)" }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-12" style={{ backgroundColor: HUE_HEX[selectedCloud.hue] }} />
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-mono"
                    style={{ color: HUE_HEX[selectedCloud.hue] }}
                  >
                    {t("neural.rationaleLabel")}
                  </span>
                </div>

                <h4
                  className="display text-ink leading-[1.05] mb-6"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                >
                  {t(selectedCloud.nameKey)}
                </h4>

                <p className="body-serif text-base md:text-lg text-ink-soft leading-[1.8] mb-8">
                  {t(selectedCloud.rationaleKey)}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">
                    {t("neural.domainLabel")}:{" "}
                    <span style={{ color: HUE_HEX[selectedCloud.hue] }}>
                      {t(`neural.clouds.${selectedCloud.id}.domain`)}
                    </span>
                  </div>
                  {selectedCloud.url && (
                    <a
                      href={selectedCloud.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm ml-auto"
                      style={{ color: HUE_HEX[selectedCloud.hue] }}
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

        {/* Cloud selector dots */}
        <div className="flex justify-center gap-3 mt-8">
          {CLOUDS.map((cloud) => {
            const isSelected = selectedCloud.id === cloud.id;
            const hueHex = HUE_HEX[cloud.hue];
            return (
              <button
                key={cloud.id}
                onClick={() => {
                  setSelected(cloud.id);
                  setTimeout(() => {
                    rationaleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }}
                className="transition-all duration-300"
                style={{
                  width: isSelected ? "32px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  backgroundColor: isSelected ? hueHex : "var(--border)",
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
