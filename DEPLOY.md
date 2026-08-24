# ขึ้นเว็บ (Deploy) — GitHub Pages

repo: https://github.com/phossatron/Sale-page (branch `main`, public)
URL ปลายทาง: **https://phossatron.github.io/Sale-page/**

---

## เปิด Pages (ทำครั้งเดียว)

1. เข้า https://github.com/phossatron/Sale-page/settings/pages
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` · **Folder**: **`/docs`** ← สำคัญ (โฟลเดอร์นี้คือเวอร์ชันที่ตัดโค้ดโหมดแก้ไขออกแล้ว)
4. กด **Save** → รอ 1–2 นาที

เช็คสถานะการ deploy ได้ที่แท็บ **Actions** ของ repo

> เลือก `/docs` ไม่ใช่ `/ (root)` — ถ้าเลือก root ผู้เข้าชมจะเห็นแถบเครื่องมือแก้ไขด้วย

---

## รอบการทำงานประจำวัน

```bash
cd "/Users/pstaex/Desktop/Beyond/Claudecode/Landing page"

# 1. เปิดเซิร์ฟเวอร์ในเครื่อง (มีโหมดแก้ไขครบ)
python3 -m http.server 8080          # → http://localhost:8080

# 2. แก้เนื้อหาบนหน้าเว็บ แล้วกดปุ่ม 📦 สร้างไฟล์ content.js
# 3. เอาไฟล์ที่ดาวน์โหลดมาวางทับ js/content.js
mv ~/Downloads/content.js js/content.js

# 4. build เวอร์ชันสำหรับผู้เข้าชม แล้วส่งขึ้นเว็บ
./build.sh
git add -A && git commit -m "update content" && git push
```

เว็บจะอัปเดตเองภายใน 1–2 นาทีหลัง push

> **อย่าลืมรัน `./build.sh` ก่อน push** เพราะ GitHub Pages ไม่ build ให้
> (จำง่าย ๆ: แก้อะไรใน `js/` หรือ `css/` หรือ `assets/` → ต้อง build ก่อนเสมอ)

---

## ใครเห็นโหมดแก้ไขได้บ้าง

| ที่ | เห็นเครื่องมือแก้ไข? |
|---|---|
| เว็บจริง `phossatron.github.io/Sale-page/` | ❌ ไม่เห็น — โค้ดถูกตัดออกตั้งแต่ตอน build |
| `localhost:8080` / วง LAN / เปิดไฟล์ตรง ๆ | ✅ เห็นครบ |
| ไฟล์ต้นฉบับ + `?edit=beyond2026` | ✅ เห็นครบ |

- เปลี่ยนคีย์ลับได้ที่ `EDIT_CONFIG.key` ในหัวไฟล์ `js/editor.js`
- ปุ่ม 🔒 ในแถบเครื่องมือ ใช้ล็อกกลับเป็นมุมมองผู้เข้าชม

---

## ผูกโดเมนของบริษัท (ทำเมื่อไหร่ก็ได้)

อยากได้ `https://sale.beyondlab.co.th` แทน URL ของ github.io:

1. เพิ่ม DNS record ที่ผู้ให้บริการโดเมน

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `sale` | `phossatron.github.io` |

2. Settings → Pages → **Custom domain** → ใส่ `sale.beyondlab.co.th` → Save
3. ติ๊ก **Enforce HTTPS** (ขึ้นให้ติ๊กหลัง GitHub ออกใบรับรองเสร็จ ~15 นาที)

ระบบจะสร้างไฟล์ `CNAME` ใน repo ให้เอง — **อย่าลบ** และถ้ารัน `./build.sh` ให้ย้ายไฟล์นั้นไปไว้ใน `docs/` ด้วย

---

## วิธีสำรอง — Vercel

repo นี้มี `vercel.json` พร้อมใช้อยู่แล้ว (build อัตโนมัติทุกครั้งที่ push ไม่ต้องรัน `./build.sh` เอง)
ขั้นตอน: https://vercel.com/new → Import repo → ตั้ง Project Name → Deploy

⚠️ แผน Hobby (ฟรี) ของ Vercel ระบุว่าใช้กับงานที่ไม่ใช่เชิงพาณิชย์ — หน้า sale page ของบริษัทเข้าข่ายเชิงพาณิชย์
ส่วน **GitHub Pages อนุญาตให้ใช้กับเว็บธุรกิจได้ฟรี** จึงเหมาะกับงานนี้มากกว่า

---

## หมายเหตุ

- **การแก้ไขไม่มีผลกับผู้เข้าชมคนอื่น** เพราะไม่มี backend — ทุกการแก้เก็บใน localStorage ของเบราว์เซอร์คนที่แก้เท่านั้น
  เนื้อหาที่ทุกคนเห็นมาจาก `js/content.js` ที่ commit ขึ้นไป
- **ฟอร์มติดต่อ** ยังเป็นตัวอย่าง ไม่ได้ส่งข้อมูลไปไหนจริง — ต่อบริการภายนอกได้ที่ฟังก์ชัน `beyondSubmit()` ใน `js/render.js`
  (เช่น Formspree, Google Forms, LINE Notify)
- ทุก path เป็น **relative** จึงทำงานถูกต้องบน URL แบบ subpath (`/Sale-page/`) ของ Pages
