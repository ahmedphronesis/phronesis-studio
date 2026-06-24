import "./globals.css";

// Root layout — provides the HTML shell and global CSS for ALL routes,
// including /admin and /login which live outside the [locale] segment.
// The locale-specific lang/dir attributes are set by the [locale] layout
// via a <body> className override (Next.js allows nested layouts to set
// attributes on inherited elements through the segment config).
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
