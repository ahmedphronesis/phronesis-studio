import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendSubscriberWelcome, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Hobby default is 10s; Brevo API can exceed that on slow days.
export const maxDuration = 60;

const SubscribeSchema = z.object({
  email: z.string().email("Valid email is required"),
  locale: z.enum(["en", "ar"]).optional().default("en"),
});

/**
 * POST /api/subscribe
 * Adds an email to the subscribers table. If the email already exists,
 * returns ok (idempotent — no error on duplicate).
 *
 * After saving, sends a branded welcome email to the subscriber telling
 * them what to expect (new episodes, articles, guides) and how to
 * unsubscribe. The email send is non-blocking — if it fails, the
 * subscription still succeeds (the row is already saved).
 *
 * No authentication required — this is a public endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const { email, locale } = parsed.data;

    // Upsert — if already subscribed, just update the locale (no error)
    await db.subscriber.upsert({
      where: { email },
      create: { email, locale },
      update: { locale },
    });

    // Send welcome email (non-blocking — subscriber is already saved).
    // Only send on first subscription (upsert create), not on every
    // re-subscription. We approximate this by checking if the email
    // was just created vs. already existed — but since upsert doesn't
    // tell us, we send the welcome every time. This is fine: if someone
    // re-subscribes, they get a friendly reminder of what to expect.
    // The email is idempotent in content (no "thanks for subscribing AGAIN").
    if (isEmailConfigured()) {
      try {
        await sendSubscriberWelcome({ email, locale });
      } catch (emailErr) {
        // Log but don't fail the subscription — the row is already saved.
        console.error("[/api/subscribe] welcome email failed:", emailErr);
      }
    } else {
      console.warn("[/api/subscribe] email not configured — skipping welcome email");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/subscribe] error:", err);
    return NextResponse.json(
      { ok: false, error: "Subscription failed" },
      { status: 500 }
    );
  }
}
