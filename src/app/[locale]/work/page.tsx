import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Work } from "@/components/sections/Work";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.work" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/work`,
      languages: {
        en: "/en/work",
        ar: "/ar/work",
      },
    },
  };
}

export default function WorkPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Work />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
