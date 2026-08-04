import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendSubscriberWelcome, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Hobby default is 10s; Brevo API can exceed that on slow days.
export const maxDuration = 60;

// Email validation: standard email format + reasonable length limits.
// Normalizes the email to lowercase + trimmed to prevent case/whitespace
// duplicates (e.g. "User@X.com" and "user@x.com" are the same subscriber).
const SubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Valid email is required")
    .min(5, "Email is too short")
    .max(254, "Email is too long"),
  locale: z.enum(["en", "ar"]).optional().default("en"),
});

/**
 * POST /api/subscribe
 *
 * Adds an email to the subscribers table. DUPLICATE-PROOF:
 * 1. Validates the email format (Zod schema above).
 * 2. Normalizes to lowercase + trimmed (prevents "User@X.com" vs "user@x.com").
 * 3. Checks if the email already exists in the database BEFORE creating.
 * 4. If it exists, returns 409 Conflict with a clear "already subscribed"
 *    message — NO duplicate row is created, NO welcome email is re-sent.
 * 5. If it doesn't exist, creates the row and sends the welcome email.
 *
 * This is a public endpoint (no auth required).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid email", code: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    const { email, locale } = parsed.data;

    // ─── Duplicate check ───────────────────────────────────────────────
    // Check BEFORE creating. This is the authoritative guard — even if the
    // frontend fails to catch a duplicate, the backend will reject it.
    const existing = await db.subscriber.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "already_subscribed",
          code: "ALREADY_SUBSCRIBED",
          // Human-readable messages in both locales so the frontend can
          // display the right one based on the user's locale.
          message_en: "This email is already subscribed.",
          message_ar: "هذا البريد الإلكتروني مشترك بالفعل.",
        },
        { status: 409 } // 409 Conflict — standard HTTP code for duplicate
      );
    }

    // ─── Create new subscriber ─────────────────────────────────────────
    await db.subscriber.create({
      data: { email, locale },
    });

    // ─── Send welcome email (non-blocking) ─────────────────────────────
    // Only sent on FIRST subscription (not on duplicate attempts, since
    // duplicates are rejected above before reaching this point).
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

    return NextResponse.json({ ok: true, code: "SUBSCRIBED" });
  } catch (err) {
    console.error("[/api/subscribe] error:", err);
    return NextResponse.json(
      { ok: false, error: "Subscription failed", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
