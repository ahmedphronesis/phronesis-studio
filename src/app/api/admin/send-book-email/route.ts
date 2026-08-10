import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/**
 * POST /api/admin/send-book-email
 * Body: { email, token, locale? }
 * locale: "en" (default) or "ar"
 *
 * Sends the book announcement email to a SINGLE email in the specified locale.
 * Also adds them as a subscriber if they don't already exist.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, locale = "en" } = body;

    if (token !== "phronesis-book-send-2026") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 503 });
    }

    const isAR = locale === "ar";
    const normalizedEmail = email.trim().toLowerCase();
    const siteUrl = "https://phronesis-studio.com";
    const replyTo = process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com";

    // Add as subscriber if they don't already exist
    const existing = await db.subscriber.findFirst({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    let addedAsSubscriber = false;
    if (!existing) {
      await db.subscriber.create({
        data: { email: normalizedEmail, locale: isAR ? "ar" : "en" },
      });
      addedAsSubscriber = true;
    }

    const buyUrl = "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX";
    const bookUrl = `${siteUrl}/${isAR ? "ar" : "en"}/publications/depth-of-knowledge`;
    const coverUrl = `${siteUrl}/publications/depth-of-knowledge-front.jpg`;

    // ─── Build email content based on locale ─────────────────────────────
    const subject = isAR
      ? "كتابٌ جديد: العمق المعرفي. أحمد علي · ستوديو فرونسيس"
      : "New Book: Depth of Knowledge. Ahmed Ali · Studio of Phronesis";

    const eyebrow = isAR ? "كتابٌ جديد · ستوديو فرونسيس" : "NEW BOOK · STUDIO OF PHRONESIS";

    const bookTitle = isAR ? "العمق المعرفي" : "Depth of Knowledge";
    const bookSubtitle = isAR
      ? "دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي"
      : "A Practical Guide to Designing Rigorous Questions Without AI";

    const greeting = isAR
      ? "يسعدني أن أُعلن صدور كتابي الأول، وإنه لمن الشرف أن تكون ممّن يصلهم هذا الخبر أولًا."
      : "It is with great pleasure that I announce the publication of my first book, and I am honored that you are among the first to receive this news.";

    const excerpt = isAR
      ? "يُعيد هذا الكتاب إلى المعلمين صناعةَ كتابة الأسئلة ذات المطالب المعرفية العالية من مادّة الدرس وحدها، دون الاعتماد على الذكاء الاصطناعي. يستند إلى إطار العمق المعرفي (DOK) لنورمان ويب (Norman Webb)، ويعود إلى كتيّبَيه الأصليَّين لعامَي 1997 و2002 بوصفهما مصدرَين أوليَّين، ويُصحِّح التأويل الخاطئ الذي روّجتْه صورةُ «عجلة العمق المعرفي» غير المعتمدة. وتُختبر الطريقة بالترميز العكسي، أنضجِ وسائل التحقُّق من المطالب المعرفية الفعلية للسؤال. وقد خُصِّص فصلٌ موسَّعٌ لتتبُّع مبدأ «الاستدعاء ليس استدلالًا» في التراث الفكري الإسلامي، من الحسن البصري في القرن الثامن إلى التدرُّج الرباعي لابن خلدون في المقدمة."
      : "This handbook restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on artificial intelligence. It is grounded in Norman Webb's Depth of Knowledge framework, returns to his original 1997 and 2002 monographs as primary sources, and corrects the widespread misinterpretation perpetuated by the unauthorized DOK Wheel. The method is verified by reverse-coding, the most reliable test for confirming a question's actual cognitive demand. A substantial chapter traces the principle that recall is not reasoning through the Islamic intellectual tradition, from Al-Hasan al-Basri in the eighth century to Ibn Khaldun's four-level progression in the Muqaddimah.";

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

    const html = `<!DOCTYPE html>
<html lang="${isAR ? "ar" : "en"}" ${isAR ? 'dir="rtl"' : ""}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr><td align="center" style="padding:32px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <tr><td style="padding:36px 40px 20px;text-align:center;border-bottom:3px solid #B48D3C;">
          <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">${escapeHtml(eyebrow)}</div>
        </td></tr>
        <tr><td style="padding:28px 40px 12px;text-align:center;">
          <img src="${coverUrl}" alt="${escapeHtml(coverAlt)}" style="width:200px;height:auto;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.15);margin:0 auto 20px;display:block;" />
          <h1 style="font-family:Cambria,Georgia,serif;font-size:30px;color:#1A1A1A;margin:0 0 6px;font-weight:normal;">${escapeHtml(bookTitle)}</h1>
          <p style="font-family:Cambria,Georgia,serif;font-style:italic;font-size:17px;color:#0F5C5E;margin:0;line-height:1.4;">${escapeHtml(bookSubtitle)}</p>
        </td></tr>
        <tr><td style="padding:20px 40px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:15px;color:#1A1A1A;line-height:1.7;margin:0 0 16px;">${escapeHtml(greeting)}</p>
          <p style="font-size:14px;color:#4A4A4A;line-height:1.7;margin:0;font-style:italic;">${escapeHtml(excerpt)}</p>
        </td></tr>
        <tr><td style="padding:8px 40px 12px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:13px;color:#1A1A1A;margin:0 0 10px;font-weight:600;">${escapeHtml(editionsLabel)}</p>
          <p style="font-size:13px;color:#4A4A4A;margin:0 0 4px;"> ${escapeHtml(paperbackLabel)}: $19.99 USD</p>
          <p style="font-size:13px;color:#4A4A4A;margin:0 0 16px;"> ${escapeHtml(ebookLabel)}: $9.99 USD</p>
        </td></tr>
        <tr><td style="padding:8px 40px 28px;text-align:center;">
          <p style="margin:0 0 10px;">
            <a href="${buyUrl}" style="display:inline-block;background-color:#0F5C5E;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:4px;font-size:14px;font-weight:bold;font-family:Consolas,monospace;letter-spacing:0.05em;">${escapeHtml(buyLabel)}</a>
          </p>
          <p style="margin:0;">
            <a href="${bookUrl}" style="display:inline-block;color:#0F5C5E;text-decoration:none;padding:10px 20px;font-size:13px;font-family:Consolas,monospace;letter-spacing:0.05em;border:1px solid #0F5C5E;border-radius:4px;">${escapeHtml(exploreLabel)}</a>
          </p>
        </td></tr>
        <tr><td style="padding:0 40px 8px;" ${isAR ? 'dir="rtl"' : ""}>
          <p style="font-size:12px;color:#8A8A8A;line-height:1.6;margin:0 0 20px;">${escapeHtml(unsubscribeText)}</p>
          <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px;">${escapeHtml(signoff)}</p>
          <p style="font-family:Cambria,Georgia,serif;font-size:18px;color:#1A1A1A;margin:8px 0 0;font-weight:600;">${escapeHtml(sigName)}</p>
          <p style="font-size:12px;color:#8A8A8A;margin:2px 0 0;line-height:1.5;">${escapeHtml(sigTitle)}</p>
        </td></tr>
        <tr><td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #EAE3D5;">
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
  ${paperbackLabel}: $19.99 USD
  ${ebookLabel}: $9.99 USD

${buyLabel}: ${buyUrl}
${exploreLabel}: ${bookUrl}

${unsubscribeText}

${signoff}
${sigName}
${sigTitle}

---
${footer}
${siteUrl}`;

    // Send to just this one email
    const result = await sendEmail({
      to: normalizedEmail,
      subject,
      html,
      text,
      replyTo,
    });

    // Write audit log
    try {
      await db.sentEmail.create({
        data: {
          toEmail: normalizedEmail,
          subject,
          bodyText: text,
          bodyHtml: html,
        },
      });
    } catch (logErr) {
      console.error("[send-book-email] SentEmail log failed:", logErr);
    }

    return NextResponse.json({
      ok: true,
      email: normalizedEmail,
      locale: isAR ? "ar" : "en",
      addedAsSubscriber,
      messageId: result.messageId,
      rejected: result.rejected,
    });
  } catch (err) {
    console.error("[/api/admin/send-book-email] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
