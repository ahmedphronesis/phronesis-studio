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
  const description = "Verify the authenticity of a certificate issued by Ahmed Ali through Studio of Phronesis. Enter the certificate ID or scan the QR code to confirm the recipient's name and the modules completed under his training.";

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
