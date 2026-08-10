import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Method } from "@/components/sections/Method";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.method" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/method`,
      languages: {
        en: "/en/method",
        ar: "/ar/method",
      },
    },
  };
}

export default function MethodPage() {
  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Method />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
