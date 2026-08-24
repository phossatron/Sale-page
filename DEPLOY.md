# ขึ้นเว็บ (Deploy)

repo: https://github.com/phossatron/Sale-page (branch `main`)
โครงสร้างพร้อม deploy แล้วทั้ง **Vercel** และ **GitHub Pages**

---

# วิธีหลัก — Vercel (แนะนำ)

ได้ URL สั้น `https://<ชื่อโปรเจกต์>.vercel.app` · deploy ใหม่อัตโนมัติทุกครั้งที่ `git push` · ฟรี HTTPS

## ขั้นตอน (ครั้งแรกครั้งเดียว)

1. เข้า https://vercel.com/signup → **Continue with GitHub** (ล็อกอินด้วยบัญชี GitHub)
2. ไปที่ https://vercel.com/new → เลือก repo **`Sale-page`** → **Import**
   - ถ้าไม่เห็น repo ให้กด *Adjust GitHub App Permissions* แล้วอนุญาต repo นี้
3. หน้า Configure Project — **ไม่ต้องแก้อะไร** เพราะไฟล์ `vercel.json` ตั้งค่าไว้ให้แล้ว
   (Framework: Other · Build Command: `bash build.sh` · Output Directory: `docs`)
   - **Project Name** = ส่วนหน้าของ URL → ตั้งเป็น `beyondlabth` จะได้ `https://beyondlabth.vercel.app`
     (ชื่อที่ตรวจแล้วว่าว่าง: `beyondlabth`, `beyondlab-sale`, `beyond-sale` — ส่วน `beyondlab`, `sale-page` ถูกใช้แล้ว)
4. กด **Deploy** → รอประมาณ 30 วินาที → เว็บขึ้นแล้ว

## หลังจากนี้ อัปเดตเว็บแค่ push

```bash
git add -A && git commit -m "update content" && git push
```
Vercel จะรัน `build.sh` ให้เองแล้ว deploy ทับให้อัตโนมัติภายในไม่ถึงนาที

> `build.sh` จะสร้างโฟลเดอร์ `docs/` ที่**ตัดโค้ดโหมดแก้ไขออกหมด** แล้ว Vercel จะ deploy เฉพาะโฟลเดอร์นั้น
> ผู้เข้าชมจึงไม่มีทางเห็นเครื่องมือแก้ไข ไม่ว่าจะเปิดดูซอร์สโค้ดหรือ console ก็ตาม

## ผูกโดเมนของบริษัท (ทำเมื่อไหร่ก็ได้)

Vercel → Project → **Settings → Domains** → Add เช่น `sale.beyondlab.co.th`
แล้วเพิ่ม DNS record ที่ผู้ให้บริการโดเมน:

| Type | Name | Value |
|---|---|---|
| CNAME | `sale` | `cname.vercel-dns.com` |

Vercel ออกใบรับรอง HTTPS ให้อัตโนมัติภายในไม่กี่นาที

## ⚠️ เรื่องแผนการใช้งาน

แผน **Hobby (ฟรี)** ของ Vercel ระบุในเงื่อนไขว่าใช้สำหรับงาน**ที่ไม่ใช่เชิงพาณิชย์**
หน้า sale page ของบริษัทถือเป็นการใช้งานเชิงพาณิชย์ → ตามเงื่อนไขต้องใช้แผน **Pro (~$20/เดือน)**

ถ้าต้องการโฮสต์ฟรีที่อนุญาตงานเชิงพาณิชย์ชัดเจน ใช้ **GitHub Pages** (ด้านล่าง) หรือ **Netlify** แทนได้
ทั้งสองที่ใช้ไฟล์ชุดเดียวกันนี้ได้เลย

---

# วิธีสำรอง — GitHub Pages

1. https://github.com/phossatron/Sale-page/settings/pages
2. Source: `Deploy from a branch` · Branch: `main` · Folder: **`/docs`** → Save
3. เว็บขึ้นที่ `https://phossatron.github.io/Sale-page/`

ทุกครั้งที่แก้เนื้อหา ต้องรัน `./build.sh` เองก่อน push (ต่างจาก Vercel ที่ build ให้อัตโนมัติ)

---

# รอบการทำงานประจำวัน

```bash
# 1. เปิดเซิร์ฟเวอร์ในเครื่อง (มีโหมดแก้ไขครบ)
python3 -m http.server 8080     # → http://localhost:8080

# 2. แก้เนื้อหาบนหน้าเว็บ → กด 📦 สร้างไฟล์ content.js
# 3. เอาไฟล์ที่ดาวน์โหลดมาวางทับ js/content.js
# 4. ส่งขึ้นเว็บ
git add -A && git commit -m "update content" && git push
```

---

# ใครเห็นโหมดแก้ไขได้บ้าง

| ที่ | เห็นเครื่องมือแก้ไข? |
|---|---|
| เว็บจริง (Vercel / Pages) | ❌ ไม่เห็น — โค้ดถูกตัดออกตั้งแต่ตอน build |
| `localhost` / วง LAN / เปิดไฟล์ตรง ๆ | ✅ เห็นครบ |
| เปิดไฟล์ `index.html` ต้นฉบับ + `?edit=beyond2026` | ✅ เห็นครบ |

- เปลี่ยนคีย์ลับได้ที่ `EDIT_CONFIG.key` ในหัวไฟล์ `js/editor.js`
- ปุ่ม 🔒 ในแถบเครื่องมือ ใช้ล็อกกลับเป็นมุมมองผู้เข้าชม

---

# หมายเหตุ

- **การแก้ไขไม่มีผลกับผู้เข้าชมคนอื่น** เพราะไม่มี backend — ทุกการแก้เก็บใน localStorage ของเบราว์เซอร์คนที่แก้เท่านั้น
  เนื้อหาที่ทุกคนเห็นมาจาก `js/content.js` ที่ commit ขึ้นไปเท่านั้น
- **ฟอร์มติดต่อ** ยังเป็นตัวอย่าง ไม่ได้ส่งข้อมูลไปไหนจริง — ต่อบริการภายนอกได้ที่ฟังก์ชัน `beyondSubmit()` ใน `js/render.js`
  (เช่น Formspree, Google Forms, LINE Notify หรือ Vercel Serverless Function)
- ทุก path เป็น **relative** จึงทำงานถูกต้องทั้งบน URL root (Vercel) และ subpath (`/Sale-page/` ของ Pages)
