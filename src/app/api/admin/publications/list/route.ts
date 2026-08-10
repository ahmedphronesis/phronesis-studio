import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { BOOKS } from "@/lib/publications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/publications/list
 * Returns all publications for the admin dropdown.
 */
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const books = BOOKS.map((b) => ({
    slug: b.slug,
    title: b.title,
    titleAr: b.titleAr,
    subtitle: b.subtitle,
    subtitleAr: b.subtitleAr,
    coverFront: b.coverFront,
    author: b.author,
    authorAr: b.authorAr,
    editions: b.editions,
    forthcoming: b.forthcoming,
    hasArabic: Boolean(b.titleAr),
  }));

  return NextResponse.json({ ok: true, books });
}
