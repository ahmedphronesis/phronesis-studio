"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe, Check, ChevronDown } from "lucide-react";
import { localeNames, routing, type Locale } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("language");

  // Mount check for portal (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Outside-click handler
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // Compute dropdown position when opening.
  // Uses rAF to ensure DOM has settled (important inside animating
  // containers like the mobile drawer).
  const computePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    // Position dropdown below button, aligned to button's left edge.
    // Use left instead of right so it works identically in LTR and RTL.
    setDropdownPos({
      top: rect.bottom + 8,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 240)),
    });
  }, []);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(computePosition);
      return () => cancelAnimationFrame(raf);
    } else {
      setDropdownPos(null);
    }
  }, [open, computePosition]);

  // Recompute on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    const handler = () => computePosition();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [open, computePosition]);

  function onSelect(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  // Dropdown style
  const dropdownStyle: React.CSSProperties = dropdownPos
    ? {
        position: "fixed",
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: "224px",
        maxHeight: "70vh",
      }
    : {
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "224px",
        maxHeight: "70vh",
      };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-xs text-ink-soft hover:text-teal transition-colors px-3 py-2 rounded-full border border-border hover:border-teal/40"
        aria-label={t("select")}
        aria-expanded={open}
      >
        <Globe size={14} strokeWidth={1.5} />
        <span className="font-mono uppercase tracking-wider">
          {localeNames[locale].native}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/*
        Render dropdown via React Portal at document.body level.
        This is CRITICAL: if the dropdown is rendered inside a
        framer-motion animating container (like the mobile drawer),
        the container's CSS transform creates a containing block for
        position:fixed descendants per CSS spec. This would cause the
        dropdown to be positioned relative to the animating parent
        instead of the viewport, and clipped by the parent's
        overflow:hidden. The portal escapes all ancestor constraints.
      */}
      {mounted && open && createPortal(
        <AnimatePresence>
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={dropdownStyle}
            className="overflow-y-auto rounded-2xl bg-paper-warm border border-border shadow-xl z-[9999] p-2"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim px-3 py-2 font-mono">
              {t("label")}
            </p>
            <ul>
              {routing.locales.map((l) => {
                const info = localeNames[l];
                return (
                  <li key={l}>
                    <button
                      onClick={() => onSelect(l)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        l === locale
                          ? "bg-teal/10 text-teal"
                          : "text-ink-soft hover:bg-paper-dark"
                      }`}
                    >
                      <span className="flex items-baseline gap-2">
                        <span
                          className="text-base"
                          style={{ fontFamily: l === "ar" ? "var(--font-amiri)" : undefined }}
                        >
                          {info.native}
                        </span>
                      </span>
                      <span className="text-[10px] text-ink-dim uppercase tracking-wider font-mono">
                        {l}
                      </span>
                      {l === locale && <Check size={14} className="text-teal" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
