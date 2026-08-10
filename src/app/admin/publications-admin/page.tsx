"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2, Send, AlertCircle, BookOpen, Globe, Mail,
  Check, Users, ChevronDown, Plus, X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";

type BookOption = {
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  coverFront: string;
  author: string;
  authorAr: string;
  editions: { format: string; formatAr: string; price: string }[];
  forthcoming: boolean;
  hasArabic: boolean;
};

export default function PublicationsAdminPage() {
  const [books, setBooks] = useState<BookOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSlug, setSelectedSlug] = useState("");
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [recipients, setRecipients] = useState<string[]>([""]);
  const [addAsSubscribers, setAddAsSubscribers] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/publications/list");
      const json = await res.json();
      if (json.ok) {
        setBooks(json.books || []);
        if (json.books.length > 0) setSelectedSlug(json.books[0].slug);
      } else {
        setError(json.error || "Failed to load publications");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectedBook = books.find((b) => b.slug === selectedSlug);

  function addRecipient() {
    setRecipients([...recipients, ""]);
  }

  function removeRecipient(index: number) {
    setRecipients(recipients.filter((_, i) => i !== index));
  }

  function updateRecipient(index: number, value: string) {
    setRecipients(recipients.map((r, i) => (i === index ? value : r)));
  }

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  const validRecipients = recipients.filter((r) => r.trim() && isValidEmail(r));
  const invalidRecipients = recipients.filter((r) => r.trim() && !isValidEmail(r));

  async function onSend() {
    if (validRecipients.length === 0) {
      setError("Please enter at least one valid email address.");
      return;
    }
    if (!selectedSlug) {
      setError("Please select a publication.");
      return;
    }

    setSending(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/publications/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
          locale,
          recipients: validRecipients,
          addAsSubscribers,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Send failed");

      const r = json;
      setResult(`Announcement sent for "${r.book}" (${r.locale.toUpperCase()}): ${r.sent} delivered, ${r.failed} failed${r.rejected.length ? `, ${r.rejected.length} rejected` : ""}.`);
      setRecipients([""]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="text-center py-16 text-[#999]">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          Loading publications...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={24} className="text-[#0F5C5E]" />
          <h1 className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "Georgia, serif" }}>
            Publication Announcement
          </h1>
        </div>
        <p className="text-sm text-[#666] mb-8">
          Send a professional book announcement email. Select a publication, choose the language,
          enter recipients, and the system generates the full announcement automatically.
        </p>

        {/* Step 1: Select Publication */}
        <Section step={1} title="Select Publication" icon={<BookOpen size={16} />}>
          {books.length === 0 ? (
            <p className="text-sm text-[#999]">No publications available.</p>
          ) : (
            <div className="space-y-2">
              {books.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setSelectedSlug(b.slug)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    selectedSlug === b.slug
                      ? "border-[#0F5C5E] bg-[#0F5C5E]/5"
                      : "border-[#E5DDD0] hover:border-[#0F5C5E]/40 bg-white"
                  }`}
                >
                  <img
                    src={b.coverFront}
                    alt=""
                    className="w-10 h-14 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{b.title}</p>
                    <p className="text-xs text-[#999] truncate">{b.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {b.editions.map((e, i) => (
                        <span key={i} className="text-[10px] text-[#999] font-mono uppercase">
                          {e.format} {e.price}
                        </span>
                      ))}
                      {b.forthcoming && (
                        <span className="text-[10px] text-[#B48D3C] font-mono uppercase">Forthcoming</span>
                      )}
                    </div>
                  </div>
                  {selectedSlug === b.slug && (
                    <Check size={16} className="text-[#0F5C5E] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </Section>

        {/* Step 2: Select Language */}
        <Section step={2} title="Language" icon={<Globe size={16} />}>
          <div className="flex gap-2">
            <button
              onClick={() => setLocale("en")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                locale === "en"
                  ? "bg-[#0F5C5E] text-white"
                  : "bg-white border border-[#E5DDD0] text-[#666] hover:border-[#0F5C5E]/40"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocale("ar")}
              disabled={!selectedBook?.hasArabic}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                locale === "ar"
                  ? "bg-[#0F5C5E] text-white"
                  : "bg-white border border-[#E5DDD0] text-[#666] hover:border-[#0F5C5E]/40 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              العربية (Arabic)
            </button>
          </div>
          {selectedBook && !selectedBook.hasArabic && (
            <p className="text-xs text-[#999] mt-2">
              Arabic translation is not available for this publication. English will be used.
            </p>
          )}
        </Section>

        {/* Step 3: Recipients */}
        <Section step={3} title="Send To" icon={<Mail size={16} />}>
          <div className="space-y-2">
            {recipients.map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => updateRecipient(i, e.target.value)}
                  placeholder="recipient@example.com"
                  className={`flex-1 bg-white border rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none ${
                    email.trim() && !isValidEmail(email)
                      ? "border-red-300 focus:border-red-400"
                      : "border-[#E5DDD0] focus:border-[#0F5C5E]"
                  }`}
                />
                {recipients.length > 1 && (
                  <button
                    onClick={() => removeRecipient(i)}
                    className="text-[#999] hover:text-[#B5462A] p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addRecipient}
              className="inline-flex items-center gap-1 text-xs text-[#0F5C5E] hover:text-[#1A6E70] mt-1"
            >
              <Plus size={14} />
              Add another recipient
            </button>
          </div>

          {invalidRecipients.length > 0 && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              {invalidRecipients.length} invalid email address(es) will be skipped.
            </p>
          )}

          {/* Add as subscribers checkbox */}
          <label className="flex items-start gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={addAsSubscribers}
              onChange={(e) => setAddAsSubscribers(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#0F5C5E] cursor-pointer"
            />
            <div>
              <span className="text-sm text-[#1A1A1A]">Add recipients as subscribers</span>
              <p className="text-xs text-[#999] mt-0.5">
                New email addresses will be added to the subscriber list with the selected language.
                Existing subscribers will not be duplicated.
              </p>
            </div>
          </label>
        </Section>

        {/* Preview info */}
        {selectedBook && (
          <div className="mb-6 p-4 rounded-xl bg-[#F5EFE4]/60 border border-[#E5DDD0]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#0F5C5E] font-mono mb-2">
              Announcement Preview
            </p>
            <div className="flex items-start gap-3">
              <img
                src={selectedBook.coverFront}
                alt=""
                className="w-12 h-16 object-cover rounded flex-shrink-0"
              />
              <div className="text-sm">
                <p className="font-medium text-[#1A1A1A]">
                  {locale === "ar" && selectedBook.titleAr ? selectedBook.titleAr : selectedBook.title}
                </p>
                <p className="text-[#666] text-xs mt-0.5">
                  {locale === "ar" && selectedBook.subtitleAr ? selectedBook.subtitleAr : selectedBook.subtitle}
                </p>
                <p className="text-[#999] text-xs mt-1">
                  by {locale === "ar" && selectedBook.authorAr ? selectedBook.authorAr : selectedBook.author}
                </p>
                <p className="text-[#999] text-xs mt-2">
                  Email will be sent in {locale === "ar" ? "Arabic (RTL)" : "English (LTR)"} with full
                  book cover, enhanced excerpt, both editions, buy buttons, and author signature.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="flex items-center gap-2 text-sm text-[#0F5C5E] bg-[#0F5C5E]/10 border border-[#0F5C5E]/30 rounded-lg px-3 py-2 mb-4">
            <Check size={16} />
            {result}
          </div>
        )}

        {/* Send button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DDD0]">
          <span className="text-xs text-[#999]">
            {validRecipients.length} valid recipient{validRecipients.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={onSend}
            disabled={sending || validRecipients.length === 0 || !selectedSlug}
            className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {sending ? "Sending..." : "Send Announcement"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

function Section({ step, title, icon, children }: {
  step: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-[#0F5C5E]/10 border border-[#0F5C5E]/30 text-[#0F5C5E] text-xs font-mono flex items-center justify-center flex-shrink-0">
          {step}
        </span>
        <span className="text-sm font-medium text-[#1A1A1A] flex items-center gap-1.5">
          {icon}
          {title}
        </span>
      </div>
      <div className="ml-8">{children}</div>
    </div>
  );
}
