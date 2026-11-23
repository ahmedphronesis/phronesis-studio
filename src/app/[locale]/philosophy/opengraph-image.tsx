import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl, serveArabicOG } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Original Philosophy",
    title: "Echoes of Wisdom & History of Philosophy",
    subtitle: "Original philosophical projects bridging academic thought and public discourse. A bilingual podcast and a comprehensive history of philosophy — from A to Z.",
    badge: "Explore both projects",
    footer: "phronesis-studio.com/philosophy",
  },
  ar: {
    kicker: "Original Philosophy",
    title: "Echoes of Wisdom & History of Philosophy",
    subtitle: "Original philosophical projects bridging academic thought and public discourse. A bilingual podcast and a comprehensive history of philosophy — from A to Z.",
    badge: "Explore both projects",
    footer: "phronesis-studio.com/ar/philosophy",
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
    return serveArabicOG("philosophy");
  }

  const isAR = locale === "ar";
  const c = COPY[isAR ? "ar" : "en"];
  const [bg, assets] = await Promise.all([
    readPublicImageAsDataUrl("school-of-athens-faded.jpg"),
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
      objectPosition: "center center",
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
