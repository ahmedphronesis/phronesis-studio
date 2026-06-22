"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#thesis", label: "Thesis" },
  { href: "#practice", label: "Practice" },
  { href: "#library", label: "Library" },
  { href: "#services", label: "Engagements" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Begin" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-6 md:px-12 lg:px-20 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <a href="#top" className="flex items-center gap-3 group">
          <span
            className="text-2xl text-gold leading-none"
            style={{ fontFamily: "var(--font-cormorant)" }}
            aria-hidden
          >
            Φ
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-base text-cream tracking-wide"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
            >
              Ahmed Ali
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-cream-dim mt-1">
              Studio of Phronesis
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="link-underline text-sm text-cream-dim hover:text-cream transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 text-sm text-charcoal-dark bg-gold hover:bg-gold-bright transition-colors px-5 py-2.5 rounded-full font-medium"
        >
          Begin a conversation
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-cream p-2"
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
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/60"
          >
            <ul className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-lg text-cream hover:text-gold transition-colors"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center text-sm text-charcoal-dark bg-gold px-5 py-2.5 rounded-full font-medium"
                >
                  Begin a conversation
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
