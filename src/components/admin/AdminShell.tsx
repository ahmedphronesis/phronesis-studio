"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  FileEdit,
  Headphones,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Loader2,
  Send,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/sent", label: "Sent Emails", icon: Send },
  { href: "/admin/templates", label: "Templates", icon: FileEdit },
  { href: "/admin/echoes", label: "Echoes", icon: Headphones },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-[#E5DDD0] sticky top-0 h-screen">
        <SidebarContent
          pathname={pathname}
          onLogout={onLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#E5DDD0] z-50 flex flex-col"
            >
              <SidebarContent
                pathname={pathname}
                onLogout={onLogout}
                loggingOut={loggingOut}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile only, desktop uses sidebar) */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-[#E5DDD0] px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-[#1A1A1A]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo-eagle.png" alt="" aria-hidden className="h-7 w-7" />
            <span className="text-sm font-medium text-[#1A1A1A]">Admin</span>
          </Link>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onLogout,
  loggingOut,
  onClose,
}: {
  pathname: string;
  onLogout: () => void;
  loggingOut: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-[#E5DDD0]">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={onClose}
        >
          <img src="/logo-eagle.png" alt="" aria-hidden className="h-10 w-10" />
          <div className="leading-tight">
            <p
              className="text-sm text-[#1A1A1A]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Studio of Phronesis
            </p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#999] mt-0.5 font-mono">
              Admin
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#0F5C5E]/10 text-[#0F5C5E] font-medium"
                  : "text-[#666] hover:bg-[#F5EFE4] hover:text-[#1A1A1A]"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#E5DDD0] space-y-1">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#666] hover:bg-[#F5EFE4] hover:text-[#1A1A1A] transition-colors"
        >
          <ExternalLink size={16} strokeWidth={1.5} />
          View site
        </Link>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#B5462A] hover:bg-[#B5462A]/8 transition-colors disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} strokeWidth={1.5} />
          )}
          Sign out
        </button>
      </div>
    </>
  );
}
