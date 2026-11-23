"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";

/**
 * Floating "case study cloud" popup showing the current CLIC Panglao
 * training engagement. Appears on every page globally.
 *
 * Time-gated: visible from 2026-11-20 00:00 local time through
 * 2026-12-31 23:59 local time. Outside this window, renders nothing.
 *
 * Display logic: the popup appears on every page load (after a soft
 * 1.4s delay so it doesn't fight the hero). If the visitor closes it,
 * it stays hidden for the remainder of that page view. On the next
 * page load or refresh, it appears again. This ensures it continues
 * to appear as intended rather than being suppressed forever after
 * its first dismissal.
 */

const CAMPAIGN_START = new Date(2026, 10, 20, 0, 0, 0); // Nov 20, 2026 local
const CAMPAIGN_END = new Date(2026, 11, 31, 23, 59, 59); // Dec 31, 2026 23:59 local

export function ClicPopup() {
  const locale = useLocale() as "en" | "ar";
  const isAR = locale === "ar";
  const rtl = isAR;

  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const now = new Date();
    if (now < CAMPAIGN_START || now > CAMPAIGN_END) return;
    // Soft delay so it doesn't fight the hero
    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
  };

  if (!hydrated || !visible) return null;

  const photo = "/engagements/clic-module1-group.jpg";
  const engagementsHref = `/${locale}/engagements`;

  return (
    <div
      role="dialog"
      aria-label="Current engagement: CLIC Panglao teacher training"
      aria-live="polite"
      dir={rtl ? "rtl" : "ltr"}
      style={{
        position: "fixed",
        bottom: 24,
        right: rtl ? undefined : 24,
        left: rtl ? 24 : undefined,
        zIndex: 60,
        width: "min(380px, calc(100vw - 32px))",
        maxWidth: 380,
        pointerEvents: "none",
      }}
    >
      {/* Cloud-shaped card with soft shadow + glassmorphism */}
      <div
        style={{
          pointerEvents: "auto",
          background: "linear-gradient(160deg, rgba(255,253,248,0.97) 0%, rgba(244,237,224,0.96) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(180,141,60,0.42)",
          borderRadius: 26,
          boxShadow: "0 30px 60px -20px rgba(15,92,94,0.35), 0 8px 24px -8px rgba(0,0,0,0.18)",
          overflow: "hidden",
          position: "relative",
          animation: "clicPopupRise 480ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Top accent: gold + teal ribbon */}
        <div
          style={{
            display: "flex",
            height: 4,
            background:
              "linear-gradient(to right, #0F5C5E 0%, #0F5C5E 40%, #B48D3C 40%, #B48D3C 100%)",
          }}
        />

        {/* Photo + caption strip */}
        <div style={{ position: "relative", height: 168, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt={
              isAR
                ? "صورة جماعية لهيئة التدريس في CLIC Panglao، 30 أكتوبر 2026"
                : "Faculty group photo, CLIC Panglao, 30 October 2026"
            }
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Gradient scrim for the photo caption */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(8,40,42,0.78) 0%, rgba(8,40,42,0) 60%)",
            }}
          />
          {/* Live badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: rtl ? undefined : 12,
              right: rtl ? 12 : undefined,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 999,
              background: "#0F5C5E",
              color: "#FAF8F3",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#7AE582",
                boxShadow: "0 0 0 0 rgba(122,229,130,0.6)",
                animation: "clicPopupPulse 1.8s infinite",
              }}
            />
            {isAR ? "جارٍ الآن" : "Live Now"}
          </div>
          {/* Photo caption */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: rtl ? undefined : 14,
              right: rtl ? 14 : undefined,
              color: "#FAF8F3",
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontSize: 13,
              lineHeight: 1.25,
              maxWidth: "90%",
            }}
          >
            {isAR
              ? "هيئة التدريس في CLIC Panglao، 30 أكتوبر 2026"
              : "Faculty group photo, CLIC Panglao, 30 October 2026"}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* Kicker */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: "#B48D3C",
              marginBottom: 6,
            }}
          >
            {isAR ? "دراسة حالة جارية" : "Live Case Study"}
          </div>

          {/* Headline (the hook) */}
          <div
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 700,
              fontSize: 19,
              lineHeight: 1.18,
              color: "#0F5C5E",
              marginBottom: 4,
              letterSpacing: -0.2,
            }}
          >
            {isAR
              ? "أحمد علي يُقدّم تدريب المعلمين الآن"
              : "Training teachers right now"}
          </div>

          {/* Sub: institution + location */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              lineHeight: 1.4,
              color: "#3d3d3d",
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 600, color: "#0F5C5E" }}>
              {isAR ? "مركز التعلّم الإبداعي الدولي (CLIC)" : "Creative Learning International Center (CLIC)"}
            </span>
            <br />
            {isAR
              ? "كاليبايان رود، داناو، بانجلاو، 6340 بوهول، الفلبين"
              : "Kalipayan Road, Danao, Panglao, 6340 Bohol, Philippines"}
          </div>

          {/* Status pill */}
          <div
            style={{
              display: "inline-block",
              padding: "5px 11px",
              border: "1px solid rgba(15,92,94,0.28)",
              borderRadius: 999,
              background: "rgba(15,92,94,0.06)",
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              color: "#0F5C5E",
              marginBottom: 14,
              lineHeight: 1.2,
            }}
          >
            {isAR
              ? "الوحدات ١–٤ مكتملة · الوحدات ٥–٨ جارية أسبوعياً حتى ديسمبر ٢٠٢٦"
              : "Modules 1–4 delivered · Modules 5–8 ongoing weekly through Dec 2026"}
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexDirection: rtl ? "row-reverse" : "row",
            }}
          >
            <Link
              href={engagementsHref}
              onClick={close}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 16px",
                borderRadius: 999,
                background: "#0F5C5E",
                color: "#FAF8F3",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 12,
                textDecoration: "none",
                letterSpacing: 0.4,
                transition: "background 200ms",
              }}
            >
              {isAR ? "عرض الدراسة الكاملة" : "View full case study"}
              <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>
                {rtl ? "←" : "→"}
              </span>
            </Link>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontSize: 12,
                color: "#777",
              }}
            >
              {isAR ? "من خلال ستوديو فرونسيس" : "Through 31 Dec 2026"}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label={isAR ? "إغلاق" : "Close"}
          style={{
            position: "absolute",
            top: 12,
            right: rtl ? undefined : 12,
            left: rtl ? 12 : undefined,
            zIndex: 2,
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "rgba(250,248,243,0.92)",
            border: "1px solid rgba(0,0,0,0.12)",
            color: "#1d1d1d",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          }}
        >
          ×
        </button>
      </div>

      {/* Local style tag for popup-specific animations */}
      <style>{`
        @keyframes clicPopupRise {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes clicPopupPulse {
          0% { box-shadow: 0 0 0 0 rgba(122,229,130,0.55); }
          70% { box-shadow: 0 0 0 8px rgba(122,229,130,0); }
          100% { box-shadow: 0 0 0 0 rgba(122,229,130,0); }
        }
      `}</style>
    </div>
  );
}
