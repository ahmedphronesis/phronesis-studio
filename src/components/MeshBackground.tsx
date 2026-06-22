"use client";

import { motion } from "framer-motion";

/* Flowing animated mesh gradient — paper palette (teal/terracotta/gold on cream) */
export function MeshBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Layer 1: slow drifting gold blob */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          top: "10%",
          left: "10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(180, 141, 60, 0.18) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      {/* Layer 2: drifting teal blob */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          top: "30%",
          right: "5%",
          width: "45vw",
          height: "45vw",
          background: "radial-gradient(circle, rgba(15, 92, 94, 0.18) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      {/* Layer 3: subtle terracotta warmth */}
      <motion.div
        aria-hidden
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{
          bottom: "10%",
          left: "30%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(181, 83, 42, 0.12) 0%, transparent 60%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
