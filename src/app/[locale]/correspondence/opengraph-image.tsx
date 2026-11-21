import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Correspondence",
    title: "Begin a Conversation",
    subtitle:
      "Whether your need is a custom system, a consultation, or instruction, describe the gap as you see it. Every enquiry receives a personal reply.",
    footer: "phronesis-studio.com/correspondence",
  },
  ar: {
    kicker: "مراسلات",
    title: "ابدأ الحوار",
    subtitle:
      "سواء كانت حاجتك نظاماً مخصصاً أو استشارة أو تدريساً، صف الفجوة كما تراها. كل رسالة تلقى رداً شخصياً.",
    footer: "phronesis-studio.com/ar/correspondence",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
