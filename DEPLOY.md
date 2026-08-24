# ขึ้นเว็บด้วย GitHub Pages

repo ถูกเตรียมและ commit ไว้ให้แล้ว (branch `main`) เหลือแค่ 3 ขั้นตอน

---

## ขั้นที่ 0 — เอาเนื้อหาที่แก้ไว้ติดขึ้นเว็บด้วย (สำคัญ)

เนื้อหาที่แก้ผ่านโหมดแก้ไข ถูกเก็บใน **localStorage ของเบราว์เซอร์เครื่องตัวเอง**
คนอื่นที่เปิดเว็บจะเห็นเนื้อหาจาก `js/content.js` เท่านั้น ดังนั้นก่อน deploy ให้:

1. เปิดหน้าเว็บ → กด **📦 สร้างไฟล์ content.js** ในแถบเครื่องมือ
2. นำไฟล์ `content.js` ที่ดาวน์โหลดมา วางทับที่ `js/content.js`
3. `git add -A && git commit -m "update content"`

> ถ้ายังไม่ได้แก้อะไร ข้ามขั้นนี้ได้เลย

---

## ขั้นที่ 1 — สร้าง repo บน GitHub

เปิด https://github.com/new แล้ว:
- **Repository name**: `beyondlab-landing` (หรือชื่ออื่นที่ต้องการ)
- **Public** ← ต้องเป็น Public ถ้าใช้บัญชีฟรี (Pages ของ repo แบบ Private ต้องมี GitHub Pro)
- **อย่าติ๊ก** Add README / .gitignore / license (repo นี้มีไฟล์อยู่แล้ว)
- กด **Create repository**

## ขั้นที่ 2 — push ขึ้นไป

รันในโฟลเดอร์นี้ (แทน `<USERNAME>` และชื่อ repo ให้ตรงกับของจริง):

```bash
cd "/Users/pstaex/Desktop/Beyond/Claudecode/Landing page"
git remote add origin https://github.com/<USERNAME>/beyondlab-landing.git
git push -u origin main
```

ถ้าถาม username/password ให้ใส่ **username ของ GitHub** และใช้ **Personal Access Token** แทนรหัสผ่าน
(สร้างที่ https://github.com/settings/tokens → Generate new token (classic) → ติ๊ก `repo`)

## ขั้นที่ 3 — เปิด GitHub Pages

ในหน้า repo → **Settings** → **Pages** (เมนูซ้าย)
- **Source**: `Deploy from a branch`
- **Branch**: `main` · โฟลเดอร์ `/ (root)` → **Save**

รอประมาณ 1–2 นาที เว็บจะขึ้นที่:

```
https://<USERNAME>.github.io/beyondlab-landing/
```

---

## อัปเดตเว็บครั้งต่อไป

```bash
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```
Pages จะ deploy ใหม่ให้อัตโนมัติภายในไม่กี่นาที

---

## หมายเหตุ

- **โหมดแก้ไขจะติดไปกับเว็บที่ deploy ด้วย** ใครเปิดเว็บก็เห็นแถบเครื่องมือ แต่แก้ได้เฉพาะในเบราว์เซอร์ตัวเอง
  ไม่กระทบเนื้อหาจริงของเว็บ (ไม่มี backend) — ถ้าต้องการซ่อนสำหรับคนทั่วไป ดูหัวข้อถัดไป
- **ซ่อนแถบเครื่องมือจากผู้เข้าชมทั่วไป**: ส่งลิงก์แบบ `https://.../beyondlab-landing/?preview=1`
  หรือถ้าต้องการซ่อนถาวร ให้ลบบล็อก `<div id="toolbar">…</div>` กับบรรทัด `<script src="js/editor.js">` ใน `index.html`
  (หน้าเว็บยังแสดงผลปกติ เพราะ render.js ทำงานแยกจากตัวแก้ไข)
- **ฟอร์มติดต่อ** ยังเป็นตัวอย่าง ไม่ได้ส่งข้อมูลไปไหนจริง — บน static host อย่าง Pages ต้องต่อบริการภายนอก
  เช่น Formspree / Google Forms / LINE Notify ที่ฟังก์ชัน `beyondSubmit()` ใน `js/render.js`
- ทุก path ในโปรเจกต์เป็น **relative** จึงทำงานถูกต้องบน URL แบบ subpath ของ Pages (`/<repo>/`)
