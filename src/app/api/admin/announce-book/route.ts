import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sendBookAnnouncement, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Book announcements can take a long time (5 emails/sec × N subscribers).
export const maxDuration = 60;

/**
 * POST /api/admin/announce-book
 *
 * Sends a book publication announcement email to ALL existing subscribers.
 * Each subscriber receives the email in the locale they subscribed with.
 *
 * This is a one-time action — run it once when a new book is published.
 * The email content is hardcoded to the "Depth of Knowledge" book. For
 * future books, update the parameters below or accept them from the
 * request body.
 *
 * Requires admin authentication.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Email not configured. Set BREVO_API_KEY or SMTP_* env vars." },
      { status: 503 }
    );
  }

  try {
    const result = await sendBookAnnouncement({
      bookTitle: "Depth of Knowledge",
      bookSubtitle: "A Practical Guide to Designing Rigorous Questions Without AI",
      bookTitleAr: "العمق المعرفي",
      bookSubtitleAr: "دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي",
      bookCover: "/publications/depth-of-knowledge-front.jpg",
      bookUrl: "https://phronesis-studio.com/en/publications/depth-of-knowledge",
      buyUrl: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX",
      buyLabel: "Buy on Amazon",
      buyLabelAr: "الشراء من أمازون",
      price: "$19.99 USD",
      excerpt: "A handbook that restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on AI tools. Built on Norman Webb's Depth of Knowledge framework, with worked examples across seven subjects and a chapter tracing the principle through the Islamic intellectual tradition.",
      excerptAr: "كتابٌ يُعيد إلى المعلمين صناعةَ كتابة الأسئلة ذات المطالب المعرفية العالية من مادّة الدرس وحدها، دون الاعتماد على أدوات الذكاء الاصطناعي. مبنيٌّ على إطار العمق المعرفي (DOK) لنورمان ويب (Norman Webb)، بأمثلةٍ محلولةٍ في سبع مواد، وفصلٍ يتتبّع المبدأ في التراث الفكري الإسلامي.",
    });

    return NextResponse.json({
      ok: true,
      ...result,
      message: `Announcement sent: ${result.sent} delivered, ${result.failed} failed.`,
    });
  } catch (err) {
    console.error("[/api/admin/announce-book POST] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
