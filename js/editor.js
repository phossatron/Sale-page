/* ============================================================
   สิทธิ์เข้าโหมดแก้ไข — ตั้งค่าตรงนี้
   ------------------------------------------------------------
   ค่าเริ่มต้น: ผู้เข้าชมทั่วไป "ไม่เห็นแถบเครื่องมือเลย"
   เปิดโหมดแก้ไขได้ 2 ทาง
     1) เปิดจากเครื่องตัวเอง (localhost / ไฟล์ในเครื่อง / วง LAN)
     2) เปิดเว็บด้วยลิงก์ลับ  https://.../?edit=beyond2026
        เมื่อปลดล็อกแล้ว คีย์จะถูกลบออกจาก URL และจำไว้ในเบราว์เซอร์เครื่องนั้น
   ล็อกกลับ: กดปุ่ม 🔒 ในแถบเครื่องมือ หรือเปิดด้วย ?edit=0
   ============================================================ */
var EDIT_CONFIG = {
  key: 'beyond2026',      // ⚠️ เปลี่ยนเป็นคำลับของคุณเอง
  allowLocal: true,       // เปิดจาก localhost / LAN แล้วแก้ได้เลยโดยไม่ต้องใส่คีย์
  remember: true          // จำการปลดล็อกไว้ในเบราว์เซอร์เครื่องนั้น
};
var UNLOCK_KEY = 'beyondlab.editor.unlocked';
var IS_PREVIEW = /[?&]preview=1/.test(location.search);

function qparam(name) {
  var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
  return m ? decodeURIComponent(m[1]) : null;
}
function isLocalHost() {
  var h = location.hostname;
  return location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(h) ||
    /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h);
}
function localAllowed() { return EDIT_CONFIG.allowLocal && isLocalHost(); }
function stripEditParam() {
  if (!history.replaceState) return;
  var q = location.search.replace(/([?&])edit=[^&]*&?/, '$1').replace(/[?&]$/, '');
  history.replaceState(null, '', location.pathname + q + location.hash);
}
function setUnlocked(on) {
  try { on ? localStorage.setItem(UNLOCK_KEY, '1') : localStorage.removeItem(UNLOCK_KEY); } catch (e) {}
}
function isUnlocked() {
  try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch (e) { return false; }
}
// ผู้ใช้คนนี้มีสิทธิ์เห็นเครื่องมือแก้ไขหรือไม่
function editorAllowed() {
  if (IS_PREVIEW) return false;                       // หน้ามุมมองผู้เข้าชม ไม่มีเครื่องมือเด็ดขาด
  var k = qparam('edit');
  if (k !== null) {
    if (k === EDIT_CONFIG.key) { if (EDIT_CONFIG.remember) setUnlocked(true); stripEditParam(); return true; }
    if (k === '0' || k === 'off' || k === 'lock') { setUnlocked(false); stripEditParam(); return false; }
    stripEditParam();                                  // คีย์ผิด — ทำเหมือนผู้เข้าชมทั่วไป
  }
  return isUnlocked() || localAllowed();
}

/* ============================================================
   editor.js — store ข้อมูล + โหมดแก้ไขหน้าเว็บ
   บันทึกอัตโนมัติลง localStorage, ส่งออก/นำเข้าเป็นไฟล์ JSON
   ============================================================ */
var STORAGE_KEY = 'beyondlab.content.v1';
function esc(v) { return String(v == null ? '' : v); }

var store = {
  data: null,
  load: function () {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    this.data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
    return this.data;
  },
  save: function () {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); flash('บันทึกแล้ว'); }
    catch (e) { flash('บันทึกไม่สำเร็จ: ' + e.message, true); }
  },
  reset: function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    this.data = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
  },
  get: function (path) {
    return path.split('.').reduce(function (o, k) {
      return (o === undefined || o === null) ? undefined : o[k];
    }, this.data);
  },
  set: function (path, val) {
    var keys = path.split('.'), last = keys.pop();
    var obj = keys.reduce(function (o, k) { if (o[k] === undefined) o[k] = {}; return o[k]; }, this.data);
    obj[last] = val;
  }
};

/* ---------- แม่แบบสำหรับ "เพิ่มรายการ" ของแต่ละลิสต์ ---------- */
var TEMPLATES = {
  'header.nav':            { label: 'New menu item', href: '#' },
  'hero.features':         { icon: 'sparkle', title: 'New highlight', desc: 'Short supporting line' },
  'hero.buttons':          { label: 'New button', href: '#contact', style: 'ghost', icon: 'arrow' },
  'trust.logos':           { label: 'BRAND' },
  'trust.stats':           { num: '0+', label: 'New metric' },
  'problems.items':        { icon: 'chat', title: 'New challenge', desc: 'Describe the challenge' },
  'services.items':        { icon: 'sparkle', title: 'New service', desc: 'Describe the service' },
  'pricing.cards':         { image: 'assets/product-capsule.svg', ribbon: 'Ready to sell', title: 'New package<br><span class="hl">All-inclusive from</span>', price: '00,000', unit: 'THB', bullets: ['Production included'], note: '(Terms and conditions apply.)', badge: 'Minimum 1,000 units', badgeSub: '' },
  'about.items':           { icon: 'sparkle', label: 'New highlight' },
  'testimonials.items':    { rating: 5, text: '\u201cClient testimonial goes here...\u201d', author: '\u2014 Name, Brand Owner' },
  'faq.items':             { q: 'New question?', a: 'Answer...' },
  'contact.channels':      { icon: 'phone', label: '+66 00 000 0000', href: '#' },
  'contact.socials':       { icon: 'facebook', href: '#' },
  'contact.form.fields':   { type: 'text', label: 'New field', name: 'field' + Date.now() % 1000 },
  'floating.items':        { icon: 'line', label: 'New channel', href: '#' }
};
function newItem(path) {
  if (TEMPLATES[path]) return JSON.parse(JSON.stringify(TEMPLATES[path]));
  if (/\.bullets$/.test(path)) return 'New line item';
  var arr = store.get(path);
  if (arr && arr.length) return JSON.parse(JSON.stringify(arr[arr.length - 1]));
  return 'New text';
}

/* ---------- UI helpers ---------- */
function flash(msg, isErr) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show' + (isErr ? ' err' : '');
  clearTimeout(flash._t);
  flash._t = setTimeout(function () { el.className = 'toast'; }, 1800);
}
var dirty = false;
function touch() { dirty = true; clearTimeout(touch._t); touch._t = setTimeout(function () { store.save(); }, 800); }

/* ---------- โหมดแก้ไข ---------- */
var editing = false;
window.EDIT_MODE = false;   // render.js ใช้ตัวนี้ตัดสินว่าจะสร้างปุ่มเครื่องมือลง DOM หรือไม่

function setEditing(on, silent) {
  editing = on;
  window.EDIT_MODE = on;
  document.body.classList.toggle('editing', on);
  renderAll();              // วาดใหม่ — ออกจากโหมดแก้ไขแล้วปุ่มเครื่องมือจะหายจาก DOM จริง ๆ
  var btn = document.getElementById('btn-edit');
  if (btn) btn.textContent = on ? '✓ เสร็จสิ้นการแก้ไข' : '✏️ โหมดแก้ไข';
  if (!silent) flash(on ? 'เปิดโหมดแก้ไข — คลิกที่ข้อความเพื่อพิมพ์ทับได้เลย' : 'ปิดโหมดแก้ไข');
}

// เรียกทุกครั้งหลังวาดหน้าใหม่ — เปิดให้พิมพ์แก้ข้อความได้เมื่ออยู่ในโหมดแก้ไข
window.afterRender = function () {
  if (!window.EDIT_MODE) return;
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    el.contentEditable = 'true';
    el.spellcheck = false;
  });
};

/* ---------- เปลี่ยนรูป + ปรับให้พอดีช่อง ---------- */

// ย่อรูปให้พอดีขนาดสูงสุดของช่องนั้น ๆ ก่อนเก็บเป็น Base64
function fitImageFile(file, max, cb) {
  var reader = new FileReader();
  // SVG / GIF ย่อด้วย canvas ไม่ได้ (จะเสียภาพเคลื่อนไหว/เวกเตอร์) ใช้ไฟล์เดิม
  if (/svg|gif/i.test(file.type)) {
    reader.onload = function () { cb(reader.result, { skipped: true, bytes: Math.round(reader.result.length * 0.75) }); };
    reader.readAsDataURL(file);
    return;
  }
  reader.onload = function () {
    var im = new Image();
    im.onload = function () {
      var w = im.naturalWidth, h = im.naturalHeight;
      var scale = Math.min(1, max / Math.max(w, h));
      var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
      var c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      var ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      var keepAlpha = /png|webp/i.test(file.type);
      if (!keepAlpha) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cw, ch); }
      ctx.drawImage(im, 0, 0, cw, ch);
      var out = keepAlpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86);
      // ถ้า PNG ยังใหญ่เกินไป แปลงเป็น JPEG แทน
      if (out.length > 1200000) out = c.toDataURL('image/jpeg', 0.86);
      cb(out, { w: w, h: h, cw: cw, ch: ch, bytes: Math.round(out.length * 0.75) });
    };
    im.onerror = function () { cb(reader.result, null); };
    im.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function kb(bytes) {
  return bytes > 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
}

var FIT_LABELS = [
  ['cover',   'เต็มกรอบ (ครอบตัดส่วนเกิน)'],
  ['contain', 'เห็นทั้งรูป (มีขอบว่าง)'],
  ['fill',    'ยืดเต็มกรอบ (สัดส่วนเพี้ยน)']
];
var POS_LABELS = [
  ['center',        'กึ่งกลาง'],
  ['top center',    'ชิดบน'],
  ['bottom center', 'ชิดล่าง'],
  ['left center',   'ชิดซ้าย'],
  ['right center',  'ชิดขวา']
];

function changeImage(path) {
  var cur = store.get(path) || '';
  var o = window.imgOpt(path);
  var draft = { src: cur, fit: o.fit, pos: o.pos };
  var m = document.getElementById('modal');

  m.innerHTML =
    '<div class="modal-card">' +
      '<h3>เปลี่ยนรูปภาพ — ' + o.name + '</h3>' +
      '<p class="hint">รูปจะถูกย่อและจัดให้พอดีกับช่องนี้โดยอัตโนมัติ (ขนาดสูงสุด ' + o.max + 'px) ' +
        'กรอบตัวอย่างด้านล่างคือสัดส่วนจริงบนหน้าเว็บ</p>' +
      '<div class="slot-preview"><span class="imgbox" style="' + (o.box || 'aspect-ratio:4/3') + '">' +
        '<img id="m-prev" src="' + esc(cur) + '" alt="" style="object-fit:' + o.fit + ';object-position:' + o.pos + '">' +
      '</span></div>' +
      '<p class="hint" id="m-info"></p>' +
      '<div class="two">' +
        '<label class="field"><span>การจัดวางรูปในกรอบ</span><select id="m-fit">' +
          FIT_LABELS.map(function (f) {
            return '<option value="' + f[0] + '"' + (f[0] === o.fit ? ' selected' : '') + '>' + f[1] + '</option>';
          }).join('') + '</select></label>' +
        '<label class="field"><span>ตำแหน่งที่ต้องการให้เห็น</span><select id="m-pos">' +
          POS_LABELS.map(function (f) {
            return '<option value="' + f[0] + '"' + (f[0] === o.pos ? ' selected' : '') + '>' + f[1] + '</option>';
          }).join('') + '</select></label>' +
      '</div>' +
      '<label class="field"><span>อัปโหลดจากเครื่อง</span><input id="m-file" type="file" accept="image/*"></label>' +
      '<label class="field"><span>หรือใส่ลิงก์รูป / path ในโฟลเดอร์ assets</span>' +
        '<input id="m-url" value="' + esc(cur).replace(/"/g, '&quot;') + '"></label>' +
      '<div class="modal-act">' +
        '<button class="btn ghost sm" id="m-default" type="button">คืนค่าการจัดวางเริ่มต้น</button>' +
        '<span class="spacer"></span>' +
        '<button class="btn ghost" id="m-cancel" type="button">ยกเลิก</button>' +
        '<button class="btn primary" id="m-ok" type="button">บันทึก</button>' +
      '</div>' +
    '</div>';
  m.classList.add('open');

  var prev = m.querySelector('#m-prev'),
      urlInput = m.querySelector('#m-url'),
      fitSel = m.querySelector('#m-fit'),
      posSel = m.querySelector('#m-pos'),
      info = m.querySelector('#m-info');

  function paint() {
    prev.src = draft.src;
    prev.style.objectFit = draft.fit;
    prev.style.objectPosition = draft.pos;
  }
  fitSel.onchange = function () { draft.fit = fitSel.value; paint(); };
  posSel.onchange = function () { draft.pos = posSel.value; paint(); };
  urlInput.addEventListener('input', function () { draft.src = urlInput.value; info.textContent = ''; paint(); });

  m.querySelector('#m-file').addEventListener('change', function (e) {
    var f = e.target.files[0];
    if (!f) return;
    info.textContent = 'กำลังปรับขนาดรูป...';
    fitImageFile(f, o.max, function (dataUrl, meta) {
      draft.src = dataUrl;
      urlInput.value = '(ไฟล์ที่อัปโหลด)';
      info.textContent = !meta ? ''
        : meta.skipped ? 'ไฟล์ ' + f.name + ' — ' + kb(meta.bytes) + ' (เวกเตอร์/ภาพเคลื่อนไหว ไม่ต้องย่อ)'
        : 'ย่อจาก ' + meta.w + '×' + meta.h + ' → ' + meta.cw + '×' + meta.ch + ' (' + kb(meta.bytes) + ')' +
          (meta.bytes > 900000 ? ' ⚠️ ไฟล์ยังใหญ่ แนะนำให้บีบอัดก่อนอัปโหลด' : '');
      paint();
    });
  });

  m.querySelector('#m-default').onclick = function () {
    var s0 = window.slotOf(path);
    draft.fit = s0.fit; draft.pos = s0.pos;
    fitSel.value = s0.fit; posSel.value = s0.pos;
    paint();
  };
  m.querySelector('#m-cancel').onclick = closeModal;
  m.querySelector('#m-ok').onclick = function () {
    if (draft.src && draft.src !== '(ไฟล์ที่อัปโหลด)') store.set(path, draft.src);
    var s0 = window.slotOf(path);
    if (!store.data.imageSettings) store.data.imageSettings = {};
    if (draft.fit === s0.fit && draft.pos === s0.pos) delete store.data.imageSettings[path];
    else store.data.imageSettings[path] = { fit: draft.fit, pos: draft.pos };
    closeModal(); renderAll(); touch(); flash('อัปเดตรูปแล้ว');
  };
}

/* ---------- เลือกไอคอน ---------- */
function pickIcon(path) {
  var m = document.getElementById('modal');
  var cur = store.get(path);
  m.innerHTML = '<div class="modal-card"><h3>เลือกไอคอน</h3><div class="icon-grid">' +
    Object.keys(window.ICONS).map(function (k) {
      return '<button type="button" class="ip' + (k === cur ? ' on' : '') + '" data-ic="' + k + '" title="' + k + '">' + icon(k) + '</button>';
    }).join('') +
    '</div><div class="modal-act"><button class="btn ghost" id="m-cancel">ปิด</button></div></div>';
  m.classList.add('open');
  m.querySelector('#m-cancel').onclick = closeModal;
  m.querySelectorAll('.ip').forEach(function (b) {
    b.onclick = function () { store.set(path, b.dataset.ic); closeModal(); renderAll(); touch(); };
  });
}
function closeModal() { var m = document.getElementById('modal'); m.classList.remove('open'); m.innerHTML = ''; }

/* ---------- event delegation ---------- */
document.addEventListener('input', function (e) {
  var el = e.target;
  if (el.hasAttribute && el.hasAttribute('data-bind') && window.EDIT_MODE) {
    store.set(el.getAttribute('data-bind'), el.innerHTML.trim());
    touch();
  }
  if (el.dataset && el.dataset.input) { store.set(el.dataset.input, el.value); touch(); }
  if (el.dataset && el.dataset.inputList) {
    store.set(el.dataset.inputList, el.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean));
    touch();
  }
});

document.addEventListener('change', function (e) {
  var el = e.target;
  if (el.dataset && (el.dataset.input || el.dataset.inputList)) { renderAll(); }
});

document.addEventListener('click', function (e) {
  // แก้ข้อความในหัวข้อ FAQ โดยไม่ให้กล่องพับ/กางเอง
  if (window.EDIT_MODE && e.target.closest &&
      e.target.closest('summary') && e.target.closest('[data-bind]')) {
    e.preventDefault();
  }
  var t = e.target.closest('[data-img],[data-icon],[data-add],[data-del],[data-move]');
  if (!t || !window.EDIT_MODE) {
    // ปิดลิงก์ที่เป็น "#" ไม่ให้กระโดด
    return;
  }
  e.preventDefault(); e.stopPropagation();

  if (t.dataset.img) return changeImage(t.dataset.img);
  if (t.dataset.icon) return pickIcon(t.dataset.icon);

  if (t.dataset.add) {
    var p = t.dataset.add, arr = store.get(p) || [];
    arr.push(newItem(p)); store.set(p, arr); renderAll(); touch(); flash('เพิ่มรายการแล้ว');
    return;
  }
  if (t.dataset.del) {
    var d = t.dataset.del.split('|'), lp = d[0], i = +d[1], a = store.get(lp);
    if (a.length <= 1 && !confirm('นี่เป็นรายการสุดท้ายของกลุ่มนี้ ต้องการลบหรือไม่?')) return;
    if (a.length > 1 && !confirm('ลบรายการนี้?')) return;
    a.splice(i, 1); renderAll(); touch(); flash('ลบแล้ว');
    return;
  }
  if (t.dataset.move) {
    var mv = t.dataset.move.split('|'), lp2 = mv[0], idx = +mv[1], dir = +mv[2], arr2 = store.get(lp2);
    var j = idx + dir;
    if (j < 0 || j >= arr2.length) return;
    var tmp = arr2[idx]; arr2[idx] = arr2[j]; arr2[j] = tmp;
    renderAll(); touch();
    return;
  }
});

// วาง (paste) เป็นข้อความล้วน กันฟอร์แมตแปลกปลอม
document.addEventListener('paste', function (e) {
  if (!editing || !e.target.hasAttribute || !e.target.hasAttribute('data-bind')) return;
  e.preventDefault();
  var txt = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, txt);
});


/* ============================================================
   มุมมองผู้เข้าชม (Visitor preview)
   แสดงหน้าเว็บอย่างที่ "บุคคลอื่น" เห็นจริง — ไม่มีเครื่องมือแก้ไข
   พร้อมจำลองขนาดหน้าจอ มือถือ / แท็บเล็ต / โน้ตบุ๊ก / จอใหญ่
   ============================================================ */
var DEVICES = [
  { id: 'mobile',  label: '📱 มือถือ',    w: 390,  h: 844  },
  { id: 'tablet',  label: '📲 แท็บเล็ต',  w: 820,  h: 1180 },
  { id: 'laptop',  label: '💻 โน้ตบุ๊ก',  w: 1280, h: 800  },
  { id: 'desktop', label: '🖥 จอใหญ่',    w: 1600, h: 900  }
];
var pv = { device: 'laptop', landscape: false, open: false };

function previewURL() {
  return location.pathname + '?preview=1&t=' + Date.now();
}

function openPreview() {
  store.save();                       // ให้ iframe อ่านเนื้อหาล่าสุด
  if (editing) setEditing(false, true);
  pv.open = true;

  var el = document.getElementById('preview');
  el.innerHTML =
    '<div class="pv-bar">' +
      '<span class="pv-title">👁 มุมมองผู้เข้าชม</span>' +
      '<span class="pv-devices">' +
        DEVICES.map(function (d) {
          return '<button type="button" class="pv-dev' + (d.id === pv.device ? ' on' : '') + '" data-dev="' + d.id + '">' + d.label + '</button>';
        }).join('') +
      '</span>' +
      '<button type="button" class="pv-btn" id="pv-rotate" title="สลับแนวตั้ง/แนวนอน">⟳ หมุนจอ</button>' +
      '<span class="pv-size" id="pv-size"></span>' +
      '<span class="pv-spacer"></span>' +
      '<button type="button" class="pv-btn" id="pv-reload">↻ โหลดใหม่</button>' +
      '<a class="pv-btn" id="pv-newtab" href="' + previewURL() + '" target="_blank" rel="noopener">↗ เปิดแท็บใหม่</a>' +
      '<button type="button" class="pv-btn close" id="pv-close">✕ ปิด (Esc)</button>' +
    '</div>' +
    (location.protocol === 'file:'
      ? '<p class="pv-warn">⚠️ เปิดจากไฟล์โดยตรง — มุมมองนี้อาจไม่เห็นเนื้อหาที่เพิ่งแก้ ให้รันผ่าน <code>python3 -m http.server 8080</code> เพื่อผลลัพธ์ที่ถูกต้อง</p>'
      : '') +
    '<div class="pv-stage"><div class="pv-frame" id="pv-frame">' +
      '<iframe id="pv-iframe" src="' + previewURL() + '" title="ตัวอย่างหน้าเว็บ"></iframe>' +
    '</div></div>';

  el.classList.add('open');
  document.body.classList.add('pv-lock');

  el.querySelectorAll('.pv-dev').forEach(function (b) {
    b.onclick = function () { pv.device = b.dataset.dev; pv.landscape = false; refreshPreviewChrome(); };
  });
  el.querySelector('#pv-rotate').onclick = function () { pv.landscape = !pv.landscape; sizePreview(); };
  el.querySelector('#pv-reload').onclick = function () {
    store.save();
    el.querySelector('#pv-iframe').src = previewURL();
    flash('โหลดตัวอย่างใหม่แล้ว');
  };
  el.querySelector('#pv-close').onclick = closePreview;
  sizePreview();
}

function refreshPreviewChrome() {
  document.querySelectorAll('#preview .pv-dev').forEach(function (b) {
    b.classList.toggle('on', b.dataset.dev === pv.device);
  });
  sizePreview();
}

function sizePreview() {
  if (!pv.open) return;
  var d = DEVICES.filter(function (x) { return x.id === pv.device; })[0];
  var w = pv.landscape ? d.h : d.w, h = pv.landscape ? d.w : d.h;
  var stage = document.querySelector('#preview .pv-stage');
  var availW = stage.clientWidth - 40, availH = stage.clientHeight - 40;
  var scale = Math.min(1, availW / w, availH / h);
  var frame = document.getElementById('pv-frame'), ifr = document.getElementById('pv-iframe');
  ifr.style.width = w + 'px';
  ifr.style.height = h + 'px';
  ifr.style.transform = 'scale(' + scale + ')';
  frame.style.width = (w * scale) + 'px';
  frame.style.height = (h * scale) + 'px';
  document.getElementById('pv-size').textContent =
    w + ' × ' + h + ' px' + (scale < 1 ? '  (ย่อ ' + Math.round(scale * 100) + '%)' : '');
}

function closePreview() {
  pv.open = false;
  var el = document.getElementById('preview');
  el.classList.remove('open');
  el.innerHTML = '';
  document.body.classList.remove('pv-lock');
}

window.addEventListener('resize', sizePreview);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (document.getElementById('modal').classList.contains('open')) closeModal();
    else if (pv.open) closePreview();
  }
});

/* ---------- แถบเครื่องมือ ---------- */
// ถอดแถบเครื่องมือ (และร่องรอยของมัน) ออกจากหน้าเว็บ
function removeToolbar() {
  ['toolbar', 'modal', 'preview'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  });
}

function downloadFile(text, name, type) {
  var blob = new Blob([text], { type: type });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function initToolbar() {
  document.getElementById('btn-edit').onclick = function () { setEditing(!editing); };
  document.getElementById('btn-preview').onclick = openPreview;
  document.getElementById('btn-save').onclick = function () { store.save(); };
  // สร้างไฟล์ js/content.js พร้อมใช้ — สำหรับนำเนื้อหาที่แก้แล้วขึ้นเว็บจริง
  document.getElementById('btn-code').onclick = function () {
    var code =
      '/* ============================================================\n' +
      '   content.js — all page content in one place\n' +
      '   Generated from the on-page editor on ' + new Date().toLocaleString('th-TH') + '\n' +
      '   ============================================================ */\n' +
      'window.DEFAULT_CONTENT = ' + JSON.stringify(store.data, null, 2) + ';\n';
    downloadFile(code, 'content.js', 'text/javascript');
    flash('ดาวน์โหลด content.js แล้ว — นำไปวางทับใน js/content.js เพื่อขึ้นเว็บ');
  };
  document.getElementById('btn-export').onclick = function () {
    downloadFile(JSON.stringify(store.data, null, 2), 'beyondlab-content.json', 'application/json');
    flash('ส่งออกไฟล์ JSON แล้ว');
  };
  document.getElementById('btn-import').onclick = function () { document.getElementById('file-import').click(); };
  document.getElementById('file-import').onchange = function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        store.data = JSON.parse(r.result); store.save(); renderAll(); flash('นำเข้าข้อมูลแล้ว');
      } catch (err) { flash('ไฟล์ไม่ถูกต้อง: ' + err.message, true); }
    };
    r.readAsText(f);
    e.target.value = '';
  };
  document.getElementById('btn-reset').onclick = function () {
    if (!confirm('คืนค่าเนื้อหาทั้งหมดกลับเป็นค่าเริ่มต้น? การแก้ไขที่บันทึกไว้จะหายไป')) return;
    store.reset(); renderAll(); flash('คืนค่าเริ่มต้นแล้ว');
  };
  document.getElementById('btn-lock').onclick = function () {
    if (!confirm('ล็อกโหมดแก้ไขบนเบราว์เซอร์นี้?\n\nแถบเครื่องมือจะหายไป และต้องเปิดด้วยลิงก์ลับ ?edit=' +
                 EDIT_CONFIG.key + ' เพื่อปลดล็อกอีกครั้ง')) return;
    setUnlocked(false);
    location.href = location.pathname + '?edit=0';
  };
  document.getElementById('tb-toggle').onclick = function () {
    document.getElementById('toolbar').classList.toggle('collapsed');
  };
}

window.addEventListener('beforeunload', function (e) {
  if (!dirty) return;
  store.save(); // กันข้อมูลหายเมื่อปิดหน้าเว็บ
});

document.addEventListener('DOMContentLoaded', function () {
  store.load();
  renderAll();
  if (IS_PREVIEW) {
    // หน้านี้ถูกเปิดในโหมดผู้เข้าชม — ไม่สร้างเครื่องมือแก้ไขใด ๆ ทั้งสิ้น
    window.EDIT_MODE = false;
    document.body.classList.add('preview-frame');
    removeToolbar();
    return;
  }
  if (!editorAllowed()) {
    // ผู้เข้าชมทั่วไป — ถอดแถบเครื่องมือออกจากหน้าเว็บไปเลย
    window.EDIT_MODE = false;
    removeToolbar();
    return;
  }
  initToolbar();
});
