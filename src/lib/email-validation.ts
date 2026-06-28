/**
 * Email validation utilities — catches common typos before saving leads.
 *
 * Two layers:
 * 1. Common typo detection: checks for known misspellings of popular domains
 *    (gmai.com → gmail.com, hotmai.con → hotmail.com, etc.)
 * 2. DNS MX record lookup: verifies the email domain actually has mail servers
 *    (catches completely fake domains like "test@randomstring.xyz")
 */

import { promises as dns } from "dns";

/** Common domain typos and their corrections */
const DOMAIN_TYPOS: Record<string, string> = {
  // Gmail
  "gmai.com": "gmail.com",
  "gmai.co": "gmail.com",
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  // Hotmail / Outlook
  "hotmai.com": "hotmail.com",
  "hotmai.con": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlok.con": "outlook.com",
  "outloook.com": "outlook.com",
  // Yahoo
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yhaoo.com": "yahoo.com",
  // Generic TLD typos
  ".con": ".com",
  ".cm": ".com",
  ".co": ".com",
  ".om": ".com",
  ".ned": ".net",
  ".nt": ".net",
  ".ogr": ".org",
  // Apple
  "iclod.com": "icloud.com",
  "icloud.con": "icloud.com",
  // Others
  "live.con": "live.com",
  "msn.con": "msn.com",
  "aol.con": "aol.com",
  "protonmail.con": "protonmail.com",
  "gmx.con": "gmx.com",
};

export interface EmailValidationResult {
  valid: boolean;
  suggestion?: string;
  error?: string;
}

/**
 * Check for common email domain typos.
 * Returns a suggestion if the domain looks like a typo of a known provider.
 */
export function checkEmailTypo(email: string): string | null {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return null;

  const domain = parts[1];

  // Check exact domain match
  if (DOMAIN_TYPOS[domain]) {
    return `${parts[0]}@${DOMAIN_TYPOS[domain]}`;
  }

  // Check for .con → .com, .cm → .com, etc. at the TLD level
  for (const [typo, correct] of Object.entries(DOMAIN_TYPOS)) {
    if (typo.startsWith(".") && domain.endsWith(typo)) {
      return `${parts[0]}@${domain.slice(0, -typo.length)}${correct}`;
    }
  }

  return null;
}

/**
 * Verify that a domain has MX (mail exchange) records.
 * This catches completely fake domains that can't receive email.
 * Uses DNS resolution with a 3-second timeout.
 *
 * Note: This runs server-side only (uses Node's dns module).
 */
export async function verifyDomainMX(email: string): Promise<boolean> {
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];

  try {
    // Set a timeout for DNS lookup
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DNS timeout")), 3000)
      ),
    ]);

    return records && records.length > 0;
  } catch {
    // If MX lookup fails, try A record (some domains use A records for email)
    try {
      const aRecords = await Promise.race([
        dns.resolve4(domain),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("DNS timeout")), 3000)
        ),
      ]);
      return aRecords && aRecords.length > 0;
    } catch {
      return false;
    }
  }
}

/**
 * Full email validation: format check + typo detection + MX record verification.
 * Returns the validation result with suggestion if a typo is detected.
 */
export async function validateEmail(
  email: string
): Promise<EmailValidationResult> {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: "Please enter a valid email address.",
    };
  }

  // Check for common typos
  const suggestion = checkEmailTypo(email);
  if (suggestion) {
    return {
      valid: false,
      error: `Did you mean ${suggestion}? Please check your email address.`,
      suggestion,
    };
  }

  // Verify domain has MX records (can actually receive email)
  const hasMX = await verifyDomainMX(email);
  if (!hasMX) {
    return {
      valid: false,
      error: "This email domain doesn't appear to accept email. Please check the address.",
    };
  }

  return { valid: true };
}
