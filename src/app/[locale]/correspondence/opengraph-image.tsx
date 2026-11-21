import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Correspondence",
    title: "Begin a Conversation",
    subtitle: "Describe the gap as you see it. Every enquiry receives a personal reply.",
    badge: "Start a conversation",
    footer: "phronesis-studio.com/correspondence",
  },
  ar: {
    kicker: "مراسلات",
    title: "ابدأ الحوار",
    subtitle: "صف الفجوة كما تراها. كل رسالة تلقى رداً شخصياً.",
    badge: "ابدأ الحوار",
    footer: "phronesis-studio.com/ar/correspondence",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAR = locale === "ar";
  const c = COPY[isAR ? "ar" : "en"];
  const [bg, assets] = await Promise.all([
    readPublicImageAsDataUrl("founder-portrait.jpg"),
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
