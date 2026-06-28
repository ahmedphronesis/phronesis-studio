import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendLeadConfirmation, sendLeadNotification, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/admin/leads/retry-emails
 * Body: { leadId: string }
 * Re-sends both confirmation + notification emails for a specific lead.
 * Used when the original email sending failed.
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { leadId } = await req.json();
    if (!leadId) {
      return NextResponse.json({ ok: false, error: "leadId is required" }, { status: 400 });
    }

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({ ok: false, error: "SMTP not configured" }, { status: 400 });
    }

    let confirmationOk = false;
    let notificationOk = false;
    const errors: string[] = [];

    // Retry confirmation email
    try {
      await sendLeadConfirmation({ leadName: lead.name, leadEmail: lead.email, gap: lead.gap });
      confirmationOk = true;
    } catch (err) {
      errors.push(`Confirmation: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Retry notification email
    try {
      await sendLeadNotification({
        leadName: lead.name,
        leadEmail: lead.email,
        leadCompany: lead.company,
        leadGap: lead.gap,
        leadBudget: lead.budget,
        leadId: lead.id,
      });
      notificationOk = true;
    } catch (err) {
      errors.push(`Notification: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Log the retry
    try {
      await db.sentEmail.create({
        data: {
          toEmail: lead.email,
          toName: lead.name,
          subject: `RETRY: Lead ${lead.id} emails`,
          bodyText: `Confirmation: ${confirmationOk ? "SUCCESS" : "FAILED"}\nNotification: ${notificationOk ? "SUCCESS" : "FAILED"}\nErrors: ${errors.join("; ") || "none"}`,
          bodyHtml: null,
          leadId: lead.id,
        },
      });
    } catch (e) {
      console.error("[retry-emails] log failed:", e);
    }

    return NextResponse.json({
      ok: true,
      confirmationSent: confirmationOk,
      notificationSent: notificationOk,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[/api/admin/leads/retry-emails] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
