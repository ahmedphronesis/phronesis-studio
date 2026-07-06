import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/subscribers — list all subscribers
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const subscribers = await db.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, subscribers });
}

/**
 * DELETE /api/admin/subscribers?id=xxx — delete a subscriber
 */
export async function DELETE(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  }

  await db.subscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
