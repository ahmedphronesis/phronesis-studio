import { promises as fs } from "fs";
import path from "path";
import type { ReactElement } from "react";

export type OGParams = {
  /** Top kicker, e.g. "ENGAGEMENTS" or "PHILOSOPHY" */
  kicker?: string;
  /** Main headline */
  title: string;
  /** Supporting line under the title */
  subtitle?: string;
  /** Optional callout badge (e.g. "Currently Training") */
  badge?: string;
  /** Footer label, usually the URL path */
  footer?: string;
  /** Optional background image (data URL) for cover-style OGs */
  backgroundImage?: string;
  /** CSS object-position for the background image (default: "center top") */
  objectPosition?: string;
  /** CSS object-fit for the background image (default: "cover"). Use "contain" to show the full image without cropping. */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Eagle logo data URL (passed from caller to avoid module-state issues) */
  eagle: string;
  /** When true, layout flips for RTL (Arabic) */
  rtl?: boolean;
  /** When true, renders the dark teal variant (for engagements cover) */
  cover?: boolean;
};

const ROOT = path.join(process.cwd(), "public");

/**
 * Serve a pre-generated Arabic OG image (PNG) from /public/og-ar/{name}.png.
 *
 * Satori (the engine behind next/og ImageResponse) doesn't support Arabic
 * letter joining — a known limitation (vercel/next.js#92111 still in draft).
 * So Arabic OGs are pre-rendered with PIL + arabic_reshaper, and we serve
 * the static PNG here instead of trying to render Arabic text via Satori.
 *
 * Returns a Response with the PNG bytes, which Next.js's opengraph-image
 * convention accepts in place of an ImageResponse.
 *
 * @param name - file basename in /public/og-ar/ (without .png extension)
 *               e.g. "home", "about", "work", "publications", "library",
 *               "method", "philosophy", "correspondence", "verify",
 *               "engagements"
 */
export async function serveArabicOG(name: string): Promise<Response> {
  const pngPath = path.join(ROOT, "og-ar", `${name}.png`);
  const buffer = await fs.readFile(pngPath);
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

export type LoadedAssets = {
  fonts: {
    interRegular: Buffer;
    interSemiBold: Buffer;
    cormorantRegular: Buffer;
    cormorantSemiBold: Buffer;
    cormorantBold: Buffer;
    cormorantItalic: Buffer;
    notoSansArabic: Buffer;
  };
  eagle: string;
};

/**
 * Load all OG assets (fonts + eagle). Each call reads from disk; safe to
 * call per-request. Caller should keep the result and pass `eagle` into
 * `ogTemplate` to avoid relying on shared module state.
 */
export async function loadAssets(): Promise<LoadedAssets> {
  const [
    interRegular, interSemiBold,
    cgRegular, cgSemiBold, cgBold, cgItalic,
    notoArabic,
    eagle,
  ] = await Promise.all([
    fs.readFile(path.join(ROOT, "fonts", "Inter-Regular.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "Inter-SemiBold.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "CormorantGaramond-Regular.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "CormorantGaramond-SemiBold.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "CormorantGaramond-Bold.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "CormorantGaramond-Italic.ttf")),
    fs.readFile(path.join(ROOT, "fonts", "NotoSansArabic-Regular.ttf")),
    fs.readFile(path.join(ROOT, "logo-eagle.png")),
  ]);
  return {
    fonts: {
      interRegular,
      interSemiBold,
      cormorantRegular: cgRegular,
      cormorantSemiBold: cgSemiBold,
      cormorantBold: cgBold,
      cormorantItalic: cgItalic,
      notoSansArabic: notoArabic,
    },
    eagle: `data:image/png;base64,${eagle.toString("base64")}`,
  };
}

export function fontsFromAssets(a: LoadedAssets) {
  return [
    { name: "Inter", data: a.fonts.interRegular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: a.fonts.interSemiBold, weight: 600 as const, style: "normal" as const },
    { name: "Cormorant Garamond", data: a.fonts.cormorantRegular, weight: 400 as const, style: "normal" as const },
    { name: "Cormorant Garamond", data: a.fonts.cormorantSemiBold, weight: 600 as const, style: "normal" as const },
    { name: "Cormorant Garamond", data: a.fonts.cormorantBold, weight: 700 as const, style: "normal" as const },
    { name: "Cormorant Garamond", data: a.fonts.cormorantItalic, weight: 400 as const, style: "italic" as const },
    { name: "Noto Sans Arabic", data: a.fonts.notoSansArabic, weight: 400 as const, style: "normal" as const },
  ];
}

/** Helper: read an image file from public/ as a data URL */
export async function readPublicImageAsDataUrl(relPath: string): Promise<string> {
  const fullPath = path.join(ROOT, relPath);
  const buf = await fs.readFile(fullPath);
  const ext = path.extname(relPath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/**
 * Shared OG image JSX template. Renders a 1200x630 card matching the
 * Studio of Phronesis visual identity: cream paper, teal type, gold accents,
 * faint eagle watermark, classic/academic aesthetic.
 */
export function ogTemplate({
  kicker,
  title,
  subtitle,
  badge,
  footer,
  backgroundImage,
  objectPosition = "center top",
  objectFit = "cover" as "cover" | "contain" | "fill" | "none" | "scale-down",
  eagle,
  rtl = false,
  cover = false,
}: OGParams): ReactElement {
  const isCover = cover && backgroundImage;
  // For Arabic (RTL), use Noto Sans Arabic for body text and a bold weight
  // for headings. Cormorant Garamond and Inter don't support Arabic glyphs.
  const fBody = rtl ? "Noto Sans Arabic" : "Inter";
  const fHead = rtl ? "Noto Sans Arabic" : "Cormorant Garamond";

  if (isCover) {
    return (
      <div
        lang={rtl ? "ar" : "en"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "#0a3537",
          fontFamily: fBody,
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <img
          src={backgroundImage}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: objectFit,
            objectPosition: objectPosition,
          }}
          alt=""
        />
        {/* Single overlay div with all gradients combined into one
            background declaration. Satori renders this reliably. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(95deg, rgba(8,40,42,0.92) 0%, rgba(8,40,42,0.80) 35%, rgba(8,40,42,0.50) 65%, rgba(8,40,42,0.25) 100%), linear-gradient(to top, rgba(8,40,42,0.75) 0%, transparent 45%), linear-gradient(to bottom, rgba(8,40,42,0.50) 0%, transparent 30%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#B48D3C",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            position: "relative",
            height: "100%",
            textAlign: rtl ? "right" : "left",
            alignItems: rtl ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexDirection: rtl ? "row-reverse" : "row",
            }}
          >
            <img src={eagle} style={{ width: 56, height: 56, objectFit: "contain" }} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: fHead,
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#FAF8F3",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Studio of Phronesis
              </div>
              <div
                style={{
                  fontFamily: fHead,
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "#D4AF6E",
                  letterSpacing: 1,
                  marginTop: 4,
                }}
              >
                ΦΡΟΝΗΣΙΣ · Practical Wisdom
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            {badge && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: rtl ? "flex-end" : "flex-start",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "#B48D3C",
                  color: "#1a1a1a",
                  fontFamily: fBody,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 22,
                }}
              >
                <span style={{ fontSize: 12, lineHeight: 1, color: "#0a3537", marginRight: 4 }}>→</span>
                {badge}
              </div>
            )}
            {kicker && (
              <div
                style={{
                  fontFamily: fBody,
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#D4AF6E",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {kicker}
              </div>
            )}
            <div
              style={{
                fontFamily: fHead,
                fontWeight: 700,
                fontSize: 64,
                color: "#FAF8F3",
                lineHeight: 1.05,
                marginBottom: subtitle ? 18 : 0,
                letterSpacing: -0.5,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontFamily: fHead,
                  fontStyle: "italic",
                  fontSize: 26,
                  color: "rgba(250,248,243,0.95)",
                  lineHeight: 1.3,
                  maxWidth: 680,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: rtl ? "flex-start" : "space-between",
              flexDirection: rtl ? "row-reverse" : "row",
              borderTop: "1px solid rgba(212,175,110,0.35)",
              paddingTop: 18,
              width: "100%",
            }}
          >
            <div
              style={{
                fontFamily: fBody,
                fontSize: 16,
                color: "rgba(250,248,243,0.78)",
                letterSpacing: 1,
              }}
            >
              {footer || "phronesis-studio.com"}
            </div>
            <div
              style={{
                fontFamily: fBody,
                fontSize: 13,
                color: "#D4AF6E",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Ahmed Mahmoud Saeed Ahmed Ali
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant: cream paper, teal type, gold accents, eagle watermark
  return (
    <div
      lang={rtl ? "ar" : "en"}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#F4EDE0",
        fontFamily: fBody,
        direction: rtl ? "rtl" : "ltr",
      }}
    >
      <img
        src={eagle}
        style={{
          position: "absolute",
          top: 28,
          ...(rtl ? { right: 28 } : { left: 28 }),
          width: 260,
          height: 260,
          objectFit: "contain",
          opacity: 0.06,
        }}
        alt=""
      />
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(180,141,60,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -140,
          left: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(15,92,94,0.07)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 22,
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "#0F5C5E",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 32,
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: "#B48D3C",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          position: "relative",
          height: "100%",
          textAlign: rtl ? "right" : "left",
          alignItems: rtl ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexDirection: rtl ? "row-reverse" : "row",
          }}
        >
          <img src={eagle} style={{ width: 48, height: 48, objectFit: "contain" }} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: fHead,
                fontSize: 24,
                fontWeight: 700,
                color: "#0F5C5E",
                letterSpacing: 4,
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Studio of Phronesis
            </div>
            <div
              style={{
                fontFamily: fHead,
                fontStyle: "italic",
                fontSize: 14,
                color: "#B48D3C",
                letterSpacing: 1,
                marginTop: 3,
              }}
            >
              ΦΡΟΝΗΣΙΣ · Practical Wisdom
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 920,
            alignItems: rtl ? "flex-end" : "flex-start",
          }}
        >
          {kicker && (
            <div
              style={{
                fontFamily: fBody,
                fontWeight: 600,
                fontSize: 18,
                color: "#B48D3C",
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              {kicker}
            </div>
          )}
          <div
            style={{
              fontFamily: fHead,
              fontWeight: 700,
              fontSize: 76,
              color: "#0F5C5E",
              lineHeight: 1.02,
              marginBottom: subtitle ? 22 : 0,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontFamily: fHead,
                fontStyle: "italic",
                fontSize: 28,
                color: "#3d3d3d",
                lineHeight: 1.3,
                maxWidth: 820,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: rtl ? "flex-start" : "space-between",
            flexDirection: rtl ? "row-reverse" : "row",
            width: "100%",
            borderTop: "1px solid rgba(180,141,60,0.4)",
            paddingTop: 18,
          }}
        >
          <div
            style={{
              fontFamily: fBody,
              fontSize: 16,
              color: "#555",
              letterSpacing: 1,
            }}
          >
            {footer || "phronesis-studio.com"}
          </div>
          <div
            style={{
              fontFamily: fBody,
              fontSize: 13,
              color: "#0F5C5E",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Ahmed Mahmoud Saeed Ahmed Ali
          </div>
        </div>
      </div>
    </div>
  );
}
