#!/bin/bash
# ============================================================
#  build.sh — สร้างเวอร์ชันสำหรับขึ้นเว็บจริงลงโฟลเดอร์ docs/
#  ตัดโค้ดโหมดแก้ไขออกทั้งหมด (ไม่มีแม้แต่ในซอร์สโค้ดของหน้า)
#  ใช้ได้ทั้งบนเครื่องตัวเองและบน build server ของ Vercel
#  (ใช้ node ในการประมวลผลข้อความ จึงไม่ต้องพึ่ง python)
# ============================================================
set -e
cd "$(dirname "$0")"

rm -rf docs
mkdir -p docs/js docs/css
cp -R assets docs/
cp js/content.js js/icons.js js/render.js js/viewer.js docs/js/
touch docs/.nojekyll

# --- สำเนาสำหรับผู้ดูแล (มีโหมดแก้ไข) ไว้ที่ /admin ---
mkdir -p docs/admin
cp index.html docs/admin/
cp -R css js assets docs/admin/

node -e '
const fs = require("fs");

// --- CSS: ตัดสไตล์ของโหมดแก้ไขออก ---
let css = fs.readFileSync("css/style.css", "utf8");
css = css.replace(/\/\* EDITOR:START[\s\S]*?\/\* EDITOR:END \*\/\s*/g, "");
fs.writeFileSync("docs/css/style.css", css);

// --- HTML: ตัดแถบเครื่องมือ + สคริปต์ตัวแก้ไข แล้วใส่ viewer.js แทน ---
let html = fs.readFileSync("index.html", "utf8");
html = html.replace(/<!-- EDITOR:START[\s\S]*?EDITOR:END -->\s*/g, "");
html = html.replace("<!-- VIEWER-ONLY -->", "<script src=\"js/viewer.js\"></script>");
fs.writeFileSync("docs/index.html", html);

// --- /admin: หน้าเดียวกันแบบมีเครื่องมือแก้ไข + กันไม่ให้ Google เก็บ index ---
let admin = fs.readFileSync("index.html", "utf8");
admin = admin.replace("<meta name=\"viewport\"",
  "<meta name=\"robots\" content=\"noindex,nofollow\">\n<meta name=\"viewport\"");
fs.writeFileSync("docs/admin/index.html", admin);
'

# ---- ตรวจกันพลาด: ถ้า build ตัดของที่ต้องมีออกไป ให้ล้มทันที ----
fail=0
mq=$(grep -c "@media" docs/css/style.css || true)
if [ "$mq" -lt 3 ]; then
  echo "❌ production CSS มี @media แค่ $mq บล็อก — เว็บจะไม่รองรับมือถือ!"; fail=1
fi
if [ "$(grep -c 'editor\.js' docs/index.html || true)" != "0" ]; then
  echo "❌ หน้าเว็บหลักยังมีโค้ดโหมดแก้ไขติดไป"; fail=1
fi
if [ "$(grep -c 'body.editing' docs/css/style.css || true)" != "0" ]; then
  echo "❌ CSS ของโหมดแก้ไขติดไปกับเว็บจริง"; fail=1
fi
if [ ! -s docs/js/content.js ] || [ ! -s docs/index.html ]; then
  echo "❌ ไฟล์หลักหายไป"; fail=1
fi
if [ "$fail" = "1" ]; then echo ""; echo "build ล้มเหลว — อย่า push จนกว่าจะแก้"; exit 1; fi

files=$(find docs -type f | wc -l | tr -d ' ')
echo "✅ สร้าง docs/ เรียบร้อย — $files ไฟล์ / $(du -sh docs | cut -f1)"
echo ""
echo "   ✔ media query ในเว็บจริง: $mq บล็อก (รองรับมือถือ)"
echo ""
echo "   ตรวจสอบผลลัพธ์ (ต้องเป็น 0 ทั้งหมด):"
echo "     • โค้ดโหมดแก้ไขใน index.html : $(grep -c 'editor\.js' docs/index.html || true)"
echo "     • แถบเครื่องมือใน index.html : $(grep -c 'id="toolbar"' docs/index.html || true)"
echo "     • สไตล์โหมดแก้ไขใน CSS      : $(grep -c 'body.editing' docs/css/style.css || true)"
echo ""
echo "   หน้าผู้ดูแล (มีเครื่องมือแก้ไข): docs/admin/  →  <เว็บ>/admin/?edit=<คีย์ลับ>" 
