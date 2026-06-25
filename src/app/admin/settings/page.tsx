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
          Brand-wide settings, footer, contact details, and links.
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

      <EmailSetupSection />

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

// ─── Email Setup Section ────────────────────────────────────────────────────

function EmailSetupSection() {
  const [status, setStatus] = useState<null | {
    ok: boolean;
    message: string;
  }>(null);
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  async function sendTest() {
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail: testEmail || undefined }),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus({
          ok: true,
          message: `Test email sent to ${json.sentTo}. Check your inbox (and spam folder).`,
        });
      } else {
        setStatus({ ok: false, message: json.error || "Send failed" });
      }
    } catch (err) {
      setStatus({
        ok: false,
        message: err instanceof Error ? err.message : "Send failed",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 md:p-8 space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[#E5DDD0]">
        <span className="text-2xl">📧</span>
        <div>
          <h2
            className="text-lg text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Email Setup
          </h2>
          <p className="text-xs text-[#999] mt-0.5">
            Send and receive as{" "}
            <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded">
              ahmed@phronesis-studio.com
            </code>{" "}
           , 100% free, no monthly fees
          </p>
        </div>
      </div>

      {/* Architecture overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#F5EFE4] border border-[#E5DDD0] rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#0F5C5E] font-mono mb-1">
            Receive
          </div>
          <div className="font-medium text-[#1A1A1A]">ImprovMX</div>
          <div className="text-[#666] mt-1">
            Forwards incoming → Gmail
          </div>
        </div>
        <div className="bg-[#F5EFE4] border border-[#E5DDD0] rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#0F5C5E] font-mono mb-1">
            Send (app)
          </div>
          <div className="font-medium text-[#1A1A1A]">Brevo SMTP</div>
          <div className="text-[#666] mt-1">
            Auto-confirmations to leads
          </div>
        </div>
        <div className="bg-[#F5EFE4] border border-[#E5DDD0] rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#0F5C5E] font-mono mb-1">
            Send (Gmail)
          </div>
          <div className="font-medium text-[#1A1A1A]">Brevo SMTP</div>
          <div className="text-[#666] mt-1">
            Reply as your domain from Gmail
          </div>
        </div>
      </div>

      {/* Step-by-step guide */}
      <details open className="border border-[#E5DDD0] rounded-lg overflow-hidden">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-[#1A1A1A] bg-[#FAFAF7] hover:bg-[#F5EFE4]">
          Step-by-step setup guide (click to expand)
        </summary>
        <div className="p-5 space-y-5 text-sm text-[#666] leading-relaxed">

          {/* Step 1 */}
          <div>
            <h4 className="text-[#1A1A1A] font-medium mb-2">
              Step 1 · Sign up for ImprovMX (free), for{" "}
              <em>receiving</em> emails
            </h4>
            <ol className="list-decimal ml-5 space-y-1 text-[#666]">
              <li>
                Go to{" "}
                <a
                  href="https://improvmx.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F5C5E] hover:underline"
                >
                  improvmx.com
                </a>{" "}
                and create a free account.
              </li>
              <li>
                Add your domain: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">phronesis-studio.com</code>
              </li>
              <li>
                Create a forwarding rule:{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">ahmed@</code>{" "}
                →{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">ahmed.phronesis@gmail.com</code>
              </li>
              <li>
                ImprovMX will show you 2 MX records to add at your DNS
                registrar (e.g. Namecheap, GoDaddy, Cloudflare). Add them:
                <pre className="bg-[#F5EFE4] border border-[#E5DDD0] rounded p-3 mt-2 text-xs font-mono text-[#1A1A1A] overflow-x-auto">
{`Type  Host  Value              Priority
MX    @     mx1.improvmx.com   10
MX    @     mx2.improvmx.com   20`}
                </pre>
              </li>
            </ol>
            <p className="text-xs text-[#999] mt-2">
              DNS propagation: 5 minutes to 1 hour. ImprovMX shows "Active"
              when verified.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <h4 className="text-[#1A1A1A] font-medium mb-2">
              Step 2 · Sign up for Brevo (free), for{" "}
              <em>sending</em> emails
            </h4>
            <ol className="list-decimal ml-5 space-y-1 text-[#666]">
              <li>
                Go to{" "}
                <a
                  href="https://www.brevo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F5C5E] hover:underline"
                >
                  brevo.com
                </a>{" "}
                and create a free account (300 emails/day, forever free).
              </li>
              <li>
                In Brevo dashboard: <em>Settings → Senders & IP → Add a
                sender</em>. Add{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">ahmed@phronesis-studio.com</code>{" "}
               , Brevo will send a verification email to it (which
                ImprovMX forwards to your Gmail).
              </li>
              <li>
                In Brevo: <em>Settings → Domain → Add domain</em>. Add{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">phronesis-studio.com</code>.
                Brevo will give you 3 DNS records (SPF, DKIM, MX-verification). Add all 3 to your DNS:
                <pre className="bg-[#F5EFE4] border border-[#E5DDD0] rounded p-3 mt-2 text-xs font-mono text-[#1A1A1A] overflow-x-auto">
{`Type   Host                   Value
TXT    @                      v=spf1 include:spf.brevo.com ~all
TXT    brevo._domainkey       (long DKIM key from Brevo)
MX     return.phronesis-studio.com  (Brevo's bounce MX)`}
                </pre>
              </li>
              <li>
                In Brevo: <em>Settings → SMTP & API → SMTP</em>. Copy your
                SMTP credentials:
                <ul className="list-disc ml-5 mt-1 text-[#666] text-xs">
                  <li>SMTP host: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded">smtp-relay.brevo.com</code></li>
                  <li>Port: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded">587</code></li>
                  <li>Login: your Brevo account email</li>
                  <li>Password: your SMTP key (starts with <code>xkeysib-</code>)</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Step 3 */}
          <div>
            <h4 className="text-[#1A1A1A] font-medium mb-2">
              Step 3 · Tell the developer your Brevo SMTP credentials
            </h4>
            <p>
              Send these 4 values to the developer (or set them yourself
              in Vercel Project Settings → Environment Variables):
            </p>
            <pre className="bg-[#F5EFE4] border border-[#E5DDD0] rounded p-3 mt-2 text-xs font-mono text-[#1A1A1A] overflow-x-auto">
{`SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=(your Brevo account email)
SMTP_PASS=(your Brevo SMTP key, starts with xkeysib-)
CONTACT_EMAIL=ahmed@phronesis-studio.com
NOTIFY_EMAIL=ahmed@phronesis-studio.com`}
            </pre>
            <p className="text-xs text-[#999] mt-2">
              Once these are set in Vercel, the contact form will
              automatically:
            </p>
            <ul className="list-disc ml-5 text-xs text-[#666] mt-1">
              <li>Send a branded confirmation email to the lead</li>
              <li>Send a notification to your Gmail (via ImprovMX forward)</li>
              <li>Both come "from" <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded">ahmed@phronesis-studio.com</code></li>
            </ul>
          </div>

          {/* Step 4 */}
          <div>
            <h4 className="text-[#1A1A1A] font-medium mb-2">
              Step 4 · (Optional) Reply as your domain from Gmail
            </h4>
            <ol className="list-decimal ml-5 space-y-1 text-[#666]">
              <li>
                In Gmail: <em>Settings → Accounts and Import → Send mail as
                → Add another email address</em>
              </li>
              <li>
                Name: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">Ahmed Ali, Studio of Phronesis</code>,
                Email:{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">ahmed@phronesis-studio.com</code>
              </li>
              <li>
                SMTP server: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">smtp-relay.brevo.com</code>,
                Port: <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">587</code>
              </li>
              <li>
                Username: your Brevo account email; Password: your Brevo
                SMTP key
              </li>
              <li>
                Choose "Send through SMTP" (not "Send through Gmail"). Now
                when you reply to inquiries from Gmail, the From address is
                your custom domain, no "via gmail.com" header.
              </li>
            </ol>
          </div>

          {/* Step 5 */}
          <div>
            <h4 className="text-[#1A1A1A] font-medium mb-2">
              Step 5 · Test it works
            </h4>
            <p>
              Use the test button below to send yourself a test email. If
              it arrives at your Gmail, the whole pipeline is working.
            </p>
          </div>
        </div>
      </details>

      {/* Test button */}
      <div className="bg-[#F5EFE4] border border-[#E5DDD0] rounded-lg p-4">
        <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">
          Send test email
        </h4>
        <p className="text-xs text-[#666] mb-3">
          Optional, specify a different recipient, or leave blank to send
          to the configured NOTIFY_EMAIL.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="test@example.com (optional)"
            className="flex-1 bg-white border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
          />
          <button
            onClick={sendTest}
            disabled={sending}
            className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            {sending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Sending…
              </>
            ) : (
              "Send test"
            )}
          </button>
        </div>
        {status && (
          <div
            className={`mt-3 text-sm rounded-lg px-3 py-2 flex items-start gap-2 ${
              status.ok
                ? "bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/30"
                : "bg-[#B5462A]/8 text-[#B5462A] border border-[#B5462A]/30"
            }`}
          >
            {status.ok ? (
              <Check size={14} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            )}
            <span className="text-xs">{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
