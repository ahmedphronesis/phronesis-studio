import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/episodes — list all episodes
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const episodes = await db.episode.findMany({ orderBy: { number: "asc" } });
  return NextResponse.json({ ok: true, episodes });
}

/**
 * POST /api/admin/episodes — create a new episode
 * Body: { number, enTitle, arTitle, enExcerpt, arExcerpt, enFull, arFull }
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { number, enTitle, arTitle, enExcerpt, arExcerpt, enFull, arFull } = data;

    if (!number || !enTitle || !arTitle) {
      return NextResponse.json(
        { ok: false, error: "number, enTitle, arTitle are required" },
        { status: 400 }
      );
    }

    const ep = await db.episode.create({
      data: {
        number: parseInt(number, 10),
        enTitle,
        arTitle,
        enExcerpt: enExcerpt || "",
        arExcerpt: arExcerpt || "",
        enFull: enFull || "",
        arFull: arFull || "",
      },
    });

    return NextResponse.json({ ok: true, episode: ep });
  } catch (err) {
    console.error("[/api/admin/episodes POST] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
