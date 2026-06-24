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
  title: "Ahmed Ali — Studio of Phronesis",
  description:
    "The art of seeing the gap and closing it well. Custom software, educational platforms, and operational systems built by a philosopher-educator-architect.",
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
