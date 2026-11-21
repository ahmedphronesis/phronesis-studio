"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, GraduationCap, Check, ExternalLink } from "lucide-react";

/**
 * CertificateVerifier — allows anyone to verify a Studio of Phronesis
 * professional development certificate by entering its certificate ID.
 *
 * The QR code on each certificate links to:
 *   phronesis-studio.com/en/verify?id=SOP-CLIC-2026-001
 *
 * If the ID matches a record, the page displays:
 *   - Teacher name
 *   - Program name
 *   - Institution
 *   - Modules completed (1-8 with dates)
 *   - Date of completion
 *   - Trainer name and credentials
 *
 * If the ID doesn't match, it shows "Certificate not found."
 */

type CertRecord = {
  id: string;
  teacherName: string;
  program: string;
  institution: string;
  location: string;
  duration: string;
  modules: { name: string; date: string }[];
  completionDate: string;
  trainer: string;
  trainerTitle: string;
};

// This will be populated when actual teacher names are confirmed.
// For now, it's a template showing the structure.
const CERTIFICATES: CertRecord[] = [
  {
    id: "SOP-CLIC-2026-001",
    teacherName: "Erlinda Logroño Howell",
    program: "From Routine to Learning Design",
    institution: "Creative Learning International Center (CLIC)",
    location: "Kalipayan Road, Danao, Panglao, 6340 Bohol, Philippines",
    duration: "October to December 2026",
    modules: [
      { name: "Lesson Planning Fundamentals", date: "30 Oct 2026" },
      { name: "Cognitive Frameworks for Early Childhood", date: "9 Nov 2026" },
      { name: "Formative Assessment with Technology", date: "16 Nov 2026" },
      { name: "21st-Century Learning Methodology", date: "23 Nov 2026" },
      { name: "Differentiated Instruction for Diverse Learners", date: "30 Nov 2026" },
      { name: "Classroom and Behavior Management", date: "7 Dec 2026" },
      { name: "Cross-Curricular and Real-Life Links (Philippines Context)", date: "14 Dec 2026" },
      { name: "Lesson Plan Clinic: Putting It All Together", date: "21 Dec 2026" },
    ],
    completionDate: "21 December 2026",
    trainer: "Ahmed Mahmoud Saeed Ahmed Ali",
    trainerTitle: "Author, Depth of Knowledge (2026) · Founder, Studio of Phronesis · Member, British Philosophical Association (BPA)",
  },
];

export function CertificateVerifier() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CertRecord | null | "not_found">(null);
  const [searching, setSearching] = useState(false);

  // Check URL for ?id= parameter (from QR code scan)
  if (typeof window !== "undefined" && !query && !result) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setQuery(id);
      // Auto-search
      setTimeout(() => {
        const found = CERTIFICATES.find((c) => c.id === id.toUpperCase());
        setResult(found || "not_found");
      }, 100);
    }
  }

  function onSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const found = CERTIFICATES.find((c) => c.id === query.trim().toUpperCase());
      setResult(found || "not_found");
      setSearching(false);
    }, 500);
  }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(15, 92, 94, 0.06), transparent 70%)" }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-8 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">Certificate Verification</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="display text-ink text-4xl md:text-5xl leading-[1.05] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Verify a Certificate
          </h1>
          <p className="body-serif text-base md:text-lg text-ink-soft leading-relaxed max-w-3xl mb-8">
            Enter the certificate ID printed on any Studio of Phronesis professional development certificate to verify its authenticity, the teacher's name, and the modules completed.
          </p>
        </motion.div>
      </div>

      {/* Search bar */}
      <div className="relative w-full px-6 md:px-12 lg:px-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-dim/50" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="e.g., SOP-CLIC-2026-001"
              className="w-full bg-paper-warm border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-colors body-serif"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={searching || !query.trim()}
            className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-bright disabled:opacity-60 text-paper text-sm font-medium px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            <ShieldCheck size={16} />
            Verify
          </button>
        </motion.div>
      </div>

      {/* Result */}
      {result && (
        <div className="relative w-full px-6 md:px-12 lg:px-20 pb-16">
          {result === "not_found" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl p-6 rounded-2xl bg-red-50 border border-red-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-red-600" size={20} />
                <span className="font-medium text-red-900">Certificate not found</span>
              </div>
              <p className="text-sm text-red-700">
                The certificate ID "{query}" does not match any record in our system. Please check the ID and try again. If you believe this is an error, contact <a href="mailto:ahmed@phronesis-studio.com" className="underline">ahmed@phronesis-studio.com</a>.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              {/* Verified badge */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-teal/5 border border-teal/20">
                <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
                  <ShieldCheck className="text-teal" size={20} />
                </div>
                <div>
                  <p className="font-medium text-teal">Certificate Verified</p>
                  <p className="text-xs text-ink-dim">This certificate is authentic and was issued by Studio of Phronesis.</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="p-6 md:p-8 rounded-2xl bg-paper-warm border border-border space-y-6">
                {/* Teacher + Program */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="text-teal" size={18} />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-teal font-mono">Certificate Holder</span>
                  </div>
                  <h2 className="display text-ink text-2xl md:text-3xl mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {result.teacherName}
                  </h2>
                  <p className="body-serif text-sm text-ink-soft">
                    Successfully completed <strong>{result.program}</strong>, a full eight-module professional development program at {result.institution}, {result.location}, from {result.duration}.
                  </p>
                </div>

                {/* Modules completed */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-3">Modules Completed</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.modules.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-paper border border-border/40">
                        <div className="w-6 h-6 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
                          <Check size={12} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-ink font-medium leading-tight">{m.name}</p>
                          <p className="text-[11px] text-ink-dim font-mono">{m.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completion + Trainer */}
                <div className="pt-4 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-1">Date of Completion</p>
                    <p className="body-serif text-sm text-ink-soft">{result.completionDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-1">Certificate ID</p>
                    <p className="text-sm text-ink font-mono">{result.id}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono mb-1">Program Trainer</p>
                    <p className="body-serif text-sm text-ink-soft">{result.trainer}</p>
                    <p className="body-serif text-xs text-ink-dim italic mt-1">{result.trainerTitle}</p>
                  </div>
                </div>

                {/* Link to full program */}
                <div className="pt-4 border-t border-border/40">
                  <a
                    href="/en/engagements"
                    className="inline-flex items-center gap-2 text-sm text-teal hover:text-teal-bright transition-colors"
                  >
                    <span>View full program details</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
