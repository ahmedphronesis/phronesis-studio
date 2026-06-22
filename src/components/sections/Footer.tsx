"use client";

const LINKS = [
  { href: "#thesis", label: "Thesis" },
  { href: "#practice", label: "Practice" },
  { href: "#library", label: "Library" },
  { href: "#services", label: "Engagements" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Begin" },
];

const EXTERNAL = [
  { href: "https://real-estate-emperor.vercel.app", label: "Real Estate Emperor" },
  { href: "https://mscs-academy.vercel.app", label: "MSCS Academy" },
  { href: "https://mun-diplomatiq.vercel.app", label: "DiplomatiQ" },
  { href: "https://linkedin.com/in/ahmedmahmoudsaeedahmedali", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/70 bg-charcoal-darkest">
      <div className="w-full px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-3xl text-gold leading-none"
                style={{ fontFamily: "var(--font-cormorant)" }}
                aria-hidden
              >
                Φ
              </span>
              <div className="leading-none">
                <p
                  className="text-lg text-cream"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
                >
                  Ahmed Ali
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream-dim mt-1">
                  Studio of Phronesis
                </p>
              </div>
            </div>
            <p className="display-italic text-cream/70 text-lg max-w-md leading-snug">
              The art of seeing the gap and closing it well.
            </p>
            <p className="text-xs text-cream-dim mt-6 leading-relaxed max-w-sm">
              Educator, systems architect, and leadership professional. Available for custom builds, consultation, and tutoring, for institutions that have stopped settling for the gap.
            </p>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-5">
              On this page
            </p>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-cream/75 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-5">
              Live work
            </p>
            <ul className="space-y-3">
              {EXTERNAL.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-cream/75 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-cream-dim">
            © {new Date().getFullYear()} Ahmed Ali, Studio of Phronesis. All rights reserved.
          </p>
          <p className="text-xs text-cream-dim display-italic">
            Al Ain · Abu Dhabi · United Arab Emirates
          </p>
        </div>
      </div>
    </footer>
  );
}
