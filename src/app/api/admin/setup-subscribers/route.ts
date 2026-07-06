import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/setup-subscribers
 * Creates the subscribers table if it doesn't exist.
 * One-time setup endpoint — safe to call multiple times.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        locale TEXT DEFAULT 'en',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({ ok: true, message: "subscribers table created or already exists" });
  } catch (err) {
    console.error("[/api/admin/setup-subscribers] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Setup failed" },
      { status: 500 }
    );
  }
}
