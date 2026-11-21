import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "About",
    title: "Ahmed Ali",
    subtitle: "Philosopher by training. Teacher by qualification. Builder by practice. Founder of Studio of Phronesis.",
    badge: "Meet the founder",
    footer: "phronesis-studio.com/about",
  },
  ar: {
    kicker: "نبذة",
    title: "أحمد علي",
    subtitle: "فيلسوف تكويناً. معلم تأهيلاً. باني ممارسة. مؤسس ستوديو فرونسيس.",
    badge: "تعرّف على المؤسس",
    footer: "phronesis-studio.com/ar/about",
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
