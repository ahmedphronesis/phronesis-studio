import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { db } from "@/lib/db";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SendSchema = z.object({
  to: z.string().email("Valid recipient email is required"),
  toName: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required").max(20000),
  leadId: z.string().optional(),
});

/**
 * POST /api/admin/email-send
 * Sends an email from ahmed@phronesis-studio.com to the specified recipient.
 * Logs to SentEmail table for history.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = SendSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { to, toName, subject, body: bodyText, leadId } = parsed.data;

    // Convert plain text body to simple HTML for email clients that render HTML
    const htmlBody = bodyText
      .split("\n")
      .map((line) => `<p style="margin:0 0 12px;font-family:Calibri,sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">${escapeHtml(line) || "&nbsp;"}</p>`)
      .join("");

    // Wrap in a branded email template
    const wrappedHtml = wrapInBrandTemplate(subject, htmlBody);

    await sendEmail({
      to: toName ? `${toName} <${to}>` : to,
      subject,
      text: bodyText,
      html: wrappedHtml,
      replyTo: process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com",
    });

    // Log to database
    const sentEmail = await db.sentEmail.create({
      data: {
        toEmail: to,
        toName: toName || null,
        subject,
        bodyText,
        bodyHtml: wrappedHtml,
        leadId: leadId || null,
      },
    });

    return NextResponse.json({ ok: true, id: sentEmail.id });
  } catch (err) {
    console.error("[/api/admin/email-send] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapInBrandTemplate(subject: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr>
      <td align="center" style="padding:32px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">

          <tr>
            <td style="padding:24px 40px;border-bottom:3px solid #B48D3C;">
              <div style="font-family:Consolas,monospace;font-size:11px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">STUDIO OF PHRONESIS</div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px;">
              ${bodyHtml}
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 32px;border-top:1px solid #EAE3D5;">
              <p style="font-family:Cambria,Georgia,serif;font-size:16px;color:#1A1A1A;margin:0 0 4px;font-weight:bold;">Ahmed Ali</p>
              <p style="font-size:13px;color:#8A8A8A;margin:2px 0 0;">Studio of Phronesis · Al Ain · UAE</p>
              <p style="font-size:13px;color:#B48D3C;margin:2px 0 0;font-style:italic;">phronesis-studio.com · Studio of Practical Wisdom</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
