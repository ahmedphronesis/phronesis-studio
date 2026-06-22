import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed Ali — Studio of Phronesis",
  description:
    "The art of seeing the gap and closing it well. Custom software, SaaS platforms, and educational systems built by a philosopher-builder. Live production work across property management, learning platforms, and diplomatic training.",
  keywords: [
    "Ahmed Ali",
    "Phronesis",
    "Studio of Phronesis",
    "custom software",
    "SaaS development",
    "UAE developer",
    "property management software",
    "educational platforms",
    "Next.js developer",
    "philosopher-builder",
  ],
  authors: [{ name: "Ahmed Ali" }],
  creator: "Ahmed Ali",
  openGraph: {
    title: "Ahmed Ali — Studio of Phronesis",
    description:
      "The art of seeing the gap and closing it well. Custom software, SaaS platforms, and educational systems.",
    url: "https://phronesis-studio.com",
    siteName: "Studio of Phronesis",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Ali — Studio of Phronesis",
    description:
      "The art of seeing the gap and closing it well. Custom software, SaaS platforms, and educational systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </body>
    </html>
  );
}
