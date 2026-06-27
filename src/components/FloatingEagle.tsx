"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * FloatingEagle — a persistent, semi-transparent eagle centered on every
 * page except the Frontispiece (homepage).
 *
 * Uses usePathname() for reactive route tracking — re-evaluates on every
 * client-side navigation, not just on mount. This fixes the issue where
 * the eagle wouldn't appear after navigating from the homepage.
 */
export function FloatingEagle() {
  const pathname = usePathname();

  const visible = useMemo(() => {
    if (!pathname) return false;

    // Don't show on admin or login pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
      return false;
    }

    // Check if we're on the homepage (Frontispiece)
    // The homepage paths: /en, /ar, /, or just /en /ar with no sub-path
    const isHomepage =
      pathname === "/en" ||
      pathname === "/ar" ||
      pathname === "/";

    if (isHomepage) {
      return false;
    }

    // All other pages: show the centered eagle
    return true;
  }, [pathname]);

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
