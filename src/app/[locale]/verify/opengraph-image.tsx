import { renderDefaultOG } from "@/lib/og-render";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = {
  en: {
    kicker: "Verify",
    title: "Certificate Verification",
    subtitle:
      "Confirm the authenticity of any Studio of Phronesis professional development certificate. Enter the certificate ID or scan the QR code.",
    footer: "phronesis-studio.com/verify",
  },
  ar: {
    kicker: "تثبيت",
    title: "التحقق من الشهادات",
    subtitle:
      "أكّد صحة أي شهادة تطوير مهني من ستوديو فرونسيس. أدخل رقم الشهادة أو امسح رمز الاستجابة السريعة.",
    footer: "phronesis-studio.com/ar/verify",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return renderDefaultOG(params, COPY);
}
