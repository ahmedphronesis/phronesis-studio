import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Library",
    title: "Original Curriculum",
    subtitle:
      "A bilingual library of original curricula by Ahmed Ali, built from first principles across mathematics, sciences, history, and literature.",
    footer: "phronesis-studio.com/library",
  },
  ar: {
    kicker: "المكتبة",
    title: "مناهج أصيلة",
    subtitle:
      "مكتبة ثنائية اللغة من المناهج الأصيلة لأحمد علي، مبنية من المبادئ الأولى في الرياضيات والعلوم والتاريخ والأدب.",
    footer: "phronesis-studio.com/ar/library",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
