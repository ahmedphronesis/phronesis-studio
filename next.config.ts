import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Vercel handles build output itself; `standalone` was for self-hosting
  // (Caddy + .zscripts/start.sh) which has been removed.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  serverExternalPackages: ["@prisma/client"],
};

export default withNextIntl(nextConfig);
