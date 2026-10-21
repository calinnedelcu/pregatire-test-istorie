/* Progres salvat în browser (localStorage) + planificare repetiții (Leitner). */
(function (g) {
  'use strict';
  var U = g.U;
  var KEY = 'pti-istorie-v1';
  var mem = null; // rezervă dacă localStorage nu e disponibil

  var S = (g.Store = {});

  function blank() {
    return {
      v: 1,
      settings: { theme: 'auto', testDate: '', perSession: 20 },
      cards: {},   // id -> {b:cutie 0-5, d:scadent(ms), ok, ko, t:ultima oară}
      read: {},    // secțiune -> timestamp
      q: {},       // întrebare -> {ok, ko, t}
      line: {},    // cheie cloze -> {ok, ko, t}
      tests: [],   // istoric teste simulate
      days: {},    // nrZi -> {c: carduri, q: întrebări}
      mynotes: {}, // secțiune -> text
      recall: {},  // secțiune -> {pct, t}
      games: {}    // joc -> {best, n}
    };
  }
  S.data = blank();

  S.load = function () {
    var raw = null;
    try { raw = g.localStorage.getItem(KEY); } catch (e) { raw = mem; }
    if (raw) {
      try {
        var d = JSON.parse(raw);
        var b = blank();
        Object.keys(b).forEach(function (k) { if (d[k] === undefined) d[k] = b[k]; });
        d.settings = Object.assign(b.settings, d.settings || {});
        S.data = d;
      } catch (e) { S.data = blank(); }
    }
    return S.data;
  };
  var flush = function () {
    var raw = JSON.stringify(S.data);
    try { g.localStorage.setItem(KEY, raw); } catch (e) { mem = raw; }
  };
  S.save = U.debounce(flush, 250);
  S.saveNow = flush;
  S.reset = function () { S.data = blank(); flush(); };
  S.exportJSON = function () { return JSON.stringify(S.data); };
  S.importJSON = function (txt) {
    var d = JSON.parse(txt);
    if (!d || typeof d !== 'object' || !d.settings) throw new Error('format');
    var b = blank();
    Object.keys(b).forEach(function (k) { if (d[k] === undefined) d[k] = b[k]; });
    S.data = d;
    flush();
  };

  /* ── zile de studiu și serie ── */
  S.touch = function (kind, n) {
    var k = U.dayNo();
    var d = S.data.days[k] || (S.data.days[k] = { c: 0, q: 0 });
    d[kind] = (d[kind] || 0) + (n || 1);
    S.save();
  };
  S.streak = function () {
    var k = U.dayNo(), n = 0;
    if (!S.data.days[k]) k--; // ziua de azi încă goală nu rupe seria
    while (S.data.days[k]) { n++; k--; }
    return n;
  };
  S.today = function () { return S.data.days[U.dayNo()] || { c: 0, q: 0 }; };

  /* ── carduri (Leitner) ── */
  var MIN = 60000, H = 3600000;
  var BASE = [0, 10 * MIN, 8 * H, 24 * H, 3 * U.DAY, 7 * U.DAY];
  S.card = function (id) { return S.data.cards[id] || { b: 0, d: 0, ok: 0, ko: 0, t: 0 }; };
  S.cap = function () {
    var left = U.daysUntil(S.data.settings.testDate);
    if (left == null || left < 0) return Infinity;
    return Math.max(6 * H, (left * U.DAY) / 4);
  };
  /* res: 0 = nu știam, 1 = greu, 2 = știam */
  S.grade = function (id, res) {
    var c = Object.assign({ b: 0, d: 0, ok: 0, ko: 0, t: 0 }, S.data.cards[id] || {});
    var now = Date.now();
    var cap = S.cap();
    if (res === 0) { c.b = c.b >= 4 ? 2 : 1; c.ko++; c.d = now + Math.min(BASE[1], cap); }
    else if (res === 1) { c.b = Math.max(1, c.b === 0 ? 1 : c.b - (c.b > 3 ? 1 : 0)); c.d = now + Math.min(BASE[c.b] / 2 || BASE[1], cap); }
    else { c.b = c.b === 0 ? 3 : Math.min(5, c.b + 1); c.ok++; c.d = now + Math.min(BASE[c.b], cap); }
    c.t = now;
    S.data.cards[id] = c;
    S.touch('c');
    return c;
  };
  S.tier = function (id) {
    var b = S.card(id).b;
    return b === 0 ? 0 : b <= 2 ? 1 : b <= 4 ? 2 : 3; // nou, în lucru, aproape, stăpânit
  };
  S.isDue = function (id) { var c = S.card(id); return c.b > 0 && c.d <= Date.now(); };

  /* ── întrebări / completări ── */
  S.rec = function (bucket, id, ok) {
    var o = S.data[bucket][id] || (S.data[bucket][id] = { ok: 0, ko: 0, t: 0 });
    if (ok) o.ok++; else o.ko++;
    o.t = Date.now();
    S.save();
  };
  S.markRead = function (secId, on) {
    if (on) S.data.read[secId] = Date.now(); else delete S.data.read[secId];
    S.save();
  };
})(typeof window !== 'undefined' ? window : globalThis);
