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
 * Body: { email: "someone@example.com", token: "phronesis-book-send-2026" }
 *
 * Sends the book announcement email to a SINGLE specific email address.
 * Also adds them as a subscriber if they don't already exist.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token } = body;

    if (token !== "phronesis-book-send-2026") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 503 });
    }

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
        data: { email: normalizedEmail, locale: "en" },
      });
      addedAsSubscriber = true;
    }

    // Build the book announcement email
    const subject = "New Book: Depth of Knowledge — Ahmed Ali · Studio of Phronesis";
    const bookTitle = "Depth of Knowledge";
    const bookSubtitle = "A Practical Guide to Designing Rigorous Questions Without AI";
    const excerpt = "A handbook that restores to educators the craft of writing cognitively demanding questions from lesson content alone, without relying on AI tools. Built on Norman Webb's Depth of Knowledge framework, with worked examples across seven subjects and a chapter tracing the principle through the Islamic intellectual tradition.";
    const buyUrl = "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0HDMK7RGX";
    const bookUrl = `${siteUrl}/en/publications/depth-of-knowledge`;
    const coverUrl = `${siteUrl}/publications/depth-of-knowledge-front.jpg`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr><td align="center" style="padding:32px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <tr><td style="padding:36px 40px 20px;text-align:center;border-bottom:3px solid #B48D3C;">
          <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">NEW BOOK · STUDIO OF PHRONESIS</div>
        </td></tr>
        <tr><td style="padding:28px 40px 12px;text-align:center;">
          <img src="${coverUrl}" alt="Cover of ${escapeHtml(bookTitle)}" style="width:200px;height:auto;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.15);margin:0 auto 20px;display:block;" />
          <h1 style="font-family:Cambria,Georgia,serif;font-size:30px;color:#1A1A1A;margin:0 0 6px;font-weight:normal;">${escapeHtml(bookTitle)}</h1>
          <p style="font-family:Cambria,Georgia,serif;font-style:italic;font-size:17px;color:#0F5C5E;margin:0;line-height:1.4;">${escapeHtml(bookSubtitle)}</p>
        </td></tr>
        <tr><td style="padding:20px 40px;">
          <p style="font-size:15px;color:#1A1A1A;line-height:1.7;margin:0 0 16px;">It is my pleasure to share with you the publication of my first book — and you are among the first to know.</p>
          <p style="font-size:14px;color:#4A4A4A;line-height:1.7;margin:0;font-style:italic;">${escapeHtml(excerpt)}</p>
        </td></tr>
        <tr><td style="padding:16px 40px 12px;">
          <p style="font-size:13px;color:#1A1A1A;margin:0 0 10px;font-weight:600;">Available in two editions:</p>
          <p style="font-size:13px;color:#4A4A4A;margin:0 0 4px;"> Paperback — $19.99 USD</p>
          <p style="font-size:13px;color:#4A4A4A;margin:0 0 16px;"> eBook — $9.99 USD</p>
        </td></tr>
        <tr><td style="padding:8px 40px 28px;text-align:center;">
          <p style="margin:0 0 10px;">
            <a href="${buyUrl}" style="display:inline-block;background-color:#0F5C5E;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:4px;font-size:14px;font-weight:bold;font-family:Consolas,monospace;letter-spacing:0.05em;">Buy on Amazon</a>
          </p>
          <p style="margin:0;">
            <a href="${bookUrl}" style="display:inline-block;color:#0F5C5E;text-decoration:none;padding:10px 20px;font-size:13px;font-family:Consolas,monospace;letter-spacing:0.05em;border:1px solid #0F5C5E;border-radius:4px;">Explore the book →</a>
          </p>
        </td></tr>
        <tr><td style="padding:0 40px 8px;">
          <p style="font-size:12px;color:#8A8A8A;line-height:1.6;margin:0 0 20px;">If you wish to unsubscribe, simply reply to this email with the word "unsubscribe".</p>
          <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px;">With warm regards,</p>
          <p style="font-family:Cambria,Georgia,serif;font-size:18px;color:#1A1A1A;margin:8px 0 0;font-weight:600;">Ahmed Ali</p>
          <p style="font-size:12px;color:#8A8A8A;margin:2px 0 0;line-height:1.5;">Author of the book · Founder, Studio of Phronesis</p>
        </td></tr>
        <tr><td style="padding:20px 40px 28px;text-align:center;border-top:1px solid #EAE3D5;">
          <p style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.15em;color:#8A8A8A;text-transform:uppercase;margin:0;">Studio of Phronesis · Abu Dhabi, United Arab Emirates</p>
          <p style="font-size:11px;color:#8A8A8A;margin:6px 0 0;"><a href="${siteUrl}" style="color:#0F5C5E;text-decoration:none;">phronesis-studio.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const text = `${subject}

NEW BOOK · STUDIO OF PHRONESIS

${bookTitle}
${bookSubtitle}

It is my pleasure to share with you the publication of my first book — and you are among the first to know.

${excerpt}

Available in two editions:
  Paperback — $19.99 USD
  eBook — $9.99 USD

Buy on Amazon: ${buyUrl}
Explore the book: ${bookUrl}

If you wish to unsubscribe, simply reply to this email with the word "unsubscribe".

With warm regards,
Ahmed Ali
Author of the book · Founder, Studio of Phronesis

---
Studio of Phronesis · Abu Dhabi, United Arab Emirates
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
      addedAsSubscriber,
      messageId: result.messageId,
      rejected: result.rejected,
    });
  } catch (err) {
    console.error("[/api/admin/send-book-email] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
