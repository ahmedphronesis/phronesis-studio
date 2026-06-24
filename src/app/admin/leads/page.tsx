"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Download,
  Loader2,
  Inbox,
  ExternalLink,
  X,
  AlertCircle,
} from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  gap: string;
  budget: string | null;
  createdAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = search
        ? `/api/admin/leads?search=${encodeURIComponent(search)}`
        : `/api/admin/leads`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to load");
      setLeads(json.leads || []);
      setTotal(json.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadLeads, 250); // debounce
    return () => clearTimeout(t);
  }, [loadLeads]);

  async function onDelete(id: string) {
    if (!confirm("Delete this lead permanently? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Delete failed");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setTotal((prev) => prev - 1);
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  function exportCsv() {
    const headers = ["Name", "Email", "Company", "Budget", "Gap", "Submitted At"];
    const rows = leads.map((l) => [
      csvEscape(l.name),
      csvEscape(l.email),
      csvEscape(l.company || ""),
      csvEscape(l.budget || ""),
      csvEscape(l.gap),
      csvEscape(new Date(l.createdAt).toISOString()),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phronesis-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1
            className="text-3xl text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Leads Inbox
          </h1>
          <p className="text-sm text-[#666] mt-1">
            {total} {total === 1 ? "submission" : "submissions"} from the
            contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, gap…"
              className="bg-white border border-[#E5DDD0] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] w-64 transition-colors"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={leads.length === 0}
            className="inline-flex items-center gap-2 bg-white border border-[#E5DDD0] hover:border-[#0F5C5E]/40 text-[#1A1A1A] text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 text-center text-[#999]">
          <Loader2 size={20} className="animate-spin mx-auto mb-2" />
          Loading leads…
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
          <Inbox size={32} className="mx-auto mb-3 text-[#999]" />
          <p className="text-[#666] text-sm">
            {search
              ? `No leads matching "${search}"`
              : "No leads yet. New contact form submissions will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <table className="hidden md:table w-full">
            <thead className="bg-[#FAFAF7] border-b border-[#E5DDD0]">
              <tr>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Name</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Contact</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3 hidden lg:table-cell">Gap (excerpt)</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Budget</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#E5DDD0] last:border-0 hover:bg-[#FAFAF7] cursor-pointer"
                  onClick={() => setSelected(lead)}
                >
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-[#1A1A1A]">{lead.name}</div>
                    {lead.company && (
                      <div className="text-xs text-[#999] mt-0.5">{lead.company}</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`mailto:${lead.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-[#0F5C5E] hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell max-w-md">
                    <p className="text-sm text-[#666] truncate">{lead.gap}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#666] font-mono">
                      {lead.budget || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#999]">
                      {new Date(lead.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(lead.id);
                      }}
                      disabled={deletingId === lead.id}
                      className="text-[#999] hover:text-[#B5462A] p-1.5 rounded transition-colors disabled:opacity-50"
                      aria-label="Delete lead"
                    >
                      {deletingId === lead.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#E5DDD0]">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 cursor-pointer hover:bg-[#FAFAF7]"
                onClick={() => setSelected(lead)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {lead.name}
                    </p>
                    {lead.company && (
                      <p className="text-xs text-[#999] truncate mt-0.5">
                        {lead.company}
                      </p>
                    )}
                    <p className="text-xs text-[#0F5C5E] truncate mt-1">
                      {lead.email}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#999] flex-shrink-0">
                    {new Date(lead.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#666] line-clamp-2 mt-2">
                  {lead.gap}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead detail drawer */}
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
                    Lead
                  </p>
                  <h2
                    className="text-xl text-[#1A1A1A]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {selected.name}
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
                <Field label="Email">
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[#0F5C5E] hover:underline text-sm"
                  >
                    {selected.email}
                  </a>
                </Field>
                {selected.company && (
                  <Field label="Company">
                    <p className="text-sm text-[#1A1A1A]">{selected.company}</p>
                  </Field>
                )}
                {selected.budget && (
                  <Field label="Budget">
                    <p className="text-sm text-[#1A1A1A] font-mono">
                      {selected.budget}
                    </p>
                  </Field>
                )}
                <Field label="The Gap (their message)">
                  <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                    {selected.gap}
                  </p>
                </Field>
                <Field label="Submitted">
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
              </div>
              <div className="px-6 py-4 border-t border-[#E5DDD0] flex items-center justify-between gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your inquiry to Studio of Phronesis&body=Dear ${encodeURIComponent(
                    selected.name
                  )},%0D%0A%0D%0AThank you for reaching out to Studio of Phronesis. %0D%0A%0D%0A`}
                  className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  Reply by email
                </a>
                <button
                  onClick={() => onDelete(selected.id)}
                  disabled={deletingId === selected.id}
                  className="inline-flex items-center gap-2 text-[#B5462A] hover:bg-[#B5462A]/8 text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === selected.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

function csvEscape(s: string): string {
  if (!s) return "";
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
