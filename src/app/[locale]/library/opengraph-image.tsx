import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl, serveArabicOG } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "The Library · Original Works",
    title: "Original Curriculum",
    subtitle: "A bilingual library of original curricula, built from first principles.",
    badge: "Browse the library",
    footer: "phronesis-studio.com/library",
  },
  ar: {
    kicker: "The Library · Original Works",
    title: "Original Curriculum",
    subtitle: "A bilingual library of original curricula, built from first principles.",
    badge: "Browse the library",
    footer: "phronesis-studio.com/ar/library",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Serve pre-generated Arabic OG (Satori doesn't support Arabic letter joining)
  if (locale === "ar") {
    return serveArabicOG("library");
  }

  const isAR = locale === "ar";
  const c = COPY[isAR ? "ar" : "en"];
  const [bg, assets] = await Promise.all([
    readPublicImageAsDataUrl("library/mathematics.jpg"),
    loadAssets(),
  ]);

  return new ImageResponse(
    ogTemplate({
      kicker: c.kicker,
      title: c.title,
      subtitle: c.subtitle,
      badge: c.badge,
      footer: c.footer,
      backgroundImage: bg,
      cover: true,
      eagle: assets.eagle,
      rtl: isAR,
    }),
    {
      ...size,
      fonts: fontsFromAssets(assets),
    }
  );
}
