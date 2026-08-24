/* icons.js — ชุดไอคอน (เลือกเปลี่ยนได้ในโหมดแก้ไข) */
window.ICONS = {
  badge:      '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-2.5L17 22l-1.5-8"/>',
  badgeCheck: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5L16 9.5"/>',
  users:      '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M17 5.5a3 3 0 0 1 0 6M18 14c2.2.7 3.6 2.4 3.6 5"/>',
  box:        '<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
  service:    '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>',
  userSearch: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c0-3.6 2.9-6.5 6.5-6.5"/><circle cx="17" cy="16" r="3.2"/><path d="m19.5 18.5 2.5 2.5"/>',
  flask:      '<path d="M9 2h6M10 2v7l-6 9.5A2.5 2.5 0 0 0 6 22h12a2.5 2.5 0 0 0 2-3.5L14 9V2"/><path d="M7.5 15h9"/>',
  pencil:     '<path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  searchCheck:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5M8.5 11l2 2 4-4"/>',
  chat:       '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/><path d="M8 9h8M8 13h5"/>',
  pill:       '<rect x="4" y="8" width="16" height="12" rx="4"/><path d="M8 4h8v4H8zM4 14h16"/>',
  beaker:     '<path d="M8 3h8M9.5 3v6L5 19a2.2 2.2 0 0 0 2 3h10a2.2 2.2 0 0 0 2-3l-4.5-10V3"/><circle cx="11" cy="17" r="1"/><circle cx="14.5" cy="19" r="1"/>',
  package:    '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 11h18M9 7V4h6v3"/>',
  chart:      '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  phone:      '<path d="M4 5c0-1 1-2 2-2h2l2 5-2 1.5a13 13 0 0 0 6 6L16 13l5 2v2c0 1.1-.9 2-2 2A16 16 0 0 1 4 5z"/>',
  mail:       '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  line:       '<path d="M21 10.5C21 6.4 16.9 3 12 3S3 6.4 3 10.5c0 3.7 3.3 6.8 7.7 7.4.9.2.8.6.7 1.2l-.3 1.5c-.1.4.3.8.8.6C15.6 19.6 21 16 21 10.5z"/>',
  tiktok:     '<path d="M15 3c.5 2.5 2 4 4.5 4.2V11c-1.8 0-3.4-.6-4.5-1.5V15a6 6 0 1 1-6-6c.4 0 .7 0 1 .1v3.2A2.8 2.8 0 1 0 12 15V3z"/>',
  instagram:  '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
  facebook:   '<path d="M14 8h3V4.5h-3c-2.2 0-4 1.8-4 4V11H7.5v3.5H10V22h3.5v-7.5H16l.7-3.5h-3.2V8.5c0-.3.2-.5.5-.5z"/>',
  arrow:      '<path d="M4 12h15M13 6l6 6-6 6"/>',
  download:   '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
  play:       '<path d="M8 5.5v13l11-6.5z"/>',
  star:       '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8L6.8 19.7l1-5.9L3.5 9.7l5.9-.8z"/>',
  check:      '<path d="m5 12.5 4.5 4.5L19 7"/>',
  shield:     '<path d="M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
  clock:      '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
  factory:    '<path d="M3 21V9l6 4V9l6 4V4h6v17z"/><path d="M3 21h18"/>',
  sparkle:    '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  plus:       '<path d="M12 5v14M5 12h14"/>',
  trash:      '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  up:         '<path d="m6 15 6-6 6 6"/>',
  down:       '<path d="m6 9 6 6 6-6"/>',
  image:      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 17 5-5 4 4 3-3 4 4"/><circle cx="9" cy="9" r="1.6"/>'
};

window.icon = function (name, cls) {
  var p = window.ICONS[name] || window.ICONS.sparkle;
  return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
         'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
};
