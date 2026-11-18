import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { isAuthenticated } from "@/lib/auth";
import { getBookBySlug } from "@/lib/publications";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

const AnnounceSchema = z.object({
  slug: z.string().min(1),
  locale: z.enum(["en", "ar"]).default("en"),
  recipients: z.array(z.string().email()).min(1),
  addAsSubscribers: z.boolean().default(true),
});

/**
 * POST /api/admin/publications/announce
 * Body: { slug, locale, recipients: string[], addAsSubscribers?: boolean }
 *
 * Sends the publication announcement email to one or more recipients,
 * using the EXISTING announcement email template. The book data is
 * loaded from publications.ts — no manual entry required.
 *
 * Each recipient gets the email in the selected locale. If Arabic is
 * selected but the book has no Arabic content, it falls back to English.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const parsed = AnnounceSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json({ ok: false, error: first?.message ?? "Invalid request" }, { status: 400 });
    }

    const { slug, locale, recipients, addAsSubscribers } = parsed.data;
    const book = getBookBySlug(slug);
    if (!book) {
      return NextResponse.json({ ok: false, error: "Publication not found" }, { status: 404 });
    }

    const isAR = locale === "ar" && Boolean(book.titleAr);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phronesis-studio.com";
    const replyTo = process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com";

    // ─── Load book data in the selected locale ───────────────────────────
    const bookTitle = isAR ? book.titleAr : book.title;
    const bookSubtitle = isAR ? book.subtitleAr : book.subtitle;
    const author = isAR ? book.authorAr : book.author;

    // Use the enhanced excerpt from the announce-book endpoint
    const excerpt = isAR
      ? "يُعيد هذا الكتاب إلى المعلمين صناعةَ كتابة الأسئلة ذات المطالب المعرفية العالية من مادّة الدرس وحدها، دون الاعتماد على الذكاء الاصطناعي. يستند إلى إطار العمق المعرفي (DOK) لنورمان ويب (Norman Webb)، ويعود إلى كتيّبَيه الأصليَّين لعامَي 1997 و2002 بوصفهما مصدرَين أوليَّين، ويُصحِّح التأويل الخاطئ الذي روّجتْه صورةُ «عجلة العمق المعرفي» غير المعتمدة. وتُختبر الطريقة بالترميز العكسي، أنضجِ وسائل التحقُّق من المطالب المعرفية الفعلية للسؤال. وقد خُصِّص فصلٌ موسَّعٌ لتتبُّع مبدأ «الاستدعاء ليس استدلالًا» في التراث الفكري الإسلامي، من الحسن البصري في القرن الثامن إلى التدرُّج الرباعي لابن خلدون في المقدمة."
      : "This handbook restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on artificial intelligence. It is grounded in Norman Webb's Depth of Knowledge framework, returns to his original 1997 and 2002 monographs as primary sources, and corrects the widespread misinterpretation perpetuated by the unauthorized DOK Wheel. The method is verified by reverse-coding, the most reliable test for confirming a question's actual cognitive demand. A substantial chapter traces the principle that recall is not reasoning through the Islamic intellectual tradition, from Al-Hasan al-Basri in the eighth century to Ibn Khaldun's four-level progression in the Muqaddimah.";

    // ─── Build email content (identical template to send-book-email) ─────
    const subject = isAR
      ? `كتابٌ جديد: ${bookTitle}. ${author} · ستوديو فرونسيس`
      : `New Book: ${bookTitle}. ${author} · Studio of Phronesis`;

    const eyebrow = isAR ? "كتابٌ جديد · ستوديو فرونسيس" : "NEW BOOK · STUDIO OF PHRONESIS";
    const greeting = isAR
      ? "يسعدني أن أُعلن صدور كتابي الأول، وإنه لمن الشرف أن تكون ممّن يصلهم هذا الخبر أولًا."
      : "It is with great pleasure that I announce the publication of my first book, and I am honored that you are among the first to receive this news.";

    const editionsLabel = isAR ? "متاح في نسختين:" : "Available in two editions:";
    const paperbackLabel = isAR ? "نسخة ورقية" : "Paperback";
    const ebookLabel = isAR ? "كتاب إلكتروني" : "eBook";
    const buyLabel = isAR ? "الشراء من أمازون" : "Buy on Amazon";
    const exploreLabel = isAR ? "تعرّف على الكتاب ←" : "Explore the book →";
    const unsubscribeText = isAR
      ? "إن رغبت في إلغاء الاشتراك، يكفي أن تردّ على هذه الرسالة بكتابة «إلغاء الاشتراك»."
      : "If you wish to unsubscribe, simply reply to this email with the word \"unsubscribe\".";
    const signoff = isAR ? "مع خالص التقدير،" : "With warm regards,";
    const sigName = "Ahmed Ali";
    const sigTitle = isAR
      ? "مؤلِّفُ الكتاب · مؤسّس ستوديو فرونسيس"
      : "Author of the book · Founder, Studio of Phronesis";
    const footer = isAR
      ? "ستوديو فرونسيس · أبوظبي، الإمارات العربية المتحدة"
      : "Studio of Phronesis · Abu Dhabi, United Arab Emirates";
    const coverAlt = isAR ? `غلاف كتاب «${bookTitle}»` : `Cover of "${bookTitle}"`;

    const buyUrl = book.editions[0]?.buyUrl || "";
    const bookUrl = `${siteUrl}/${isAR ? "ar" : "en"}/publications/${book.slug}`;
    const coverUrl = `${siteUrl}${book.coverFront}`;

    // Build editions HTML
    const editionsHtml = book.editions.map((ed) => {
      const label = isAR ? ed.formatAr : ed.format;
      return `<p style="font-size:13px;color:#4A4A4A;margin:0 0 4px;"> ${escapeHtml(label)}: ${escapeHtml(ed.price)}</p>`;
    }).join("\n          ");

    const editionsText = book.editions.map((ed) => {
      const label = isAR ? ed.formatAr : ed.format;
      return `  ${label}: ${ed.price}`;
    }).join("\n");

    const html = `<!DOCTYPE html>
<html lang="${isAR ? "ar" : "en"}" ${isAR ? 'dir="rtl"' : ""}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);max-width:680px;">
        <tr><td style="padding:36px 32px 20px;text-align:center;border-bottom:3px solid #B48D3C;">
          <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">${escapeHtml(eyebrow)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px 12px;text-align:center;">
          <img src="${coverUrl}" alt="${escapeHtml(coverAlt)}" style="width:200px;height:auto;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.15);margin:0 auto 20px;display:block;" />
          <h1 style="font-family:Cambria,Georgia,serif;font-size:30px;color:#1A1A1A;margin:0 0 6px;font-weight:normal;">${escapeHtml(bookTitle)}</h1>
          <p style="font-family:Cambria,Georgia,serif;font-style:italic;font-size:17px;color:#0F5C5E;margin:0;line-height:1.4;">${escapeHtml(bookSubtitle)}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:15px;color:#1A1A1A;line-height:1.7;margin:0 0 16px;text-align:justify;">${escapeHtml(greeting)}</p>
          <p style="font-size:14px;color:#4A4A4A;line-height:1.7;margin:0;font-style:italic;text-align:justify;">${escapeHtml(excerpt)}</p>
        </td></tr>
        <tr><td style="padding:8px 32px 12px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:13px;color:#1A1A1A;margin:0 0 10px;font-weight:600;">${escapeHtml(editionsLabel)}</p>
          ${editionsHtml}
        </td></tr>
        <tr><td style="padding:8px 32px 28px;text-align:center;">
          <p style="margin:0 0 10px;">
            <a href="${buyUrl}" style="display:inline-block;background-color:#0F5C5E;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:4px;font-size:14px;font-weight:bold;font-family:Consolas,monospace;letter-spacing:0.05em;">${escapeHtml(buyLabel)}</a>
          </p>
          <p style="margin:0;">
            <a href="${bookUrl}" style="display:inline-block;color:#0F5C5E;text-decoration:none;padding:10px 20px;font-size:13px;font-family:Consolas,monospace;letter-spacing:0.05em;border:1px solid #0F5C5E;border-radius:4px;">${escapeHtml(exploreLabel)}</a>
          </p>
        </td></tr>
        <tr><td style="padding:0 32px 8px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:12px;color:#8A8A8A;line-height:1.6;margin:0 0 20px;">${escapeHtml(unsubscribeText)}</p>
          <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px;">${escapeHtml(signoff)}</p>
          <p style="font-family:Cambria,Georgia,serif;font-size:18px;color:#1A1A1A;margin:8px 0 0;font-weight:600;">${escapeHtml(sigName)}</p>
          <p style="font-size:12px;color:#8A8A8A;margin:2px 0 0;line-height:1.5;">${escapeHtml(sigTitle)}</p>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;text-align:center;border-top:1px solid #EAE3D5;">
          <p style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.15em;color:#8A8A8A;text-transform:uppercase;margin:0;">${escapeHtml(footer)}</p>
          <p style="font-size:11px;color:#8A8A8A;margin:6px 0 0;"><a href="${siteUrl}" style="color:#0F5C5E;text-decoration:none;">phronesis-studio.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const text = `${subject}

${eyebrow}

${bookTitle}
${bookSubtitle}

${greeting}

${excerpt}

${editionsLabel}
${editionsText}

${buyLabel}: ${buyUrl}
${exploreLabel}: ${bookUrl}

${unsubscribeText}

${signoff}
${sigName}
${sigTitle}

---
${footer}
${siteUrl}`;

    // ─── Send to each recipient ──────────────────────────────────────────
    let sent = 0;
    let failed = 0;
    const rejected: string[] = [];

    for (const recipient of recipients) {
      const normalizedEmail = recipient.trim().toLowerCase();

      // Add as subscriber if requested
      if (addAsSubscribers) {
        try {
          const existing = await db.subscriber.findFirst({
            where: { email: normalizedEmail },
            select: { id: true },
          });
          if (!existing) {
            await db.subscriber.create({
              data: { email: normalizedEmail, locale: isAR ? "ar" : "en" },
            });
          }
        } catch (e) {
          // Non-fatal — continue with email send
        }
      }

      try {
        const result = await sendEmail({
          to: normalizedEmail,
          subject,
          html,
          text,
          replyTo,
        });

        if (result.rejected.includes(normalizedEmail)) {
          rejected.push(normalizedEmail);
          failed++;
        } else {
          sent++;
        }

        // Audit log
        try {
          await db.sentEmail.create({
            data: { toEmail: normalizedEmail, subject, bodyText: text, bodyHtml: html },
          });
        } catch (logErr) {
          console.error("[publications/announce] SentEmail log failed:", logErr);
        }

        // Rate limit: 5 emails/sec
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`[publications/announce] Failed to send to ${normalizedEmail}:`, err);
        failed++;
        rejected.push(normalizedEmail);
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      rejected,
      book: bookTitle,
      locale: isAR ? "ar" : "en",
      recipients: recipients.length,
    });
  } catch (err) {
    console.error("[/api/admin/publications/announce] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
