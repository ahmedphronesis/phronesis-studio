#!/usr/bin/env python3
"""
Translate ALL sections for a language using z-ai CLI.
Usage: python3 scripts/translate-py.py <locale>
"""
import json, subprocess, re, sys, time, os

LOCALE = sys.argv[1] if len(sys.argv) > 1 else None
if not LOCALE:
    print("Usage: python3 scripts/translate-py.py <locale>")
    sys.exit(1)

LOCALE_INFO = {
    'es': ('Spanish', 'Español', 'Use formal academic Spanish. Phronesis = frónesis.'),
    'fr': ('French', 'Français', 'Use formal French. Phronesis = phronesis.'),
    'ru': ('Russian', 'Русский', 'Use formal Russian. Phronesis = фронезис.'),
    'fa': ('Persian', 'فارسی', 'Use formal Persian. Phronesis = فرونسیس.'),
    'zh': ('Mandarin', '中文', 'Use formal written Chinese. Phronesis = 实践智慧.'),
    'tr': ('Turkish', 'Türkçe', 'Use formal Turkish. Phronesis = fronesis.'),
    'pt': ('Portuguese', 'Português', 'Use formal academic Portuguese. Phronesis = frónesis.'),
    'hi': ('Hindi', 'हिन्दी', 'Use formal Hindi. Phronesis = व्यावहारिक ज्ञान.'),
    'ml': ('Malayalam', 'മലയാളം', 'Use formal Malayalam. Phronesis = പ്രായോഗിക ജ്ഞാനം.'),
}

if LOCALE not in LOCALE_INFO:
    print(f"Unknown locale: {LOCALE}")
    sys.exit(1)

NAME, NATIVE, NOTES = LOCALE_INFO[LOCALE]
PROJECT_DIR = '/home/z/my-project'
EN_PATH = f'{PROJECT_DIR}/src/messages/en.json'
LOCALE_PATH = f'{PROJECT_DIR}/src/messages/{LOCALE}.json'

# Load English source
with open(EN_PATH, 'r') as f:
    en = json.load(f)

# Load existing locale file
with open(LOCALE_PATH, 'r') as f:
    existing = json.load(f)

SECTIONS = ['nav', 'hero', 'thesis', 'practice', 'library', 'work', 'workContent', 'method', 'contact', 'footer', 'about']

def translate_json(json_str, section_name):
    """Translate a JSON string using z-ai CLI"""
    prompt = f"""You are a master translator of academic and philosophical texts. Translate ALL values in this JSON from English to {NAME} ({NATIVE}).

PRINCIPLES:
1. Academic, literary, dignified tone. NOT literal, NOT casual.
2. {NOTES}
3. Preserve ALL JSON keys exactly. Only translate the string values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001, SHA-256) in English.
5. Keep brand names (Studio of Phronesis, Real Estate Emperor, MSCS Academy, DiplomatiQ, Echoes of Wisdom, Treasury Emperor) in English.
6. Keep currency (AED) and numbers as-is.
7. For arrays of strings, translate each string.
8. For nested objects, translate all string values recursively.
9. Return ONLY valid JSON with the same structure. No commentary, no markdown fences.

Section: {section_name}
Source JSON:
{json_str}

Return the {NAME} translation:"""

    try:
        result = subprocess.run(
            ['timeout', '120', 'z-ai', 'chat', '-m', 'glm-4.6', '-p', prompt],
            capture_output=True, text=True, timeout=130
        )
        output = result.stdout

        # Extract content from CLI response
        match = re.search(r'"content":\s*"([\s\S]*?)",\s*"role"', output)
        if not match:
            return None

        content = match.group(1).replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")

        # Extract JSON from content
        json_match = re.search(r'\{[\s\S]*\}', content)
        if not json_match:
            return None

        return json.loads(json_match.group(0))
    except Exception as e:
        print(f"    Error: {e}")
        return None

print(f"\n=== Full translation to {NAME} ({LOCALE}) ===")
start_time = time.time()

for section in SECTIONS:
    if section not in en:
        print(f"  {section}: skipped (not in English)")
        continue

    section_json = json.dumps(en[section], ensure_ascii=False)
    if section_json == '{}':
        print(f"  {section}: skipped (empty)")
        continue

    print(f"  {section}... ", end='', flush=True)

    translated = translate_json(section_json, section)
    if translated:
        existing[section] = translated
        # Save after each section
        with open(LOCALE_PATH, 'w') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)
            f.write('\n')
        print("✓")
    else:
        print("✗ (using existing/fallback)")

    time.sleep(3)

elapsed = round(time.time() - start_time)
print(f"\n✓ Complete ({elapsed}s)")
