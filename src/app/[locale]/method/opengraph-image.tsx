import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "The Method",
    title: "Phronesis",
    subtitle: "Four movements. The same discipline Aristotle described, applied to a system instead of a soul.",
    badge: "See the method",
    footer: "phronesis-studio.com/method",
  },
  ar: {
    kicker: "The Method",
    title: "Phronesis",
    subtitle: "Four movements. The same discipline Aristotle described, applied to a system instead of a soul.",
    badge: "See the method",
    footer: "phronesis-studio.com/ar/method",
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
    readPublicImageAsDataUrl("vitruvian-man.jpg"),
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
      objectFit: "contain",
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
