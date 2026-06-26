import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Library } from "@/components/sections/Library";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.library" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/library`,
      languages: {
        en: "/en/library",
        ar: "/ar/library",
      },
    },
  };
}

export default function LibraryPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Library />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
