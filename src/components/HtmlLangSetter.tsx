"use client";

import { useEffect } from "react";

/**
 * Sets <html lang> and <html dir> attributes dynamically based on the
 * current locale. This is needed because the root layout provides a
 * static <html lang="en" dir="ltr"> (to serve all routes including
 * /admin and /login), and locale-specific attributes are updated
 * client-side after hydration.
 */
export function HtmlLangSetter({
  locale,
  dir,
}: {
  locale: string;
  dir: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
