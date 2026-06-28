import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendLeadConfirmation, sendLeadNotification, isEmailConfigured } from "@/lib/email";
import { validateEmail } from "@/lib/email-validation";

// Allow up to 60 seconds for email sending (default Vercel Hobby is 10s)
export const runtime = "nodejs";
export const maxDuration = 60;

const LeadSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("A valid email is required").max(180),
  company: z.string().max(180).optional().nullable(),
  gap: z.string().min(20, "Tell me a little more about the gap — at least a sentence").max(4000),
  budget: z.string().max(60).optional().nullable(),
  // Honeypot field — bots fill this, humans don't (it's hidden via CSS)
  website: z.string().max(0).optional(),
});

/**
 * Retry wrapper — tries an async function up to 3 times with exponential backoff.
 * Logs each attempt. Returns true if any attempt succeeds.
 */
async function retryEmail<T>(
  label: string,
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fn();
      console.log(`[/api/lead] ${label} succeeded on attempt ${attempt}`);
      return { success: true };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[/api/lead] ${label} failed on attempt ${attempt}/${maxRetries}: ${errMsg}`);
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((r) => setTimeout(r, delay));
      } else {
        return { success: false, error: errMsg };
      }
    }
  }
  return { success: false, error: "Max retries exceeded" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: first?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    // Honeypot check — if the hidden "website" field has any value, it's a bot.
    if (parsed.data.website && parsed.data.website.length > 0) {
      console.warn("[/api/lead] honeypot triggered — bot submission rejected");
      return NextResponse.json({ ok: true, id: "bot-rejected" });
    }

    const { name, email, company, gap, budget } = parsed.data;

    // Email validation: check for common typos (gmai.com → gmail.com)
    // and verify the domain has MX records (can actually receive email).
    // This prevents leads with undeliverable email addresses.
    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { ok: false, error: emailCheck.error },
        { status: 400 }
      );
    }

    // Step 1: Save the lead to the DB FIRST — this is the critical data.
    // Even if everything else fails, the lead is preserved.
    const lead = await db.lead.create({
      data: {
        name,
        email,
        company: company ?? null,
        gap,
        budget: budget ?? null,
      },
    });

    console.log(`[/api/lead] Lead saved: ${lead.id} from ${name} <${email}>`);

    // Step 2: Send emails with retry logic. We AWAIT to ensure Vercel
    // doesn't kill the function before emails complete.
    // Each email gets 3 attempts with exponential backoff (1s, 2s, 4s).
    // Even if one email fails, the other still gets attempted.
    let confirmationResult: { success: boolean; error?: string } = { success: false, error: "SMTP not configured" };
    let notificationResult: { success: boolean; error?: string } = { success: false, error: "SMTP not configured" };

    if (isEmailConfigured()) {
      // Send both emails in parallel, each with its own retry logic
      [confirmationResult, notificationResult] = await Promise.all([
        retryEmail("confirmation email", () =>
          sendLeadConfirmation({ leadName: name, leadEmail: email, gap })
        ),
        retryEmail("notification email", () =>
          sendLeadNotification({
            leadName: name,
            leadEmail: email,
            leadCompany: company ?? null,
            leadGap: gap,
            leadBudget: budget ?? null,
            leadId: lead.id,
          })
        ),
      ]);
    } else {
      console.warn("[/api/lead] SMTP not configured — skipping email notifications");
    }

    // Step 3: Log email status to the sent_emails table for audit trail.
    // This ensures we ALWAYS know whether emails succeeded or failed, even
    // if Vercel logs expire.
    try {
      await db.sentEmail.create({
        data: {
          toEmail: email,
          toName: name,
          subject: "Lead confirmation + notification",
          bodyText: `Lead ID: ${lead.id}\nName: ${name}\nEmail: ${email}\n\nConfirmation sent: ${confirmationResult.success}\nNotification sent: ${notificationResult.success}\n${confirmationResult.error ? `Confirmation error: ${confirmationResult.error}\n` : ""}${notificationResult.error ? `Notification error: ${notificationResult.error}\n` : ""}`,
          bodyHtml: null,
          leadId: lead.id,
        },
      });
    } catch (logErr) {
      console.error("[/api/lead] Failed to log email status:", logErr);
      // Non-fatal — the lead is already saved
    }

    // Step 4: If BOTH emails failed, log a critical warning.
    // The lead is saved but NO emails were sent — admin needs to check.
    if (!confirmationResult.success && !notificationResult.success) {
      console.error(`[/api/lead] CRITICAL: Lead ${lead.id} saved but ALL emails failed! Admin must send manually.`);
    }

    // Step 5: Return success to the user regardless — the lead is saved.
    // The user doesn't need to know about email backend issues.
    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("[/api/lead] error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Please try email instead." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Studio of Phronesis — lead endpoint" });
}
