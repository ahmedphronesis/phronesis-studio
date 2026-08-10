import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "phronesis_admin_session";
const SESSION_TTL_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

/**
 * Verify admin login.
 * Supports two env configurations:
 *
 * 1. ADMIN_PASSWORD (plaintext, simplest for single-admin):
 *    Stored as plain text in .env / Vercel env vars.
 *    Compared with timing-safe equality.
 *
 * 2. ADMIN_PASSWORD_HASH (bcrypt, more secure):
 *    Stored as bcrypt hash. NOTE: bcrypt hashes contain $ characters
 *    which env parsers may mangle. Use base64 encoding (ADMIN_PASSWORD_HASH_B64)
 *    to avoid this issue entirely.
 */
export async function verifyLogin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("ADMIN_EMAIL is not set");

  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) return false;

  // Plaintext path (simplest, recommended for single-admin)
  const plaintext = process.env.ADMIN_PASSWORD;
  if (plaintext) {
    return timingSafeEqual(password, plaintext);
  }

  // bcrypt hash path (base64-encoded to avoid $-expansion issues)
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (hashB64) {
    try {
      const hash = Buffer.from(hashB64, "base64").toString("utf8");
      return bcrypt.compareSync(password, hash);
    } catch {
      return false;
    }
  }

  throw new Error(
    "No admin password configured. Set either ADMIN_PASSWORD or ADMIN_PASSWORD_HASH_B64 in .env"
  );
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret());
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
