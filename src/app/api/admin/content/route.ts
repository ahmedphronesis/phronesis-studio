import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/content?locale=en
 * Returns all namespaces for a locale as { namespace: value } object.
 * If no locale given, returns both: { en: {...}, ar: {...} }.
 */
export async function GET(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const locale = req.nextUrl.searchParams.get("locale");
  const where = locale ? { locale } : {};
  const rows = await db.siteContent.findMany({ where, orderBy: { namespace: "asc" } });

  if (locale) {
    const out: Record<string, unknown> = {};
    for (const r of rows) out[r.namespace] = r.value;
    return NextResponse.json({ ok: true, locale, content: out });
  }

  // Group by locale
  const grouped: Record<string, Record<string, unknown>> = { en: {}, ar: {} };
  for (const r of rows) {
    if (!grouped[r.locale]) grouped[r.locale] = {};
    grouped[r.locale][r.namespace] = r.value;
  }
  return NextResponse.json({ ok: true, content: grouped });
}

/**
 * PUT /api/admin/content
 * Body: { locale, namespace, value }
 * Upserts a single namespace's content for a locale.
 */
export async function PUT(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { locale, namespace, value } = await req.json();
    if (!locale || !namespace || typeof value !== "object" || value === null) {
      return NextResponse.json(
        { ok: false, error: "locale, namespace, and value (object) are required" },
        { status: 400 }
      );
    }
    if (!["en", "ar"].includes(locale)) {
      return NextResponse.json({ ok: false, error: "Invalid locale" }, { status: 400 });
    }

    await db.siteContent.upsert({
      where: { locale_namespace: { locale, namespace } },
      create: { locale, namespace, value: value as object },
      update: { value: value as object },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/content PUT] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/content?locale=en&namespace=contact
 *
 * Deletes a single namespace row for a locale. After deletion, the static
 * JSON file (messages/{locale}.json) becomes the sole source of truth for
 * that namespace — useful for "reset to defaults" when an admin edit has
 * gone stale or when the JSON has been updated with new content (e.g.
 * pricing currency changes) and the DB override needs to be cleared.
 *
 * Safe to call on a namespace that has no DB row — returns ok:true either
 * way (idempotent).
 */
export async function DELETE(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const locale = req.nextUrl.searchParams.get("locale");
  const namespace = req.nextUrl.searchParams.get("namespace");
  if (!locale || !namespace) {
    return NextResponse.json(
      { ok: false, error: "locale and namespace query params are required" },
      { status: 400 }
    );
  }
  if (!["en", "ar"].includes(locale)) {
    return NextResponse.json({ ok: false, error: "Invalid locale" }, { status: 400 });
  }

  try {
    await db.siteContent.deleteMany({
      where: { locale, namespace },
    });
    return NextResponse.json({ ok: true, locale, namespace });
  } catch (err) {
    console.error("[/api/admin/content DELETE] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
