#!/usr/bin/env bash
# Translate ALL sections of a language using z-ai CLI
# Usage: bash scripts/translate-cli-full.sh <locale>

LOCALE=$1
if [ -z "$LOCALE" ]; then
  echo "Usage: bash scripts/translate-cli-full.sh <locale>"
  exit 1
fi

case $LOCALE in
  es) NAME="Spanish"; NATIVE="Español"; NOTES="Use formal academic Spanish. Phronesis = frónesis." ;;
  fr) NAME="French"; NATIVE="Français"; NOTES="Use formal French. Phronesis = phronesis." ;;
  ru) NAME="Russian"; NATIVE="Русский"; NOTES="Use formal Russian. Phronesis = фронезис." ;;
  fa) NAME="Persian"; NATIVE="فارسی"; NOTES="Use formal Persian. Phronesis = فرونسیس." ;;
  zh) NAME="Mandarin"; NATIVE="中文"; NOTES="Use formal written Chinese. Phronesis = 实践智慧." ;;
  tr) NAME="Turkish"; NATIVE="Türkçe"; NOTES="Use formal Turkish. Phronesis = fronesis." ;;
  pt) NAME="Portuguese"; NATIVE="Português"; NOTES="Use formal academic Portuguese. Phronesis = frónesis." ;;
  hi) NAME="Hindi"; NATIVE="हिन्दी"; NOTES="Use formal Hindi. Phronesis = व्यावहारिक ज्ञान." ;;
  ml) NAME="Malayalam"; NATIVE="മലയാളം"; NOTES="Use formal Malayalam. Phronesis = പ്രായോഗിക ജ്ഞാനം." ;;
  *) echo "Unknown locale: $LOCALE"; exit 1 ;;
esac

echo "=== Translating ALL sections to $NAME ($LOCALE) ==="

cd /home/z/my-project

# Sections to translate (each as a separate CLI call)
SECTIONS="nav hero thesis practice library work workContent method contact footer about"

for SECTION in $SECTIONS; do
  echo -n "  $SECTION... "

  # Extract the section JSON
  python3 -c "
import json
d = json.load(open('src/messages/en.json'))
print(json.dumps(d.get('$SECTION', {}), ensure_ascii=False))
" > /tmp/section_en.json

  # Check if section is empty
  if [ ! -s /tmp/section_en.json ] || [ "$(cat /tmp/section_en.json)" == "{}" ]; then
    echo "skipped (empty)"
    continue
  fi

  # Translate via z-ai CLI
  SECTION_JSON=$(cat /tmp/section_en.json)

  RESULT=$(timeout 120 z-ai chat -m glm-4.6 -p "You are a master translator of academic and philosophical texts. Translate ALL values in this JSON from English to $NAME ($NATIVE).

PRINCIPLES:
1. Academic, literary, dignified tone. NOT literal, NOT casual.
2. $NOTES
3. Preserve ALL JSON keys exactly. Only translate the string values.
4. Keep technical terms (Next.js, React, TypeScript, Prisma, Vercel, ADEK, Irtiqa'a, ISO 9001, SHA-256) in English.
5. Keep brand names (Studio of Phronesis, Real Estate Emperor, MSCS Academy, DiplomatiQ, Echoes of Wisdom, Treasury Emperor) in English.
6. Keep currency (AED) and numbers as-is.
7. For arrays of strings, translate each string.
8. For nested objects, translate all string values recursively.
9. Return ONLY valid JSON with the same structure. No commentary, no markdown fences.

Section: $SECTION
Source JSON:
$SECTION_JSON

Return the $NAME translation:" 2>&1)

  # Parse the result and save to the locale file
  python3 << PYEOF
import json, re, sys

result = '''$RESULT'''

# Extract content from CLI response
match = re.search(r'"content":\s*"([\s\S]*?)",\s*"role"', result)
if not match:
    print("FAILED (no content)")
    sys.exit(0)

content = match.group(1).replace('\\\\n', '\n').replace('\\\\\\"', '"').replace("\\\\'", "'")

# Extract JSON from content
json_match = re.search(r'\{[\s\S]*\}', content)
if not json_match:
    print("FAILED (no JSON)")
    sys.exit(0)

try:
    translated = json.loads(json_match.group(0))
except:
    print("FAILED (parse error)")
    sys.exit(0)

# Load existing locale file and update the section
locale = "$LOCALE"
section = "$SECTION"
path = f'src/messages/{locale}.json'
with open(path, 'r') as f:
    d = json.load(f)
d[section] = translated
with open(path, 'w') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)
    f.write('\n')
print("✓")
PYEOF

  sleep 3
done

echo ""
echo "=== $NAME translation complete ==="
