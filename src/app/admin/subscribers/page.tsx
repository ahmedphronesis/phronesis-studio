"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Trash2, Download, AlertCircle, Mail } from "lucide-react";

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

  function exportCsv() {
    const csv = "email,locale,subscribed_at\n" + subscribers.map(s =>
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
    if (!confirm("Delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[#1A1A1A]" style={{ fontFamily: "Georgia, serif" }}>
            Subscribers
          </h1>
          <p className="text-sm text-[#666] mt-1">
            {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
          </p>
        </div>
        {subscribers.length > 0 && (
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 text-sm text-[#0F5C5E] hover:text-[#1A6E70] border border-[#0F5C5E]/30 hover:bg-[#0F5C5E]/5 px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </header>

      {error && (
        <div className="bg-[#B5462A]/8 border border-[#B5462A]/30 text-[#B5462A] text-sm rounded-lg px-4 py-3 flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-[#999]">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          Loading subscribers...
        </div>
      ) : subscribers.length === 0 ? (
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-12 text-center">
          <Mail size={32} className="mx-auto mb-3 text-[#999]" />
          <p className="text-[#666] text-sm">
            No subscribers yet. The signup form is in the website footer.
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
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-[#E5DDD0] last:border-0 hover:bg-[#FAFAF7]">
                  <td className="px-5 py-4 text-sm font-medium text-[#1A1A1A]">{s.email}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-[#999] font-mono uppercase">{s.locale}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#999]">
                    {new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onDelete(s.id)}
                      className="text-[#999] hover:text-[#B5462A] p-1.5 transition-colors"
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
            {subscribers.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{s.email}</p>
                  <p className="text-[10px] text-[#999] mt-0.5">
                    {s.locale.toUpperCase()} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(s.id)}
                  className="text-[#999] hover:text-[#B5462A] p-1.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
