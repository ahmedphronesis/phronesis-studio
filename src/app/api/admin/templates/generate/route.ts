import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateTemplate, TEMPLATES, type TemplateId } from "@/lib/docx/templates";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/templates/generate
 * Body: { template: TemplateId, payload: {...}, clientName?: string }
 * Returns: binary .docx file
 */
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { template, payload, clientName } = await req.json();

    // Validate template id
    const valid = TEMPLATES.find((t) => t.id === template);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid template" }, { status: 400 });
    }

    const { buffer, fileName } = await generateTemplate(template as TemplateId, payload);

    // Log to DB for history / re-download
    try {
      await db.templateLog.create({
        data: {
          template,
          clientName: clientName || null,
          payload: payload as object,
          fileName,
        },
      });
    } catch (e) {
      console.error("[template log] failed to log:", e);
      // non-fatal
    }

    // Convert Node Buffer to Uint8Array for NextResponse compatibility
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": uint8.length.toString(),
      },
    });
  } catch (err) {
    console.error("[/api/admin/templates/generate] error:", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
