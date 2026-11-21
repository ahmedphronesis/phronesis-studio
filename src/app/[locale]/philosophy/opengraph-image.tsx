import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Philosophy · Podcast",
    title: "Echoes of Wisdom",
    subtitle:
      "A bilingual philosophy podcast by Ahmed Ali. Sixteen episodes across two seasons, exploring ethics, logic, epistemology, and metaphysics.",
    footer: "phronesis-studio.com/philosophy",
  },
  ar: {
    kicker: "الفلسفة · بودكاست",
    title: "أصداء الحكمة",
    subtitle:
      "بودكاست فلسفي ثنائي اللغة لأحمد علي. ستة عشر حلقة في موسمين تستكشف الأخلاق والمنطق ونظرية المعرفة والميتافيزيقا.",
    footer: "phronesis-studio.com/ar/philosophy",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
