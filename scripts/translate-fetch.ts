#!/usr/bin/env bun
/**
 * Translate using fetch directly with AbortController for reliable timeouts.
 * Usage: bun run scripts/translate-fetch.ts <locale>
 */
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-fetch.ts <locale>");
  process.exit(1);
}

const config = JSON.parse(readFileSync("/etc/.z-ai-config", "utf8"));

const NOTES: Record<string, { name: string; native: string; notes: string }> = {
  ru: { name: "Russian", native: "Русский", notes: "Use formal Russian. Phronesis = фронезис. Academic register." },
  fa: { name: "Persian", native: "فارسی", notes: "Use formal Persian. Phronesis = فرونسیس. Academic register." },
  zh: { name: "Mandarin", native: "中文", notes: "Use formal written Chinese. Phronesis = 实践智慧. Academic register." },
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

async function translateChunk(sectionKey: string, sectionData: Record<string, string>): Promise<Record<string, string>> {
  const sourceJson = JSON.stringify(sectionData, null, 2);

  const prompt = `Translate the following JSON values from English to ${info.name} (${info.native}).

PRINCIPLES:
1. Academic, literary, dignified tone.
2. ${info.notes}
3. Preserve all JSON keys exactly. Only translate values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001) in original form.
5. Keep brand names in English.
6. Keep currency (AED) and numbers as-is.
7. Return ONLY valid JSON, no commentary, no markdown fences.

Section: ${sectionKey}
Source JSON:
${sourceJson}

Return the ${info.name} translation:`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const content = await callLLM(prompt, 30000);
      const match = content.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("no JSON in response");
    } catch (err) {
      console.error(`\n  ⚠ ${sectionKey} attempt ${attempt}: ${err}`);
      if (attempt < 3) await sleep(15000);
    }
  }

  console.error(`\n  ✗ ${sectionKey} using English fallback`);
  return sectionData;
}

async function main() {
  console.log(`\n=== Translating to ${info.name} (${locale}) ===`);

  const translated: Record<string, Record<string, string>> = {};
  const sections = Object.keys(enMessages);

  for (const section of sections) {
    process.stdout.write(`  ${section}... `);
    try {
      translated[section] = await translateChunk(section, enMessages[section]);
      console.log("✓");
    } catch (err) {
      console.error(`✗ (${err})`);
      translated[section] = enMessages[section];
    }
    await sleep(8000);
  }

  const outPath = `/home/z/my-project/src/messages/${locale}.json`;
  writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");

  const heroName = translated.hero?.name || "?";
  console.log(`\n✓ Written to ${outPath}`);
  console.log(`  hero.name = "${heroName}"`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
