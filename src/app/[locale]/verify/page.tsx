import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MouseProvider } from "@/components/anim";
import { CertificateVerifier } from "@/components/sections/CertificateVerifier";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = "Certificate Verification · Studio of Phronesis";
  const description = "Verify the authenticity of a Studio of Phronesis professional development certificate. Enter the certificate ID or scan the QR code on the certificate to confirm attendance and completion.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://phronesis-studio.com/${locale}/verify`,
      siteName: "Studio of Phronesis",
    },
    alternates: {
      canonical: `/${locale}/verify`,
      languages: { en: "/en/verify", ar: "/ar/verify" },
    },
  };
}

export default async function VerifyPage({
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
          <CertificateVerifier />
        </main>
        <Footer />
      </div>
    </MouseProvider>
  );
}
