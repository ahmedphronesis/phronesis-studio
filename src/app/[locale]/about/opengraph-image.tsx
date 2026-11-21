import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "About",
    title: "Ahmed Ali",
    subtitle:
      "Philosopher by training. Teacher by qualification. Builder by practice. Founder of Studio of Phronesis.",
    footer: "phronesis-studio.com/about",
  },
  ar: {
    kicker: "نبذة",
    title: "أحمد علي",
    subtitle:
      "فيلسوف تكويناً. معلم تأهيلاً. باني ممارسة. مؤسس ستوديو فرونسيس.",
    footer: "phronesis-studio.com/ar/about",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
