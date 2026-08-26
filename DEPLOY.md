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

## แก้เนื้อหาจากมือถือหรือที่อื่น (ไม่ต้องใช้คอม)

### ลิงก์หน้าผู้ดูแล
```
https://phossatron.github.io/Sale-page/admin/
```
- **ไม่ต้องใส่คีย์** — ตัว path `/admin/` เองคือความลับ ใครเปิดลิงก์นี้ได้ก็ใช้เครื่องมือแก้ไขได้ทันที
  (ส่งลิงก์นี้ให้ทีมงานได้เลย ใช้ได้ทุกเครื่อง ทุกเบราว์เซอร์ ไม่ว่าจะเคยเปิดมาก่อนหรือไม่)
- หน้านี้ตั้ง `noindex` ไว้ Google จะไม่เก็บเข้าระบบค้นหา
- **การแก้ในหน้านี้ยังไม่กระทบเว็บจริง** จนกว่าจะกด 🚀 เผยแพร่ขึ้นเว็บ ซึ่งต้องใช้ GitHub token
  → คนที่บังเอิญเจอ `/admin/` แก้เว็บจริงไม่ได้ ป้องกันชั้นจริงอยู่ที่ token
- ถ้าต้องการกลับไปใช้ระบบคีย์ ตั้ง `adminPathOpen: false` ใน `EDIT_CONFIG` ที่หัวไฟล์ `js/editor.js`
- **บุ๊กมาร์กลิงก์นี้ไว้ในมือถือ** จะได้เปิดง่าย

### เผยแพร่ขึ้นเว็บจริงจากมือถือ
กดปุ่ม **🚀 เผยแพร่ขึ้นเว็บ** ในแถบเครื่องมือ ระบบจะ commit ไฟล์ `content.js` ทั้ง 3 จุดเข้า GitHub ให้เอง
เว็บจริงจะเปลี่ยนตามภายใน 1–2 นาที **ไม่ต้องใช้ Terminal ไม่ต้องรัน build.sh**

ครั้งแรกต้องใส่ GitHub token หนึ่งครั้ง:
1. เปิด https://github.com/settings/personal-access-tokens/new
2. **Repository access** → Only select repositories → เลือก `Sale-page`
3. **Permissions** → Repository permissions → **Contents** = **Read and write**
4. ตั้ง Expiration ตามต้องการ → Generate token → คัดลอกมาวางในช่องที่ระบบถาม

> ⚠️ token จะถูกเก็บใน localStorage ของเบราว์เซอร์เครื่องนั้น ใครที่หยิบเครื่องไปใช้ได้ก็แก้เว็บได้
> ใช้ token แบบ fine-grained ที่จำกัดเฉพาะ repo นี้และสิทธิ์ Contents เท่านั้น และตั้งวันหมดอายุไว้เสมอ
> ยกเลิกได้ตลอดที่ https://github.com/settings/tokens (หรือกด "ลบ token ออกจากเครื่องนี้" ในหน้าต่างเดิม)

### ข้อควรระวังเรื่องเนื้อหาไม่ตรงกันระหว่างอุปกรณ์
แต่ละเครื่องเก็บงานที่แก้ค้างไว้ของตัวเองใน localStorage
**เปิดแก้จากเครื่องใหม่ ให้กด `↺ คืนค่าเริ่มต้น` ก่อนเสมอ** เพื่อดึงเนื้อหาล่าสุดที่เผยแพร่แล้วมาเป็นตัวตั้งต้น
(ถ้าแก้จากคอม ให้ `git pull` ก่อนแก้ไฟล์ด้วย เพราะการเผยแพร่จากมือถือได้ commit เข้า repo ไปแล้ว)

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
| `/admin/` บนเว็บจริง | ✅ เห็นครบ (หน้าผู้ดูแล ไม่ต้องใส่คีย์) |

- เปลี่ยนคีย์ลับได้ที่ `EDIT_CONFIG.key` ในหัวไฟล์ `js/editor.js`
- ปุ่ม 🔒 ในแถบเครื่องมือ ใช้ล็อกกลับเป็นมุมมองผู้เข้าชม

---

## ผูกโดเมนของบริษัท — international.beyondlab.co.th

เป้าหมาย: `https://international.beyondlab.co.th/` แทน `phossatron.github.io/Sale-page/`

### ขั้นที่ 1 — เพิ่ม DNS record (ต้องทำก่อนเสมอ)

ที่ระบบจัดการ DNS ของโดเมน **beyondlab.co.th** เพิ่ม 1 record:

| Type | Name / Host | Value / Points to | TTL |
|---|---|---|---|
| `CNAME` | `international` | `phossatron.github.io` | Auto (หรือ 3600) |

> ค่า Value คือ `phossatron.github.io` **เท่านั้น** ไม่ต้องมี `/Sale-page` ต่อท้าย
> บางผู้ให้บริการต้องใส่จุดปิดท้ายเป็น `phossatron.github.io.`

### ขั้นที่ 2 — รอ DNS มีผล แล้วค่อยเปิดใช้

ตรวจว่า DNS พร้อมหรือยัง:
```bash
dig +short international.beyondlab.co.th
# ต้องได้ phossatron.github.io. ตามด้วยหมายเลข IP ของ GitHub (185.199.108-111.153)
```

เมื่อขึ้นแล้วจึงเปิดใช้:
```bash
cd "/Users/pstaex/Desktop/Beyond/Claudecode/Landing page"
sed -i '' 's|CUSTOM_DOMAIN=""|CUSTOM_DOMAIN="international.beyondlab.co.th"|' build.sh
./build.sh
git add -A && git commit -m "Point the site at international.beyondlab.co.th" && git push
```

### ขั้นที่ 3 — เปิด HTTPS

GitHub จะอ่านไฟล์ `docs/CNAME` แล้วตั้งค่า Custom domain ให้เอง
รอประมาณ 15 นาทีให้ออกใบรับรอง แล้วเข้า Settings → Pages → ติ๊ก **Enforce HTTPS**

### ⚠️ ลำดับสำคัญมาก
**ห้ามเปิด `CUSTOM_DOMAIN` ก่อนเพิ่ม DNS** เพราะ GitHub จะ redirect เว็บเดิมไปโดเมนใหม่ทันที
ถ้า DNS ยังไม่พร้อม เว็บจะเข้าไม่ได้ทั้งหมดจนกว่า DNS จะมีผล

### URL หลังเปลี่ยนเสร็จ
| เดิม | ใหม่ |
|---|---|
| `phossatron.github.io/Sale-page/` | `international.beyondlab.co.th/` |
| `phossatron.github.io/Sale-page/admin/` | `international.beyondlab.co.th/admin/` |

URL เดิมจะ redirect มาที่โดเมนใหม่ให้อัตโนมัติ

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
