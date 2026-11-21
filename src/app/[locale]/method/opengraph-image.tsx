import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Method",
    title: "Phronesis",
    subtitle: "Four movements applied to a system instead of a soul: Perceive, Diagnose, Close, Embed.",
    badge: "See the method",
    footer: "phronesis-studio.com/method",
  },
  ar: {
    kicker: "المنهج",
    title: "فرونسيس",
    subtitle: "أربع حركات مطبّقة على نظام: الإدراك، التشخيص، الإغلاق، التضمين.",
    badge: "شاهد المنهج",
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
