import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip i18n for: API routes, Next internals, Vercel internals,
  // admin portal + login (they live outside the [locale] segment),
  // and any path with a file extension (e.g. /logo.svg, /echoes-data.json).
  matcher: ["/((?!api|_next|_vercel|admin|login|.*\\..*).*)"],
};
