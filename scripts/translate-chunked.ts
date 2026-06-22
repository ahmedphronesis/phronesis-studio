#!/usr/bin/env bun
/**
 * Translate to a single language, chunk by chunk (section by section).
 * This avoids LLM timeouts on large payloads.
 * Usage: bun run scripts/translate-chunked.ts <locale>
 */
import ZAI from "z-ai-web-dev-sdk";
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-chunked.ts <locale>");
  process.exit(1);
}

const NOTES: Record<string, { name: string; native: string; notes: string }> = {
  ar: { name: "Arabic", native: "العربية", notes: "Use Modern Standard Arabic (فصحى). Phronesis = فرونسيس (practical wisdom). Academic register." },
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
  console.error(`Unknown locale: ${locale}. Available: ${Object.keys(NOTES).join(", ")}`);
  process.exit(1);
}

const enMessages = JSON.parse(readFileSync("/home/z/my-project/src/messages/en.json", "utf8"));

async function translateChunk(zai: ZAI, sectionKey: string, sectionData: Record<string, string>): Promise<Record<string, string>> {
  const entries = Object.entries(sectionData);
  const sourceJson = JSON.stringify(Object.fromEntries(entries.map(([k, v]) => [k, v])), null, 2);

  const prompt = `You are a master translator specializing in academic and philosophical texts. Translate the following JSON values from English to ${info.name} (${info.native}).

PRINCIPLES:
1. Academic, literary, dignified tone — NOT literal, NOT casual, NOT marketing-speak.
2. ${info.notes}
3. Preserve all JSON keys exactly. Only translate the values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001, etc.) in original form.
5. Keep brand names ("Studio of Phronesis", "Real Estate Emperor", "MSCS Academy", "DiplomatiQ", "Echoes of Wisdom") in English.
6. Keep currency (AED) and numbers as-is.
7. Return ONLY valid JSON with the same keys, no commentary, no markdown fences.

Section: ${sectionKey}
Source JSON:
${sourceJson}

Return the ${info.name} translation:`;

  const response = await zai.chat.completions.create({
    model: "glm-4.6",
    messages: [
      { role: "system", content: "You are a master translator of academic and philosophical texts. Return only valid JSON." },
      { role: "user", content: prompt },
    ],
    thinking: { type: "disabled" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error(`  ✗ No JSON in response for section ${sectionKey}`);
    return sectionData; // fallback to English
  }

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error(`  ✗ JSON parse error for section ${sectionKey}: ${e}`);
    return sectionData;
  }
}

async function main() {
  console.log(`\n=== Translating to ${info.name} (${locale}) ===`);
  const zai = await ZAI.create();

  const translated: Record<string, Record<string, string>> = {};
  const sections = Object.keys(enMessages);

  for (const section of sections) {
    console.log(`  Translating section: ${section}...`);
    try {
      translated[section] = await translateChunk(zai, section, enMessages[section]);
      console.log(`  ✓ ${section} done (${Object.keys(translated[section]).length} keys)`);
    } catch (err) {
      console.error(`  ✗ Error on ${section}: ${err}`);
      translated[section] = enMessages[section]; // fallback
    }
  }

  const outPath = `/home/z/my-project/src/messages/${locale}.json`;
  writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");
  console.log(`\n✓ Written to ${outPath}`);
  console.log(`  Total sections: ${sections.length}`);
  console.log(`  Total keys: ${sections.reduce((n, s) => n + Object.keys(translated[s]).length, 0)}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
