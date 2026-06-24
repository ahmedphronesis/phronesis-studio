"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * FloatingEagle — a persistent, semi-transparent eagle that appears on
 * every page and follows the user as they scroll.
 *
 * Design:
 * - Fixed position, bottom-right corner of viewport
 * - Very low opacity (5%) so it doesn't compete with content
 * - Scroll-driven parallax: drifts up as you scroll down (and vice versa)
 * - Breathing animation: gentle scale + rotation loop
 * - pointer-events: none (never interferes with clicks)
 * - z-index: 9999 (above all content, but invisible to interaction)
 * - Fades in after scrolling 80px down (so it doesn't clash with the Hero's
 *   large eagle on the homepage)
 */
export function FloatingEagle() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Parallax: eagle drifts up as you scroll down
  // Range: 0 to ~400px of vertical drift over 2000px of scroll
  const rawY = useTransform(scrollY, [0, 2000], [0, -400]);
  const rawRotate = useTransform(scrollY, [0, 2000], [0, 8]);

  // Smooth the parallax with a spring
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 30, mass: 0.8 });
  const smoothRotate = useSpring(rawRotate, {
    stiffness: 40,
    damping: 25,
    mass: 0.8,
  });

  // Show the eagle after scrolling 400px down
  // (on non-homepage pages, show immediately since there's no Hero eagle to clash with)
  // Hide on admin/login pages (would be distracting when editing)
  useEffect(() => {
    // Don't show on admin or login pages
    if (
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/login")
    ) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      const scrolled = window.scrollY;
      // Check if we're on a page without the Hero (i.e., not the homepage)
      // Homepage has an element with id="top" (the Hero section)
      const hasHero = document.getElementById("top");
      if (!hasHero) {
        setVisible(true);
      } else {
        setVisible(scrolled > 400);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.06 : 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        bottom: "-3rem",
        right: "-3rem",
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
        y: smoothY,
        rotate: smoothRotate,
      }}
    >
      <motion.img
        src="/logo-eagle.png"
        alt=""
        className="w-[clamp(14rem,22vw,24rem)] h-auto"
        style={{
          filter: "drop-shadow(0 4px 24px rgba(180, 141, 60, 0.12))",
        }}
        animate={{
          scale: [1, 1.04, 1],
          rotate: [0, 1.5, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
