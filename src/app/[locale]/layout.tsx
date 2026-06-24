import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, localeNames, type Locale } from "@/i18n/routing";
import { Cormorant_Garamond, Inter, Source_Serif_4, JetBrains_Mono, Amiri } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";

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

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://phronesis-studio.com"),
  title: {
    default: "Studio of Phronesis — Ahmed Ali",
    template: "%s · Studio of Phronesis",
  },
  description:
    "The art of seeing the gap and closing it well. Custom software, educational platforms, and operational systems built by a philosopher-educator-architect.",
  keywords: [
    "Studio of Phronesis",
    "Ahmed Ali",
    "philosopher",
    "educator",
    "systems architect",
    "Al Ain",
    "UAE",
    "custom software",
    "educational platforms",
    "Model United Nations",
    "MUN",
    "philosophy",
    "phronesis",
    "Aristotle",
    "Bibliotheca Alexandrina",
    "tutoring",
    "consultancy",
    "curriculum design",
    "real estate software",
    "property management",
  ],
  authors: [{ name: "Ahmed Ali" }],
  creator: "Ahmed Ali",
  publisher: "Studio of Phronesis",
  applicationName: "Studio of Phronesis",
  category: "education",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AR"],
    url: "https://phronesis-studio.com",
    siteName: "Studio of Phronesis",
    title: "Studio of Phronesis — Ahmed Ali",
    description:
      "The art of seeing the gap and closing it well. Custom software, educational platforms, and operational systems built by a philosopher-educator-architect.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Φ — Studio of Phronesis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio of Phronesis — Ahmed Ali",
    description:
      "The art of seeing the gap and closing it well. Custom software, educational platforms, and operational systems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo-eagle.png", type: "image/png" }],
    apple: [{ url: "/logo-eagle.png" }],
    shortcut: [{ url: "/logo-eagle.png" }],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const localeInfo = localeNames[locale as Locale];

  return (
    <div
      className={`${cormorant.variable} ${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${amiri.variable} bg-background text-foreground`}
    >
      <HtmlLangSetter locale={locale} dir={localeInfo.dir} />
      <NextIntlClientProvider>
        {children}
      </NextIntlClientProvider>
      <Toaster />
      <SonnerToaster position="bottom-right" />
    </div>
  );
}
