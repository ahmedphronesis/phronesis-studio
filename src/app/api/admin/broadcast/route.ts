import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { sendPublicationBroadcast, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Broadcasts can take a long time (5 emails/sec × N subscribers).
export const maxDuration = 60;

/**
 * GET /api/admin/broadcast — return subscriber count for preview
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const count = await db.subscriber.count();
  return NextResponse.json({ ok: true, subscriberCount: count, emailConfigured: isEmailConfigured() });
}

/**
 * POST /api/admin/broadcast — send a custom email to all subscribers
 * Body: { subject, html, text, locale? }
 *
 * This is the "manual broadcast" feature — lets the admin compose an
 * arbitrary email (announcement, newsletter, etc.) and send it to every
 * subscriber. Rate-limited at 5 emails/sec, writes a SentEmail audit
 * row per recipient.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { subject, html, text, locale = "all" } = await req.json();

    if (!subject || !html || !text) {
      return NextResponse.json(
        { ok: false, error: "subject, html, and text are required" },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { ok: false, error: "Email not configured. Set BREVO_API_KEY or SMTP_* env vars." },
        { status: 503 }
      );
    }

    const result = await sendPublicationBroadcast({ subject, html, text, locale });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[/api/admin/broadcast POST] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
