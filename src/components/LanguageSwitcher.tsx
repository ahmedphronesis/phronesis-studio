"use client";

import { useState, useRef, useEffect } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("language");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onSelect(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-xs text-ink-soft hover:text-teal transition-colors px-3 py-2 rounded-full border border-border hover:border-teal/40"
        aria-label={t("select")}
      >
        <Globe size={14} strokeWidth={1.5} />
        <span className="font-mono uppercase tracking-wider">
          {localeNames[locale].native}
        </span>
        <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-56 md:max-h-[70vh] max-h-[60vh] overflow-y-auto rounded-2xl bg-paper-warm border border-border shadow-xl z-[100] p-2"
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
                        <span className="text-base" style={{ fontFamily: l === "ar" ? "var(--font-amiri)" : undefined }}>
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
        )}
      </AnimatePresence>
    </div>
  );
}
