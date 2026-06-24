"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Login failed");
      router.refresh();
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE4] px-4">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <img
            src="/logo-eagle.png"
            alt=""
            aria-hidden
            className="h-20 w-20 mx-auto mb-3"
          />
          <h1
            className="text-2xl text-[#1A1A1A] tracking-wide"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Studio of Phronesis
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#666] mt-2 font-mono">
            Admin Portal
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white/80 backdrop-blur border border-[#E5DDD0] rounded-2xl p-8 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg pl-10 pr-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.22em] text-[#0F5C5E] mb-2 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#F5EFE4]/60 border border-[#E5DDD0] rounded-lg pl-10 pr-10 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#0F5C5E] focus:ring-1 focus:ring-[#0F5C5E]/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0F5C5E]"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#B5462A] bg-[#B5462A]/8 border border-[#B5462A]/30 rounded-lg px-4 py-2.5"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group w-full inline-flex items-center justify-center gap-2 bg-[#0F5C5E] hover:bg-[#1A6E70] disabled:opacity-60 disabled:cursor-not-allowed text-[#F5EFE4] font-medium px-5 py-3.5 rounded-lg transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Enter Studio
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#999] mt-6">
          <a href="/" className="hover:text-[#0F5C5E] transition-colors">
            ← Back to site
          </a>
        </p>
      </motion.div>
    </div>
  );
}
