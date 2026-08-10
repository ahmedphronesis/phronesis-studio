"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Loader2, Trash2, Download, AlertCircle, Mail, Search,
  UserPlus, Check, X, Users, Globe,
} from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  locale: string;
  createdAt: string;
};

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<"all" | "en" | "ar">("all");

  // Manual add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newLocale, setNewLocale] = useState<"en" | "ar">("en");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/subscribers");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setSubscribers(json.subscribers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Client-side filter (in addition to server-side) for instant search UX
  const filtered = useMemo(() => {
    if (!search && localeFilter === "all") return subscribers;
    const q = search.toLowerCase().trim();
    return subscribers.filter((s) => {
      const matchesSearch = !q || s.email.toLowerCase().includes(q);
      const matchesLocale = localeFilter === "all" || s.locale === localeFilter;
      return matchesSearch && matchesLocale;
    });
  }, [subscribers, search, localeFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = subscribers.length;
    const enCount = subscribers.filter((s) => s.locale === "en").length;
    const arCount = subscribers.filter((s) => s.locale === "ar").length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = subscribers.filter((s) => new Date(s.createdAt) >= today).length;
    return { total, enCount, arCount, todayCount };
  }, [subscribers]);

  function exportCsv() {
    const csv = "email,locale,subscribed_at\n" + filtered.map((s) =>
      `${s.email},${s.locale},${new Date(s.createdAt).toISOString()}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this subscriber? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function onAddSubscriber(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setAdding(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, locale: newLocale }),
      });
      const json = await res.json();

      if (res.status === 409 || json.code === "ALREADY_SUBSCRIBED") {
        setAddError("This email is already subscribed.");
        return;
      }
      if (!json.ok) throw new Error(json.error || "Failed to add subscriber");

      setSubscribers((prev) => [json.subscriber, ...prev]);
      setAddSuccess(`Added ${newEmail} successfully.`);
      setNewEmail("");
      setTimeout(() => setAddSuccess(null), 3000);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add subscriber");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "Georgia, serif" }}>
              Subscribers
            </h1>
            <p className="text-sm text-[#666] mt-1">
              View, search, and manage everyone subscribed to your updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {subscribers.length > 0 && (
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 text-sm text-[#0F5C5E] hover:text-[#1A6E70] border border-[#0F5C5E]/30 hover:bg-[#0F5C5E]/5 px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={14} />
                Export CSV
              </button>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 text-sm text-white bg-[#0F5C5E] hover:bg-[#1A6E70] px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={14} />
              Add Subscriber
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Users size={16} />} label="Total" value={stats.total} color="#0F5C5E" />
          <StatCard icon={<Globe size={16} />} label="English" value={stats.enCount} color="#B48D3C" />
          <StatCard icon={<Globe size={16} />} label="Arabic" value={stats.arCount} color="#B5462A" />
          <StatCard icon={<Mail size={16} />} label="Today" value={stats.todayCount} color="#2D6A4F" />
        </div>

        {/* Add subscriber form (collapsible) */}
        {showAddForm && (
          <div className="bg-white border border-[#E5DDD0] rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Add a subscriber manually</h2>
              <button
                onClick={() => { setShowAddForm(false); setAddError(null); setAddSuccess(null); }}
                className="text-[#999] hover:text-[#1A1A1A]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={onAddSubscriber} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="subscriber@example.com"
                required
                className="flex-1 bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
              />
              <select
                value={newLocale}
                onChange={(e) => setNewLocale(e.target.value as "en" | "ar")}
                className="bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
              <button
                type="submit"
                disabled={adding || !newEmail.trim()}
                className="inline-flex items-center justify-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                {adding ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {adding ? "Adding..." : "Add"}
              </button>
            </form>
            {addError && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[#B5462A] bg-[#B5462A]/8 border border-[#B5462A]/30 rounded-lg px-3 py-2">
                <AlertCircle size={14} />
                {addError}
              </div>
            )}
            {addSuccess && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[#0F5C5E] bg-[#0F5C5E]/10 border border-[#0F5C5E]/30 rounded-lg px-3 py-2">
                <Check size={14} />
                {addSuccess}
              </div>
            )}
            <p className="text-xs text-[#999] mt-3">
              The system checks for duplicates before adding. If the email already exists, it will not be added again.
            </p>
          </div>
        )}

        {/* Search + filter bar */}
        {subscribers.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email..."
                className="w-full bg-white border border-[#E5DDD0] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E]"
              />
            </div>
            <div className="flex gap-1 bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg p-1">
              {(["all", "en", "ar"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocaleFilter(l)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    localeFilter === l
                      ? "bg-white text-[#0F5C5E] shadow-sm"
                      : "text-[#999] hover:text-[#1A1A1A]"
                  }`}
                >
                  {l === "all" ? "All" : l === "en" ? "English" : "Arabic"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2 mb-4">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Subscribers table / empty state */}
        {loading ? (
          <div className="text-center py-16 text-[#999]">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
            <Mail size={32} className="mx-auto mb-3 text-[#999]" />
            <p className="text-[#666] text-sm">
              No subscribers yet. The signup form is in the website footer, or you can add one manually above.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
            <Search size={32} className="mx-auto mb-3 text-[#999]" />
            <p className="text-[#666] text-sm">
              No subscribers match your search.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
            <table className="hidden md:table w-full">
              <thead className="bg-[#FAFAF7] border-b border-[#E5DDD0]">
                <tr>
                  <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Email</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Language</th>
                  <th className="text-left text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3">Subscribed</th>
                  <th className="text-right text-[10px] uppercase tracking-wider text-[#999] font-mono px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-[#E5DDD0] last:border-0 hover:bg-[#FAFAF7]">
                    <td className="px-5 py-4 text-sm font-medium text-[#1A1A1A]">{s.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full ${
                        s.locale === "en"
                          ? "bg-[#B48D3C]/10 text-[#B48D3C]"
                          : "bg-[#B5462A]/10 text-[#B5462A]"
                      }`}>
                        {s.locale}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#999]">
                      {new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      <span className="text-[#ccc] ml-1">
                        {new Date(s.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onDelete(s.id)}
                        className="text-[#999] hover:text-[#B5462A] p-1.5 transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#E5DDD0]">
              {filtered.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{s.email}</p>
                    <p className="text-[10px] text-[#999] mt-0.5">
                      <span className={`inline-block px-1.5 py-0.5 rounded-full mr-1 ${
                        s.locale === "en"
                          ? "bg-[#B48D3C]/10 text-[#B48D3C]"
                          : "bg-[#B5462A]/10 text-[#B5462A]"
                      }`}>{s.locale.toUpperCase()}</span>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(s.id)}
                    className="text-[#999] hover:text-[#B5462A] p-1.5 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Result count */}
            <div className="px-5 py-3 border-t border-[#E5DDD0] bg-[#FAFAF7] text-xs text-[#999] font-mono">
              Showing {filtered.length} of {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
            </div>
          </div>
        )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-[#E5DDD0] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#999] font-mono">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "Georgia, serif" }}>
        {value}
      </div>
    </div>
  );
}
