import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Publications",
    title: "Depth of Knowledge",
    subtitle:
      "A Practical Guide to Designing Rigorous Questions Without AI. By Ahmed Ali. 2026. ISBN 979-8-1913137-5-7.",
    footer: "phronesis-studio.com/publications",
  },
  ar: {
    kicker: "إصدارات",
    title: "عمق المعرفة",
    subtitle:
      "دليل عملي لتصميم الأسئلة الصارمة دون الذكاء الاصطناعي. تأليف أحمد علي. ٢٠٢٦.",
    footer: "phronesis-studio.com/ar/publications",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
