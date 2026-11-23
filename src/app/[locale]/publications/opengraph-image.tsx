import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl, serveArabicOG } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Books · Written Works",
    title: "Depth of Knowledge",
    subtitle: "A Practical Guide to Designing Rigorous Questions Without AI. By Ahmed Ali. 2026.",
    badge: "Read the book",
    footer: "phronesis-studio.com/publications",
  },
  ar: {
    kicker: "Books · Written Works",
    title: "Depth of Knowledge",
    subtitle: "A Practical Guide to Designing Rigorous Questions Without AI. By Ahmed Ali. 2026.",
    badge: "Read the book",
    footer: "phronesis-studio.com/ar/publications",
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
    return serveArabicOG("publications");
  }

  const isAR = locale === "ar";
  const c = COPY[isAR ? "ar" : "en"];
  const [bg, assets] = await Promise.all([
    readPublicImageAsDataUrl("publications/depth-of-knowledge-front.jpg"),
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
