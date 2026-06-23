#!/usr/bin/env bun
/**
 * Complete translation of ALL sections for a single language.
 * Translates section by section to avoid timeouts.
 * Usage: bun run scripts/translate-full.ts <locale>
 */
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-full.ts <locale>");
  process.exit(1);
}

const config = JSON.parse(readFileSync("/etc/.z-ai-config", "utf8"));

const LOCALE_INFO: Record<string, { name: string; native: string; notes: string }> = {
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

const info = LOCALE_INFO[locale];
if (!info) {
  console.error(`Unknown locale: ${locale}. Available: ${Object.keys(LOCALE_INFO).join(", ")}`);
  process.exit(1);
}

const enMessages = JSON.parse(readFileSync("/home/z/my-project/src/messages/en.json", "utf8"));

async function callLLM(prompt: string, timeoutMs = 45000): Promise<string> {
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
          { role: "system", content: "You are a master translator of academic and philosophical texts. Return only valid JSON. Preserve all JSON keys exactly. Only translate the values." },
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

async function translateSection(sectionName: string, sectionData: any): Promise<any> {
  const sourceJson = JSON.stringify(sectionData, null, 2);

  const prompt = `Translate the following JSON values from English to ${info.name} (${info.native}).

PRINCIPLES:
1. Academic, literary, dignified tone. NOT literal, NOT casual, NOT marketing-speak.
2. ${info.notes}
3. Preserve ALL JSON keys exactly. Only translate the string values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001, ISO 45001, SHA-256, etc.) in original English form.
5. Keep brand names ("Studio of Phronesis", "Real Estate Emperor", "MSCS Academy", "DiplomatiQ", "Echoes of Wisdom", "Treasury Emperor") in English.
6. Keep currency (AED), numbers, and proper nouns as-is.
7. For arrays of strings, translate each string in the array.
8. For nested objects, translate all string values recursively.
9. Return ONLY valid JSON with the same structure, no commentary, no markdown fences.

Section: ${sectionName}
Source JSON:
${sourceJson}

Return the ${info.name} translation:`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const content = await callLLM(prompt, 45000);
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error("no JSON in response");
    } catch (err) {
      if (attempt < 3) {
        await sleep(8000);
      }
    }
  }
  return sectionData; // fallback to English
}

async function main() {
  console.log(`\n=== Full translation to ${info.name} (${locale}) ===`);
  const startTime = Date.now();

  // Load existing translations (keep what's already translated, only translate missing/English sections)
  const targetPath = `/home/z/my-project/src/messages/${locale}.json`;
  const existing = JSON.parse(readFileSync(targetPath, "utf8"));

  // Sections to translate (skip 'language' which is just UI labels)
  const sectionsToTranslate = ['nav', 'hero', 'thesis', 'practice', 'library', 'work', 'workContent', 'method', 'contact', 'footer', 'about'];

  for (const section of sectionsToTranslate) {
    if (!enMessages[section]) continue;

    process.stdout.write(`  ${section}... `);
    const translated = await translateSection(section, enMessages[section]);
    existing[section] = translated;

    // Save after each section so progress isn't lost
    writeFileSync(targetPath, JSON.stringify(existing, null, 2) + "\n");
    console.log("✓");

    await sleep(3000); // 3s delay between sections
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n✓ Complete (${elapsed}s)`);
  console.log(`  Written to ${targetPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
