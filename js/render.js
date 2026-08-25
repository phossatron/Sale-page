/* ============================================================
   render.js — วาดหน้าเว็บจากข้อมูลใน store.data
   ทุกข้อความผูกด้วย data-bind="path"  (แก้ได้ในโหมดแก้ไข)
   ทุกรูปผูกด้วย data-img="path"       (เปลี่ยนรูปได้)
   ทุกลิสต์ผูกด้วย data-list="path"    (เพิ่ม/ลบ/ย้ายลำดับได้)
   ============================================================ */
(function () {
  var esc = function (s) { return String(s == null ? "" : s); };

  // อีเมลปลายทางของฟอร์มติดต่อ (ค่าสำรอง หากข้อมูลใน content ไม่ได้ระบุไว้)
  var FALLBACK_SEND_TO = 'sales.international@beyondlabth.co.th';

  /* ---------- helpers ---------- */
  // เครื่องมือแก้ไขทั้งหมดจะถูก "สร้างลง DOM เฉพาะตอนอยู่ในโหมดแก้ไข" เท่านั้น
  // มุมมองผู้เข้าชมจึงไม่มีปุ่มเหล่านี้อยู่ในหน้าเลย (ไม่ใช่แค่ซ่อนด้วย CSS)
  var isEdit = function () { return !!window.EDIT_MODE; };
  // ส่วนที่โผล่เฉพาะโหมดแก้ไข
  function EO(html) { return isEdit() ? html : ''; }
  function IMGBTN(path) {
    return EO('<button class="img-btn" type="button" data-img="' + path + '">' + icon('image') + ' เปลี่ยนรูป</button>');
  }
  // ข้อความแก้ไขได้
  function T(tag, path, cls, attrs) {
    return '<' + tag + ' class="ed ' + (cls || '') + '" data-bind="' + path + '" ' +
      (attrs || '') + '>' + esc(store.get(path)) + '</' + tag + '>';
  }
  /* ---------- ช่องรูป (image slots) ----------
     กำหนดสัดส่วน/วิธีจัดวาง/ขนาดสูงสุดของแต่ละช่อง
     รูปที่อัปโหลดเข้ามาจะถูกย่อและครอบให้พอดีช่องเสมอ ไม่ทำให้เลย์เอาต์เพี้ยน */
  var SLOTS = {
    'header.logo':           { name: 'โลโก้',            box: 'width:170px;height:48px',                        fit: 'contain', pos: 'left center',   max: 600  },
    'hero.image':            { name: 'ภาพพื้นหลัง Hero', box: '',                                                fit: 'cover',   pos: 'center',        max: 1920, bg: true },
    'about.video.image':     { name: 'ภาพปกวิดีโอ',      box: '',                                                fit: 'cover',   pos: 'center',        max: 1600, bg: true },
    'pricing.cards.*.image': { name: 'ภาพสินค้า',        box: 'aspect-ratio:1/1',                                fit: 'cover',   pos: 'center',        max: 1000 },
    'contact.image':         { name: 'ภาพบุคคล',         box: 'width:100%;max-width:260px;aspect-ratio:3/4;margin:0 auto', fit: 'contain', pos: 'bottom center', max: 900  }
  };
  var SLOT_DEFAULT = { name: 'รูปภาพ', box: 'aspect-ratio:4/3', fit: 'cover', pos: 'center', max: 1600 };

  // หา slot ของ path (รองรับ index ในลิสต์ เช่น pricing.cards.0.image)
  window.slotOf = function (path) {
    return SLOTS[path.replace(/\.\d+(?=\.)/g, '.*')] || SLOT_DEFAULT;
  };
  // ค่าที่ใช้จริง = ค่าเริ่มต้นของ slot + ค่าที่ผู้ใช้ปรับเอง
  window.imgOpt = function (path) {
    var s = window.slotOf(path);
    var o = (store.data.imageSettings || {})[path] || {};
    return { name: s.name, box: s.box, max: s.max, bg: !!s.bg, fit: o.fit || s.fit, pos: o.pos || s.pos };
  };
  var bgSize = function (fit) { return fit === 'fill' ? '100% 100%' : fit; };

  // รูปแก้ไขได้
  function IMG(path, cls, alt) {
    var o = window.imgOpt(path);
    return '<span class="imgbox ' + (cls || '') + '" style="' + o.box + '">' +
      '<img src="' + esc(store.get(path)) + '" alt="' + esc(alt || '') + '" loading="lazy" ' +
        'style="object-fit:' + o.fit + ';object-position:' + o.pos + '">' +
      IMGBTN(path) +
      '</span>';
  }
  // พื้นหลังรูปแก้ไขได้
  function BG(path, cls, inner) {
    var o = window.imgOpt(path);
    return '<div class="bgbox ' + (cls || '') + '" style="background-image:url(\'' + esc(store.get(path)) + '\');' +
        'background-size:' + bgSize(o.fit) + ';background-position:' + o.pos + '">' +
      IMGBTN(path) + (inner || '') + '</div>';
  }
  // ไอคอนแก้ไขได้
  function ICO(path, cls) {
    var body = icon(store.get(path));
    return isEdit()
      ? '<button class="icobtn ' + (cls || '') + '" type="button" data-icon="' + path + '">' + body + '</button>'
      : '<span class="icobtn ' + (cls || '') + '">' + body + '</span>';
  }
  // แถบเครื่องมือของแต่ละรายการ (ลบ / ย้าย)
  function ITEM_TOOLS(listPath, i) {
    if (!isEdit()) return '';
    return '<span class="item-tools">' +
      '<button type="button" title="เลื่อนขึ้น/ซ้าย" data-move="' + listPath + '|' + i + '|-1">' + icon('up') + '</button>' +
      '<button type="button" title="เลื่อนลง/ขวา" data-move="' + listPath + '|' + i + '|1">' + icon('down') + '</button>' +
      '<button type="button" class="del" title="ลบรายการนี้" data-del="' + listPath + '|' + i + '">' + icon('trash') + '</button>' +
      '</span>';
  }
  function ADD(listPath, label) {
    if (!isEdit()) return '';
    return '<button type="button" class="add-btn" data-add="' + listPath + '">' + icon('plus') +
      ' ' + (label || 'เพิ่มรายการ') + '</button>';
  }
  function list(path, itemFn, wrapCls, addLabel) {
    var arr = store.get(path) || [];
    return '<div class="list ' + (wrapCls || '') + '" data-list="' + path + '">' +
      arr.map(function (it, i) {
        return itemFn(it, i, path + '.' + i);
      }).join('') +
      '</div>' + ADD(path, addLabel);
  }

  /* ---------- sections ---------- */
  function header() {
    return '<header class="site-header" id="top"><div class="wrap hd">' +
      '<a class="logo" href="#top">' + IMG('header.logo', 'logo-img', 'Beyond Lab') + '</a>' +
      '<nav class="nav">' + list('header.nav', function (it, i, p) {
        return '<span class="nav-item item">' + T('a', p + '.label', '', 'href="' + esc(it.href) + '" data-href="' + p + '.href"') + ITEM_TOOLS('header.nav', i) + '</span>';
      }, 'nav-list', 'เพิ่มเมนู') +
      '</nav>' +
      '<a class="btn primary sm" href="' + esc(store.get('header.cta.href')) + '">' + T('span', 'header.cta.label') + '</a>' +
      '</div></header>';
  }

  function hero() {
    var b = 'hero.badge';
    return '<section class="hero" id="hero">' +
      BG('hero.image', 'hero-bg') +
      '<div class="wrap hero-in">' +
        '<div class="hero-copy">' +
          T('p', 'hero.eyebrow', 'eyebrow') +
          T('h1', 'hero.title', 'hero-title') +
          T('p', 'hero.subtitle', 'hero-sub') +
          list('hero.features', function (it, i, p) {
            return '<div class="hf item">' + ICO(p + '.icon') + '<div>' + T('strong', p + '.title') + T('span', p + '.desc') + '</div>' + ITEM_TOOLS('hero.features', i) + '</div>';
          }, 'hero-features', 'เพิ่มจุดเด่น') +
          list('hero.buttons', function (it, i, p) {
            return '<span class="item btn-wrap"><a class="btn ' + esc(it.style) + '" href="' + esc(it.href) + '">' +
              T('span', p + '.label') + icon(it.icon || 'arrow') + '</a>' + ITEM_TOOLS('hero.buttons', i) + '</span>';
          }, 'hero-btns', 'เพิ่มปุ่ม') +
        '</div>' +
        '<div class="hero-badge">' + T('span', b + '.top', 'bt') + T('strong', b + '.num', 'bn') + T('span', b + '.bottom', 'bb') + '</div>' +
      '</div></section>';
  }

  function trust() {
    return '<section class="trust" id="trust"><div class="wrap card soft">' +
      T('p', 'trust.heading', 'trust-head') +
      list('trust.logos', function (it, i, p) {
        return '<span class="logo-chip item">' + T('span', p + '.label') + ITEM_TOOLS('trust.logos', i) + '</span>';
      }, 'logos', 'เพิ่มโลโก้') +
      '<hr>' +
      list('trust.stats', function (it, i, p) {
        return '<div class="stat item">' + T('strong', p + '.num') + T('span', p + '.label') + ITEM_TOOLS('trust.stats', i) + '</div>';
      }, 'stats', 'เพิ่มตัวเลข') +
      '</div></section>';
  }

  function problems() {
    return '<section class="sec" id="problems"><div class="wrap">' +
      T('h2', 'problems.heading', 'sec-title') +
      list('problems.items', function (it, i, p) {
        return '<article class="card pcard item">' + ICO(p + '.icon', 'big') + T('h3', p + '.title') + T('p', p + '.desc') + ITEM_TOOLS('problems.items', i) + '</article>';
      }, 'grid g5', 'เพิ่มการ์ดปัญหา') +
      '</div></section>';
  }

  function services() {
    return '<section class="sec alt" id="services"><div class="wrap">' +
      T('h2', 'services.heading', 'sec-title') +
      '<div class="card soft pad">' +
      list('services.items', function (it, i, p) {
        return '<article class="scard item">' + ICO(p + '.icon', 'big') +
          '<div>' + T('h3', p + '.title') + T('p', p + '.desc') + '</div>' + ITEM_TOOLS('services.items', i) + '</article>';
      }, 'grid g3 svc', 'เพิ่มบริการ') +
      '</div></div></section>';
  }

  function pricing() {
    return '<section class="sec" id="pricing"><div class="wrap">' +
      '<div class="promo">' +
      list('pricing.cards', function (it, i, p) {
        return '<article class="promo-card item">' +
          '<div class="promo-media">' + IMG(p + '.image', '', 'Product package') +
            T('span', p + '.ribbon', 'ribbon') + '</div>' +
          '<div class="promo-body">' +
            T('h3', p + '.title', 'promo-title') +
            '<div class="price">' + T('span', p + '.price', 'pnum') + T('sup', p + '.unit', 'punit') + '</div>' +
            list(p + '.bullets', function (b, j, bp) {
              return '<span class="bullet item">' + icon('check') + T('span', bp) + ITEM_TOOLS(p + '.bullets', j) + '</span>';
            }, 'bullets', 'เพิ่มข้อ') +
            T('p', p + '.note', 'note') +
            '<div class="pbadge">' + T('strong', p + '.badge') + T('span', p + '.badgeSub') + '</div>' +
          '</div>' + ITEM_TOOLS('pricing.cards', i) + '</article>';
      }, 'promo-grid', 'เพิ่มแพ็กเกจ') +
      '</div>' +
      '<div class="center"><a class="btn ghost round" href="' + esc(store.get('pricing.button.href')) + '">' +
        T('span', 'pricing.button.label') + icon('arrow') + '</a></div>' +
      '</div></section>';
  }

  function about() {
    var v = store.get('about.video');
    return '<section class="sec" id="about"><div class="wrap about">' +
      '<div class="about-copy">' +
        T('h2', 'about.heading', 'sec-title left') +
        T('p', 'about.sub', 'about-sub') +
        list('about.items', function (it, i, p) {
          return '<div class="ab item">' + ICO(p + '.icon', 'big') + T('span', p + '.label') + ITEM_TOOLS('about.items', i) + '</div>';
        }, 'about-items', 'เพิ่มจุดเด่น') +
      '</div>' +
      '<div class="video">' + BG('about.video.image', 'video-bg',
          '<div class="video-txt">' + T('span', 'about.video.line1') + T('span', 'about.video.line2') + T('span', 'about.video.line3') + '</div>' +
          '<a class="play" href="' + esc(v.url || '#') + '" ' + (v.url ? 'target="_blank" rel="noopener"' : '') + '>' + icon('play') + '</a>') +
        EO('<label class="edit-only field"><span>ลิงก์วิดีโอ</span><input type="url" data-input="about.video.url" value="' + esc(v.url) + '" placeholder="https://youtube.com/..."></label>') +
      '</div>' +
      '</div></section>';
  }

  function testimonials() {
    return '<section class="sec alt" id="reviews"><div class="wrap">' +
      T('h2', 'testimonials.heading', 'sec-title') +
      list('testimonials.items', function (it, i, p) {
        var n = Number(it.rating) || 5, s = '';
        for (var k = 0; k < n; k++) s += icon('star', 'star');
        return '<article class="card tcard item"><div class="stars">' + s + '</div>' +
          T('p', p + '.text') + T('span', p + '.author', 'author') +
          EO('<label class="edit-only field"><span>ดาว</span><input type="number" min="1" max="5" data-input="' + p + '.rating" value="' + n + '"></label>') +
          ITEM_TOOLS('testimonials.items', i) + '</article>';
      }, 'grid g4', 'เพิ่มรีวิว') +
      '</div></section>';
  }

  function faq() {
    return '<section class="sec" id="faq"><div class="wrap">' +
      T('h2', 'faq.heading', 'sec-title') +
      list('faq.items', function (it, i, p) {
        return '<details class="faq-item item"><summary>' + T('span', p + '.q') + '<i>+</i></summary>' +
          T('div', p + '.a', 'faq-a') + ITEM_TOOLS('faq.items', i) + '</details>';
      }, 'faq-grid', 'เพิ่มคำถาม') +
      '</div></section>';
  }

  function contact() {
    var f = store.get('contact.form');
    return '<section class="contact" id="contact"><div class="wrap contact-in">' +
      '<div class="contact-copy">' +
        T('h2', 'contact.heading', 'c-head') +
        T('p', 'contact.sub', 'c-sub') +
        list('contact.channels', function (it, i, p) {
          return '<span class="chan item">' + ICO(p + '.icon') +
            T('a', p + '.label', '', 'href="' + esc(it.href) + '"') + ITEM_TOOLS('contact.channels', i) + '</span>';
        }, 'chans', 'เพิ่มช่องทางติดต่อ') +
        list('contact.socials', function (it, i, p) {
          return '<span class="soc item"><a href="' + esc(it.href) + '">' + icon(it.icon) + '</a>' +
            EO('<button class="mini" type="button" data-icon="' + p + '.icon">แก้ไอคอน</button>') + ITEM_TOOLS('contact.socials', i) + '</span>';
        }, 'socs', 'เพิ่มโซเชียล') +
      '</div>' +
      '<div class="contact-art">' + IMG('contact.image', '', 'Talk to our team') + '</div>' +
      '<form class="contact-form" onsubmit="return beyondSubmit(event)">' +
        list('contact.form.fields', function (it, i, p) {
          var input = it.type === 'select'
            ? '<select name="' + esc(it.name) + '"><option value="">' + esc(it.label) + '</option>' +
              (it.options || []).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>'
            : '<input type="' + esc(it.type) + '" name="' + esc(it.name) + '" placeholder="' + esc(it.label) + '">';
          return '<div class="fld item">' + input +
            EO('<div class="edit-only fld-edit">' +
              '<label><span>ป้ายกำกับ</span><input data-input="' + p + '.label" value="' + esc(it.label) + '"></label>' +
              '<label><span>ชนิด</span><select data-input="' + p + '.type">' +
                ['text', 'tel', 'email', 'number', 'select', 'textarea'].map(function (t) {
                  return '<option' + (t === it.type ? ' selected' : '') + '>' + t + '</option>';
                }).join('') + '</select></label>' +
              '<label><span>ตัวเลือก (คั่นด้วย ,)</span><input data-input-list="' + p + '.options" value="' + esc((it.options || []).join(', ')) + '"></label>' +
            '</div>') + ITEM_TOOLS('contact.form.fields', i) + '</div>';
        }, 'fields', 'เพิ่มช่องกรอก') +
        '<input type="text" name="_honey" class="honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<button class="btn dark block" type="submit">' + T('span', 'contact.form.submit') + '</button>' +
        '<p class="form-status" role="status" aria-live="polite"></p>' +
        T('p', 'contact.form.note', 'form-note') +
        EO('<label class="edit-only field"><span>ส่งข้อมูลจากฟอร์มไปที่อีเมล</span>' +
           '<input type="email" data-input="contact.form.sendTo" value="' + esc(f.sendTo || FALLBACK_SEND_TO) + '"></label>' +
           '<label class="edit-only field"><span>หัวข้ออีเมล</span>' +
           '<input data-input="contact.form.subject" value="' + esc(f.subject || '') + '"></label>') +
      '</form>' +
      '</div></section>';
  }

  function floating() {
    return '<div class="floating">' +
      list('floating.items', function (it, i, p) {
        return '<span class="fl item"><a href="' + esc(it.href) + '" title="' + esc(it.label) + '">' + icon(it.icon) +
          T('span', p + '.label', 'fl-label') + '</a>' +
          EO('<button class="mini" type="button" data-icon="' + p + '.icon">ไอคอน</button>') + ITEM_TOOLS('floating.items', i) + '</span>';
      }, 'fl-list', 'เพิ่มปุ่มลอย') +
      '<a class="fl top" href="#top">' + icon('up') + '<span class="fl-label">TOP</span></a>' +
      '</div>';
  }

  function footer() {
    return '<footer class="site-footer">' + T('p', 'footer.text', 'wrap') + '</footer>';
  }

  window.renderAll = function () {
    document.title = store.get('site.title');
    document.documentElement.style.setProperty('--brand', store.get('site.brandColor') || '#F26522');
    document.getElementById('app').innerHTML =
      header() + hero() + trust() + problems() + services() + pricing() +
      about() + testimonials() + faq() + contact() + footer() + floating();
    if (window.afterRender) window.afterRender();
  };

  /* ส่งข้อมูลฟอร์มเข้าอีเมลผ่าน FormSubmit (ไม่ต้องมี backend)
     ปลายทางตั้งได้ที่ contact.form.sendTo ในโหมดแก้ไข */
  window.beyondSubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var cfg = store.get('contact.form') || {};
    var to = (cfg.sendTo || FALLBACK_SEND_TO).trim();
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type=submit]');

    var raw = {};
    new FormData(form).forEach(function (v, k) { raw[k] = v; });
    if (raw._honey) return false;                        // บอตกรอกกับดัก — ทิ้งเงียบ ๆ

    // ตรวจข้อมูลที่จำเป็น (ช่องแบบเลือกไม่บังคับ)
    var missing = (cfg.fields || []).filter(function (fl) {
      return fl.type !== 'select' && !String(raw[fl.name] || '').trim();
    });
    if (missing.length) {
      say(status, 'Please fill in: ' + missing.map(function (f) { return f.label; }).join(', '), 'err');
      return false;
    }

    // ส่งโดยใช้ "ป้ายกำกับ" เป็นชื่อฟิลด์ อีเมลที่ได้จะอ่านง่าย
    var data = {};
    (cfg.fields || []).forEach(function (fl) {
      data[fl.label || fl.name] = raw[fl.name] || '—';
    });
    data._subject = cfg.subject || 'New enquiry from the website';
    data._template = 'table';
    data._captcha = 'false';
    data['Submitted at'] = new Date().toLocaleString('en-GB');
    data['Page'] = location.href;

    btn.disabled = true;
    say(status, 'Sending…', '');

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        btn.disabled = false;
        if (j && (j.success === 'true' || j.success === true)) {
          form.reset();
          say(status, 'Thank you — we have received your details and will be in touch shortly.', 'ok');
        } else if (j && /activat/i.test(j.message || '')) {
          say(status, 'Almost there — the recipient inbox must confirm the activation email once. ' +
                      'Please try again after confirming.', 'err');
        } else {
          throw new Error((j && j.message) || 'Unexpected response');
        }
      })
      .catch(function (err) {
        btn.disabled = false;
        say(status, 'Could not send right now. Please contact us directly at ' + to +
                    ' (' + String(err.message || err) + ')', 'err');
      });
    return false;
  };

  function say(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-status' + (kind ? ' ' + kind : '');
  }
})();
