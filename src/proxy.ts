import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect /echoes/* → /philosophy/* (permanent, preserves old links + SEO)
  // Catches: /echoes, /en/echoes, /ar/echoes, /echoes/9, /echoes/season-1,
  // /echoes/history-of-philosophy, etc.
  // The /echoes substring only appears in the path segment, not in
  // /echoes-data.json (which has a file extension and is skipped by the
  // matcher before reaching here).
  if (pathname === "/echoes" || pathname.startsWith("/echoes/")) {
    const newPath = pathname.replace(/^\/echoes/, "/philosophy");
    const url = req.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, 308);
  }
  // Also catch localized variants: /en/echoes, /ar/echoes
  if (/^\/(en|ar)\/echoes(\/|$)/.test(pathname)) {
    const newPath = pathname.replace(/^\/(en|ar)\/echoes/, "/$1/philosophy");
    const url = req.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(req);
}

export const config = {
  // Skip i18n for: API routes, Next internals, Vercel internals,
  // admin portal + login (they live outside the [locale] segment),
  // and any path with a file extension (e.g. /logo.svg, /echoes-data.json).
  matcher: ["/((?!api|_next|_vercel|admin|login|.*\\..*).*)"],
};
