import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Method",
    title: "Phronesis",
    subtitle:
      "Four movements. The same discipline Aristotle described, applied to a system instead of a soul: Perceive, Diagnose, Close, Embed.",
    footer: "phronesis-studio.com/method",
  },
  ar: {
    kicker: "المنهج",
    title: "فرونسيس",
    subtitle:
      "أربع حركات. الانضباط نفسه الذي وصفه أرسطو، مطبّقاً على نظام بدلاً من نفس: الإدراك، التشخيص، الإغلاق، التضمين.",
    footer: "phronesis-studio.com/ar/method",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
