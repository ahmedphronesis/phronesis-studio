import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl, serveArabicOG } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Work with me",
    title: "Start a Conversation",
    subtitle: "A single line or a brief paragraph will suffice. Describe the gap as you see it.",
    badge: "Start a conversation",
    footer: "phronesis-studio.com/correspondence",
  },
  ar: {
    kicker: "Work with me",
    title: "Start a Conversation",
    subtitle: "A single line or a brief paragraph will suffice. Describe the gap as you see it.",
    badge: "Start a conversation",
    footer: "phronesis-studio.com/ar/correspondence",
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
    return serveArabicOG("correspondence");
  }

  const isAR = locale === "ar";
  const c = COPY[isAR ? "ar" : "en"];
  const [bg, assets] = await Promise.all([
    // Use the dedicated correspondence photograph (NOT the generic founder-portrait.jpg)
    readPublicImageAsDataUrl("founder-portrait-correspondence.jpg"),
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
      objectPosition: "center 20%",
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
