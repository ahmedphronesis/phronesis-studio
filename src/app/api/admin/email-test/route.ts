import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sendEmail, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/email-test
 * Sends a test email to the configured NOTIFY_EMAIL address.
 * Used by the Settings page to verify SMTP is working.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SMTP env vars not set. Configure SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL." },
      { status: 400 }
    );
  }

  try {
    const { testEmail } = await req.json().catch(() => ({}));
    const to = testEmail || process.env.NOTIFY_EMAIL || process.env.CONTACT_EMAIL;
    if (!to) {
      return NextResponse.json({ ok: false, error: "No recipient email configured" }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: "Test email from Studio of Phronesis admin",
      text: "This is a test email from your admin portal. If you received this, SMTP is working correctly.",
      html: `<!DOCTYPE html>
<html><body style="font-family:Calibri,sans-serif;color:#1A1A1A;background:#F5EFE4;padding:40px;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;padding:32px;border-radius:8px;border-top:4px solid #0F5C5E;">
    <h1 style="font-family:Cambria,Georgia,serif;color:#1A1A1A;font-weight:normal;margin:0 0 16px;">SMTP test successful</h1>
    <p style="color:#4A4A4A;font-size:15px;">This is a test email from your admin portal. If you received this, your Brevo SMTP relay is correctly configured.</p>
    <p style="color:#4A4A4A;font-size:15px;">You can now:</p>
    <ul style="color:#4A4A4A;font-size:14px;">
      <li>Receive lead notifications at <strong>${process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com"}</strong> (forwarded to your Gmail via ImprovMX)</li>
      <li>Send branded confirmation emails to leads automatically when they submit the contact form</li>
      <li>Reply to leads from Gmail "Send as" your custom domain via Brevo SMTP</li>
    </ul>
    <hr style="border:none;border-top:1px solid #EAE3D5;margin:24px 0;">
    <p style="color:#8A8A8A;font-size:12px;">Sent from the admin portal at phronesis-studio.com</p>
  </div>
</body></html>`,
    });

    return NextResponse.json({ ok: true, sentTo: to });
  } catch (err) {
    console.error("[/api/admin/email-test] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}
