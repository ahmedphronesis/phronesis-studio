import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Philosophy · Podcast",
    title: "Echoes of Wisdom",
    subtitle: "A bilingual philosophy podcast by Ahmed Ali. Sixteen episodes across two seasons.",
    badge: "Listen to episodes",
    footer: "phronesis-studio.com/philosophy",
  },
  ar: {
    kicker: "الفلسفة · بودكاست",
    title: "أصداء الحكمة",
    subtitle: "بودكاست فلسفي ثنائي اللغة لأحمد علي. ستة عشر حلقة في موسمين.",
    badge: "استمع للحلقات",
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
