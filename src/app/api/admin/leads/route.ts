import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/leads?search=...&take=50&cursor=...
 * Returns leads, newest first.
 */
export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("search")?.trim();
  const take = Math.min(parseInt(req.nextUrl.searchParams.get("take") || "100", 10), 500);

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
          { gap: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
  });

  const total = await db.lead.count({ where });

  return NextResponse.json({ ok: true, leads, total });
}

/**
 * DELETE /api/admin/leads
 * Body: { id } — deletes a single lead by ID.
 */
export async function DELETE(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/leads DELETE] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
