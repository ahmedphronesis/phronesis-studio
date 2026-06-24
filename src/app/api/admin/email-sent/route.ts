import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/email-sent?limit=50
 * Returns the most recent sent emails (history).
 */
export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 200);

  const emails = await db.sentEmail.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, emails });
}
