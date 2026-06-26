import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.correspondence" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/correspondence`,
      languages: {
        en: "/en/correspondence",
        ar: "/ar/correspondence",
      },
    },
  };
}

export default function CorrespondencePage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Contact />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
