"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  const LINKS = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("studio") },
    { href: "/work", label: t("work") },
    { href: "/library", label: t("library") },
    { href: "/method", label: t("method") },
    { href: "/correspondence", label: t("correspondence") },
  ] as const;

  const EXTERNAL = [
    { href: "https://real-estate-emperor.vercel.app", label: "Real Estate Emperor" },
    { href: "https://mscs-academy.vercel.app", label: "MSCS Academy" },
    { href: "https://mun-diplomatiq.vercel.app", label: "DiplomatiQ" },
    { href: "https://linkedin.com/in/ahmedmahmoudsaeedahmedali", label: "LinkedIn" },
  ];

  return (
    <footer className="relative mt-auto border-t border-border bg-paper-warm">
      <div className="w-full px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo-eagle.png"
                alt=""
                aria-hidden
                className="h-11 w-11"
              />
              <div className="leading-none">
                <p
                  className="text-lg text-ink"
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 500 }}
                >
                  Ahmed Ali
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mt-1 font-mono">
                  Studio of Phronesis
                </p>
              </div>
            </div>
            <p className="display-italic text-ink-soft text-lg max-w-md leading-snug">
              {tf("tagline")}
            </p>
            <p className="body-serif text-xs text-ink-dim mt-6 leading-relaxed max-w-sm">
              {tf("description")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-teal mb-5 font-mono">
              {tf("onThisPage")}
            </p>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline body-serif text-sm text-ink-soft hover:text-teal transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-teal mb-5 font-mono">
              {tf("liveWork")}
            </p>
            <ul className="space-y-3">
              {EXTERNAL.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline body-serif text-sm text-ink-soft hover:text-teal transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-ink-dim body-serif">
            © {new Date().getFullYear()} Ahmed Ali, Studio of Phronesis. {tf("rights")}
          </p>
          <p className="text-xs text-ink-dim display-italic">
            {tf("location")}
          </p>
        </div>
      </div>
    </footer>
  );
}
