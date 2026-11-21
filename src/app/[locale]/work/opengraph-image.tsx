import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Selected Work",
    title: "The Workshop",
    subtitle:
      "Production-grade systems across education, operations, and software. Each one a separate practice with its own case studies.",
    footer: "phronesis-studio.com/work",
  },
  ar: {
    kicker: "أعمال مختارة",
    title: "الورشة",
    subtitle:
      "أنظمة إنتاجية في التعليم والعمليات والبرمجيات. كل ممارسة بدراسات حالتها الخاصة.",
    footer: "phronesis-studio.com/ar/work",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
