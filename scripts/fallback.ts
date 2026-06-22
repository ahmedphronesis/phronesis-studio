#!/usr/bin/env bun
/**
 * For languages that haven't been translated yet, create a fallback
 * that uses English values. This lets the site work in all 11 locales
 * immediately. Real translations will replace these.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const REMAINING = ["ar", "fa", "zh", "ru", "tr", "pt", "hi", "ml"];
const enJson = readFileSync("/home/z/my-project/src/messages/en.json", "utf8");
const en = JSON.parse(enJson);

for (const locale of REMAINING) {
  const path = `/home/z/my-project/src/messages/${locale}.json`;
  if (existsSync(path)) {
    console.log(`✓ ${locale} already exists`);
    continue;
  }
  // Copy English as fallback
  writeFileSync(path, JSON.stringify(en, null, 2) + "\n");
  console.log(`✓ Created fallback for ${locale}`);
}
console.log("Done");
