"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowUpRight, Check, Loader2, Mail, Linkedin, MapPin } from "lucide-react";
import { Reveal } from "../anim";

const BUDGETS = [
  "Below 15K AED",
  "15K – 30K AED",
  "30K – 60K AED",
  "60K – 120K AED",
  "120K+ AED",
  "I don't know yet — let's discuss",
];

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Submission failed");
      }
      setDone(true);
      form.reset();
      toast.success("Inquiry received.", {
        description: "I read every message personally. Expect a reply within 48 hours.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Could not send inquiry.", { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative py-32 md:py-44 bg-charcoal/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Begin</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display text-cream text-[clamp(2.4rem,5.5vw,4.4rem)] max-w-4xl mb-6">
            Tell me what gap needs closing.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-base md:text-lg text-cream/75 max-w-2xl leading-relaxed">
            One paragraph is enough. What is the spreadsheet, the workflow, the system, the gap that nobody has time to fix? I read every message myself and reply within 48 hours.
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-12 gap-12 lg:gap-20">
          {/* Form */}
          <Reveal className="md:col-span-8" delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid sm:grid-cols-2 gap-7">
                <Field label="Your name" name="name" placeholder="Ahmed Ali" required />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <Field
                label="Company / Institution (optional)"
                name="company"
                placeholder="Where you work"
              />

              <div>
                <label
                  htmlFor="gap"
                  className="block text-[11px] uppercase tracking-[0.22em] text-gold mb-3"
                >
                  The gap you need closed
                </label>
                <textarea
                  id="gap"
                  name="gap"
                  rows={5}
                  required
                  minLength={20}
                  placeholder="What is broken, repeated, or done by hand that shouldn't be? What does it cost you, weekly or monthly, to keep doing it this way?"
                  className="w-full bg-charcoal-dark/60 border border-border rounded-lg px-4 py-3.5 text-cream placeholder:text-cream-dim/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors resize-y"
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-[11px] uppercase tracking-[0.22em] text-gold mb-3"
                >
                  Budget range (optional)
                </label>
                <select
                  id="budget"
                  name="budget"
                  defaultValue=""
                  className="w-full bg-charcoal-dark/60 border border-border rounded-lg px-4 py-3.5 text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select a range — or skip if you're not sure
                  </option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || done}
                  className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-bright disabled:opacity-60 disabled:cursor-not-allowed text-charcoal-dark font-medium px-8 py-4 rounded-full transition-all duration-300"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span
                        key="done"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-3"
                      >
                        <Check size={18} strokeWidth={2.5} />
                        Inquiry received
                      </motion.span>
                    ) : submitting ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <Loader2 size={18} className="animate-spin" />
                        Sending
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        Send the inquiry
                        <ArrowUpRight
                          size={18}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </Reveal>

          {/* Sidebar */}
          <Reveal className="md:col-span-4" delay={0.18}>
            <div className="md:sticky md:top-32 space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream-dim mb-4">
                  Prefer email?
                </p>
                <a
                  href="mailto:ahmed@phronesis-studio.com"
                  className="display-italic text-gold text-xl md:text-2xl link-underline"
                >
                  ahmed@phronesis-studio.com
                </a>
              </div>

              <div className="gold-rule opacity-30" />

              <div className="space-y-4">
                <ContactLink
                  icon={Linkedin}
                  label="LinkedIn"
                  href="https://linkedin.com/in/ahmedmahmoudsaeedahmedali"
                  value="in/ahmedmahmoudsaeedahmedali"
                />
                <ContactLink
                  icon={Mail}
                  label="Gmail (backup)"
                  href="mailto:ahmed.phronesis@gmail.com"
                  value="ahmed.phronesis@gmail.com"
                />
                <ContactLink
                  icon={MapPin}
                  label="Location"
                  href={undefined}
                  value="Al Ain, Abu Dhabi, UAE"
                />
              </div>

              <div className="gold-rule opacity-30" />

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream-dim mb-3">
                  Response time
                </p>
                <p className="text-sm text-cream/75 leading-relaxed">
                  Within 48 hours, personally. No autoresponders, no sales pipeline, no SDR. If your gap is urgent, mention it in the message.
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream-dim mb-3">
                  Minimum engagement
                </p>
                <p className="text-sm text-cream/75 leading-relaxed">
                  8,000 AED. Annual license + setup fee. No one-time payments. Custom scope, fixed timeline, production-grade from day one.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[11px] uppercase tracking-[0.22em] text-gold mb-3"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-charcoal-dark/60 border border-border rounded-lg px-4 py-3.5 text-cream placeholder:text-cream-dim/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition-colors"
      />
    </div>
  );
}

function ContactLink({
  icon: Icon,
  label,
  href,
  value,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  href?: string;
  value: string;
}) {
  const content = (
    <div className="flex items-center gap-4 group">
      <div className="w-9 h-9 rounded-full border border-border group-hover:border-gold/60 flex items-center justify-center text-cream-dim group-hover:text-gold transition-colors">
        <Icon size={14} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim">{label}</p>
        <p className={`text-sm text-cream/85 mt-0.5 ${href ? "link-underline" : ""}`}>{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
}
