import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [
    "en", "ar", "fa", "es", "fr", "zh", "ru", "tr", "pt", "hi", "ml"
  ],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, { native: string; english: string; dir: "ltr" | "rtl" }> = {
  en: { native: "English", english: "English", dir: "ltr" },
  ar: { native: "العربية", english: "Arabic", dir: "rtl" },
  fa: { native: "فارسی", english: "Persian", dir: "rtl" },
  es: { native: "Español", english: "Spanish", dir: "ltr" },
  fr: { native: "Français", english: "French", dir: "ltr" },
  zh: { native: "中文", english: "Mandarin", dir: "ltr" },
  ru: { native: "Русский", english: "Russian", dir: "ltr" },
  tr: { native: "Türkçe", english: "Turkish", dir: "ltr" },
  pt: { native: "Português", english: "Portuguese", dir: "ltr" },
  hi: { native: "हिन्दी", english: "Hindi", dir: "ltr" },
  ml: { native: "മലയാളം", english: "Malayalam", dir: "ltr" },
};

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
