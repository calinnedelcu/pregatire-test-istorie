/* Utilitare: DOM (h), text, aleator, iconițe. */
(function (g) {
  'use strict';
  var U = (g.U = {});

  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* h('div.card#id', {class:'x', onClick:fn, dataset:{a:1}}, 'text', child, [..]) */
  U.h = function h(tag, attrs) {
    var kids = Array.prototype.slice.call(arguments, 2);
    if (attrs != null && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
      kids.unshift(attrs);
      attrs = null;
    }
    var parts = String(tag).split(/(?=[.#])/);
    var name = 'div';
    var classes = [];
    var id = null;
    parts.forEach(function (p, i) {
      if (p[0] === '.') classes.push(p.slice(1));
      else if (p[0] === '#') id = p.slice(1);
      else if (p) name = p;
    });
    var SVG = { svg: 1, path: 1, circle: 1, rect: 1, line: 1, polyline: 1, polygon: 1, g: 1 };
    var el = SVG[name] ? document.createElementNS('http://www.w3.org/2000/svg', name) : document.createElement(name);
    if (id) el.id = id;
    if (classes.length) el.setAttribute('class', classes.join(' '));
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class' || k === 'className') {
          var add = Array.isArray(v) ? v.filter(Boolean).join(' ') : String(v);
          el.setAttribute('class', ((el.getAttribute('class') || '') + ' ' + add).trim());
        } else if (k === 'style') {
          if (typeof v === 'string') el.style.cssText = v; else Object.assign(el.style, v);
        } else if (k === 'dataset') {
          Object.keys(v).forEach(function (d) { el.dataset[d] = v[d]; });
        } else if (k === 'html') {
          el.innerHTML = v;
        } else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
          el.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'selected') {
          el[k] = v;
        } else if (v === true) {
          el.setAttribute(k, '');
        } else {
          el.setAttribute(k, v);
        }
      });
    }
    U.append(el, kids);
    return el;
  };

  U.append = function (el, kids) {
    (function add(list) {
      list.forEach(function (k) {
        if (k == null || k === false || k === true) return;
        if (Array.isArray(k)) add(k);
        else if (k instanceof Node) el.appendChild(k);
        else el.appendChild(document.createTextNode(String(k)));
      });
    })(kids);
    return el;
  };

  U.clear = function (el) { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  /* ── iconițe (stroke) ── */
  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    test: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    sliders: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    redo: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-6.6 0-2.6-1.5-4.4-2.9-5.9-.5 1.5-1.3 2.2-2.3 2.6.4-3.3-.8-6.5-4.1-9.1.2 3.4-1.4 5.1-2.8 7C5.7 11.7 5 13.2 5 15.4 5 19.3 8 22 12 22z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 10 18.7l1-1"/>',
    updown: '<path d="M7 4v16M3 8l4-4 4 4"/><path d="M17 20V4M13 16l4 4 4-4"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/>',
    compass: '<circle cx="12" cy="12" r="9.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2"/><path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5z" fill="currentColor"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
  };
  U.icon = function (name, size) {
    var s = size || 20;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', s);
    svg.setAttribute('height', s);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = ICONS[name] || '';
    return svg;
  };

  /* ── text ── */
  U.norm = function (s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[„”“"'’`´.,;:!?()\[\]{}<>«»–—\-\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };
  U.key = function (s) { return U.norm(s).replace(/ /g, ''); };
  U.lev = function (a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[b.length];
  };
  /* 2 = exact, 1 = aproape (greșeală mică de scriere), 0 = greșit */
  U.match = function (given, accepted) {
    var gk = U.key(given);
    if (!gk) return 0;
    var best = 0;
    (Array.isArray(accepted) ? accepted : [accepted]).forEach(function (acc) {
      var ak = U.key(acc);
      if (gk === ak) best = 2;
      else if (best < 1 && ak.length >= 6 && U.lev(gk, ak) <= (ak.length >= 14 ? 2 : 1)) best = 1;
    });
    return best;
  };
  U.nr = function (n, sg, pl) {
    if (n === 1) return '1 ' + sg;
    var de = n >= 20 && (n % 100 === 0 || n % 100 >= 20);
    return n + (de ? ' de ' : ' ') + pl;
  };
  U.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ── aleator ── */
  U.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  U.sample = function (arr, n) { return U.shuffle(arr).slice(0, n); };
  U.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  U.uniq = function (arr) { return Array.from(new Set(arr)); };
  U.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };

  /* ── timp ── */
  U.DAY = 86400000;
  U.dayNo = function (t) {
    var d = t == null ? new Date() : new Date(t);
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / U.DAY);
  };
  U.daysUntil = function (iso) {
    if (!iso) return null;
    var p = String(iso).split('-').map(Number);
    if (p.length !== 3 || p.some(isNaN)) return null;
    var target = Math.floor((Date.UTC(p[0], p[1] - 1, p[2])) / U.DAY);
    return target - U.dayNo();
  };
  U.fmtDur = function (ms) {
    var s = Math.round(ms / 1000);
    var m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  };

  /* ── mesaje ── */
  U.toast = function (msg) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var t = U.h('div.toast', { role: 'status' }, msg);
    root.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  };
  U.debounce = function (fn, ms) {
    var t;
    return function () { var a = arguments; clearTimeout(t); t = setTimeout(function () { fn.apply(null, a); }, ms); };
  };
})(typeof window !== 'undefined' ? window : globalThis);
