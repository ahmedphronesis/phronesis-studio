import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Philosopher · Author · Educator · Trainer",
    title: "Studio of Phronesis",
    subtitle: "Practical wisdom applied to systems, classrooms, and the examined life.",
    badge: "Explore the practice",
    footer: "phronesis-studio.com",
  },
  ar: {
    kicker: "فيلسوف · كاتب · معلم · مدرّب",
    title: "ستوديو فرونسيس",
    subtitle: "الحكمة العملية مطبّقة على الأنظمة والفصول والحياة المتأمّلة.",
    badge: "استكشف الممارسة",
    footer: "phronesis-studio.com",
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
    readPublicImageAsDataUrl("hero-athens-poster.jpg"),
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
