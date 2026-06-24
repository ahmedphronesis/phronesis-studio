import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Only English and Arabic are first-class supported.
  // Arabic is manually translated and reviewed; English is the source.
  // Other locales were removed because their MT output was not publication quality.
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, { native: string; english: string; dir: "ltr" | "rtl" }> = {
  en: { native: "English", english: "English", dir: "ltr" },
  ar: { native: "العربية", english: "Arabic", dir: "rtl" },
};

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
