import "./globals.css";
import type { Metadata } from "next";
import { FloatingEagle } from "@/components/FloatingEagle";
import { getLocale } from "next-intl/server";

/**
 * Root layout — renders the HTML shell for ALL routes (public, admin, login).
 *
 * The <html lang> and <html dir> attributes are set SERVER-SIDE based on the
 * current request locale (via next-intl's getLocale()). For /en/* → lang="en"
 * dir="ltr"; for /ar/* → lang="ar" dir="rtl"; for /admin and /login (which
 * are outside the [locale] segment) → defaults to "en"/"ltr".
 *
 * This ensures SSR HTML is correct for crawlers and screen readers on the
 * very first byte — no client-side hydration needed to fix the language.
 */
export const metadata: Metadata = {
  verification: {
    google: "I7i4WPjVKGFLNmDp1CU-rGfErnVn_MEzd4sv9zshhpI",
    other: {
      "msvalidate.01": "62274B38A3DCB37F0CB0238AC08F507A",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Plausible Analytics — privacy-friendly, no cookies */}
        <script async src="https://plausible.io/js/pa-35ck-1FGbo3ZIVi_43OPr.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <FloatingEagle />
      </body>
    </html>
  );
}
