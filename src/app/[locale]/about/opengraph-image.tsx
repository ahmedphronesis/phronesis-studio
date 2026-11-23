import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl, serveArabicOG } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "The Founder",
    title: "Ahmed Ali",
    subtitle: "Philosopher by training, teacher by qualification, builder by practice. Founder of Studio of Phronesis, established in Abu Dhabi, UAE.",
    badge: "Meet the founder",
    footer: "phronesis-studio.com/about",
  },
  ar: {
    kicker: "The Founder",
    title: "Ahmed Ali",
    subtitle: "Philosopher by training, teacher by qualification, builder by practice. Founder of Studio of Phronesis, established in Abu Dhabi, UAE.",
    badge: "Meet the founder",
    footer: "phronesis-studio.com/ar/about",
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
    return serveArabicOG("about");
  }

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
