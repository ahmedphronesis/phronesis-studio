import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { sendEpisodeBroadcast, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Episode creation may trigger a broadcast to all subscribers, which
// can take longer than the Vercel Hobby default of 10s.
export const maxDuration = 60;

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
 * Body: { number, enTitle, arTitle, enExcerpt, arExcerpt, enFull, arFull, notifySubscribers? }
 *
 * If notifySubscribers is true AND email is configured, sends a broadcast
 * email to all subscribers announcing the new episode. The broadcast is
 * non-blocking — if it fails, the episode is still created.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const {
      number,
      enTitle,
      arTitle,
      enExcerpt,
      arExcerpt,
      enFull,
      arFull,
      notifySubscribers = false,
    } = data;

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

    // Send broadcast email to all subscribers (if requested & configured).
    // Non-blocking — episode is already saved. Errors are logged but don't
    // fail the API response.
    let broadcastResult: { sent: number; failed: number; rejected: string[] } | null = null;
    if (notifySubscribers) {
      if (isEmailConfigured()) {
        try {
          broadcastResult = await sendEpisodeBroadcast({
            episodeNumber: ep.number,
            enTitle: ep.enTitle,
            arTitle: ep.arTitle,
            enExcerpt: ep.enExcerpt || undefined,
            arExcerpt: ep.arExcerpt || undefined,
          });
        } catch (broadcastErr) {
          console.error("[/api/admin/episodes POST] broadcast failed:", broadcastErr);
        }
      } else {
        console.warn("[/api/admin/episodes POST] email not configured — skipping broadcast");
      }
    }

    return NextResponse.json({
      ok: true,
      episode: ep,
      broadcast: broadcastResult,
    });
  } catch (err) {
    console.error("[/api/admin/episodes POST] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
