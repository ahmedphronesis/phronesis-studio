"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, Check, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

type Settings = {
  footerTagline: string;
  footerDescription: string;
  footerLocation: string;
  footerRights: string;
  contactEmail: string;
  contactLocation: string;
  contactResponseTime: string;
  linkedinUrl: string;
};

const DEFAULTS: Settings = {
  footerTagline: "The art of seeing the gap and closing it well.",
  footerDescription:
    "Educator, systems architect, and leadership and management professional. Available for custom builds, consultation, and tutoring.",
  footerLocation: "Al Ain · Abu Dhabi · United Arab Emirates",
  footerRights: "All rights reserved.",
  contactEmail: "ahmed@phronesis-studio.com",
  contactLocation: "Al Ain · United Arab Emirates",
  contactResponseTime:
    "I typically respond within one business day, often sooner.",
  linkedinUrl: "https://linkedin.com/in/ahmedmahmoudsaeedahmedali",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content?locale=en");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      const footer = json.content.footer || {};
      const contact = json.content.contact || {};
      setSettings({
        footerTagline: footer.tagline || DEFAULTS.footerTagline,
        footerDescription: footer.description || DEFAULTS.footerDescription,
        footerLocation: footer.location || DEFAULTS.footerLocation,
        footerRights: footer.rights || DEFAULTS.footerRights,
        contactEmail: "ahmed@phronesis-studio.com", // hardcoded in component, not in i18n
        contactLocation: contact.location || DEFAULTS.contactLocation,
        contactResponseTime: contact.responseTime || DEFAULTS.contactResponseTime,
        linkedinUrl: "https://linkedin.com/in/ahmedmahmoudsaeedahmedali",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // Save footer namespace
      const footerRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          namespace: "footer",
          value: {
            tagline: settings.footerTagline,
            description: settings.footerDescription,
            location: settings.footerLocation,
            rights: settings.footerRights,
            onThisPage: "On this page",
            liveWork: "Live work",
          },
        }),
      });
      if (!footerRes.ok) throw new Error("Failed to save footer");

      // Save contact namespace (just the fields we own)
      const contactRes = await fetch("/api/admin/content?locale=en");
      const contactJson = await contactRes.json();
      const currentContact = contactJson.content.contact || {};
      const updateContactRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          namespace: "contact",
          value: {
            ...currentContact,
            location: settings.contactLocation,
            responseTime: settings.contactResponseTime,
          },
        }),
      });
      if (!updateContactRes.ok) throw new Error("Failed to save contact");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-[#999]">
        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
        Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1
          className="text-3xl text-[#1A1A1A]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Site Settings
        </h1>
        <p className="text-sm text-[#666] mt-1">
          Brand-wide settings — footer, contact details, and links.
        </p>
      </header>

      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 md:p-8 space-y-5">
        <h2
          className="text-lg text-[#1A1A1A] pb-2 border-b border-[#E5DDD0]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Footer
        </h2>

        <Field
          label="Footer Tagline"
          value={settings.footerTagline}
          onChange={(v) => setSettings({ ...settings, footerTagline: v })}
          helpText="Short italic phrase shown in the footer under the wordmark."
        />
        <Field
          label="Footer Description"
          value={settings.footerDescription}
          onChange={(v) => setSettings({ ...settings, footerDescription: v })}
          textarea
          helpText="1–2 sentence description shown in the footer."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Footer Location"
            value={settings.footerLocation}
            onChange={(v) => setSettings({ ...settings, footerLocation: v })}
          />
          <Field
            label="Rights Text"
            value={settings.footerRights}
            onChange={(v) => setSettings({ ...settings, footerRights: v })}
          />
        </div>
      </div>

      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 md:p-8 space-y-5">
        <h2
          className="text-lg text-[#1A1A1A] pb-2 border-b border-[#E5DDD0]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Contact
        </h2>

        <Field
          label="Public Email (shown on Contact page)"
          value={settings.contactEmail}
          onChange={(v) => setSettings({ ...settings, contactEmail: v })}
          helpText="This is the email shown on the site. To change where inquiries are delivered, see the Email Forwarding note below."
        />
        <Field
          label="Location (shown on Contact page)"
          value={settings.contactLocation}
          onChange={(v) => setSettings({ ...settings, contactLocation: v })}
        />
        <Field
          label="Response Time Note"
          value={settings.contactResponseTime}
          onChange={(v) => setSettings({ ...settings, contactResponseTime: v })}
          textarea
        />
        <Field
          label="LinkedIn URL"
          value={settings.linkedinUrl}
          onChange={(v) => setSettings({ ...settings, linkedinUrl: v })}
          helpText="This is hardcoded in Contact.tsx. To change it, ask the developer (or edit the file directly)."
        />
      </div>

      <div className="bg-[#F7EFD9] border border-[#B48D3C]/30 rounded-2xl p-6">
        <h3
          className="text-base text-[#1A1A1A] mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          📧 Email Forwarding (Custom Domain Email)
        </h3>
        <p className="text-sm text-[#666] leading-relaxed">
          You mentioned wanting inquiries forwarded to your Gmail. To set up{" "}
          <code className="text-[#0F5C5E] bg-white/50 px-1.5 py-0.5 rounded text-xs">
            ahmed@phronesis-studio.com
          </code>
          :
        </p>
        <ol className="text-sm text-[#666] leading-relaxed mt-2 ml-5 list-decimal space-y-1">
          <li>
            Choose an email provider (recommended:{" "}
            <strong>Google Workspace</strong> for full Gmail, or{" "}
            <strong>Resend + Vercel</strong> for free forwarding-only).
          </li>
          <li>
            Add the provider's MX records to your domain's DNS (at your
            registrar — Namecheap, GoDaddy, Cloudflare, etc.).
          </li>
          <li>
            Configure a forwarding rule:{" "}
            <code className="text-[#0F5C5E] bg-white/50 px-1.5 py-0.5 rounded text-xs">
              ahmed@phronesis-studio.com
            </code>{" "}
            →{" "}
            <code className="text-[#0F5C5E] bg-white/50 px-1.5 py-0.5 rounded text-xs">
              ahmed.phronesis@gmail.com
            </code>
            .
          </li>
          <li>
            Update <code className="text-[#0F5C5E] bg-white/50 px-1.5 py-0.5 rounded text-xs">CONTACT_EMAIL</code>{" "}
            in this admin and the <code className="text-[#0F5C5E] bg-white/50 px-1.5 py-0.5 rounded text-xs">mailto:</code> links
            will update automatically.
          </li>
        </ol>
        <p className="text-xs text-[#999] mt-3">
          This is a DNS/provider-side task — not something the admin portal
          can do for you. Once configured, test by sending an email to the
          new address.
        </p>
      </div>

      <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6">
        <h3
          className="text-base text-[#1A1A1A] mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Need to edit other content?
        </h3>
        <p className="text-sm text-[#666] mb-4">
          For navigation labels, hero text, thesis, work content, etc., use
          the full content editor:
        </p>
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-2 text-sm text-[#0F5C5E] hover:underline"
        >
          Open Content Editor
          <ExternalLink size={12} />
        </Link>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2"
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky bottom-4 bg-[#F5EFE4] border border-[#E5DDD0] rounded-2xl p-4 shadow-sm flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving…" : saved ? "Saved" : "Save settings"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  helpText?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
        />
      )}
      {helpText && <p className="text-xs text-[#999] mt-1.5">{helpText}</p>}
    </div>
  );
}
