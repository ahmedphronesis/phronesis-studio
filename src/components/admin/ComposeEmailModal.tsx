"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  X,
  AlertCircle,
  Check,
} from "lucide-react";

type ComposeEmailModalProps = {
  open: boolean;
  onClose: () => void;
  initialTo?: string;
  initialToName?: string;
  initialSubject?: string;
  initialBody?: string;
  leadId?: string;
  onSent?: () => void;
};

export function ComposeEmailModal({
  open,
  onClose,
  initialTo = "",
  initialToName = "",
  initialSubject = "",
  initialBody = "",
  leadId,
  onSent,
}: ComposeEmailModalProps) {
  const [to, setTo] = useState(initialTo);
  const [toName, setToName] = useState(initialToName);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Capture the SMTP response so we can show the user the messageId and a
  // link to Brevo's logs. "SMTP accepted" ≠ "delivered" — if the recipient
  // never receives the email, the messageId is the only way to track what
  // happened next (delivered / bounced / deferred / blocked).
  const [smtpInfo, setSmtpInfo] = useState<{
    messageId: string | null;
    smtpResponse: string;
    accepted: string[];
    rejected: string[];
  } | null>(null);

  // Reset state when modal opens with new initial values
  const [lastOpen, setLastOpen] = useState(false);
  if (open && !lastOpen) {
    setTo(initialTo);
    setToName(initialToName);
    setSubject(initialSubject);
    setBody(initialBody);
    setError(null);
    setSuccess(false);
    setSmtpInfo(null);
    setLastOpen(true);
  }
  if (!open && lastOpen) {
    setLastOpen(false);
  }

  async function onSend() {
    if (!to || !subject || !body) {
      setError("To, Subject, and Body are all required.");
      return;
    }
    setSending(true);
    setError(null);
    setSuccess(false);
    setSmtpInfo(null);
    try {
      const res = await fetch("/api/admin/email-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          toName: toName || undefined,
          subject,
          body,
          leadId: leadId || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Send failed");
      setSmtpInfo({
        messageId: json.messageId || null,
        smtpResponse: json.smtpResponse || "",
        accepted: json.accepted || [],
        rejected: json.rejected || [],
      });
      // If Brevo rejected the recipient, that's a soft failure — show it.
      if (json.rejected && json.rejected.length > 0) {
        setError(
          `Brevo rejected these recipients: ${json.rejected.join(", ")}. The email was NOT delivered to them.`
        );
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSent?.();
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  function onCloseHandler() {
    if (sending) return;
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onCloseHandler}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-4 md:inset-x-8 md:inset-y-10 lg:inset-x-20 lg:inset-y-12 bg-white z-50 rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5DDD0] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-mono">
                  Compose
                </p>
                <h2
                  className="text-xl text-[#1A1A1A]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  New email from{" "}
                  <span style={{ color: "#0F5C5E" }}>
                    ahmed@phronesis-studio.com
                  </span>
                </h2>
              </div>
              <button
                onClick={onCloseHandler}
                disabled={sending}
                className="text-[#999] hover:text-[#1A1A1A] p-2 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* To */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                  To
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="email"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="md:col-span-2 bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
                  />
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    placeholder="Recipient name (optional)"
                    className="bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                  Message
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  placeholder="Type your message here…"
                  className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors resize-none font-mono text-[13px] leading-relaxed"
                />
                <p className="text-xs text-[#999] mt-1.5">
                  Plain text. Line breaks are preserved. The email is wrapped in a branded template automatically.
                </p>
              </div>

              {/* Error/Success */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] text-sm rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={14} />
                      <span className="font-medium">SMTP accepted.</span>
                    </div>
                    {smtpInfo?.messageId && (
                      <p className="text-xs mt-1 break-all">
                        Message ID:{" "}
                        <code className="bg-white/60 px-1.5 py-0.5 rounded">
                          {smtpInfo.messageId}
                        </code>
                      </p>
                    )}
                    <p className="text-[11px] mt-2 text-[#2D6A4F]/80 leading-relaxed">
                      SMTP accepting your email ≠ recipient received it. If the
                      client says they never got it, look up the Message ID in{" "}
                      <a
                        href="https://app.brevo.com/transactional/logs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-[#0F5C5E]"
                      >
                        Brevo → Transactional → Logs
                      </a>{" "}
                      to see if it was delivered, bounced, deferred, or blocked.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E5DDD0] flex items-center justify-between gap-3">
              <p className="text-xs text-[#999]">
                Sent from{" "}
                <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded">
                  ahmed@phronesis-studio.com
                </code>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onCloseHandler}
                  disabled={sending}
                  className="text-sm text-[#666] hover:text-[#1A1A1A] px-4 py-2.5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSend}
                  disabled={sending || success}
                  className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {sending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending…
                    </>
                  ) : success ? (
                    <>
                      <Check size={14} />
                      Sent
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send email
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
