import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Philosophy",
    title: "Echoes of Wisdom & History of Philosophy",
    subtitle: "A bilingual podcast and a comprehensive history of philosophy project — from A to Z.",
    badge: "Explore both projects",
    footer: "phronesis-studio.com/philosophy",
  },
  ar: {
    kicker: "الفلسفة",
    title: "أصداء الحكمة وتاريخ الفلسفة",
    subtitle: "بودكاست ثنائي اللغة ومشروع شامل لتاريخ الفلسفة — من الألف إلى الياء.",
    badge: "استكشف المشروعين",
    footer: "phronesis-studio.com/ar/philosophy",
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
