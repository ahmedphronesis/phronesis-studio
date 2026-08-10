import Link from "next/link";
import { db } from "@/lib/db";
import { FileText, Inbox, FileEdit, Headphones, ArrowUpRight } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [leadCount, contentCount, episodeCount, recentLeads] = await Promise.all([
    db.lead.count(),
    db.siteContent.count(),
    db.episode.count(),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const cards = [
    {
      label: "Total Leads",
      value: leadCount,
      href: "/admin/leads",
      icon: Inbox,
      tint: "#0F5C5E",
    },
    {
      label: "Content Rows",
      value: contentCount,
      href: "/admin/content",
      icon: FileText,
      tint: "#B48D3C",
    },
    {
      label: "Episodes",
      value: episodeCount,
      href: "/admin/echoes",
      icon: Headphones,
      tint: "#B5462A",
    },
    {
      label: "Templates",
      value: 8,
      href: "/admin/templates",
      icon: FileEdit,
      tint: "#2D6A4F",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1
          className="text-3xl text-[#1A1A1A]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Overview
        </h1>
        <p className="text-sm text-[#666] mt-1">
          A snapshot of your studio's activity.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, href, icon: Icon, tint }) => (
          <Link
            key={label}
            href={href}
            className="group bg-white border border-[#E5DDD0] rounded-2xl p-5 hover:border-[#0F5C5E]/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tint}15`, color: tint }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <ArrowUpRight
                size={14}
                className="text-[#999] group-hover:text-[#0F5C5E] transition-colors"
              />
            </div>
            <div
              className="text-3xl text-[#1A1A1A] leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {value}
            </div>
            <p className="text-xs uppercase tracking-[0.15em] text-[#999] mt-2 font-mono">
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl text-[#1A1A1A]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Recent Leads
          </h2>
          <Link
            href="/admin/leads"
            className="text-sm text-[#0F5C5E] hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 text-center text-[#999] text-sm">
            No leads yet.
          </div>
        ) : (
          <div className="bg-white border border-[#E5DDD0] rounded-2xl overflow-hidden">
            {recentLeads.map((lead, i) => (
              <div
                key={lead.id}
                className={`flex items-center justify-between gap-4 p-4 ${
                  i !== recentLeads.length - 1
                    ? "border-b border-[#E5DDD0]"
                    : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {lead.name}
                    {lead.company && (
                      <span className="text-[#999] font-normal">
                        {" · "}
                        {lead.company}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#999] truncate mt-0.5">
                    {lead.email}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#666] font-mono">
                    {lead.budget || "·"}
                  </p>
                  <p className="text-[10px] text-[#999] mt-0.5">
                    {lead.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2
          className="text-xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickLink
            href="/admin/templates"
            title="Generate a document"
            desc="Demo briefs, quotations, invoices, letters"
          />
          <QuickLink
            href="/admin/content"
            title="Edit site text"
            desc="Update any English or Arabic content"
          />
          <QuickLink
            href="/admin/echoes"
            title="Manage Echoes episodes"
            desc="Add or edit bilingual transcripts"
          />
          <QuickLink
            href="/admin/settings"
            title="Site settings"
            desc="Footer, navigation, contact details"
          />
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-[#E5DDD0] rounded-2xl p-5 hover:border-[#0F5C5E]/40 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-base text-[#1A1A1A] mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {title}
          </p>
          <p className="text-xs text-[#999]">{desc}</p>
        </div>
        <ArrowUpRight
          size={16}
          className="text-[#999] group-hover:text-[#0F5C5E] transition-colors mt-1"
        />
      </div>
    </Link>
  );
}
