#!/usr/bin/env bash
/**
 * Translate using z-ai CLI (which has proper timeout handling).
 * Usage: bun run scripts/translate-cli.ts <locale>
 */
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: bun run scripts/translate-cli.ts <locale>");
  process.exit(1);
}

const NOTES: Record<string, { name: string; native: string; notes: string }> = {
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

function translateChunkCLI(sectionKey: string, sectionData: Record<string, string>): Record<string, string> {
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

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Use timeout command to kill the CLI if it hangs
      const result = execSync(
        `timeout 60 z-ai chat -m glm-4.6 -p '${prompt.replace(/'/g, "'\\''")}'`,
        { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, timeout: 65000 }
      );

      // Parse the CLI output to extract the content
      const match = result.match(/"content":\s*"([\s\S]*?)",\s*"role"/);
      if (!match) {
        // Try alternative parsing
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const content = parsed.choices?.[0]?.message?.content || "";
          const contentMatch = content.match(/\{[\s\S]*\}/);
          if (contentMatch) return JSON.parse(contentMatch[0]);
        }
        throw new Error("could not parse CLI output");
      }

      // The content field has escaped JSON — unescape it
      let content = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
      const contentMatch = content.match(/\{[\s\S]*\}/);
      if (contentMatch) return JSON.parse(contentMatch[0]);

      throw new Error("no JSON in content");
    } catch (err) {
      console.error(`  ⚠ ${sectionKey} attempt ${attempt} failed: ${err}`);
      if (attempt < 3) {
        execSync("sleep 5");
      }
    }
  }

  console.error(`  ✗ ${sectionKey} using English fallback`);
  return sectionData;
}

console.log(`\n=== Translating to ${info.name} (${locale}) ===`);

const translated: Record<string, Record<string, string>> = {};
const sections = Object.keys(enMessages);

for (const section of sections) {
  process.stdout.write(`  ${section}... `);
  try {
    translated[section] = translateChunkCLI(section, enMessages[section]);
    console.log("✓");
  } catch (err) {
    console.error(`✗`);
    translated[section] = enMessages[section];
  }
  // 3 second delay between sections
  execSync("sleep 3");
}

const outPath = `/home/z/my-project/src/messages/${locale}.json`;
writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");

const heroName = translated.hero?.name || "?";
console.log(`\n✓ Written to ${outPath}`);
console.log(`  hero.name = "${heroName}"`);
