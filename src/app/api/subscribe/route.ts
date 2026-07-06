import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SubscribeSchema = z.object({
  email: z.string().email("Valid email is required"),
  locale: z.enum(["en", "ar"]).optional().default("en"),
});

/**
 * POST /api/subscribe
 * Adds an email to the subscribers table. If the email already exists,
 * returns ok (idempotent — no error on duplicate).
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/subscribe] error:", err);
    return NextResponse.json(
      { ok: false, error: "Subscription failed" },
      { status: 500 }
    );
  }
}
