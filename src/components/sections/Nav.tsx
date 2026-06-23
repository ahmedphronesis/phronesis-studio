"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();

  const LINKS = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("studio") },
    { href: "/work", label: t("work") },
    { href: "/library", label: t("library") },
    { href: "/method", label: t("method") },
    { href: "/correspondence", label: t("correspondence") },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="text-2xl text-gold leading-none"
            style={{ fontFamily: "var(--font-cormorant)" }}
            aria-hidden
          >
            Φ
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-base text-ink tracking-wide"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
            >
              Ahmed Ali
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mt-1 font-mono">
              Studio of Phronesis
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-teal"
                      : "text-ink-soft hover:text-teal"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: language + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/correspondence"
            className="inline-flex items-center gap-2 text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-5 py-2.5 rounded-full font-medium"
          >
            {t("begin")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-ink p-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-paper/95 backdrop-blur-xl border-b border-border/60"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-lg text-ink hover:text-teal transition-colors"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 flex items-center justify-between">
                <LanguageSwitcher />
                <Link
                  href="/correspondence"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center text-sm text-paper bg-teal px-5 py-2.5 rounded-full font-medium"
                >
                  {t("begin")}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
