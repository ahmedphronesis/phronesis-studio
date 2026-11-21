import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY: Record<"en" | "ar", {
  kicker: string;
  title: string;
  subtitle: string;
  badge: string;
  footer: string;
}> = {
  en: {
    kicker: "Current Engagement",
    title: "From Routine to Learning Design",
    subtitle:
      "On-site teacher training at Creative Learning International Center, Panglao, Bohol. An eight-module professional development program.",
    badge: "Live Now",
    footer: "phronesis-studio.com/en/engagements",
  },
  ar: {
    kicker: "النشاط الحالي",
    title: "من الروتين إلى تصميم التعلّم",
    subtitle:
      "تدريب المعلمين في مركز الإبداع للتعلّم الدولي، بانجلاو، بوهول، الفلبين.",
    badge: "جارٍ الآن",
    footer: "phronesis-studio.com/ar/engagements",
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
    readPublicImageAsDataUrl("engagements/clic-module1-group.jpg"),
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
