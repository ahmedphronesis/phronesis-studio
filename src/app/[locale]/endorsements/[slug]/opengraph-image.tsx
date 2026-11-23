import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, readPublicImageAsDataUrl } from "@/lib/og-template";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Dr. Frank Höselbarth",
    title: "Letter of Endorsement",
    subtitle: "For Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI (2026). Philosopher and author of The Education Revolution in the Gulf and the German Industry.",
    badge: "Read the letter",
    footer: "phronesis-studio.com/endorsements/dr-frank-hoselbarth",
  },
  ar: {
    kicker: "Dr. Frank Höselbarth",
    title: "Letter of Endorsement",
    subtitle: "For Depth of Knowledge: A Practical Guide to Designing Rigorous Questions Without AI (2026). Philosopher and author of The Education Revolution in the Gulf and the German Industry.",
    badge: "Read the letter",
    footer: "phronesis-studio.com/ar/endorsements/dr-frank-hoselbarth",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  const isAR = locale === "ar";

  // Serve pre-generated Arabic OG (Satori doesn't support Arabic letter joining)
  // For now, fall through to ImageResponse for both EN and AR —
  // the Arabic version will be regenerated via PIL script and served via
  // a separate route. For the moment, use the same English cover image.

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
