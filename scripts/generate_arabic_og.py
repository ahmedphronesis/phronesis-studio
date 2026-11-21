#!/usr/bin/env python3
"""
Generate Arabic OG images using PIL (with arabic_reshaper for proper
letter joining) and serve them via a Next.js API route.

Satori (the engine behind next/og ImageResponse) doesn't support
Arabic letter joining — a known limitation (vercel/next.js#92111
is still in draft). This script generates proper Arabic OG images
using PIL + arabic_reshaper + python-bidi, then the Next.js route
serves them as the opengraph-image for Arabic locales.

Usage: called by the Next.js API route at /api/og/[...path]
"""
import sys
import os
import json
import base64
import io
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    import arabic_reshaper
    from bidi.algorithm import get_display
except ImportError as e:
    print(f"Error: {e}", file=sys.stderr)
    print("Install: pip install Pillow arabic-reshaper python-bidi", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent / "public"
FONTS = ROOT / "fonts"

# Font cache
_font_cache = {}

def get_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    key = f"{name}-{size}"
    if key not in _font_cache:
        path = FONTS / name
        _font_cache[key] = ImageFont.truetype(str(path), size)
    return _font_cache[key]

def get_latin_font(size: int) -> ImageFont.FreeTypeFont:
    """Load Inter font for Latin characters (URLs, names, etc.)"""
    key = f"Inter-{size}"
    if key not in _font_cache:
        path = FONTS / "Inter-Regular.ttf"
        _font_cache[key] = ImageFont.truetype(str(path), size)
    return _font_cache[key]

def get_greek_font(size: int) -> ImageFont.FreeTypeFont:
    """Load Liberation Serif for Greek characters (ΦΡΟΝΗΣΙΣ motto)"""
    key = f"LiberationSerif-{size}"
    if key not in _font_cache:
        path = FONTS / "LiberationSerif-Regular.ttf"
        _font_cache[key] = ImageFont.truetype(str(path), size)
    return _font_cache[key]

def shape_arabic(text: str) -> str:
    """Apply Arabic letter joining (reshaping) without reversing.
    Also replaces characters not in the Amiri font."""
    text = clean_for_amiri(text)
    return arabic_reshaper.reshape(text)


def clean_for_amiri(text: str) -> str:
    """Replace characters not in the Amiri font with Arabic-compatible alternatives."""
    replacements = {
        ".": "،",  # period → Arabic comma
        "—": "،",  # em dash → Arabic comma  
        "·": "،",  # middle dot → Arabic comma
        "•": "،",  # bullet → Arabic comma
        "-": "،",  # hyphen → Arabic comma
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def is_arabic_char(c: str) -> bool:
    """Check if a character is in the Arabic Unicode range."""
    cp = ord(c)
    return (0x0600 <= cp <= 0x06FF) or (0x0750 <= cp <= 0x077F) or (0xFB50 <= cp <= 0xFDFF) or (0xFE70 <= cp <= 0xFEFF)

def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]

def draw_mixed_text(draw, xy, text, font_arabic, font_latin, fill):
    """Draw text that may contain both Arabic and Latin characters.
    Arabic segments are shaped with arabic_reshaper; Latin segments
    use the Latin font. Text is drawn left-to-right at the given position.
    """
    if not text:
        return 0
    x, y = xy
    # Split into segments of Arabic vs non-Arabic
    segments = []
    current = ""
    current_is_arabic = is_arabic_char(text[0]) if text else False
    for c in text:
        c_is_arabic = is_arabic_char(c)
        if c_is_arabic != current_is_arabic and current:
            segments.append((current, current_is_arabic))
            current = c
            current_is_arabic = c_is_arabic
        else:
            current += c
            current_is_arabic = c_is_arabic
    if current:
        segments.append((current, current_is_arabic))

    total_w = 0
    for seg_text, seg_is_arabic in segments:
        if seg_is_arabic:
            shaped = shape_arabic(seg_text)
            font = font_arabic
        else:
            shaped = seg_text
            font = font_latin
        draw.text((x + total_w, y), shaped, font=font, fill=fill)
        bbox = draw.textbbox((0, 0), shaped, font=font)
        total_w += bbox[2] - bbox[0]
    return total_w

def draw_mixed_text_rtl(draw, xy, text, font_arabic, font_latin, fill):
    """Draw mixed Arabic/Latin text right-aligned (RTL) at the given position.
    The xy is the top-right corner of the text.
    """
    total_w = draw_mixed_text(draw, (0, 0), text, font_arabic, font_latin, fill)
    x, y = xy
    draw_mixed_text(draw, (x - total_w, y), text, font_arabic, font_latin, fill)
    return total_w

def draw_text_rtl(draw, xy, text, font, fill):
    """Draw Arabic text right-aligned at the given position."""
    shaped = shape_arabic(text)
    draw.text(xy, shaped, font=font, fill=fill)

def load_image_as_rgba(path: Path, target_size: tuple) -> Image.Image:
    """Load an image and resize it to fill target_size (cover)."""
    img = Image.open(str(path)).convert("RGBA")
    # Resize to cover
    w, h = target_size
    img_ratio = img.width / img.height
    target_ratio = w / h
    if img_ratio > target_ratio:
        new_h = h
        new_w = int(h * img_ratio)
    else:
        new_w = w
        new_h = int(w / img_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    # Center crop
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    img = img.crop((left, top, left + w, top + h))
    return img

def generate_cover_og(
    kicker: str,
    title: str,
    subtitle: str,
    badge: str,
    footer: str,
    bg_image_path: str,
    eagle_path: str,
    object_fit: str = "cover",
    object_position: str = "center top",
) -> bytes:
    """Generate a cover-style OG image (1200x630) with dark teal gradient overlay."""
    W, H = 1200, 630

    # Load background image
    bg_full = ROOT / bg_image_path
    if object_fit == "contain":
        bg_img = Image.open(str(bg_full)).convert("RGBA")
        # Scale to fit within WxH
        img_ratio = bg_img.width / bg_img.height
        target_ratio = W / H
        if img_ratio > target_ratio:
            new_w = int(W * 0.9)
            new_h = int(new_w / img_ratio)
        else:
            new_h = int(H * 0.9)
            new_w = int(new_h * img_ratio)
        bg_img = bg_img.resize((new_w, new_h), Image.LANCZOS)
        # Create dark background
        canvas = Image.new("RGBA", (W, H), (10, 53, 55, 255))
        # Center the image
        offset = ((W - new_w) // 2, (H - new_h) // 2)
        canvas.paste(bg_img, offset, bg_img)
        bg = canvas
    else:
        bg = load_image_as_rgba(bg_full, (W, H))

    # Apply dark teal gradient overlay (left-weighted)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    # Left-to-right gradient: dark on left, transparent on right
    for x in range(W):
        # Alpha goes from ~230 (left) to ~30 (right)
        alpha = int(230 - (x / W) * 200)
        overlay_draw.line([(x, 0), (x, H)], fill=(8, 40, 42, alpha))
    # Bottom gradient
    for y in range(H // 2, H):
        alpha = int(((y - H // 2) / (H // 2)) * 180)
        overlay_draw.line([(0, y), (W, y)], fill=(8, 40, 42, alpha))
    # Top gradient
    for y in range(H // 4):
        alpha = int(80 - (y / (H // 4)) * 80)
        overlay_draw.line([(0, y), (W, y)], fill=(8, 40, 42, alpha))

    bg = Image.alpha_composite(bg, overlay)

    # Add gold top rule
    draw = ImageDraw.Draw(bg)
    draw.rectangle([(0, 0), (W, 4)], fill=(180, 141, 60, 255))

    # Load eagle
    eagle = Image.open(str(ROOT / eagle_path)).convert("RGBA")
    eagle_small = eagle.resize((48, 48), Image.LANCZOS)

    # ── Header: eagle + studio name ──
    padding = 56
    # Eagle
    bg.paste(eagle_small, (padding, padding), eagle_small)
    # Studio name
    font_studio = get_font("Amiri-Regular.ttf", 28)
    studio_text = "ستوديو فرونسيس"
    shaped_studio = shape_arabic(studio_text)
    studio_w = text_width(draw, shaped_studio, font_studio)
    draw.text((padding + 48 + 10, padding + 5), shaped_studio, font=font_studio, fill=(250, 248, 243, 255))
    # Greek motto
    font_motto = get_greek_font(16)
    motto_text = "ΦΡΟΝΗΣΙΣ · Practical Wisdom"
    draw.text((padding + 48 + 10, padding + 38), motto_text, font=font_motto, fill=(212, 175, 110, 255))

    # ── Badge ──
    if badge:
        font_badge = get_font("Amiri-Regular.ttf", 14)
        shaped_badge = shape_arabic(badge)
        badge_w = text_width(draw, shaped_badge, font_badge) + 40
        badge_x = W - padding - badge_w
        badge_y = padding + 60
        # Gold pill background
        draw.rounded_rectangle(
            [(badge_x, badge_y), (badge_x + badge_w, badge_y + 32)],
            radius=16, fill=(180, 141, 60, 255)
        )
        # Badge text (dark)
        bx = badge_x + (badge_w - text_width(draw, shaped_badge, font_badge)) // 2
        draw.text((bx, badge_y + 8), shaped_badge, font=font_badge, fill=(26, 26, 26, 255))

    # ── Kicker ──
    font_kicker = get_font("Amiri-Regular.ttf", 18)
    shaped_kicker = shape_arabic(kicker)
    kicker_y = padding + 200
    kicker_w = text_width(draw, shaped_kicker, font_kicker)
    draw.text((W - padding - kicker_w, kicker_y), shaped_kicker, font=font_kicker, fill=(212, 175, 110, 255))

    # ── Title ──
    font_title = get_font("Amiri-Regular.ttf", 56)
    shaped_title = shape_arabic(title)
    title_y = kicker_y + 35
    title_w = text_width(draw, shaped_title, font_title)
    draw.text((W - padding - title_w, title_y), shaped_title, font=font_title, fill=(250, 248, 243, 255))

    # ── Subtitle ──
    if subtitle:
        font_sub = get_font("Amiri-Regular.ttf", 22)
        # Word-wrap the subtitle
        words = subtitle.split()
        lines = []
        current = ""
        max_w = W - 2 * padding - 100
        for word in words:
            test = (current + " " + word).strip()
            shaped_test = shape_arabic(test)
            if text_width(draw, shaped_test, font_sub) > max_w and current:
                lines.append(current)
                current = word
            else:
                current = test
        if current:
            lines.append(current)

        sub_y = title_y + 80
        for line in lines:
            shaped_line = shape_arabic(line)
            line_w = text_width(draw, shaped_line, font_sub)
            draw.text((W - padding - line_w, sub_y), shaped_line, font=font_sub, fill=(220, 220, 220, 240))
            sub_y += 30

    # ── Footer ──
    font_footer = get_latin_font(14)
    font_name = get_latin_font(13)
    footer_y = H - padding + 10
    # Top border
    draw.line([(padding, footer_y - 15), (W - padding, footer_y - 15)], fill=(212, 175, 110, 80), width=1)
    # Footer URL (Latin text — use Inter font, right-aligned in RTL)
    footer_w = text_width(draw, footer, font_footer)
    draw.text((W - padding - footer_w, footer_y), footer, font=font_footer, fill=(200, 200, 200, 200))
    # Name (left side — Latin text, use Inter font)
    name_text = "Ahmed Mahmoud Saeed Ahmed Ali"
    draw.text((padding, footer_y), name_text, font=font_name, fill=(212, 175, 110, 255))

    # Convert to RGB and save as PNG
    result = bg.convert("RGB")
    buf = io.BytesIO()
    result.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def generate_default_og(
    kicker: str,
    title: str,
    subtitle: str,
    badge: str,
    footer: str,
    eagle_path: str,
) -> bytes:
    """Generate the default cream-paper OG image."""
    W, H = 1200, 630

    # Cream background
    bg = Image.new("RGBA", (W, H), (244, 237, 224, 255))
    draw = ImageDraw.Draw(bg)

    # Faint eagle watermark (top-left)
    eagle = Image.open(str(ROOT / eagle_path)).convert("RGBA")
    eagle_wm = eagle.resize((260, 260), Image.LANCZOS)
    # Reduce opacity
    eagle_wm.putalpha(eagle_wm.getchannel("A").point(lambda v: int(v * 0.06)))
    bg.paste(eagle_wm, (28, 28), eagle_wm)

    # Decorative circles
    circle1 = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
    cd = ImageDraw.Draw(circle1)
    cd.ellipse([0, 0, 360, 360], fill=(180, 141, 60, 25))
    bg.paste(circle1, (W - 360 - 100, -120), circle1)

    circle2 = Image.new("RGBA", (320, 320), (0, 0, 0, 0))
    cd2 = ImageDraw.Draw(circle2)
    cd2.ellipse([0, 0, 320, 320], fill=(15, 92, 94, 18))
    bg.paste(circle2, (-80, H - 320 + 140), circle2)

    draw = ImageDraw.Draw(bg)

    # Borders (teal double + gold inner)
    draw.rectangle([(22, 22), (W - 22, H - 22)], outline=(15, 92, 94, 255), width=3)
    draw.rectangle([(32, 32), (W - 32, H - 32)], outline=(180, 141, 60, 255), width=2)

    padding = 80

    # Header: eagle + studio name
    eagle_small = eagle.resize((48, 48), Image.LANCZOS)
    bg.paste(eagle_small, (padding, padding), eagle_small)
    font_studio = get_font("Amiri-Regular.ttf", 24)
    studio_text = "ستوديو فرونسيس"
    shaped_studio = shape_arabic(studio_text)
    draw.text((padding + 48 + 10, padding + 2), shaped_studio, font=font_studio, fill=(15, 92, 94, 255))
    font_motto = get_greek_font(14)
    draw.text((padding + 48 + 10, padding + 32), "ΦΡΟΝΗΣΙΣ · Practical Wisdom", font=font_motto, fill=(180, 141, 60, 255))

    # Badge
    if badge:
        font_badge = get_font("Amiri-Regular.ttf", 14)
        shaped_badge = shape_arabic(badge)
        badge_w = text_width(draw, shaped_badge, font_badge) + 40
        badge_y = padding + 80
        draw.rounded_rectangle(
            [(W - padding - badge_w, badge_y), (W - padding, badge_y + 32)],
            radius=16, fill=(180, 141, 60, 255)
        )
        bx = W - padding - badge_w + (badge_w - text_width(draw, shaped_badge, font_badge)) // 2
        draw.text((bx, badge_y + 8), shaped_badge, font=font_badge, fill=(26, 26, 26, 255))

    # Kicker
    font_kicker = get_font("Amiri-Regular.ttf", 18)
    shaped_kicker = shape_arabic(kicker)
    kicker_y = H // 2 - 80
    kicker_w = text_width(draw, shaped_kicker, font_kicker)
    draw.text((W - padding - kicker_w, kicker_y), shaped_kicker, font=font_kicker, fill=(180, 141, 60, 255))

    # Title
    font_title = get_font("Amiri-Regular.ttf", 64)
    shaped_title = shape_arabic(title)
    title_y = kicker_y + 35
    title_w = text_width(draw, shaped_title, font_title)
    draw.text((W - padding - title_w, title_y), shaped_title, font=font_title, fill=(15, 92, 94, 255))

    # Subtitle
    if subtitle:
        font_sub = get_font("Amiri-Regular.ttf", 22)
        words = subtitle.split()
        lines = []
        current = ""
        max_w = W - 2 * padding - 200
        for word in words:
            test = (current + " " + word).strip()
            shaped_test = shape_arabic(test)
            if text_width(draw, shaped_test, font_sub) > max_w and current:
                lines.append(current)
                current = word
            else:
                current = test
        if current:
            lines.append(current)

        sub_y = title_y + 85
        for line in lines:
            shaped_line = shape_arabic(line)
            line_w = text_width(draw, shaped_line, font_sub)
            draw.text((W - padding - line_w, sub_y), shaped_line, font=font_sub, fill=(80, 80, 80, 240))
            sub_y += 30

    # Footer
    font_footer = get_latin_font(16)
    font_name = get_latin_font(13)
    footer_y = H - padding + 10
    draw.line([(padding, footer_y - 15), (W - padding, footer_y - 15)], fill=(180, 141, 60, 100), width=1)
    footer_w = text_width(draw, footer, font_footer)
    draw.text((W - padding - footer_w, footer_y), footer, font=font_footer, fill=(100, 100, 100, 255))
    name_text = "Ahmed Mahmoud Saeed Ahmed Ali"
    draw.text((padding, footer_y), name_text, font=font_name, fill=(15, 92, 94, 255))

    result = bg.convert("RGB")
    buf = io.BytesIO()
    result.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


# ── Page-specific copy (Arabic) ──
# This must match the website's actual Arabic content from ar.json
PAGES = {
    "home": {
        "kicker": "فيلسوفٌ. مؤلِّفٌ. باني النُّظُم. مربٍّ.",
        "title": "ستوديو فرونسيس",
        "subtitle": "إدراكُ موضعِ الخلل فيما هو كائن، وإيصاله إلى ما ينبغي أن يكون، على مقتضى الإحكام والانضباط.",
        "badge": "استكشف الممارسة",
        "footer": "phronesis-studio.com",
        "bg": None,  # default variant
    },
    "about": {
        "kicker": "المؤسّس",
        "title": "أحمد علي",
        "subtitle": "فيلسوف تكويناً، معلم تأهيلاً، باني ممارسة. مؤسس ستوديو فرونسيس، تأسس في أبوظبي، الإمارات.",
        "badge": "تعرّف على المؤسس",
        "footer": "phronesis-studio.com/ar/about",
        "bg": "founder-portrait.jpg",
        "object_position": "center 20%",
    },
    "work": {
        "kicker": "أعمال مختارة",
        "title": "ورشة العمل",
        "subtitle": "أنظمة إنتاجية في التعليم والعمليات والبرمجيات.",
        "badge": "شاهد الأنظمة",
        "footer": "phronesis-studio.com/ar/work",
        "bg": "engagements/clic-module1-training.jpg",
    },
    "library": {
        "kicker": "المكتبة، أعمال أصلية",
        "title": "منهج دراسي أصيل",
        "subtitle": "مكتبة ثنائية اللغة من المناهج الأصيلة، مبنية من المبادئ الأولى.",
        "badge": "تصفّح المكتبة",
        "footer": "phronesis-studio.com/ar/library",
        "bg": "library/mathematics.jpg",
    },
    "method": {
        "kicker": "المنهج",
        "title": "فرونيسيس",
        "subtitle": "أربعُ حركاتٍ متتابعة؛ وهي عينُ الانضباط الذي وصفه أرسطو، غير أنه يُطبَّق هنا على نظامٍ لا على نفسٍ.",
        "badge": "شاهد المنهج",
        "footer": "phronesis-studio.com/ar/method",
        "bg": "vitruvian-man.jpg",
        "object_fit": "contain",
    },
    "philosophy": {
        "kicker": "الفلسفة الأصلية",
        "title": "أصداء الحكمة وتاريخ الفلسفة",
        "subtitle": "مشاريع فلسفية أصلية تصل بين الفكر الأكاديمي والحوار العام. بودكاست ثنائي اللغة، ومشروع شامل لتاريخ الفلسفة: من الألف إلى الياء.",
        "badge": "استكشف المشروعين",
        "footer": "phronesis-studio.com/ar/philosophy",
        "bg": "school-of-athens-faded.jpg",
        "object_position": "center center",
    },
    "publications": {
        "kicker": "كتب، مؤلّفات",
        "title": "العمق المعرفي",
        "subtitle": "دليل عملي لتصميم أسئلة تُعمّق التفكير بلا ذكاء اصطناعي، تأليف أحمد علي، ٢٠٢٦",
        "badge": "اقرأ الكتاب",
        "footer": "phronesis-studio.com/ar/publications",
        "bg": "publications/depth-of-knowledge-front.jpg",
        "object_fit": "contain",
    },
    "correspondence": {
        "kicker": "اعمل معي",
        "title": "ابدأ حوارًا",
        "subtitle": "بيّن لي موضع الخلل كما تراه، وسأبحث في جوهره قبل اقتراح ما يصلحه. أقرأ كل رسالة بنفسي.",
        "badge": "ابدأ الحوار",
        "footer": "phronesis-studio.com/ar/correspondence",
        "bg": "founder-portrait.jpg",
        "object_position": "center 20%",
    },
    "verify": {
        "kicker": "تثبيت",
        "title": "التحقق من الشهادات",
        "subtitle": "أكّد صحة أي شهادة من ستوديو فرونسيس.",
        "badge": "تحقّق الآن",
        "footer": "phronesis-studio.com/ar/verify",
        "bg": "engagements/clic-module1-workshop.jpg",
    },
    "engagements": {
        "kicker": "الممارسات المهنية",
        "title": "التطوير المهني وتدريب المعلمين",
        "subtitle": "تدريب المعلمين في مركز التعلّم الإبداعي الدولي، بانجلاو، بوهول. برنامج من ثماني وحدات مُستند إلى بلوم وويب ومارزانو والفهم بالتصميم.",
        "badge": "جارٍ الآن",
        "footer": "phronesis-studio.com/ar/engagements",
        "bg": "engagements/clic-module1-group.jpg",
    },
}


def generate(page: str) -> bytes:
    """Generate the OG image for the given page."""
    cfg = PAGES.get(page)
    if not cfg:
        raise ValueError(f"Unknown page: {page}")

    if cfg.get("bg"):
        return generate_cover_og(
            kicker=cfg["kicker"],
            title=cfg["title"],
            subtitle=cfg["subtitle"],
            badge=cfg["badge"],
            footer=cfg["footer"],
            bg_image_path=cfg["bg"],
            eagle_path="logo-eagle.png",
            object_fit=cfg.get("object_fit", "cover"),
            object_position=cfg.get("object_position", "center top"),
        )
    else:
        return generate_default_og(
            kicker=cfg["kicker"],
            title=cfg["title"],
            subtitle=cfg["subtitle"],
            badge=cfg["badge"],
            footer=cfg["footer"],
            eagle_path="logo-eagle.png",
        )


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_arabic_og.py <page>", file=sys.stderr)
        print(f"Pages: {', '.join(PAGES.keys())}", file=sys.stderr)
        sys.exit(1)

    page = sys.argv[1]
    out_dir = ROOT / "og-ar"
    out_dir.mkdir(exist_ok=True)
    out_path = out_dir / f"{page}.png"
    data = generate(page)
    out_path.write_bytes(data)
    print(f"Generated: {out_path} ({len(data)} bytes)")
