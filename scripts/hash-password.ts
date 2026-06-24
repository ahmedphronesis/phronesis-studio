#!/usr/bin/env bun
/**
 * OPTIONAL: Generate a base64-encoded bcrypt hash for ADMIN_PASSWORD_HASH_B64.
 * Most users should just use ADMIN_PASSWORD (plaintext) in .env — simpler.
 *
 * Only use this if you want bcrypt hashing (e.g., to avoid plaintext in env).
 * Usage: bun scripts/hash-password.ts
 */
import * as bcrypt from "bcryptjs";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const password = await ask("Enter new admin password: ");
  if (password.length < 8) {
    console.error("Password must be at least 8 characters");
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, 12);
  // Base64-encode to avoid $-expansion issues in .env files
  const b64 = Buffer.from(hash, "utf8").toString("base64");
  console.log("\nPaste this into .env as ADMIN_PASSWORD_HASH_B64:\n");
  console.log(b64);
  console.log("\n(Remove ADMIN_PASSWORD if you're switching to the bcrypt path.)");
  rl.close();
}

main();
