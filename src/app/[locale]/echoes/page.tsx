import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Echoes } from "@/components/sections/Echoes";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { getEpisodes } from "@/lib/episodes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.echoes" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/echoes`,
      languages: {
        en: "/en/echoes",
        ar: "/ar/echoes",
      },
    },
  };
}

export default async function EchoesPage() {
  const episodes = await getEpisodes();
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Echoes episodes={episodes} />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
