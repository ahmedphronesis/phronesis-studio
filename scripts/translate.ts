#!/usr/bin/env bun
/**
 * Generate academic translations — resume from where we stopped.
 * Skip locales that already have a translation file.
 */
import ZAI from "z-ai-web-dev-sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";

const LOCALES: { code: string; name: string; native: string; notes: string }[] = [
  { code: "ar", name: "Arabic", native: "العربية", notes: "Use Modern Standard Arabic (فصحى). Preserve philosophical terminology. Phronesis = فرونسيس (practical wisdom). Use academic register suitable for a philosopher's portfolio." },
  { code: "fa", name: "Persian", native: "فارسی", notes: "Use formal Persian. Preserve philosophical terminology. Phronesis = فرونسیس (practical wisdom). Academic register." },
  { code: "zh", name: "Mandarin", native: "中文", notes: "Use formal written Chinese (书面语). Phronesis = 实践智慧 (practical wisdom). Academic and literary register." },
  { code: "ru", name: "Russian", native: "Русский", notes: "Use formal Russian. Phronesis = фронезис (Aristotle's term). Academic philosophical register." },
  { code: "tr", name: "Turkish", native: "Türkçe", notes: "Use formal Turkish. Phronesis = fronesis. Academic register." },
  { code: "pt", name: "Portuguese", native: "Português", notes: "Use formal academic Portuguese. Phronesis = frónesis. Philosophical register." },
  { code: "hi", name: "Hindi", native: "हिन्दी", notes: "Use formal Hindi. Phronesis = व्यावहारिक ज्ञान. Academic register." },
  { code: "ml", name: "Malayalam", native: "മലയാളം", notes: "Use formal Malayalam. Phronesis = പ്രായോഗിക ജ്ഞാനം. Academic register." },
];

const enJson = readFileSync("/home/z/my-project/src/messages/en.json", "utf8");

async function translate() {
  const zai = await ZAI.create();

  for (const locale of LOCALES) {
    const targetPath = `/home/z/my-project/src/messages/${locale.code}.json`;
    if (existsSync(targetPath)) {
      console.log(`✓ ${locale.code} already exists, skipping`);
      continue;
    }

    console.log(`\n=== Translating to ${locale.name} (${locale.code}) ===`);

    const prompt = `You are a master translator specializing in academic and philosophical texts. Translate the following JSON from English to ${locale.name} (${locale.native}).

CRITICAL TRANSLATION PRINCIPLES:
1. This is for a philosopher-educator's professional portfolio. The tone must be academic, literary, and dignified — NOT literal, NOT casual, NOT marketing-speak.
2. ${locale.notes}
3. Preserve all JSON keys exactly as they are. Only translate the values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001, etc.) in their original form.
5. Keep brand names ("Studio of Phronesis", "Real Estate Emperor", "MSCS Academy", "DiplomatiQ", "Echoes of Wisdom") in their original English form.
6. Keep currency amounts (AED) and numbers as-is.
7. The phrase "phronesis" should be transliterated or translated according to the language's philosophical tradition.
8. Maintain the elegant, manuscript-like voice — as if translating a letter from a philosopher.
9. Return ONLY the JSON, no commentary, no markdown fences.

Source JSON (English):
${enJson}

Return the translated JSON for ${locale.name}:`;

    try {
      const response = await zai.chat.completions.create({
        model: "glm-4.6",
        messages: [
          { role: "system", content: "You are a master translator of academic and philosophical texts. You return only valid JSON, no commentary." },
          { role: "user", content: prompt },
        ],
        thinking: { type: "disabled" },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || "";
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error(`  ✗ No JSON found in response for ${locale.code}`);
        continue;
      }

      const translated = JSON.parse(match[0]);
      writeFileSync(targetPath, JSON.stringify(translated, null, 2) + "\n");
      console.log(`  ✓ Written to src/messages/${locale.code}.json`);
    } catch (err) {
      console.error(`  ✗ Error translating ${locale.code}: ${err}`);
    }
  }
  console.log("\n=== All translations complete ===");
}

translate().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
