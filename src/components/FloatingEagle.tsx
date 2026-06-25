"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * FloatingEagle — a persistent, semi-transparent eagle centered on every
 * page except the Frontispice (homepage).
 *
 * Design:
 * - Fixed position, centered horizontally and vertically in the viewport
 * - NO scroll parallax — truly fixed in place
 * - Larger size for visual presence
 * - Subtle breathing animation (scale only)
 * - pointer-events: none (never interferes with clicks)
 * - z-index: 9999 (above all content, but invisible to interaction)
 * - Hidden on the homepage (which has its own large eagle in the Hero)
 *   and on /admin /login (would be distracting)
 * - Visible on ALL screen sizes including mobile
 */
export function FloatingEagle() {
  const [visible, setVisible] = useState(false);

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
    const path = window.location.pathname;
    const isHomepage =
      path === "/en" ||
      path === "/ar" ||
      path === "/" ||
      path === "";

    if (isHomepage) {
      setVisible(false);
      return;
    }

    // All other pages: show the centered eagle
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.05,
      }}
    >
      <motion.img
        src="/logo-eagle.png"
        alt=""
        className="w-[clamp(18rem,40vw,36rem)] h-auto max-w-none"
        style={{
          filter: "drop-shadow(0 4px 24px rgba(180, 141, 60, 0.10))",
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
    </div>
  );
}
