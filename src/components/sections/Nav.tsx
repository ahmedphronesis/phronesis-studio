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
    { href: "/philosophy", label: t("echoes") },
    { href: "/publications", label: t("publications") },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 overflow-x-hidden ${
        scrolled
          ? "bg-paper/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-4 md:px-6 lg:px-10 xl:px-16 h-20 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <img
            src="/logo-eagle.png"
            alt=""
            aria-hidden
            className="h-8 md:h-9 w-8 md:w-9"
          />
          <span className="flex flex-col leading-none">
            <span
              className="text-sm md:text-base text-ink tracking-wide whitespace-nowrap"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
            >
              Ahmed Ali
            </span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-ink-dim mt-1 font-mono whitespace-nowrap">
              Studio of Phronesis
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center min-w-0">
          {LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <li key={l.href} className="flex-shrink-0">
                <Link
                  href={l.href}
                  className={`text-xs xl:text-sm whitespace-nowrap transition-colors ${
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
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
          <LanguageSwitcher />
          <Link
            href="/correspondence"
            className="inline-flex items-center gap-2 text-xs xl:text-sm text-paper bg-teal hover:bg-teal-bright transition-colors px-3 xl:px-5 py-2 xl:py-2.5 rounded-full font-medium whitespace-nowrap"
          >
            {t("begin")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-ink p-2 flex-shrink-0"
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
            className="lg:hidden overflow-hidden bg-paper/95 backdrop-blur-xl border-b border-border/60"
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
                  className="inline-flex items-center text-sm text-paper bg-teal px-5 py-2.5 rounded-full font-medium whitespace-nowrap"
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
