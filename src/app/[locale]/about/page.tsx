import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/og-about.png",
          width: 1200,
          height: 630,
          alt: "Studio of Phronesis — The Founder",
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: "/en/about",
        ar: "/ar/about",
      },
    },
  };
}

export default function AboutPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <About />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
