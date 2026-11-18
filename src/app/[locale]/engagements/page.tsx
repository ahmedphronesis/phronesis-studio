import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { EngagementsPageContent } from "@/components/sections/EngagementsPageContent";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAR = locale === "ar";
  const t = await getTranslations({ locale, namespace: "work" });
  const title = `${t("engagementsTitle")} · Studio of Phronesis`;
  const description = t("engagementsIntro");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://phronesis-studio.com/${locale}/engagements`,
      siteName: "Studio of Phronesis",
      locale: isAR ? "ar_AR" : "en_US",
    },
    alternates: {
      canonical: `/${locale}/engagements`,
      languages: { en: "/en/engagements", ar: "/ar/engagements" },
    },
  };
}

export default async function EngagementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <MouseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <EngagementsPageContent />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
