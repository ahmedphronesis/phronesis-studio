#!/usr/bin/env bun
/**
 * Translate to a single language with per-chunk timeout and retry.
 * Usage: bun run scripts/translate-robust.ts <locale>
 */
import ZAI from "z-ai-web-dev-sdk";
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-robust.ts <locale>");
  process.exit(1);
}

const NOTES: Record<string, { name: string; native: string; notes: string }> = {
  fa: { name: "Persian", native: "فارسی", notes: "Use formal Persian. Phronesis = فرونسیس. Academic register." },
  zh: { name: "Mandarin", native: "中文", notes: "Use formal written Chinese. Phronesis = 实践智慧. Academic register." },
  ru: { name: "Russian", native: "Русский", notes: "Use formal Russian. Phronesis = фронезис. Academic register." },
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

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateChunk(zai: ZAI, sectionKey: string, sectionData: Record<string, string>, attempt = 1): Promise<Record<string, string>> {
  const sourceJson = JSON.stringify(sectionData, null, 2);

  const prompt = `You are a master translator specializing in academic and philosophical texts. Translate the following JSON values from English to ${info.name} (${info.native}).

PRINCIPLES:
1. Academic, literary, dignified tone.
2. ${info.notes}
3. Preserve all JSON keys exactly. Only translate values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001) in original form.
5. Keep brand names ("Studio of Phronesis", "Real Estate Emperor", "MSCS Academy", "DiplomatiQ", "Echoes of Wisdom") in English.
6. Keep currency (AED) and numbers as-is.
7. Return ONLY valid JSON, no commentary, no markdown fences.

Section: ${sectionKey}
Source JSON:
${sourceJson}

Return the ${info.name} translation:`;

  try {
    const response = await withTimeout(
      zai.chat.completions.create({
        model: "glm-4.6",
        messages: [
          { role: "system", content: "You are a master translator. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
        temperature: 0.3,
      }),
      45000 // 45 second timeout per chunk
    );

    const content = response.choices[0]?.message?.content || "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("no JSON in response");
    return JSON.parse(match[0]);
  } catch (err) {
    if (attempt < 3) {
      console.error(`  ⚠ ${sectionKey} attempt ${attempt} failed (${err}), retrying in 5s...`);
      await sleep(5000);
      return translateChunk(zai, sectionKey, sectionData, attempt + 1);
    }
    console.error(`  ✗ ${sectionKey} failed after 3 attempts, using English fallback`);
    return sectionData;
  }
}

async function main() {
  console.log(`\n=== Translating to ${info.name} (${locale}) ===`);
  const zai = await ZAI.create();

  const translated: Record<string, Record<string, string>> = {};
  const sections = Object.keys(enMessages);

  for (const section of sections) {
    process.stdout.write(`  ${section}... `);
    try {
      translated[section] = await translateChunk(zai, section, enMessages[section]);
      console.log("✓");
    } catch (err) {
      console.error(`✗ (${err})`);
      translated[section] = enMessages[section];
    }
    // Small delay between sections to avoid rate limiting
    await sleep(2000);
  }

  const outPath = `/home/z/my-project/src/messages/${locale}.json`;
  writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");

  // Verify
  const heroName = translated.hero?.name || "?";
  console.log(`\n✓ Written to ${outPath}`);
  console.log(`  hero.name = "${heroName}" (should NOT be "Ahmed Ali")`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
