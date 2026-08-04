"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Loader2, Check } from "lucide-react";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setError(null);
    setSubscribed(false);
    setAlreadySubscribed(false);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const json = await res.json();

      // Handle duplicate subscription (HTTP 409)
      if (res.status === 409 || json.code === "ALREADY_SUBSCRIBED") {
        setAlreadySubscribed(true);
        // Display the bilingual message from the server, falling back to a
        // local string if the server didn't include one.
        const msg = locale === "ar" ? json.message_ar : json.message_en;
        // We don't throw — this is NOT an error, it's an expected state.
        // The alreadySubscribed state shows a distinct (amber, not red) message.
        setTimeout(() => setAlreadySubscribed(false), 5000);
        return;
      }

      if (!json.ok) throw new Error(json.error || "Subscription failed");
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="relative mt-auto border-t border-border bg-paper-warm">
      <div className="w-full px-6 md:px-12 lg:px-20 py-8 md:py-10">
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

            {/* Follow the work — real email capture that saves to the database.
                Subscribers are stored in the Subscriber table and can be
                viewed/exported from the admin portal. */}
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-teal mb-3 font-mono">
                {tf("followWork")}
              </p>
              <form onSubmit={onSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tf("followWorkPlaceholder")}
                  disabled={subscribing}
                  required
                  className="flex-1 bg-paper border border-border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-dim/50 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-colors body-serif disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={subscribing || subscribed}
                  className="inline-flex items-center justify-center bg-teal hover:bg-teal-bright disabled:opacity-60 text-paper text-xs font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-mono uppercase tracking-wider"
                >
                  {subscribing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : subscribed ? (
                    <Check size={14} />
                  ) : (
                    tf("followWorkButton")
                  )}
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-teal mt-2 body-serif">
                  {locale === "ar" ? "تم اشتراكك بنجاح. تحقّق من بريدك الإلكتروني للحصول على رسالة الترحيب." : "Subscribed successfully. Check your inbox for a welcome email."}
                </p>
              )}
              {alreadySubscribed && (
                <p className="text-[10px] text-amber-600 mt-2 body-serif font-medium">
                  {locale === "ar" ? "هذا البريد الإلكتروني مشترك بالفعل." : "This email is already subscribed."}
                </p>
              )}
              {error && (
                <p className="text-[10px] text-red-600 mt-2 body-serif">{error}</p>
              )}
              <p className="text-[10px] text-ink-dim/60 mt-2 body-serif italic">
                {tf("followWorkDesc")}
              </p>
            </div>
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

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
