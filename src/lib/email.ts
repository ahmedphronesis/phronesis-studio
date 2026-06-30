/**
 * Email sending via Brevo.
 *
 * PRIMARY: Brevo HTTP API (https://api.brevo.com/v3/smtp/email)
 *   The API sometimes routes through different IP pools than the SMTP
 *   relay, which can improve deliverability to Microsoft 365 / Outlook
 *   domains that aggressively filter Brevo's shared SMTP IPs.
 *
 * FALLBACK: Brevo SMTP relay (smtp-relay.brevo.com:587)
 *   If the API call fails (network error, 5xx response), we fall back
 *   to the SMTP relay so a transient API outage doesn't block email.
 *
 * The API key is the same value for both paths (starts with xkeysib-).
 * Reuses the existing SMTP_PASS env var — no new env vars needed.
 *
 * Required env vars:
 *   SMTP_HOST       = smtp-relay.brevo.com
 *   SMTP_PORT       = 587
 *   SMTP_USER       = (your Brevo SMTP login, usually your Brevo account email)
 *   SMTP_PASS       = (your Brevo key — starts with xkeysib-. Used for BOTH
 *                     SMTP auth AND the API key header)
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
 * Send an email. PRIMARY path: Brevo HTTP API. FALLBACK: Brevo SMTP relay.
 *
 * The API is preferred because it sometimes routes through a different IP
 * pool than the SMTP relay — this matters for deliverability to Microsoft 365
 * / Outlook domains, which aggressively filter Brevo's shared SMTP IPs.
 *
 * If the API call fails (network error, non-2xx response), we automatically
 * fall back to the SMTP relay so a transient API outage doesn't block email.
 *
 * Returns an EmailSendResult. Inspect `rejected` — if non-empty, the
 * recipient was rejected. If `accepted` is empty, nothing was sent.
 *
 * IMPORTANT: resolving does NOT guarantee delivery. Brevo may still:
 *   - Defer delivery if the recipient's MX is strict about IP reputation
 *   - Bounce later if the recipient's mailbox is full or doesn't exist
 *   - Be silently dropped by the recipient's gateway (e.g. Microsoft 365 EOP)
 * The `messageId` is the only way to track what happened post-acceptance.
 * Look it up in Brevo dashboard → Transactional → Logs.
 */
export async function sendEmail(p: EmailPayload): Promise<EmailSendResult> {
  // Try the API first
  try {
    const apiResult = await sendEmailViaApi(p);
    if (apiResult.accepted.length > 0) {
      return apiResult;
    }
    // If accepted is empty but no exception was thrown, fall through to SMTP
    console.warn("[email] Brevo API returned no accepted recipients, falling back to SMTP");
  } catch (apiErr) {
    console.warn("[email] Brevo API failed, falling back to SMTP:", apiErr instanceof Error ? apiErr.message : apiErr);
  }

  // Fallback to SMTP
  return sendEmailViaSmtp(p);
}

/**
 * Send via Brevo HTTP API (POST https://api.brevo.com/v3/smtp/email).
 *
 * API key resolution:
 *   1. BREVO_API_KEY env var (preferred — generate in Brevo dashboard →
 *      SMTP & API → API Keys → Generate)
 *   2. SMTP_PASS env var (fallback — in SOME Brevo accounts the SMTP key
 *      also works as an API key; if not, the API call will 401 and the
 *      caller falls back to SMTP)
 *
 * If you're seeing SMTP-format responses ("250 2.0.0 OK: queued as...")
 * in the admin diagnostic instead of "API 200 OK", it means the API key
 * is not set or invalid, and the code is falling back to SMTP. Generate
 * a Brevo API key and add it as BREVO_API_KEY in Vercel env vars.
 */
async function sendEmailViaApi(p: EmailPayload): Promise<EmailSendResult> {
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  if (!apiKey) {
    throw new Error("No Brevo API key found. Set BREVO_API_KEY (preferred) or SMTP_PASS env var.");
  }

  const from = getFrom();
  // Brevo API expects recipients as an array of { email, name? } objects.
  // The `to` field in EmailPayload may be a plain address or "Name <addr>".
  const { address: toAddress, name: toName } = parseEmailAddress(p.to);

  const body: Record<string, unknown> = {
    sender: { name: from.name, email: from.address },
    to: [{ email: toAddress, ...(toName ? { name: toName } : {}) }],
    subject: p.subject,
  };
  if (p.html) body.htmlContent = p.html;
  if (p.text) body.textContent = p.text;
  if (p.replyTo) {
    const { address: replyAddress, name: replyName } = parseEmailAddress(p.replyTo);
    body.replyTo = { email: replyAddress, ...(replyName ? { name: replyName } : {}) };
  }

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const respText = await resp.text();

  if (!resp.ok) {
    // Brevo API returns 400 for validation errors, 401 for bad API key,
    // 429 for rate limit, 5xx for server errors.
    throw new Error(`Brevo API HTTP ${resp.status}: ${respText.slice(0, 500)}`);
  }

  // Brevo API returns { "messageId": "xxx@domain.com" }
  let respJson: { messageId?: string };
  try {
    respJson = JSON.parse(respText);
  } catch {
    respJson = {};
  }

  const messageId = respJson.messageId
    ? respJson.messageId.replace(/^<|>$/g, "")
    : null;

  return {
    messageId,
    response: `API ${resp.status} OK`,
    accepted: [toAddress],
    rejected: [],
    pending: [],
  };
}

/**
 * Send via Brevo SMTP relay (the original path, kept as fallback).
 */
async function sendEmailViaSmtp(p: EmailPayload): Promise<EmailSendResult> {
  const transport = getTransport();
  const info = await transport.sendMail({
    from: getFrom(),
    to: p.to,
    subject: p.subject,
    text: p.text,
    html: p.html,
    replyTo: p.replyTo,
  });

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
 * Parse an email address that may be in either format:
 *   "user@example.com"           → { address: "user@example.com", name: "" }
 *   "Name <user@example.com>"    → { address: "user@example.com", name: "Name" }
 */
function parseEmailAddress(input: string): { address: string; name: string } {
  const match = input.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    return { name: match[1].replace(/^["']|["']$/g, ""), address: match[2].trim() };
  }
  return { name: "", address: input.trim() };
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

/**
 * Verify the Brevo API key works by calling the account endpoint.
 * This is the preferred sending path — if the API key is invalid, emails
 * will silently fall back to SMTP (which may have deliverability issues
 * with Microsoft 365 domains).
 *
 * Returns ok=true if the API key is valid AND the account can send emails.
 */
export async function verifyBrevoApi(): Promise<{
  ok: boolean;
  message: string;
  usingEnvVar: string;
}> {
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  const usingEnvVar = process.env.BREVO_API_KEY ? "BREVO_API_KEY" : "SMTP_PASS (fallback — may not work as API key)";

  if (!apiKey) {
    return {
      ok: false,
      message: "No API key found. Set BREVO_API_KEY env var (generate in Brevo dashboard → SMTP & API → API Keys).",
      usingEnvVar,
    };
  }

  try {
    // Call the account endpoint to verify the API key without sending an email.
    // GET https://api.brevo.com/v3/account returns account info if the key is valid.
    const resp = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
      },
    });

    if (resp.ok) {
      const data = await resp.json().catch(() => ({}));
      const plan = data.plan?.find((p: { type: string }) => p.type === "free") ? "free" : "paid";
      return {
        ok: true,
        message: `Brevo API key valid. Account: ${data.email || "unknown"} (${data.companyName || "no company"}), plan: ${plan}. Emails will be sent via the API (preferred path).`,
        usingEnvVar,
      };
    } else {
      const text = await resp.text().catch(() => "");
      return {
        ok: false,
        message: `Brevo API returned HTTP ${resp.status}. ${text.slice(0, 200)}. The API key may be invalid or this is the SMTP password (not an API key). Generate a separate API key in Brevo dashboard → SMTP & API → API Keys, and add it as BREVO_API_KEY in Vercel. Without a valid API key, emails fall back to SMTP which has deliverability issues with Microsoft 365.`,
        usingEnvVar,
      };
    }
  } catch (err) {
    return {
      ok: false,
      message: `API verification request failed: ${err instanceof Error ? err.message : "unknown error"}. Check network connectivity to api.brevo.com.`,
      usingEnvVar,
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
 * Check if email is configured (used by admin Settings page to show status).
 * Returns true if EITHER the Brevo API key OR SMTP credentials are present.
 * The API path is preferred; SMTP is the fallback.
 */
export function isEmailConfigured(): boolean {
  const hasApi = Boolean(process.env.BREVO_API_KEY || process.env.SMTP_PASS);
  const hasSmtp = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
  return Boolean(hasApi || hasSmtp) && Boolean(process.env.CONTACT_EMAIL);
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
