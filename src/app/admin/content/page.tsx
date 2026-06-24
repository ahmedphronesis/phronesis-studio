"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Search,
  RotateCcw,
} from "lucide-react";

type Locale = "en" | "ar";

const NAMESPACES = [
  { key: "nav", label: "Navigation" },
  { key: "hero", label: "Hero (Homepage Top)" },
  { key: "thesis", label: "Thesis" },
  { key: "vouches", label: "Vouches & Recommendations" },
  { key: "about", label: "About / Studio" },
  { key: "work", label: "Work (Section Headers)" },
  { key: "workContent", label: "Work Content (Projects, Education, Real Estate, Finance)" },
  { key: "echoes", label: "Echoes / Philosophy Works" },
  { key: "library", label: "Library" },
  { key: "method", label: "Method" },
  { key: "contact", label: "Contact / Correspondence" },
  { key: "footer", label: "Footer" },
  { key: "language", label: "Language Switcher UI" },
];

export default function ContentEditorPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeNs, setActiveNs] = useState<string>("hero");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [draftJson, setDraftJson] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");

  // Load all content once
  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to load");
      setContent(json.content || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // When active namespace or locale changes, populate the editor
  useEffect(() => {
    const localeContent = content[locale] as Record<string, unknown> | undefined;
    const nsContent = localeContent?.[activeNs];
    setDraftJson(nsContent ? JSON.stringify(nsContent, null, 2) : "{}");
    setSuccess(false);
    setError(null);
  }, [locale, activeNs, content]);

  async function onSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Parse the JSON to validate
      const parsed = JSON.parse(draftJson);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, namespace: activeNs, value: parsed }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Save failed");
      // Update local state
      setContent((prev) => ({
        ...prev,
        [locale]: { ...(prev[locale] as Record<string, unknown> || {}), [activeNs]: parsed },
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    const nsContent = content[locale]?.[activeNs];
    setDraftJson(nsContent ? JSON.stringify(nsContent, null, 2) : "{}");
    setError(null);
    setSuccess(false);
  }

  const filteredNamespaces = NAMESPACES.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.key.toLowerCase().includes(search.toLowerCase())
  );

  const isRtl = locale === "ar";

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1
            className="text-3xl text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Content Editor
          </h1>
          <p className="text-sm text-[#666] mt-1">
            Edit any text on the site. Changes go live instantly after save.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E5DDD0] rounded-lg p-1">
          {(["en", "ar"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                locale === l
                  ? "bg-[#0F5C5E] text-white"
                  : "text-[#666] hover:bg-[#F5EFE4]"
              }`}
              style={l === "ar" ? { fontFamily: "Georgia, serif" } : {}}
            >
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Namespace browser */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-[#E5DDD0]">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sections…"
                  className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] transition-colors"
                />
              </div>
            </div>
            <nav className="max-h-[60vh] overflow-y-auto p-2 space-y-0.5">
              {filteredNamespaces.map((ns) => (
                <button
                  key={ns.key}
                  onClick={() => setActiveNs(ns.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeNs === ns.key
                      ? "bg-[#0F5C5E]/10 text-[#0F5C5E] font-medium"
                      : "text-[#666] hover:bg-[#F5EFE4]"
                  }`}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#999] mb-0.5">
                    {ns.key}
                  </div>
                  <div className="leading-tight">{ns.label}</div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Editor */}
        <section className="lg:col-span-8 xl:col-span-9">
          <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5DDD0] flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999] font-mono">
                  {locale} · {activeNs}
                </p>
                <h2
                  className="text-lg text-[#1A1A1A]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {NAMESPACES.find((n) => n.key === activeNs)?.label}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 text-xs text-[#666] hover:text-[#1A1A1A] px-3 py-2 rounded-lg hover:bg-[#F5EFE4] transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  onClick={onSave}
                  disabled={saving || loading}
                  className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving…
                    </>
                  ) : success ? (
                    <>
                      <Check size={14} />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-[#999]">
                <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                Loading…
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={draftJson}
                  onChange={(e) => {
                    setDraftJson(e.target.value);
                    setSuccess(false);
                  }}
                  spellCheck={false}
                  dir={isRtl ? "rtl" : "ltr"}
                  className="w-full h-[60vh] p-5 font-mono text-xs text-[#1A1A1A] bg-[#FAFAF7] focus:outline-none resize-none border-0"
                  style={{
                    fontFamily:
                      "ui-monospace, 'SF Mono', Monaco, Consolas, monospace",
                    lineHeight: 1.6,
                  }}
                />
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 py-3 bg-[#B5462A]/8 border-t border-[#B5462A]/30 text-sm text-[#B5462A] flex items-start gap-2"
                >
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-xs mt-0.5 opacity-90">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs text-[#999] mt-3 px-1">
            Tip: Edit the JSON above. Keys must stay exactly as shown — only
            translate the values. Save to publish. The site picks up changes
            on the next request.
          </p>
        </section>
      </div>
    </div>
  );
}
