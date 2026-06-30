import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  sendEmail,
  isEmailConfigured,
  verifySmtp,
  checkEmailDnsRecords,
  type DnsReport,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/email-test
 *
 * Runs a full email deliverability diagnostic:
 *   1. Verifies SMTP credentials work (NOOP command)
 *   2. Sends a test email and captures the Brevo messageId
 *   3. Checks DNS records (SPF, DKIM for Brevo selectors, DMARC, MX)
 *      for phronesis-studio.com
 *   4. Returns a comprehensive report the admin UI can display
 *
 * The report explicitly distinguishes between "SMTP accepted the email"
 * (which is all sendMail() resolving tells you) and "DNS records are
 * properly configured so recipient servers will accept the email".
 *
 * Most "admin says sent but client never received" issues are caused by:
 *   (a) Brevo sender not verified in dashboard
 *   (b) SPF record missing or doesn't include spf.brevo.com
 *   (c) DKIM record missing (Brevo selector: brevo._domainkey)
 *   (d) DMARC policy rejecting because SPF/DKIM aren't aligned
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

    // ── Step 1: verify SMTP connection ─────────────────────────────
    const smtpVerification = await verifySmtp();

    // ── Step 2: parallel — send test email + DNS check ─────────────
    // We still attempt the send even if verifySmtp failed, because the
    // failure message is useful to surface alongside the DNS report.
    const [sendResult, dnsReport] = await Promise.all([
      smtpVerification.ok
        ? sendEmail({
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
          })
        : Promise.resolve(null),
      checkEmailDnsRecords("phronesis-studio.com"),
    ]);

    // ── Step 3: build the report ───────────────────────────────────
    const report = {
      smtp: smtpVerification,
      sent: sendResult
        ? {
            to,
            messageId: sendResult.messageId,
            smtpResponse: sendResult.response,
            accepted: sendResult.accepted,
            rejected: sendResult.rejected,
            brevoLogsUrl: "https://app.brevo.com/transactional/logs",
          }
        : null,
      dns: dnsReport,
      // Top-level summary flags the most common failure modes so the
      // admin UI can surface them prominently without parsing the full report.
      warnings: buildWarnings(smtpVerification, sendResult, dnsReport),
    };

    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[/api/admin/email-test] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Send failed" },
      { status: 500 }
    );
  }
}

function buildWarnings(
  smtp: { ok: boolean; message: string },
  send: {
    messageId: string | null;
    accepted: string[];
    rejected: string[];
  } | null,
  dns: DnsReport
): string[] {
  const w: string[] = [];

  if (!smtp.ok) {
    w.push(
      "SMTP connection failed. The admin portal cannot reach Brevo. Check SMTP_HOST, SMTP_USER, SMTP_PASS env vars in Vercel."
    );
  }

  if (send && send.rejected.length > 0) {
    w.push(
      `Brevo rejected these recipients: ${send.rejected.join(", ")}. The email was NOT sent to them.`
    );
  }

  if (!dns.spf.found) {
    w.push(
      "SPF record missing for phronesis-studio.com. Gmail/Outlook will silently filter most of your email to spam. Add a TXT record: v=spf1 include:spf.brevo.com ~all"
    );
  } else if (dns.spf.value && !/brevo/.test(dns.spf.value)) {
    w.push(
      "SPF record exists but does NOT include Brevo (spf.brevo.com). Update your SPF record or Brevo will not be authorized to send from your domain."
    );
  }

  if (!dns.dkimBrevo.found && !dns.dkimS1.found && !dns.dkimS2.found) {
    w.push(
      "No Brevo DKIM record found. Log in to Brevo dashboard → Senders & IP → Authenticate your domain. Brevo will give you a TXT record to add at brevo._domainkey.phronesis-studio.com."
    );
  }

  if (dns.dmarc.found && dns.dmarc.value) {
    if (/p=reject/i.test(dns.dmarc.value) || /p=quarantine/i.test(dns.dmarc.value)) {
      if (!dns.spf.found || (!dns.dkimBrevo.found && !dns.dkimS1.found && !dns.dkimS2.found)) {
        w.push(
          "DMARC policy is set to reject/quarantine but SPF or DKIM is missing. Recipient servers will SILENTLY DROP your email — it won't even reach the spam folder. Either fix SPF/DKIM or relax DMARC to p=none while you set them up."
        );
      }
    }
  }

  if (send && send.accepted.length > 0 && w.length === 0) {
    // No warnings — but still surface the "track in Brevo" reminder.
    w.push(
      "SMTP accepted the email and DNS looks healthy. If the recipient still didn't receive it, look up the messageId in Brevo dashboard → Transactional → Logs to see if Brevo actually delivered it (vs. bounced / deferred / blocked)."
    );
  }

  return w;
}
