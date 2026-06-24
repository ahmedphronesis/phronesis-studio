"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * FloatingEagle — a persistent, semi-transparent eagle centered on every
 * page except the Frontispice (homepage).
 *
 * Design:
 * - Fixed full-screen flex container, centers the eagle in the viewport
 * - Very low opacity (5%) so it doesn't compete with content
 * - Subtle scroll-driven parallax: drifts up as you scroll down
 * - Breathing animation: gentle scale loop
 * - pointer-events: none (never interferes with clicks)
 * - z-index: 9999 (above all content, but invisible to interaction)
 * - Hidden on the homepage (which has its own large eagle in the Hero)
 *   and on /admin /login (would be distracting)
 */
export function FloatingEagle() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Parallax: eagle drifts up slightly as you scroll down
  const rawY = useTransform(scrollY, [0, 2000], [0, -120]);
  const smoothY = useSpring(rawY, { stiffness: 50, damping: 30, mass: 0.8 });

  useEffect(() => {
    // Don't show on admin or login pages
    if (
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/login")
    ) {
      setVisible(false);
      return;
    }

    // Check if we're on the homepage (has the Hero with id="top")
    // The homepage keeps its own large eagle in the Hero, so we hide
    // the floating one there to avoid duplication.
    const path = window.location.pathname;
    // Homepage paths: /en, /ar (and root / which redirects to /en)
    const isHomepage =
      path === "/en" ||
      path === "/ar" ||
      path === "/" ||
      path === "";

    if (isHomepage) {
      setVisible(false);
      return;
    }

    // All other pages: show the floating eagle
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.05 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.img
        src="/logo-eagle.png"
        alt=""
        className="w-[clamp(14rem,22vw,24rem)] h-auto"
        style={{
          filter: "drop-shadow(0 4px 24px rgba(180, 141, 60, 0.10))",
          y: smoothY,
        }}
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
