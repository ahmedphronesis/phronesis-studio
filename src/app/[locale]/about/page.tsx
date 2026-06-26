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
