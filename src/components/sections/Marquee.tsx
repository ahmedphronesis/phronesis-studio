"use client";

import { motion } from "framer-motion";

const CREDENTIALS = [
  "Aristotle · Phronesis",
  "Alexandria University · BA Philosophy",
  "Al-Azhar · PG Diploma in Education",
  "ADEK Licensed Teacher",
  "ISO 9001 · ISO 45001",
  "Etisalat · Top Sales Executive",
  "British Philosophical Association",
  "Bibliotheca Alexandrina",
  "IELTS Band 7",
  "CompTIA A+ Network+ Linux+",
  "Next.js 16 · React 19",
  "Prisma · PostgreSQL · Vercel",
];

export function Marquee() {
  // Duplicate for seamless loop
  const items = [...CREDENTIALS, ...CREDENTIALS];
  return (
    <section
      aria-hidden
      className="relative w-full py-6 md:py-8 border-y border-border/40 bg-charcoal-dark/60 overflow-hidden"
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 md:gap-12 whitespace-nowrap"
      >
        {items.map((c, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 md:gap-12 text-cream-dim text-sm md:text-base"
            style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
          >
            {c}
            <span className="text-gold/60 text-xs">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
