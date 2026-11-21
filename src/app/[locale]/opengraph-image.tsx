import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Philosopher · Author · Educator · Trainer",
    title: "Ahmed Ali",
    subtitle:
      "Studio of Phronesis. Practical wisdom applied to systems, classrooms, and the examined life.",
    footer: "phronesis-studio.com",
  },
  ar: {
    kicker: "فيلسوف · كاتب · معلم · مدرّب",
    title: "أحمد علي",
    subtitle:
      "ستوديو فرونسيس. الحكمة العملية مطبّقة على الأنظمة والفصول والحياة المتأمّلة.",
    footer: "phronesis-studio.com",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
