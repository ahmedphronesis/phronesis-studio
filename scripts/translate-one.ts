#!/usr/bin/env bun
/**
 * Translate to a single language. Usage: bun run scripts/translate-one.ts <locale>
 */
import ZAI from "z-ai-web-dev-sdk";
import { readFileSync, writeFileSync } from "fs";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-one.ts <locale>");
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
  console.error(`Unknown locale: ${locale}`);
  process.exit(1);
}

const enJson = readFileSync("/home/z/my-project/src/messages/en.json", "utf8");

async function main() {
  console.log(`Translating to ${info.name} (${locale})...`);
  const zai = await ZAI.create();

  const prompt = `You are a master translator specializing in academic and philosophical texts. Translate the following JSON from English to ${info.name} (${info.native}).

CRITICAL TRANSLATION PRINCIPLES:
1. This is for a philosopher-educator's professional portfolio. Academic, literary, dignified tone.
2. ${info.notes}
3. Preserve all JSON keys exactly. Only translate values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001) in original form.
5. Keep brand names ("Studio of Phronesis", "Real Estate Emperor", "MSCS Academy", "DiplomatiQ", "Echoes of Wisdom") in English.
6. Keep currency (AED) and numbers as-is.
7. Return ONLY valid JSON, no commentary, no markdown fences.

Source JSON:
${enJson}

Return the ${info.name} translation:`;

  const response = await zai.chat.completions.create({
    model: "glm-4.6",
    messages: [
      { role: "system", content: "You are a master translator. Return only valid JSON." },
      { role: "user", content: prompt },
    ],
    thinking: { type: "disabled" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "";
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("No JSON found in response");
    process.exit(1);
  }

  const translated = JSON.parse(match[0]);
  writeFileSync(`/home/z/my-project/src/messages/${locale}.json`, JSON.stringify(translated, null, 2) + "\n");
  console.log(`✓ Written to src/messages/${locale}.json`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
