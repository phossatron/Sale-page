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
- **Repository name**: `sale-page`
- **Public** ← ต้องเป็น Public ถ้าใช้บัญชีฟรี (Pages ของ repo แบบ Private ต้องมี GitHub Pro)
- **อย่าติ๊ก** Add README / .gitignore / license (repo นี้มีไฟล์อยู่แล้ว)
- กด **Create repository**

## ขั้นที่ 2 — push ขึ้นไป

รันในโฟลเดอร์นี้ (แทน `phossatron` และชื่อ repo ให้ตรงกับของจริง):

```bash
cd "/Users/pstaex/Desktop/Beyond/Claudecode/Landing page"
git remote add origin https://github.com/beyondlabth/sale-page.git
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
https://beyondlabth.github.io/sale-page/
```

---

## ย้าย repo ไปไว้ใต้ชื่อแบรนด์ (ทำครั้งเดียว)

เป้าหมาย: `https://beyondlabth.github.io/sale-page/`

1. **สร้าง organization** → https://github.com/organizations/plan → เลือก **Free**
   - Organization name: `beyondlabth`
   - Contact email: อีเมลของคุณ · This organization belongs to: **My personal account**
2. **ย้าย repo เข้า org** → https://github.com/phossatron/Sale-page/settings
   → เลื่อนลงล่างสุด **Danger Zone** → **Transfer ownership**
   → New owner: `beyondlabth` → พิมพ์ชื่อ repo ยืนยัน
3. **เปลี่ยนชื่อ repo เป็นตัวเล็ก** → Settings → General → Repository name → `sale-page` → **Rename**
4. **ตรวจ Pages อีกครั้ง** → Settings → Pages → Branch `main` / folder `/docs` → Save
5. **อัปเดต remote ในเครื่อง**
   ```bash
   git remote set-url origin https://github.com/beyondlabth/sale-page.git
   git remote -v
   ```

> GitHub จะ redirect URL เก่าไปยัง URL ใหม่ให้ระยะหนึ่ง แต่ควรใช้ URL ใหม่ในการแชร์

## อัปเดตเว็บครั้งต่อไป

```bash
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```
Pages จะ deploy ใหม่ให้อัตโนมัติภายในไม่กี่นาที

---

## ซ่อนโหมดแก้ไขจากบุคคลอื่น

มี 2 ระดับ เลือกใช้ตามความต้องการ

### ระดับ 1 — ล็อกด้วยคีย์ลับ (ค่าเริ่มต้น ใช้อยู่แล้ว)
ผู้เข้าชมทั่วไปที่เปิด `https://beyondlabth.github.io/sale-page/`
**จะไม่เห็นแถบเครื่องมือเลย** (ถูกถอดออกจากหน้าเว็บตั้งแต่ตอนโหลด)

เข้าโหมดแก้ไขได้ 2 ทาง:
| ทาง | วิธี |
|---|---|
| เครื่องตัวเอง | เปิดจาก `localhost` / วง LAN / เปิดไฟล์ตรง ๆ → เห็นเครื่องมือทันที |
| จากที่อื่น | เปิดด้วยลิงก์ลับ `https://.../?edit=beyond2026` |

- ปลดล็อกแล้ว **คีย์จะถูกลบออกจาก URL ทันที** และจำไว้ในเบราว์เซอร์เครื่องนั้น (เปิดครั้งต่อไปไม่ต้องใส่ซ้ำ)
- **ล็อกกลับ**: กดปุ่ม 🔒 ในแถบเครื่องมือ หรือเปิดด้วย `?edit=0`
- ⚠️ **เปลี่ยนคีย์เป็นของตัวเองก่อน deploy** ที่ `EDIT_CONFIG.key` บรรทัดแรก ๆ ของ `js/editor.js`
- ⚠️ ระดับนี้เป็นการ *ซ่อน* ไม่ใช่ *ระบบความปลอดภัย* — คนที่เปิดดูซอร์สโค้ด `js/editor.js` จะเห็นคีย์ได้
  แต่ถึงเห็นก็แก้เนื้อหาเว็บจริงไม่ได้ (ไม่มี backend — แก้ได้แค่ในเบราว์เซอร์ตัวเอง)

### ระดับ 2 — build เวอร์ชันที่ไม่มีโค้ดแก้ไขเลย (แน่นอนที่สุด)

```bash
./build.sh
```

จะสร้างโฟลเดอร์ `docs/` ที่:
- **ไม่มี** `js/editor.js` และแถบเครื่องมือใน HTML
- **ไม่มี** สไตล์ของโหมดแก้ไขใน CSS (ไฟล์เล็กลงจาก 22KB → 11KB)
- ใช้ `js/viewer.js` แทน ซึ่งล็อก `EDIT_MODE = false` แบบเขียนทับไม่ได้ แม้เปิด console

จากนั้นตั้ง **Settings → Pages → Branch: `main` / folder: `/docs`** แทน `/ (root)`

วิธีทำงานประจำวัน: แก้เนื้อหาที่เครื่องตัวเอง (`localhost:8080` มีเครื่องมือครบ) →
กด 📦 สร้างไฟล์ content.js → วางทับ `js/content.js` → `./build.sh` → `git push`

---

## หมายเหตุ

- **การแก้ไขไม่มีผลกับผู้เข้าชมคนอื่น** เพราะไม่มี backend — ทุกการแก้เก็บใน localStorage ของเบราว์เซอร์คนที่แก้เท่านั้น
  เนื้อหาที่ทุกคนเห็นมาจาก `js/content.js` ที่ commit ขึ้นไปเท่านั้น
- **ฟอร์มติดต่อ** ยังเป็นตัวอย่าง ไม่ได้ส่งข้อมูลไปไหนจริง — บน static host อย่าง Pages ต้องต่อบริการภายนอก
  เช่น Formspree / Google Forms / LINE Notify ที่ฟังก์ชัน `beyondSubmit()` ใน `js/render.js`
- ทุก path ในโปรเจกต์เป็น **relative** จึงทำงานถูกต้องบน URL แบบ subpath ของ Pages (`/<repo>/`)
