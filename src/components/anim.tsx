"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

/* Easing used throughout — slow, philosophical, never bouncy */
export const EASE = [0.22, 1, 0.36, 1] as const;

/* Container that staggers its children into view */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: gap,
      },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/* Child element that fades up. Used inside <Stagger> */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE, delay },
    },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/* Standalone scroll-reveal (no parent stagger) */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
