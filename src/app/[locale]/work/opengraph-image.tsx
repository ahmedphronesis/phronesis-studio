import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Selected Work",
    title: "The Workshop",
    subtitle: "Production-grade systems across education, operations, and software.",
    badge: "View the systems",
    footer: "phronesis-studio.com/work",
  },
  ar: {
    kicker: "أعمال مختارة",
    title: "الورشة",
    subtitle: "أنظمة إنتاجية في التعليم والعمليات والبرمجيات.",
    badge: "شاهد الأنظمة",
    footer: "phronesis-studio.com/ar/work",
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
    readPublicImageAsDataUrl("engagements/clic-module1-training.jpg"),
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
