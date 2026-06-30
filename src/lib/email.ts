/**
 * Email sending via Brevo SMTP relay.
 *
 * Free tier: 300 emails/day, forever.
 * Sign up at https://www.brevo.com — verify your domain, get SMTP credentials
 * from https://app.brevo.com/settings/keys/smtp
 *
 * Required env vars:
 *   SMTP_HOST       = smtp-relay.brevo.com
 *   SMTP_PORT       = 587
 *   SMTP_USER       = (your Brevo SMTP login, usually your Brevo account email)
 *   SMTP_PASS       = (your Brevo SMTP key — starts with xkeysib-)
 *   CONTACT_EMAIL   = ahmed@phronesis-studio.com (the From address)
 *   CONTACT_NAME    = "Ahmed Ali — Studio of Phronesis"
 *   NOTIFY_EMAIL    = ahmed@phronesis-studio.com (where notifications go —
 *                     forwarded to Gmail via ImprovMX)
 */
import nodemailer from "nodemailer";
import { resolveMx, resolveTxt, resolveCname } from "dns/promises";

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP env vars not set. Need SMTP_HOST, SMTP_USER, SMTP_PASS."
    );
  }

  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransport;
}

function getFrom(): { name: string; address: string } {
  const email = process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com";
  const name = process.env.CONTACT_NAME || "Ahmed Ali · Studio of Phronesis";
  return { name, address: email };
}

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string; // plain-text fallback
  html?: string; // rich HTML body
  replyTo?: string;
};

/**
 * Result of sendEmail — includes the SMTP server's response so callers can
 * confirm Brevo actually accepted the message (not just that the API call
 * resolved). The `messageId` is Brevo's internal tracking ID; the user can
 * look it up in Brevo dashboard → Transactional → Logs to see what happened
 * to the email AFTER Brevo accepted it (delivered / bounced / deferred / blocked).
 */
export type EmailSendResult = {
  messageId: string | null;
  response: string;       // e.g. "250 Ok <queued messageId>"
  accepted: string[];     // recipient addresses Brevo accepted
  rejected: string[];     // recipient addresses Brevo rejected
  pending: string[];      // addresses pending
};

/**
 * Send an email via Brevo SMTP. Returns the SMTP server response.
 * Caller should inspect `rejected` array — if non-empty, Brevo refused to
 * accept those recipients (e.g. invalid email). If `accepted` is empty,
 * nothing was sent.
 *
 * IMPORTANT: this resolving does NOT guarantee delivery. Brevo may still:
 *   - Silently drop the email if the From address isn't a Verified Sender
 *   - Defer delivery if the recipient's MX is strict about SPF/DKIM/DMARC
 *   - Bounce later if the recipient's mailbox is full or doesn't exist
 * The `messageId` is the only way to track what happened post-acceptance.
 */
export async function sendEmail(p: EmailPayload): Promise<EmailSendResult> {
  const transport = getTransport();
  const info = await transport.sendMail({
    from: getFrom(),
    to: p.to,
    subject: p.subject,
    text: p.text,
    html: p.html,
    replyTo: p.replyTo,
  });

  // nodemailer's SMTP transport returns info with: messageId, response,
  // accepted, rejected, pending, envelope.
  // Note: messageId from Brevo looks like "<xxx@smtp-relay.mail.fr>".
  // We strip the angle brackets for cleaner display.
  const messageId = info.messageId
    ? info.messageId.replace(/^<|>$/g, "")
    : null;

  const smtpInfo = info as unknown as {
    accepted?: string[];
    rejected?: string[];
    pending?: string[];
    response?: string;
  };

  return {
    messageId,
    response: smtpInfo.response || "(no SMTP response)",
    accepted: smtpInfo.accepted || [],
    rejected: smtpInfo.rejected || [],
    pending: smtpInfo.pending || [],
  };
}

/**
 * Verify SMTP credentials by issuing a NOOP command. Returns ok=true if the
 * SMTP server accepted the connection and authenticated successfully.
 * Does NOT verify that the From address is a Brevo Verified Sender —
 * that's a separate check the user must do in the Brevo dashboard.
 */
export async function verifySmtp(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const transport = getTransport();
    await transport.verify();
    return {
      ok: true,
      message: `SMTP connection verified. Host: ${process.env.SMTP_HOST}, user: ${process.env.SMTP_USER}`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "SMTP verification failed",
    };
  }
}

// ─── DNS diagnostics for email deliverability ─────────────────────────────

export type DnsRecord = {
  name: string;     // DNS record name queried
  found: boolean;
  value: string | null;
  explanation: string;
  recommendation?: string;
};

export type DnsReport = {
  domain: string;
  spf: DnsRecord;
  // Brevo's modern domain authentication uses CNAME records at
  // brevo1._domainkey and brevo2._domainkey pointing to
  // b1.<domain>.dkim.brevo.com and b2.<domain>.dkim.brevo.com.
  // Older setups used a TXT record at brevo._domainkey. We check both.
  dkimBrevo1Cname: DnsRecord;  // brevo1._domainkey CNAME → b1.<domain>.dkim.brevo.com
  dkimBrevo2Cname: DnsRecord;  // brevo2._domainkey CNAME → b2.<domain>.dkim.brevo.com
  dkimBrevoTxt: DnsRecord;     // brevo._domainkey TXT (legacy)
  dkimS1: DnsRecord;           // s1._domainkey TXT (very old alternate)
  dkimS2: DnsRecord;           // s2._domainkey TXT (very old alternate)
  dmarc: DnsRecord;
  mx: { exchange: string; priority: number }[];
};

async function resolveTxtJoined(name: string): Promise<string | null> {
  try {
    const records = await resolveTxt(name);
    if (records.length === 0) return null;
    // TXT records come back as arrays of string fragments — join them.
    return records.map((r) => r.join("")).join(" ");
  } catch {
    return null;
  }
}

async function resolveCnameString(name: string): Promise<string | null> {
  try {
    const record = await resolveCname(name);
    if (record.length === 0) return null;
    // resolveCname returns the canonical name without trailing dot —
    // add it back for display consistency.
    return record[0];
  } catch {
    return null;
  }
}

/**
 * Inspect the DNS records that govern email deliverability for the given
 * domain. Used by the admin diagnostic tool to show the user exactly what
 * is missing and provide copy-paste DNS record templates.
 *
 * For Brevo specifically (modern domain authentication):
 *   SPF:        v=spf1 include:spf.brevo.com ~all  (TXT on @)
 *   DKIM:       brevo1._domainkey CNAME → b1.<domain>.dkim.brevo.com
 *               brevo2._domainkey CNAME → b2.<domain>.dkim.brevo.com
 *   DMARC:      v=DMARC1; p=none; rua=mailto:...  (TXT on _dmarc)
 *   Brevo code: brevo-code:<hash>  (TXT on @, used by Brevo to verify ownership)
 *
 * IMPORTANT: SPF must be a SINGLE TXT record with all `include:` directives
 * inside it. Multiple SPF TXT records on the same name is invalid per RFC 7208
 * and causes recipient servers to ignore SPF entirely.
 */
export async function checkEmailDnsRecords(
  domain: string = "phronesis-studio.com"
): Promise<DnsReport> {
  const bareDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const [
    rootTxtRecords,
    dkimBrevo1Cname,
    dkimBrevo2Cname,
    dkimBrevoTxt,
    dkimS1,
    dkimS2,
    dmarc,
    mxRecords,
  ] = await Promise.all([
    resolveTxtJoined(bareDomain),
    resolveCnameString(`brevo1._domainkey.${bareDomain}`),
    resolveCnameString(`brevo2._domainkey.${bareDomain}`),
    resolveTxtJoined(`brevo._domainkey.${bareDomain}`),
    resolveTxtJoined(`s1._domainkey.${bareDomain}`),
    resolveTxtJoined(`s2._domainkey.${bareDomain}`),
    resolveTxtJoined(`_dmarc.${bareDomain}`),
    resolveMx(bareDomain).catch(() => []),
  ]);

  // rootTxtRecords may contain MULTIPLE TXT records (SPF + brevo-code + …).
  // Find the SPF one specifically.
  const spfRecord = rootTxtRecords && /v=spf1/.test(rootTxtRecords)
    ? rootTxtRecords.split(" ").find(r => /v=spf1/.test(r)) || rootTxtRecords
    : null;
  // Actually: when resolveTxt returns multiple TXT records, our join
  // concatenates them with spaces, which is wrong. We need to find which
  // one starts with v=spf1. Let's be smarter:
  let spfValue: string | null = null;
  if (rootTxtRecords) {
    // Each TXT record came back as a joined string; we joined those with
    // " ". To find SPF, we look for the v=spf1 token anywhere.
    const spfMatch = rootTxtRecords.match(/v=spf1[^"\n]*/i);
    spfValue = spfMatch ? spfMatch[0] : null;
  }
  // Also: detect if there's a brevo-code TXT (separate from SPF).
  const hasBrevoCode = rootTxtRecords && /brevo-code:/i.test(rootTxtRecords);
  // Check that SPF includes spf.brevo.com
  const spfIncludesBrevo = Boolean(spfValue && /include:spf\.brevo\.com/i.test(spfValue));

  // Determine if any DKIM is configured (CNAME form preferred, TXT form legacy)
  const dkimCnameFound = Boolean(dkimBrevo1Cname || dkimBrevo2Cname);
  const dkimTxtFound = Boolean(dkimBrevoTxt && /v=DKIM1/.test(dkimBrevoTxt));

  return {
    domain: bareDomain,
    spf: {
      name: `${bareDomain}  TXT`,
      found: Boolean(spfValue),
      value: spfValue,
      explanation:
        "SPF (Sender Policy Framework) lists which mail servers are allowed to send email from your domain. Without SPF including Brevo, Gmail/Outlook will silently filter most of your email to spam. IMPORTANT: SPF must be a SINGLE TXT record with all include: directives inside it — multiple SPF TXT records on the same name is invalid and causes SPF to be ignored entirely.",
      recommendation: !spfValue
        ? `Add this TXT record at your DNS provider:
  Name: @  (or ${bareDomain})
  Value: v=spf1 include:spf.brevo.com ~all`
        : spfValue && !spfIncludesBrevo
          ? `Your SPF record exists but does NOT include Brevo. EDIT the existing TXT record (do not add a second SPF record) to:
  v=spf1 include:spf.brevo.com ${spfValue.replace(/^v=spf1\s*/, "")}

Current: ${spfValue}

Example (if you also have Namecheap email forwarding):
  v=spf1 include:spf.brevo.com include:spf.efwd.registrar-servers.com ~all`
          : undefined,
    },
    dkimBrevo1Cname: {
      name: `brevo1._domainkey.${bareDomain}  CNAME`,
      found: Boolean(dkimBrevo1Cname),
      value: dkimBrevo1Cname ? `${dkimBrevo1Cname}.` : null,
      explanation:
        "DKIM selector #1 — Brevo's modern domain authentication uses a CNAME record pointing to b1.<domain>.dkim.brevo.com. This is the recommended setup; Brevo generates it in their dashboard under Senders & IP → Authenticate your domain.",
      recommendation: !dkimBrevo1Cname && !dkimTxtFound
        ? `Log in to Brevo dashboard → Senders & IP → Authenticate your domain.
Brevo will give you a CNAME record to add at:
  Name: brevo1._domainkey
  Value: b1.${bareDomain}.dkim.brevo.com.`
        : undefined,
    },
    dkimBrevo2Cname: {
      name: `brevo2._domainkey.${bareDomain}  CNAME`,
      found: Boolean(dkimBrevo2Cname),
      value: dkimBrevo2Cname ? `${dkimBrevo2Cname}.` : null,
      explanation:
        "DKIM selector #2 — Brevo's modern domain authentication uses a CNAME record pointing to b2.<domain>.dkim.brevo.com. This is the recommended setup; Brevo generates it in their dashboard under Senders & IP → Authenticate your domain.",
      recommendation: !dkimBrevo2Cname && !dkimTxtFound
        ? `Log in to Brevo dashboard → Senders & IP → Authenticate your domain.
Brevo will give you a CNAME record to add at:
  Name: brevo2._domainkey
  Value: b2.${bareDomain}.dkim.brevo.com.`
        : undefined,
    },
    dkimBrevoTxt: {
      name: `brevo._domainkey.${bareDomain}  TXT`,
      found: dkimTxtFound,
      value: dkimBrevoTxt,
      explanation:
        "Legacy DKIM TXT record (older Brevo setup). Most modern Brevo configurations use the CNAME form above instead; either is acceptable.",
    },
    dkimS1: {
      name: `s1._domainkey.${bareDomain}  TXT`,
      found: Boolean(dkimS1 && /v=DKIM1/.test(dkimS1)),
      value: dkimS1,
      explanation: "Alternate DKIM selector some older Brevo setups use.",
    },
    dkimS2: {
      name: `s2._domainkey.${bareDomain}  TXT`,
      found: Boolean(dkimS2 && /v=DKIM1/.test(dkimS2)),
      value: dkimS2,
      explanation: "Alternate DKIM selector some older Brevo setups use.",
    },
    dmarc: {
      name: `_dmarc.${bareDomain}  TXT`,
      found: Boolean(dmarc && /v=DMARC1/.test(dmarc)),
      value: dmarc,
      explanation:
        "DMARC tells recipient servers what to do if SPF or DKIM fails. With p=quarantine, a failed SPF/DKIM check sends your email to spam. With p=reject, recipient servers silently drop it — it won't even reach the spam folder.",
      recommendation: !dmarc
        ? `Add this TXT record (start with p=none for monitoring):
  Name: _dmarc
  Value: v=DMARC1; p=none; rua=mailto:ahmed@${bareDomain}`
        : undefined,
    },
    mx: mxRecords.map((r) => ({
      exchange: r.exchange,
      priority: r.priority,
    })),
  };
}


/**
 * Check if SMTP is configured (used by admin Settings page to show status).
 */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_EMAIL
  );
}

// ─── Templated emails ──────────────────────────────────────────────────────

/**
 * Confirmation email sent to a lead after they submit the contact form.
 * Plain HTML, brand-aligned, no external images (works in all clients).
 */
export async function sendLeadConfirmation(opts: {
  leadName: string;
  leadEmail: string;
  gap: string;
}): Promise<void> {
  const { leadName, leadEmail, gap } = opts;
  const firstName = leadName.split(" ")[0];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your inquiry has been received</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;border-bottom:3px solid #B48D3C;">
              <img src="https://phronesis-studio.com/logo-email.png" alt="Studio of Phronesis" width="100" height="100" style="margin:0 auto 12px;display:block;border:0;outline:none;text-decoration:none;" />
              <div style="font-family:Cambria,Georgia,serif;font-size:18px;letter-spacing:0.15em;color:#1A1A1A;font-weight:bold;">STUDIO OF PHRONESIS</div>
              <div style="font-family:Calibri,sans-serif;font-size:13px;color:#8A8A8A;font-style:italic;margin-top:4px;">Philosopher · Educator · Architect</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <h1 style="font-family:Cambria,Georgia,serif;font-size:26px;color:#1A1A1A;margin:0 0 16px;font-weight:normal;">Your inquiry has been received</h1>
              <p style="font-size:15px;color:#4A4A4A;margin:0 0 16px;">Dear ${escapeHtml(firstName)},</p>
              <p style="font-size:15px;color:#4A4A4A;margin:0 0 16px;">Thank you for reaching out to Studio of Phronesis. I have received your inquiry and will respond personally within one business day, often sooner.</p>

              <table role="presentation" width="100%" cellpadding="14" cellspacing="0" style="background-color:#F5EFE4;border-left:3px solid #0F5C5E;margin:20px 0;">
                <tr>
                  <td>
                    <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;margin-bottom:6px;font-weight:bold;">Your message</div>
                    <div style="font-size:14px;color:#1A1A1A;font-style:italic;line-height:1.6;">"${escapeHtml(truncate(gap, 280))}${gap.length > 280 ? "…" : ""}"</div>
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;color:#4A4A4A;margin:24px 0 8px;">In the meantime, you may find it useful to review:</p>
              <ul style="font-size:14px;color:#4A4A4A;padding-left:22px;margin:0 0 16px;">
                <li style="margin-bottom:6px;"><a href="https://phronesis-studio.com/en/work" style="color:#0F5C5E;text-decoration:none;">Selected work</a>: production platforms currently in use</li>
                <li style="margin-bottom:6px;"><a href="https://phronesis-studio.com/en/method" style="color:#0F5C5E;text-decoration:none;">The method</a>: how I diagnose, design, build, and embed</li>
                <li style="margin-bottom:6px;"><a href="https://phronesis-studio.com/en/library" style="color:#0F5C5E;text-decoration:none;">The library</a>: free downloadable guides</li>
              </ul>

              <p style="font-size:15px;color:#4A4A4A;margin:24px 0 0;">If your inquiry is urgent, you may reply directly to this email.</p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="font-size:15px;color:#4A4A4A;margin:0 0 4px;">With regards,</p>
              <p style="font-family:Cambria,Georgia,serif;font-size:18px;color:#1A1A1A;margin:8px 0 0;font-weight:bold;">Ahmed Ali</p>
              <p style="font-size:13px;color:#8A8A8A;margin:2px 0 0;">Studio of Phronesis · Al Ain · UAE</p>
              <p style="font-size:13px;color:#B48D3C;margin:2px 0 0;font-style:italic;">phronesis-studio.com · Studio of Practical Wisdom</p>
            </td>
          </tr>

          <!-- Footer rule -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #EAE3D5;text-align:center;">
              <p style="font-size:11px;color:#8A8A8A;margin:0;">This email was sent automatically from your inquiry at phronesis-studio.com.<br>Please do not reply to spam or phishing attempts claiming to be from this address.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `STUDIO OF PHRONESIS

Your inquiry has been received

Dear ${firstName},

Thank you for reaching out to Studio of Phronesis. I have received your inquiry and will respond personally within one business day, often sooner.

Your message:
"${truncate(gap, 280)}${gap.length > 280 ? "…" : ""}"

In the meantime, you may find it useful to review:
- Selected work: https://phronesis-studio.com/en/work
- The method: https://phronesis-studio.com/en/method
- The library: https://phronesis-studio.com/en/library

If your inquiry is urgent, you may reply directly to this email.

With regards,
Ahmed Ali
Studio of Phronesis · Al Ain · UAE
phronesis-studio.com · Studio of Practical Wisdom`;

  await sendEmail({
    to: leadEmail,
    subject: "Your inquiry has been received: Studio of Phronesis",
    text,
    html,
    replyTo: process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com",
  });
  // Result discarded — this function is called from the lead form handler,
  // not the admin UI, so we don't need to surface the messageId here.
}

/**
 * Notification email sent to the studio owner (forwarded to Gmail via ImprovMX)
 * when a new lead is submitted. Contains all lead details.
 */
export async function sendLeadNotification(opts: {
  leadName: string;
  leadEmail: string;
  leadCompany: string | null;
  leadGap: string;
  leadBudget: string | null;
  leadId: string;
}): Promise<void> {
  const { leadName, leadEmail, leadCompany, leadGap, leadBudget, leadId } = opts;
  const notify = process.env.NOTIFY_EMAIL || process.env.CONTACT_EMAIL || "ahmed@phronesis-studio.com";
  const adminUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phronesis-studio.com";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New inquiry from ${escapeHtml(leadName)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EFE4;font-family:Calibri,-apple-system,sans-serif;color:#1A1A1A;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EFE4;">
    <tr>
      <td align="center" style="padding:32px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">

          <tr>
            <td style="padding:32px 40px 20px;border-bottom:3px solid #B48D3C;">
              <div style="font-family:Consolas,monospace;font-size:11px;letter-spacing:0.2em;color:#0F5C5E;text-transform:uppercase;font-weight:bold;">NEW INQUIRY · STUDIO OF PHRONESIS</div>
              <h1 style="font-family:Cambria,Georgia,serif;font-size:24px;color:#1A1A1A;margin:8px 0 0;font-weight:normal;">${escapeHtml(leadName)}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #EAE3D5;">
                    <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#8A8A8A;text-transform:uppercase;">EMAIL</div>
                    <div style="font-size:14px;color:#1A1A1A;"><a href="mailto:${escapeHtml(leadEmail)}" style="color:#0F5C5E;text-decoration:none;">${escapeHtml(leadEmail)}</a></div>
                  </td>
                </tr>
                ${leadCompany ? `<tr><td style="padding:8px 0;border-bottom:1px solid #EAE3D5;"><div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#8A8A8A;text-transform:uppercase;">COMPANY</div><div style="font-size:14px;color:#1A1A1A;">${escapeHtml(leadCompany)}</div></td></tr>` : ""}
                ${leadBudget ? `<tr><td style="padding:8px 0;border-bottom:1px solid #EAE3D5;"><div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#8A8A8A;text-transform:uppercase;">BUDGET</div><div style="font-size:14px;color:#1A1A1A;">${escapeHtml(leadBudget)}</div></td></tr>` : ""}
                <tr>
                  <td style="padding:8px 0;">
                    <div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:0.2em;color:#8A8A8A;text-transform:uppercase;">THE GAP (THEIR MESSAGE)</div>
                    <div style="font-size:14px;color:#1A1A1A;line-height:1.7;margin-top:6px;white-space:pre-wrap;">${escapeHtml(leadGap)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 32px;text-align:center;">
              <a href="${adminUrl}/admin/leads" style="display:inline-block;background-color:#0F5C5E;color:#FFFFFF;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:14px;font-weight:bold;">View in admin →</a>
              <p style="font-size:11px;color:#8A8A8A;margin:16px 0 0;">Lead ID: ${escapeHtml(leadId)}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `NEW INQUIRY · STUDIO OF PHRONESIS

From: ${leadName}
Email: ${leadEmail}
${leadCompany ? `Company: ${leadCompany}\n` : ""}${leadBudget ? `Budget: ${leadBudget}\n` : ""}
Message:
${leadGap}

---
View in admin: ${adminUrl}/admin/leads
Lead ID: ${leadId}`;

  await sendEmail({
    to: notify,
    subject: `New inquiry from ${leadName}`,
    text,
    html,
    replyTo: leadEmail, // so when you hit "Reply" in Gmail, it goes to the lead
  });
  // Result discarded — this function is called from the lead form handler.
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max);
}
