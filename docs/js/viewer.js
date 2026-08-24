/* ============================================================
   viewer.js — รันหน้าเว็บแบบอ่านอย่างเดียว
   ใช้แทน editor.js ในไฟล์ที่ build ไป deploy (โฟลเดอร์ docs/)
   ไม่มีโค้ดโหมดแก้ไขอยู่ในหน้าเลยแม้แต่บรรทัดเดียว
   ============================================================ */
var store = {
  data: window.DEFAULT_CONTENT,
  get: function (path) {
    return path.split('.').reduce(function (o, k) {
      return (o === undefined || o === null) ? undefined : o[k];
    }, this.data);
  }
};
// ล็อกค่าไว้ถาวร — แม้เปิด console พิมพ์ทับก็เปลี่ยนไม่ได้
try {
  Object.defineProperty(window, 'EDIT_MODE', { value: false, writable: false, configurable: false });
} catch (e) { window.EDIT_MODE = false; }
document.addEventListener('DOMContentLoaded', function () { renderAll(); });
