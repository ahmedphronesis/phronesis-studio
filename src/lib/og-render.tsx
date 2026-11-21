import { ImageResponse } from "next/og";
import { ogTemplate, loadAssets, fontsFromAssets, type OGParams } from "@/lib/og-template";

/**
 * Render a default (cream-paper) OG card from page-specific COPY.
 * Each per-page opengraph-image.tsx file imports this and supplies its copy.
 * NOTE: `runtime`, `size`, `contentType` must be declared statically in each
 * route file — Next.js requires them to be statically analyzable.
 */
export async function renderDefaultOG(
  params: Promise<{ locale: string }>,
  copy: Record<"en" | "ar", Omit<OGParams, "eagle" | "cover" | "backgroundImage">>
) {
  const { locale } = await params;
  const isAR = locale === "ar";
  const c = copy[isAR ? "ar" : "en"];
  const assets = await loadAssets();
  return new ImageResponse(
    ogTemplate({ ...c, eagle: assets.eagle, rtl: isAR }),
    {
      width: 1200,
      height: 630,
      fonts: fontsFromAssets(assets),
    }
  );
}
