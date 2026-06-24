import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendLeadConfirmation, sendLeadNotification, isEmailConfigured } from "@/lib/email";

const LeadSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("A valid email is required").max(180),
  company: z.string().max(180).optional().nullable(),
  gap: z.string().min(20, "Tell me a little more about the gap — at least a sentence").max(4000),
  budget: z.string().max(60).optional().nullable(),
});

export const runtime = "nodejs";

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

    const { name, email, company, gap, budget } = parsed.data;

    const lead = await db.lead.create({
      data: {
        name,
        email,
        company: company ?? null,
        gap,
        budget: budget ?? null,
      },
    });

    // Send confirmation email to the lead + notification to the studio owner.
    // Both are fire-and-forget — email failures should NOT break the API response.
    // We log errors but still return 200 to the user.
    if (isEmailConfigured()) {
      // Fire-and-forget both emails in parallel
      Promise.all([
        sendLeadConfirmation({ leadName: name, leadEmail: email, gap }),
        sendLeadNotification({
          leadName: name,
          leadEmail: email,
          leadCompany: company ?? null,
          leadGap: gap,
          leadBudget: budget ?? null,
          leadId: lead.id,
        }),
      ]).catch((err) => {
        console.error("[/api/lead] email send failed:", err);
      });
    } else {
      console.warn("[/api/lead] SMTP not configured — skipping email notifications");
    }

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
