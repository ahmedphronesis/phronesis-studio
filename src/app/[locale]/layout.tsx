import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, localeNames, type Locale } from "@/i18n/routing";
import { Cormorant_Garamond, Inter, Source_Serif_4, JetBrains_Mono, Amiri } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";
import { OrganizationJsonLd, WebSiteJsonLd, PersonJsonLd } from "@/components/JsonLd";

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
    default: "Ahmed Ali · Studio of Phronesis",
    template: "%s · Studio of Phronesis",
  },
  verification: {
    google: "I7i4WPjVKGFLNmDp1CU-rGfErnVn_MEzd4sv9zshhpI",
    other: {
      "msvalidate.01": "62274B38A3DCB37F0CB0238AC08F507A",
    },
  },
  description:
    "Ahmed Ali is a philosopher, educator, and systems architect based in Al Ain, UAE. He builds custom software systems, publishes bilingual philosophical work, and teaches. His practice inherits the polymath ideal of the classical Islamic tradition.",
  keywords: [
    "Ahmed Ali",
    "Ahmed Ali philosopher",
    "Ahmed Ali UAE",
    "Ahmed Ali Al Ain",
    "Ahmed Ali philosopher UAE",
    "Ahmed Ali systems architect",
    "Ahmed Ali educator",
    "Ahmed Ali polymath",
    "Ahmed Ali author",
    "Ahmed Ali writer",
    "Ahmed Ali developer",
    "Ahmed Ali consultant",
    "Ahmed Ali teacher",
    "Ahmed Ali tutor",
    "Ahmed Ali thinker",
    "Ahmed Ali scholar",
    "Ahmed Ali Studio of Phronesis",
    "Ahmed Ali Echoes of Wisdom",
    "Ahmed Ali philosophy podcast",
    "احمد علي",
    "احمد علي فيلسوف",
    "احمد علي الامارات",
    "احمد علي العين",
    "احمد علي معلم",
    "احمد علي مفكر",
    "Studio of Phronesis",
    "phronesis",
    "philosopher",
    "philosophy",
    "contemporary philosophy",
    "contemporary philosopher",
    "Arab philosophy",
    "Arab philosophers",
    "Arabic philosophy",
    "Egyptian philosopher",
    "Islamic philosophy",
    "Islamic philosopher",
    "Muslim philosopher",
    "scholar",
    "academic",
    "polymath",
    "thinker",
    "intellectual",
    "educator",
    "teacher",
    "tutor",
    "professor",
    "lecturer",
    "curriculum designer",
    "curriculum design",
    "educational platforms",
    "educational technology",
    "learning platform",
    "online learning",
    "bilingual education",
    "bilingual curriculum",
    "bilingual mathematics",
    "mathematics curriculum",
    "custom software",
    "software architect",
    "software development",
    "web developer",
    "web development",
    "website builder",
    "systems design",
    "systems architect",
    "systems thinking",
    "real estate software",
    "real estate website",
    "real estate dashboard",
    "property management software",
    "financial systems",
    "operational systems",
    "Model United Nations",
    "MUN",
    "philosophy podcast",
    "philosophy podcast Arabic",
    "echoes of wisdom",
    "echoes of wisdom podcast",
    "consultation",
    "consulting",
    "advisory",
    "mentorship",
    "Al Ain",
    "UAE",
    "Abu Dhabi",
    "United Arab Emirates",
    "Egypt",
    "Alexandria",
    "Cairo",
    "Al-Azhar University",
    "Alexandria University",
    "Emory University",
    "Bibliotheca Alexandrina",
    "Ain Al Khaleej Private School",
    "ADEK",
    "Abu Dhabi Department of Education and Knowledge",
    "Rahimjon Abdugafurov",
    "Ashraf Hassan Mansour",
    "Salah A. Soliman",
    "Rehmatullah Baridaie",
    "Plato",
    "Aristotle",
    "Socrates",
    "Ibn Rushd",
    "Averroes",
    "Ibn Sina",
    "Avicenna",
    "Al-Farabi",
    "Al-Ghazali",
    "Ibn Khaldun",
    "Descartes",
    "Nietzsche",
    "Kant",
    "Spinoza",
    "Wittgenstein",
    "Foucault",
    "Stoicism",
    "epistemology",
    "ethics",
    "metaphysics",
    "logic",
    "aesthetics",
    "permaculture",
    "sustainable agriculture",
    "renewable energy",
    "natural sciences",
    "history of philosophy",
    "comparative theology",
    "psychology",
    "literature",
    "languages",
    "economics",
    "political science",
    "practical wisdom",
    "Aristotelian phronesis",
    "gap analysis",
    "operational excellence",
    "process improvement",
    "digital transformation",
    "custom software development UAE",
    "software developer Al Ain",
    "philosophy teacher UAE",
    "philosophy tutor UAE",
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
    url: "https://phronesis-studio.com/en",
    siteName: "Studio of Phronesis",
    title: "Ahmed Ali · Studio of Phronesis",
    description:
      "Ahmed Ali is a philosopher, educator, and systems architect based in Al Ain, UAE. He builds custom software systems, publishes bilingual philosophical work, and teaches. His practice inherits the polymath ideal of the classical Islamic tradition.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studio of Phronesis · Ahmed Ali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Ali · Studio of Phronesis",
    description:
      "Ahmed Ali: philosopher, educator, and systems architect in Al Ain, UAE. Custom software, bilingual philosophical work, and teaching.",
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon-512x512.png", color: "#0F5C5E" },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#0F5C5E",
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
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <PersonJsonLd />
      <NextIntlClientProvider>
        {children}
      </NextIntlClientProvider>
      <Toaster />
      <SonnerToaster position="bottom-right" />
    </div>
  );
}
