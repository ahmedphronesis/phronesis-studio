"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight, Check, Loader2, Linkedin, MapPin } from "lucide-react";
import { Reveal, Magnetic } from "../anim";

const BUDGET_KEYS = ["budget1", "budget2", "budget3", "budget4", "budget5", "budget6"] as const;

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const budgets = BUDGET_KEYS.map((k) => t(k));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string)?.trim(),
      email: (data.get("email") as string)?.trim(),
      company: (data.get("company") as string)?.trim() || null,
      gap: (data.get("gap") as string)?.trim(),
      budget: (data.get("budget") as string) || null,
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
      setDone(true);
      form.reset();
      toast.success(t("toastSuccess"), { description: t("toastSuccessDesc") });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(t("toastError"), { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(15, 92, 94, 0.06), transparent 70%)" }}
      />

      <div className="relative w-full px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-teal/60" />
            <span className="eyebrow">{t("eyebrow")}</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            className={`display text-ink mb-8 ${isRTL ? "leading-[1.4]" : "leading-[1.05]"}`}
            style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}
          >
            {t("title")}{" "}<br className="br-rtl-hide" />
            <span className="display-italic text-teal">{t("titleItalic")}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className={`body-serif text-base md:text-lg text-ink-soft max-w-2xl mb-10 whitespace-pre-line ${isRTL ? "leading-[2.2]" : "leading-relaxed"}`}
          >{t("intro")}</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-8" delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid sm:grid-cols-2 gap-7">
                <Field label={t("fieldName")} name="name" placeholder="Ahmed Ali" required />
                <Field label={t("fieldEmail")} name="email" type="email" placeholder="you@company.com" required />
              </div>
              <Field label={t("fieldCompany")} name="company" placeholder="Where you work" />

              <div>
                <label htmlFor="gap" className="block text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{t("fieldGap")}</label>
                <textarea
                  id="gap"
                  name="gap"
                  rows={5}
                  required
                  minLength={20}
                  placeholder={t("fieldGapPlaceholder")}
                  className="w-full bg-paper-warm/60 border border-border rounded-lg px-4 py-3.5 text-ink placeholder:text-ink-dim/60 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/40 transition-colors resize-y body-serif"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{t("fieldBudget")}</label>
                <select
                  id="budget"
                  name="budget"
                  defaultValue=""
                  className="w-full bg-paper-warm/60 border border-border rounded-lg px-4 py-3.5 text-ink focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/40 transition-colors appearance-none cursor-pointer body-serif"
                >
                  <option value="" disabled>{t("fieldBudgetPlaceholder")}</option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Magnetic strength={0.4}>
                  <button
                    type="submit"
                    disabled={submitting || done}
                    className="group inline-flex items-center gap-3 bg-teal hover:bg-teal-bright disabled:opacity-60 disabled:cursor-not-allowed text-paper font-medium px-8 py-4 rounded-full transition-all duration-300 glow-teal"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {done ? (
                        <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-3">
                          <Check size={18} strokeWidth={2.5} />
                          {t("submitted")}
                        </motion.span>
                      ) : submitting ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                          <Loader2 size={18} className="animate-spin" />
                          {t("submitting")}
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                          {t("submit")}
                          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </Magnetic>
              </div>
            </form>
          </Reveal>

          <Reveal className="lg:col-span-4" delay={0.18}>
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-4 font-mono">{t("preferEmail")}</p>
                <a href="mailto:ahmed@phronesis-studio.com" className="display-italic text-teal text-2xl md:text-3xl link-underline">
                  ahmed@phronesis-studio.com
                </a>
              </div>
              <div className="teal-rule opacity-30" />
              <div className="space-y-4">
                <ContactLink icon={Linkedin} label={t("linkedinLabel")} href="https://linkedin.com/in/ahmedmahmoudsaeedahmedali" value="in/ahmedmahmoudsaeedahmedali" />
                <ContactLink icon={MapPin} label={t("locationLabel")} href={undefined} value={t("location")} />
              </div>
              <div className="teal-rule opacity-30" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-3 font-mono">{t("responseTimeLabel")}</p>
                <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("responseTime")}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-ink-dim mb-3 font-mono">{t("engagementLabel")}</p>
                <p className="body-serif text-sm text-ink-soft leading-relaxed">{t("engagementBody")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, required }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-[11px] uppercase tracking-[0.22em] text-teal mb-3 font-mono">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-paper-warm/60 border border-border rounded-lg px-4 py-3.5 text-ink placeholder:text-ink-dim/60 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/40 transition-colors body-serif"
      />
    </div>
  );
}

function ContactLink({ icon: Icon, label, href, value }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; label: string; href?: string; value: string }) {
  const content = (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-full border border-border group-hover:border-teal/60 flex items-center justify-center text-ink-dim group-hover:text-teal transition-colors">
        <Icon size={15} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-dim font-mono">{label}</p>
        <p className={`body-serif text-sm text-ink-soft mt-0.5 ${href ? "link-underline" : ""}`}>{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  ) : content;
}
