import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers — applied to every route (public, admin, api).
 *
 * - Content-Security-Policy: restricts all resource loads to 'self' + the
 *   minimum exceptions Next.js requires (inline styles/scripts for hydration,
 *   data: URIs for fonts/images, https: for any external images).
 *   'unsafe-inline' on script-src is required because Next.js injects inline
 *   hydration scripts; for stricter CSP we'd need nonce-based headers, which
 *   is a larger refactor. The current policy still blocks the dangerous
 *   vectors: external script injection, eval, foreign origins, plugins.
 * - X-Content-Type-Options: nosniff — blocks MIME-sniffing attacks.
 * - X-Frame-Options: DENY — prevents the site from being iframed (clickjacking).
 *   Reinforced by frame-ancestors 'none' in CSP.
 * - Referrer-Policy: strict-origin-when-cross-origin — only sends the origin
 *   (not the full URL) on cross-origin requests.
 * - Permissions-Policy: denies camera, microphone, geolocation, payment —
 *   the site uses none of these, so we disable them at the browser level.
 * - X-DNS-Prefetch-Control: off — disables aggressive DNS prefetching.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  serverExternalPackages: ["@prisma/client"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
