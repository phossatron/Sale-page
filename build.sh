#!/bin/bash
# ============================================================
#  build.sh — สร้างเวอร์ชันสำหรับขึ้นเว็บจริงลงโฟลเดอร์ docs/
#  ตัดโค้ดโหมดแก้ไขออกทั้งหมด (ไม่มีแม้แต่ในซอร์สโค้ดของหน้า)
#  ใช้คู่กับ GitHub Pages → Settings > Pages > Branch: main / folder: /docs
# ============================================================
set -e
cd "$(dirname "$0")"

rm -rf docs
mkdir -p docs/js
cp -R assets docs/
mkdir -p docs/css
cp js/content.js js/icons.js js/render.js js/viewer.js docs/js/
touch docs/.nojekyll

python3 - <<'PY'
import re
# --- CSS: ตัดสไตล์ของโหมดแก้ไขออก ---
css = open('css/style.css', encoding='utf-8').read()
css = re.sub(r'/\* EDITOR:START.*?/\* EDITOR:END \*/\s*', '', css, flags=re.S)
open('docs/css/style.css', 'w', encoding='utf-8').write(css)

# --- HTML ---
s = open('index.html', encoding='utf-8').read()
# ตัดทุกบล็อกระหว่าง EDITOR:START ... EDITOR:END
s = re.sub(r'<!-- EDITOR:START.*?EDITOR:END -->\s*', '', s, flags=re.S)
# ใส่ viewer.js แทน editor.js
s = s.replace('<!-- VIEWER-ONLY -->', '<script src="js/viewer.js"></script>')
open('docs/index.html', 'w', encoding='utf-8').write(s)
PY

echo "✅ สร้าง docs/ เรียบร้อย"
echo "   ไฟล์:      $(find docs -type f | wc -l | tr -d ' ') ไฟล์"
echo "   ขนาดรวม:   $(du -sh docs | cut -f1)"
echo ""
echo "   ตรวจสอบผลลัพธ์:"
echo "     • โค้ดโหมดแก้ไข (editor.js):  $(grep -c 'editor\.js' docs/index.html || true) รายการใน index.html  (ต้องเป็น 0)"
echo "     • แถบเครื่องมือใน HTML:        $(grep -c 'id=\"toolbar\"' docs/index.html || true) รายการ  (ต้องเป็น 0)"
echo "     • สไตล์โหมดแก้ไขใน CSS:       $(grep -c 'body.editing' docs/css/style.css || true) รายการ  (ต้องเป็น 0)"
echo ""
echo "   นำขึ้นเว็บ: git add -A && git commit -m \"build\" && git push"
echo "   แล้วตั้ง GitHub Pages → Branch: main / folder: /docs"
