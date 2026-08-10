import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/episodes/[id] — update episode
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();
    const { number, enTitle, arTitle, enExcerpt, arExcerpt, enFull, arFull } = data;

    const ep = await db.episode.update({
      where: { number: parseInt(id, 10) },
      data: {
        ...(number !== undefined && { number: parseInt(number, 10) }),
        ...(enTitle !== undefined && { enTitle }),
        ...(arTitle !== undefined && { arTitle }),
        ...(enExcerpt !== undefined && { enExcerpt }),
        ...(arExcerpt !== undefined && { arExcerpt }),
        ...(enFull !== undefined && { enFull }),
        ...(arFull !== undefined && { arFull }),
      },
    });

    return NextResponse.json({ ok: true, episode: ep });
  } catch (err) {
    console.error("[/api/admin/episodes PUT] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/episodes/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.episode.delete({ where: { number: parseInt(id, 10) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/episodes DELETE] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
