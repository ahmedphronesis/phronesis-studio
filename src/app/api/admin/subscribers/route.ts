import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Same validation + normalization as the public /api/subscribe endpoint —
// prevents the admin from creating duplicates or saving invalid emails.
const CreateSubscriberSchema = z.object({
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
 * GET /api/admin/subscribers — list all subscribers (newest first)
 *
 * Optional query params:
 *   ?search=foo  — filter by email substring (case-insensitive)
 *   ?locale=en   — filter by locale
 */
export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("search")?.trim().toLowerCase();
  const localeFilter = req.nextUrl.searchParams.get("locale");

  const where: Record<string, unknown> = {};
  if (search) {
    where.email = { contains: search, mode: "insensitive" };
  }
  if (localeFilter === "en" || localeFilter === "ar") {
    where.locale = localeFilter;
  }

  const subscribers = await db.subscriber.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, subscribers });
}

/**
 * POST /api/admin/subscribers — manually add a subscriber
 *
 * Duplicate-proof: checks if the email already exists BEFORE creating.
 * Returns 409 Conflict if the email is already subscribed.
 *
 * Body: { email, locale? }
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = CreateSubscriberSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const { email, locale } = parsed.data;

    // Duplicate check — same logic as the public endpoint
    const existing = await db.subscriber.findFirst({
      where: { email },
      select: { id: true, createdAt: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "This email is already subscribed.",
          code: "ALREADY_SUBSCRIBED",
        },
        { status: 409 }
      );
    }

    const subscriber = await db.subscriber.create({
      data: { email, locale },
    });

    return NextResponse.json({ ok: true, subscriber });
  } catch (err) {
    console.error("[/api/admin/subscribers POST] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
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
