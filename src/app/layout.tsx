import "./globals.css";
import type { Metadata } from "next";

// Root layout — provides the HTML shell and global CSS for ALL routes,
// including /admin and /login which live outside the [locale] segment.
// The locale-specific lang/dir attributes are set by the [locale] layout
// via a <body> className override (Next.js allows nested layouts to set
// attributes on inherited elements through the segment config).

export const metadata: Metadata = {
  verification: {
    google: "I7i4WPjVKGFLNmDp1CU-rGfErnVn_MEzd4sv9zshhpI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
