"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  X,
  AlertCircle,
  Mail,
} from "lucide-react";
import { ComposeEmailModal } from "@/components/admin/ComposeEmailModal";

type SentEmail = {
  id: string;
  toEmail: string;
  toName: string | null;
  subject: string;
  bodyText: string;
  createdAt: string;
  leadId: string | null;
};

export default function SentEmailsPage() {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SentEmail | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeState, setComposeState] = useState<{
    to: string;
    toName: string;
    subject: string;
    body: string;
  }>({ to: "", toName: "", subject: "", body: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-sent?limit=100");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setEmails(json.emails || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="text-center py-16 text-[#999]">
        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
        Loading sent emails…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Sent Emails
          </h1>
          <p className="text-sm text-[#666] mt-1">
            {emails.length} {emails.length === 1 ? "email" : "emails"} sent
            from{" "}
            <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">
              ahmed@phronesis-studio.com
            </code>
          </p>
        </div>
        <button
          onClick={() => {
            setComposeState({ to: "", toName: "", subject: "", body: "" });
            setComposeOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Send size={14} />
          Compose
        </button>
      </header>

      {error && (
        <div className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {emails.length === 0 ? (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
          <Mail size={32} className="mx-auto mb-3 text-[#999]" />
          <p className="text-[#666] text-sm">
            No emails sent yet. Click "Compose" to send your first email from{" "}
            <code className="text-[#0F5C5E] bg-[#F5EFE4] px-1.5 py-0.5 rounded text-xs">
              ahmed@phronesis-studio.com
            </code>
            .
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
          <table className="hidden md:table w-full">
            <thead className="bg-[#FAFAF7] border-b border-[#E5DDD0]">
              <tr>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">To</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Subject</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Sent</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr
                  key={email.id}
                  className="border-b border-[#E5DDD0] last:border-0 hover:bg-[#FAFAF7] cursor-pointer"
                  onClick={() => setSelected(email)}
                >
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {email.toName || email.toEmail}
                    </div>
                    {email.toName && (
                      <div className="text-xs text-[#999] mt-0.5">{email.toEmail}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#1A1A1A] truncate max-w-md">
                      {email.subject}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#999]">
                      {new Date(email.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#E5DDD0]">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-4 cursor-pointer hover:bg-[#FAFAF7]"
                onClick={() => setSelected(email)}
              >
                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                  {email.toName || email.toEmail}
                </p>
                <p className="text-sm text-[#666] truncate mt-0.5">
                  {email.subject}
                </p>
                <p className="text-[10px] text-[#999] mt-1">
                  {new Date(email.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-[#E5DDD0] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-mono">
                    Sent email
                  </p>
                  <h2
                    className="text-lg text-[#1A1A1A] leading-tight mt-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {selected.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[#999] hover:text-[#1A1A1A] p-2"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <Field label="To">
                  <p className="text-sm text-[#1A1A1A]">
                    {selected.toName ? `${selected.toName} <${selected.toEmail}>` : selected.toEmail}
                  </p>
                </Field>
                <Field label="From">
                  <p className="text-sm text-[#0F5C5E]">
                    ahmed@phronesis-studio.com
                  </p>
                </Field>
                <Field label="Sent">
                  <p className="text-sm text-[#666]">
                    {new Date(selected.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Field>
                <Field label="Message">
                  <pre className="text-sm text-[#1A1A1A] whitespace-pre-wrap leading-relaxed font-sans">
                    {selected.bodyText}
                  </pre>
                </Field>
              </div>
              <div className="px-6 py-4 border-t border-[#E5DDD0] flex items-center gap-3">
                <button
                  onClick={() => {
                    setComposeState({
                      to: selected.toEmail,
                      toName: selected.toName || "",
                      subject: selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`,
                      body: `\n\n\n— On ${new Date(selected.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}, you wrote:\n\n${selected.bodyText.split("\n").map((line) => `> ${line}`).join("\n")}`,
                    });
                    setSelected(null);
                    setComposeOpen(true);
                  }}
                  className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Send size={14} />
                  Reply again
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ComposeEmailModal
        open={composeOpen}
        onClose={() => {
          setComposeOpen(false);
          load();
        }}
        initialTo={composeState.to}
        initialToName={composeState.toName}
        initialSubject={composeState.subject}
        initialBody={composeState.body}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-mono mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}
