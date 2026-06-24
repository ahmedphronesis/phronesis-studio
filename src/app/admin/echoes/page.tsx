"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Headphones,
  AlertCircle,
} from "lucide-react";

type Episode = {
  number: number;
  enTitle: string;
  arTitle: string;
  enExcerpt: string;
  arExcerpt: string;
  enFull: string;
  arFull: string;
};

type EditState = {
  number: string;
  enTitle: string;
  arTitle: string;
  enExcerpt: string;
  arExcerpt: string;
  enFull: string;
  arFull: string;
};

const EMPTY: EditState = {
  number: "",
  enTitle: "",
  arTitle: "",
  enExcerpt: "",
  arExcerpt: "",
  enFull: "",
  arFull: "",
};

export default function EchoesAdminPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/episodes");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setEpisodes(json.episodes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    const nextNum = episodes.length > 0 ? Math.max(...episodes.map((e) => e.number)) + 1 : 1;
    setEditing({ ...EMPTY, number: String(nextNum) });
    setIsNew(true);
  }

  function startEdit(ep: Episode) {
    setEditing({
      number: String(ep.number),
      enTitle: ep.enTitle,
      arTitle: ep.arTitle,
      enExcerpt: ep.enExcerpt,
      arExcerpt: ep.arExcerpt,
      enFull: ep.enFull,
      arFull: ep.arFull,
    });
    setIsNew(false);
  }

  async function onSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew
        ? "/api/admin/episodes"
        : `/api/admin/episodes/${editing.number}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: parseInt(editing.number, 10),
          enTitle: editing.enTitle,
          arTitle: editing.arTitle,
          enExcerpt: editing.enExcerpt,
          arExcerpt: editing.arExcerpt,
          enFull: editing.enFull,
          arFull: editing.arFull,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(number: number) {
    if (!confirm(`Delete episode ${number}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/episodes/${number}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16 text-[#999]">
        <Loader2 size={24} className="animate-spin mx-auto mb-2" />
        Loading episodes…
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
            Echoes
          </h1>
          <p className="text-sm text-[#666] mt-1">
            {episodes.length} episodes. Bilingual transcripts shown on the
            Philosophy Works page.
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={14} />
          New episode
        </button>
      </header>

      {error && (
        <div className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {episodes.length === 0 ? (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
          <Headphones size={32} className="mx-auto mb-3 text-[#999]" />
          <p className="text-[#666] text-sm">
            No episodes yet. Click "New episode" to add the first.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep) => (
            <div
              key={ep.number}
              className="bg-white border border-[#E5DDD0] rounded-2xl p-5 flex items-start gap-4"
            >
              <div
                className="text-3xl text-[#0F5C5E] flex-shrink-0 w-14 text-center font-light"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {String(ep.number).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                  {ep.enTitle}
                </p>
                <p
                  className="text-sm text-[#666] truncate mt-0.5"
                  style={{ fontFamily: "Georgia, serif", direction: "rtl" }}
                >
                  {ep.arTitle}
                </p>
                <p className="text-xs text-[#999] mt-1.5 line-clamp-1">
                  {ep.enExcerpt.slice(0, 120)}…
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(ep)}
                  className="text-[#666] hover:text-[#0F5C5E] p-2 rounded transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDelete(ep.number)}
                  className="text-[#999] hover:text-[#B5462A] p-2 rounded transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setEditing(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-4 md:inset-12 bg-white z-50 rounded-2xl flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#E5DDD0] flex items-center justify-between">
                <h2
                  className="text-xl text-[#1A1A1A]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {isNew ? "New Episode" : `Edit Episode ${editing.number}`}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="text-[#999] hover:text-[#1A1A1A] p-2"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      Number
                    </label>
                    <input
                      type="number"
                      value={editing.number}
                      onChange={(e) =>
                        setEditing({ ...editing, number: e.target.value })
                      }
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      English Title
                    </label>
                    <input
                      type="text"
                      value={editing.enTitle}
                      onChange={(e) =>
                        setEditing({ ...editing, enTitle: e.target.value })
                      }
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                    Arabic Title (العنوان بالعربية)
                  </label>
                  <input
                    type="text"
                    value={editing.arTitle}
                    onChange={(e) =>
                      setEditing({ ...editing, arTitle: e.target.value })
                    }
                    dir="rtl"
                    style={{ fontFamily: "Georgia, serif" }}
                    className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      English Excerpt
                    </label>
                    <textarea
                      value={editing.enExcerpt}
                      onChange={(e) =>
                        setEditing({ ...editing, enExcerpt: e.target.value })
                      }
                      rows={2}
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      Arabic Excerpt (مقتطف)
                    </label>
                    <textarea
                      value={editing.arExcerpt}
                      onChange={(e) =>
                        setEditing({ ...editing, arExcerpt: e.target.value })
                      }
                      rows={2}
                      dir="rtl"
                      style={{ fontFamily: "Georgia, serif" }}
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] resize-y"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      English Full Transcript
                    </label>
                    <textarea
                      value={editing.enFull}
                      onChange={(e) =>
                        setEditing({ ...editing, enFull: e.target.value })
                      }
                      rows={12}
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] resize-y font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
                      Arabic Full Transcript (النص الكامل)
                    </label>
                    <textarea
                      value={editing.arFull}
                      onChange={(e) =>
                        setEditing({ ...editing, arFull: e.target.value })
                      }
                      rows={12}
                      dir="rtl"
                      style={{ fontFamily: "Georgia, serif" }}
                      className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] resize-y"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#E5DDD0] flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="text-sm text-[#666] hover:text-[#1A1A1A] px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {isNew ? "Create episode" : "Save changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
