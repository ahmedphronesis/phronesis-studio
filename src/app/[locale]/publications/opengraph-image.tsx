import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Publications",
    title: "Depth of Knowledge",
    subtitle: "A Practical Guide to Designing Rigorous Questions Without AI. By Ahmed Ali. 2026.",
    badge: "Read the book",
    footer: "phronesis-studio.com/publications",
  },
  ar: {
    kicker: "إصدارات",
    title: "عمق المعرفة",
    subtitle: "دليل عملي لتصميم الأسئلة الصارمة دون الذكاء الاصطناعي. تأليف أحمد علي. ٢٠٢٦.",
    badge: "اقرأ الكتاب",
    footer: "phronesis-studio.com/ar/publications",
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
