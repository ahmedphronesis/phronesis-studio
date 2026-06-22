#!/usr/bin/env bun
/**
 * Re-translate ONLY the thesis section for a given locale.
 * Usage: bun run scripts/retranslate-thesis.ts <locale>
 */
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/retranslate-thesis.ts <locale>");
  process.exit(1);
}

const config = JSON.parse(readFileSync("/etc/.z-ai-config", "utf8"));

const NOTES: Record<string, { name: string; native: string; notes: string }> = {
  ar: { name: "Arabic", native: "العربية", notes: "Use Modern Standard Arabic (فصحى). Phronesis = فرونسيس (practical wisdom). Academic register." },
  es: { name: "Spanish", native: "Español", notes: "Use formal academic Spanish. Phronesis = frónesis. Philosophical and editorial tone." },
  fr: { name: "French", native: "Français", notes: "Use formal French. Phronesis = phronesis. Academic philosophical register." },
  ru: { name: "Russian", native: "Русский", notes: "Use formal Russian. Phronesis = фронезис. Academic philosophical register." },
  fa: { name: "Persian", native: "فارسی", notes: "Use formal Persian. Phronesis = فرونسیس. Academic register." },
  zh: { name: "Mandarin", native: "中文", notes: "Use formal written Chinese. Phronesis = 实践智慧. Academic and literary register." },
  tr: { name: "Turkish", native: "Türkçe", notes: "Use formal Turkish. Phronesis = fronesis. Academic register." },
  pt: { name: "Portuguese", native: "Português", notes: "Use formal academic Portuguese. Phronesis = frónesis." },
  hi: { name: "Hindi", native: "हिन्दी", notes: "Use formal Hindi. Phronesis = व्यावहारिक ज्ञान. Academic register." },
  ml: { name: "Malayalam", native: "മലയാളം", notes: "Use formal Malayalam. Phronesis = പ്രായോഗിക ജ്ഞാനം. Academic register." },
};

const info = NOTES[locale];
if (!info) {
  console.error(`Unknown locale: ${locale}`);
  process.exit(1);
}

const enMessages = JSON.parse(readFileSync("/home/z/my-project/src/messages/en.json", "utf8"));
const thesisSection = enMessages.thesis;

async function callLLM(prompt: string, timeoutMs = 30000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
        "X-Z-AI-From": "Z",
        "X-Chat-Id": config.chatId,
        "X-User-Id": config.userId,
        "X-Token": config.token,
      },
      body: JSON.stringify({
        model: "glm-4.6",
        messages: [
          { role: "system", content: "You are a master translator of academic and philosophical texts. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } finally {
    clearTimeout(timeout);
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`\n=== Re-translating thesis section for ${info.name} (${locale}) ===`);

  const sourceJson = JSON.stringify(thesisSection, null, 2);

  const prompt = `Translate the following JSON values from English to ${info.name} (${info.native}).

PRINCIPLES:
1. Academic, literary, dignified tone.
2. ${info.notes}
3. Preserve all JSON keys exactly. Only translate values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001) in original form.
5. Keep brand names in English.
6. Keep currency (AED) and numbers as-is.
7. Use SIMPLE, CLEAR sentence structures that translate well. Avoid idioms.
8. Return ONLY valid JSON, no commentary, no markdown fences.

Section: thesis
Source JSON:
${sourceJson}

Return the ${info.name} translation:`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      process.stdout.write(`  Attempt ${attempt}... `);
      const content = await callLLM(prompt, 30000);
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        const translated = JSON.parse(match[0]);

        // Load existing translation file and update only the thesis section
        const targetPath = `/home/z/my-project/src/messages/${locale}.json`;
        const existing = JSON.parse(readFileSync(targetPath, "utf8"));
        existing.thesis = translated;

        // Also update footer.description to include "and Management"
        const footerDesc = existing.footer?.description || "";
        // The footer description should be re-translated too since it changed
        const footerPrompt = `Translate this single sentence to ${info.name} (${info.native}). Academic tone. Return ONLY the translated sentence, no quotes, no JSON:
"Educator, systems architect, and leadership and management professional. Available for custom builds, consultation, and tutoring, for institutions that have stopped settling for the gap."`;

        try {
          const footerResponse = await callLLM(footerPrompt, 20000);
          // Extract just the translated text (remove any JSON or quotes)
          const footerTranslated = footerResponse.replace(/^["']|["']$/g, "").trim();
          if (footerTranslated && footerTranslated.length > 20) {
            existing.footer.description = footerTranslated;
            console.log("✓ (thesis + footer)");
          } else {
            console.log("✓ (thesis only, footer fallback)");
          }
        } catch {
          console.log("✓ (thesis only, footer failed)");
        }

        writeFileSync(targetPath, JSON.stringify(existing, null, 2) + "\n");
        console.log(`  ✓ Written to ${targetPath}`);

        // Verify
        console.log(`  thesis.lead preview: ${translated.lead?.substring(0, 60)}...`);
        return;
      }
      throw new Error("no JSON in response");
    } catch (err) {
      console.error(`✗ (${err})`);
      if (attempt < 3) await sleep(8000);
    }
  }

  console.error(`  ✗ Failed after 3 attempts`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
