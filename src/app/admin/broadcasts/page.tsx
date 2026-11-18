"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Send, AlertCircle, Mail, Users } from "lucide-react";

export default function BroadcastsPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [locale, setLocale] = useState<"all" | "en" | "ar">("all");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(true);

  const loadPreview = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/broadcast");
      const json = await res.json();
      if (json.ok) {
        setSubscriberCount(json.subscriberCount);
        setEmailConfigured(json.emailConfigured);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  async function onSend() {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and message are required.");
      return;
    }
    setSending(true);
    setError(null);
    setResult(null);
    try {
      // Build a simple HTML wrapper around the plain-text body
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <tr><td style="padding:32px 40px 20px;border-bottom:3px solid #B48D3C;">
          <div style="font-family:Consolas,monospace;font-size:11px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">STUDIO OF PHRONESIS</div>
          <h1 style="font-family:Cambria,Georgia,serif;font-size:24px;color:#1A1A1A;margin:8px 0 0;font-weight:normal;">${escapeHtml(subject)}</h1>
        </td></tr>
        <tr><td style="padding:24px 40px;">
          <p style="font-size:14px;color:#1A1A1A;line-height:1.7;white-space:pre-wrap;">${escapeHtml(body)}</p>
        </td></tr>
        <tr><td style="padding:16px 40px 32px;text-align:center;border-top:1px solid #EAE3D5;">
          <p style="font-size:11px;color:#8A8A8A;margin:0;">You're receiving this because you subscribed at phronesis-studio.com. Reply with "unsubscribe" to opt out.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

      const text = `${subject}

${body}

---
Studio of Phronesis
You're receiving this because you subscribed at phronesis-studio.com. Reply with "unsubscribe" to opt out.`;

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, text, locale }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Send failed");
      setResult(`Broadcast complete: ${json.sent} delivered, ${json.failed} failed${json.rejected?.length ? `, ${json.rejected.length} rejected` : ""}.`);
      setSubject("");
      setBody("");
      await loadPreview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Mail size={24} className="text-[#0F5C5E]" />
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Broadcast</h1>
      </div>
        <p className="text-sm text-[#666] mb-8">
          Compose a custom email and send it to all subscribers. Use this for
          announcements, newsletters, or any message that isn&apos;t tied to a
          specific episode.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-[#E5DDD0] bg-[#F5EFE4]/40">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-[#0F5C5E]" />
              <span className="text-xs uppercase tracking-[0.15em] text-[#666] font-mono">Recipients</span>
            </div>
            <div className="text-2xl font-semibold text-[#1A1A1A]">
              {subscriberCount === null ? "…" : subscriberCount}
            </div>
            <div className="text-xs text-[#666] mt-1">subscribers will receive this</div>
          </div>
          <div className={`p-4 rounded-lg border ${emailConfigured ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-center gap-2 mb-1">
              <Send size={16} className={emailConfigured ? "text-green-600" : "text-red-600"} />
              <span className="text-xs uppercase tracking-[0.15em] text-[#666] font-mono">Email status</span>
            </div>
            <div className="text-sm font-semibold text-[#1A1A1A]">
              {emailConfigured ? "Configured" : "Not configured"}
            </div>
            <div className="text-xs text-[#666] mt-1">
              {emailConfigured ? "Brevo API / SMTP ready" : "Set BREVO_API_KEY in env"}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New article in the Library"
              className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
              Recipients
            </label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "all" | "en" | "ar")}
              className="bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
            >
              <option value="all">All subscribers (EN + AR)</option>
              <option value="en">English subscribers only</option>
              <option value="ar">Arabic subscribers only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              placeholder="Write your message here. Plain text — line breaks are preserved."
              className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] resize-y"
            />
            <p className="text-xs text-[#666] mt-1">
              The message is wrapped in a branded Studio of Phronesis email
              template automatically. Sent at 5 emails/sec to respect Brevo
              limits.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {result && (
            <div className="text-sm text-[#0F5C5E] bg-[#0F5C5E]/10 border border-[#0F5C5E]/30 rounded-lg px-3 py-2">
              {result}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DDD0]">
            <button
              onClick={onSend}
              disabled={sending || !emailConfigured || !subject.trim() || !body.trim()}
              className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {sending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {sending ? "Sending…" : `Send to ${subscriberCount ?? "?"} subscribers`}
            </button>
          </div>
        </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
