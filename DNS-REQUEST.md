# คำขอเพิ่ม DNS record — สำหรับส่งให้ผู้ดูแลโดเมน

โดเมน: **beyondlab.co.th**
วัตถุประสงค์: ชี้ซับโดเมน `international` ไปยังเว็บ landing page สำหรับตลาดต่างประเทศ

---

## ฉบับภาษาไทย (ส่งให้ทีม IT / ผู้ดูแลเว็บบริษัท)

> **เรื่อง: ขอเพิ่ม DNS record 1 รายการ สำหรับโดเมน beyondlab.co.th**
>
> เรียน ผู้ดูแลระบบ
>
> บริษัทกำลังจัดทำหน้าเว็บ landing page สำหรับลูกค้าต่างประเทศ โดยใช้บริการโฮสต์ของ GitHub Pages
> รบกวนเพิ่ม DNS record ให้ 1 รายการ ตามรายละเอียดด้านล่างครับ
>
> | หัวข้อ | ค่าที่ต้องใส่ |
> |---|---|
> | Type | `CNAME` |
> | Name / Host | `international` |
> | Value / Target / Points to | `phossatron.github.io` |
> | TTL | Auto หรือ 3600 |
>
> **หมายเหตุสำคัญ**
> - ค่า Value คือ `phossatron.github.io` เท่านั้น ไม่ต้องมี `https://` และไม่ต้องมี path ต่อท้าย
> - บางระบบต้องใส่จุดปิดท้ายเป็น `phossatron.github.io.`
> - บางระบบต้องกรอกช่อง Name เป็นชื่อเต็ม `international.beyondlab.co.th`
>
> **รายการนี้ไม่กระทบระบบเดิมใด ๆ**
> เป็นการเพิ่มซับโดเมนใหม่เท่านั้น ไม่แตะต้อง record ของเว็บไซต์หลัก (beyondlab.co.th / www)
> และไม่แตะ MX record จึงไม่กระทบระบบอีเมลของบริษัท
>
> เมื่อดำเนินการเรียบร้อยแล้ว รบกวนแจ้งกลับด้วยครับ จะได้ตรวจสอบและเปิดใช้งาน HTTPS ต่อไป
> (โดยปกติ DNS จะมีผลภายใน 5–30 นาที)
>
> ขอบคุณครับ

---

## English version (for an international registrar or hosting provider)

> **Subject: Request to add one DNS record for beyondlab.co.th**
>
> Hello,
>
> We are launching a landing page for our international customers, hosted on GitHub Pages.
> Could you please add the following DNS record to the **beyondlab.co.th** zone?
>
> | Field | Value |
> |---|---|
> | Type | `CNAME` |
> | Name / Host | `international` |
> | Value / Target | `phossatron.github.io` |
> | TTL | Auto (or 3600) |
>
> Notes:
> - The target is `phossatron.github.io` only — no protocol prefix and no path.
> - Some control panels require a trailing dot: `phossatron.github.io.`
> - Some panels require the fully qualified host: `international.beyondlab.co.th`
>
> This adds a new subdomain only. It does not modify the records for the main website
> (`beyondlab.co.th` / `www`) and does not touch the MX records, so company email is unaffected.
>
> Please confirm once the record is live so we can enable HTTPS on our side.
>
> Thank you.

---

## ถ้าผู้ดูแลถามเพิ่มเติม

**ถาม: ทำไมต้องเป็น CNAME ไม่ใช่ A record?**
สำหรับซับโดเมน GitHub แนะนำให้ใช้ CNAME เพราะ GitHub เปลี่ยน IP ของเซิร์ฟเวอร์ได้ตลอด
ถ้าใช้ A record จะต้องคอยตามแก้ IP เอง (ถ้าระบบไม่รองรับ CNAME จริง ๆ ใช้ A record 4 รายการ
ชี้ไปที่ `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` แทนได้)

**ถาม: ต้องเพิ่ม TXT record เพื่อยืนยันตัวตนไหม?**
ไม่จำเป็นสำหรับการใช้งานแบบนี้ แต่ถ้าต้องการความปลอดภัยเพิ่ม (กันคนอื่นมาอ้างสิทธิ์ซับโดเมน)
สามารถขอค่ายืนยันจาก GitHub มาเพิ่มเป็น TXT record ที่ `_github-pages-challenge-phossatron` ได้

**ถาม: จะมีค่าใช้จ่ายไหม?**
ไม่มี เป็นการเพิ่ม record ในโดเมนที่บริษัทมีอยู่แล้ว และ GitHub Pages ให้ใช้ฟรีพร้อม HTTPS

---

## ตรวจสอบเองได้ว่าเสร็จหรือยัง

```bash
dig +short international.beyondlab.co.th
```
ถ้าขึ้นแบบนี้แปลว่าเรียบร้อย:
```
phossatron.github.io.
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

เช็คแบบไม่ใช้ Terminal: เปิด https://dnschecker.org แล้วค้นหา `international.beyondlab.co.th` เลือกชนิด CNAME
