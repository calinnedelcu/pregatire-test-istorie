/* Carduri cu repetare la intervale + completări din notițe. */
(function (g) {
  'use strict';
  var U = g.U, h = U.h, S = g.Store, Notes = g.Notes;
  var D = (g.DATA = g.DATA || {});
  var Cards = (g.Cards = {});

  var SHORT = { etno: 'Etnogeneză', calatori: 'Călători', descoperiri: 'Descoperiri' };
  Notes.short = function (id) { return SHORT[id] || id; };
  function chChip(chId) {
    var ch = D.chById[chId];
    return h('span.chip.' + (ch ? ch.cls : ''), Notes.short(chId));
  }

  /* ── construire ── */
  function findLine(secId, snip) {
    var x = /^([a-z0-9-]+)#(.+)$/.exec(snip);   // „secțiune#fragment” pentru rânduri din altă secțiune
    if (x && D.sec[x[1]]) { secId = x[1]; snip = x[2]; }
    var ls = Notes.linesOf(secId);
    for (var i = 0; i < ls.length; i++) if (ls[i].plain.indexOf(snip) >= 0) return ls[i];
    return null;
  }
  Cards.findLine = findLine;

  Cards.build = function () {
    var out = [], byId = {};
    (D.cardsSrc || []).forEach(function (c) {
      var sec = D.sec[c.sec];
      if (!sec) { console.warn('Card fără secțiune validă:', c.id, c.sec); return; }
      var card = Object.assign({ kind: 'qa' }, c);
      card.ch = sec.ch;
      card.srcLines = (c.src || []).map(function (s) { return findLine(c.sec, s); }).filter(Boolean);
      out.push(card);
      byId[card.id] = card;
    });
    // carduri generate din tabelul surselor medievale
    var T = D.tables && D.tables.sources;
    if (T) {
      var dupWork = {};
      T.rows.forEach(function (r) { if (r.lucrare) dupWork[r.lucrare] = (dupWork[r.lucrare] || 0) + 1; });
      T.rows.forEach(function (r) {
        var c1 = {
          id: 'tb-' + r.n, kind: 'qa', sec: 'etno-formarea', ch: 'etno', tag: 'tabel',
          q: 'Tabelul surselor, rândul ' + r.n + ': secolul ' + r.sec + ', autorul „' + r.autor + '”. Ce lucrare e trecută și ce menționează despre români?',
          a: (r.lucrare ? '**' + r.lucrare + '**' : '(lucrarea nu e trecută în tabel)') + ' — ' + r.mentiune,
          rowNote: 'Tabelul surselor, rândul ' + r.n + ': sec. ' + r.sec + ' · ' + r.autor + ' · ' + (r.lucrare || '—') + ' · ' + r.mentiune
        };
        out.push(c1); byId[c1.id] = c1;
        if (r.lucrare && dupWork[r.lucrare] === 1) {
          var c2 = {
            id: 'tw-' + r.n, kind: 'qa', sec: 'etno-formarea', ch: 'etno', tag: 'tabel',
            q: '„' + r.lucrare + '” — cine e autorul, din ce secol este și ce menționează despre români?',
            a: '**' + r.autor + '**, sec. ' + r.sec + ' — ' + r.mentiune,
            rowNote: 'Tabelul surselor, rândul ' + r.n
          };
          out.push(c2); byId[c2.id] = c2;
        }
      });
    }
    D.cards = out;
    D.cardById = byId;
    D.cloze = buildCloze();
  };

  function buildCloze() {
    var items = [];
    Object.keys(D.line).forEach(function (id) {
      var n = D.line[id];
      if (!n.keys || !n.keys.length) return;
      var segs = Notes.segments(n.text);
      var ctx = Notes.ctxOf(n);
      var kids = n.kids.filter(function (k) { return k.id; }).slice(0, 6).map(function (k) { return k.plain; });
      n.keys.forEach(function (k, i) {
        items.push({ id: 'cz:' + id + ':' + i, kind: 'cloze', line: n, i: i, ans: k, segs: segs, ctx: ctx, kids: kids, sec: n.sec, ch: n.ch });
      });
    });
    return items;
  }

  /* ── scop ── */
  function inScope(c, p) {
    if (p.sec) return c.sec === p.sec;
    if (p.chs && p.chs.length) return p.chs.indexOf(c.ch) >= 0;
    if (p.ch) return c.ch === p.ch;
    return true;
  }
  function counts(pool) {
    var due = 0, fresh = 0, learned = 0;
    pool.forEach(function (c) {
      var x = S.card(c.id);
      if (x.b === 0) fresh++;
      else { if (x.d <= Date.now()) due++; if (x.b >= 4) learned++; }
    });
    return { due: due, fresh: fresh, learned: learned, all: pool.length };
  }

  /* ── ecran de pornire ── */
  Cards.view = function (params) {
    params = params || {};
    if (params.run) return runFromParams(params);
    if (params.sec || params.ch) return runFromParams(Object.assign({ mode: 'all' }, params));
    var App = g.App;
    var sel = {};
    D.chapters.forEach(function (c) { sel[c.id] = true; });
    var mode = 'smart';
    var info = h('p.muted');
    var go = h('button.btn.primary.lg', { onClick: start });
    var chipsCh = h('div.chips-pick'), chipsMode = h('div.chips-pick');
    function pool() { return D.cards.filter(function (c) { return sel[c.ch]; }); }
    function draw() {
      U.clear(chipsCh); U.clear(chipsMode);
      D.chapters.forEach(function (c) {
        chipsCh.appendChild(h('button' + (sel[c.id] ? '.on' : ''), { 'aria-pressed': sel[c.id] ? 'true' : 'false', onClick: function () { sel[c.id] = !sel[c.id]; draw(); } }, Notes.short(c.id)));
      });
      [['smart', 'Inteligent: scadente + noi'], ['all', 'Toate, amestecate'], ['weak', 'Doar cele greșite']].forEach(function (m) {
        chipsMode.appendChild(h('button' + (mode === m[0] ? '.on' : ''), { 'aria-pressed': mode === m[0] ? 'true' : 'false', onClick: function () { mode = m[0]; draw(); } }, m[1]));
      });
      var p = pool(), k = counts(p);
      info.textContent = k.all + ' carduri în total: ' + k.due + ' de repetat acum, ' + k.fresh + ' noi, ' + k.learned + ' învățate bine.';
      var n = sessionSize(p, mode);
      go.textContent = n ? 'Începe: ' + U.nr(n, 'card', 'carduri') : 'Nimic de făcut aici';
      go.disabled = !n;
    }
    function start() { App.go('cards', { run: 1, chs: Object.keys(sel).filter(function (k) { return sel[k]; }), mode: mode }); }
    draw();
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Carduri'), h('p', 'Întrebarea apare pe față, răspunsul pe spate. Spui răspunsul în minte înainte să întorci cardul. Cele greșite revin mai repede, cele știute mai rar.'))),
      h('div.card.opts-card',
        h('div.field', h('span.lab', 'Capitole'), chipsCh),
        h('div.field', h('span.lab', 'Ce parcurgi'), chipsMode),
        info, go),
      h('button.btn.ghost', { onClick: function () { App.go('practice'); } }, U.icon('left', 16), 'Înapoi la Exersează'));
  };

  function sessionSize(pool, mode) {
    var k = counts(pool), n = S.data.settings.perSession;
    if (mode === 'all') return Math.min(pool.length, Math.max(n, 1) * 1);
    if (mode === 'weak') return Math.min(pool.filter(isWeak).length, n);
    return Math.min(k.due + k.fresh, n);
  }
  function isWeak(c) { var x = S.card(c.id); return x.ko > 0 && (x.b <= 2 || x.ko > x.ok); }

  function runFromParams(p) {
    var App = g.App;
    var pool = D.cards.filter(function (c) { return inScope(c, p); });
    var n = p.sec ? pool.length : S.data.settings.perSession;
    var items;
    if (p.mode === 'weak') items = U.shuffle(pool.filter(isWeak)).slice(0, n);
    else if (p.mode === 'all') items = U.shuffle(pool).slice(0, n);
    else {
      var due = U.shuffle(pool.filter(function (c) { return S.isDue(c.id); }));
      var fresh = pool.filter(function (c) { return S.card(c.id).b === 0; });
      items = due.slice(0, n);
      if (items.length < n) items = items.concat(U.shuffle(fresh).slice(0, n - items.length));
    }
    if (!items.length) {
      return h('div.stack',
        h('div.card', h('h2', 'Nimic de repetat acum'), h('p.muted', p.mode === 'weak' ? 'Nu ai niciun card marcat ca greșit în această selecție.' : 'Toate cardurile din această selecție sunt la zi. Revino mai târziu sau parcurge-le amestecate.'),
          h('div.row', { style: 'margin-top:12px' },
            h('button.btn.primary', { onClick: function () { App.go('cards', Object.assign({}, p, { mode: 'all', run: 1 })); } }, U.icon('shuffle', 16), 'Amestecă tot'),
            h('button.btn', { onClick: function () { App.go('cards'); } }, 'Înapoi'))));
    }
    var title = 'Carduri' + (p.sec ? ' · ' + D.sec[p.sec].title : '');
    return runSession(items, { title: title, params: p });
  }

  /* ── sesiune de carduri ── */
  function runSession(items, opts) {
    var App = g.App;
    var queue = items.slice(), idx = 0, flipped = false, cur = null, cardEl = null;
    var stats = { ok: 0, hard: 0, ko: 0 }, missed = [];
    var root = h('div'), host = h('div'), actions = h('div.fc-actions');
    var prog = h('i'), count = h('span.count');
    var t0 = Date.now();
    root.appendChild(h('div.sess-head',
      h('div.row', h('button.btn.sm.ghost', { onClick: function () { S.saveNow(); App.go(opts.back || 'practice'); } }, U.icon('left', 16), 'Ieși'), h('span.title', opts.title), count),
      h('div.prog', prog)));
    root.appendChild(host);
    root.appendChild(actions);

    function updateProg() {
      var total = queue.length;
      prog.style.width = Math.round(100 * idx / Math.max(1, total)) + '%';
      count.textContent = Math.min(idx + 1, total) + ' / ' + total;
    }

    function show() {
      if (idx >= queue.length) return finish();
      cur = queue[idx];
      flipped = false;
      updateProg();
      U.clear(host); U.clear(actions);
      var back, front;
      var mkTags = function () {
        var t = [chChip(cur.ch)];
        if (cur.tag) t.push(h('span.chip', cur.tag));
        if (cur.kind === 'list') t.push(h('span.chip.warn', 'enumerare'));
        return t;
      };
      front = h('div.face.front', h('div.top', mkTags()), h('div.q', cur.q), h('div.hint', 'Gândește răspunsul, apoi întoarce cardul'));
      var srcTxt = cur.rowNote || (cur.srcLines && cur.srcLines.length ? cur.srcLines.slice(0, 3).map(function (l) { return l.plain; }).join(' · ') : '');
      var ansBox;
      var checks = [];
      if (cur.kind === 'list') {
        ansBox = h('ul.checklist', cur.items.map(function (it, i) {
          var cb = h('input', { type: 'checkbox', id: 'li-' + i });
          cb.addEventListener('change', suggest);
          cb.addEventListener('click', function (e) { e.stopPropagation(); });
          checks.push(cb);
          return h('li', h('label', { for: 'li-' + i, onClick: function (e) { e.stopPropagation(); } }, cb, h('span', Notes.inline(it))));
        }));
      } else {
        ansBox = h('div.a', Notes.inline(cur.a));
      }
      back = h('div.face.back',
        h('div.top', mkTags()),
        cur.kind === 'list' ? h('div.small.muted', 'Bifează ce ai spus corect:') : null,
        ansBox,
        srcTxt ? h('div.src', h('b', 'Din notițe: '), srcTxt) : null,
        h('button.btn.sm.ghost', { style: 'align-self:flex-start', onClick: function (e) { e.stopPropagation(); S.saveNow(); App.go('notes', { ch: cur.ch, sec: cur.sec }); } }, U.icon('book', 15), 'Vezi în notițe'));
      cardEl = h('div.fc-card', { tabindex: '0', role: 'button', 'aria-label': 'Întoarce cardul', onClick: flip }, front, back);
      host.appendChild(h('div.fc', cardEl));
      var showBtn = h('button.btn.primary.lg', { onClick: flip }, 'Arată răspunsul ', h('kbd', 'Spațiu'));
      actions.appendChild(showBtn);
      cardEl.focus({ preventScroll: true });

      cur._checks = checks;
    }

    var gradeBtns = [];
    function suggestion() {
      if (!cur || cur.kind !== 'list' || !cur._checks.length) return null;
      var n = cur._checks.filter(function (c) { return c.checked; }).length;
      var p = n / cur._checks.length;
      return p === 1 ? 2 : p >= 0.6 ? 1 : 0;
    }
    function suggest() {
      var s = suggestion();
      gradeBtns.forEach(function (b, i) { b.classList.toggle('primary', s === i); });
    }
    function flip() {
      if (flipped) return;
      flipped = true;
      cardEl.classList.add('flipped');
      U.clear(actions);
      gradeBtns = [
        h('button.btn.bad', { onClick: function () { grade(0); } }, 'Nu știam', h('small', 'revine în curând ', h('kbd', '1'))),
        h('button.btn.mid', { onClick: function () { grade(1); } }, 'Greu', h('small', 'revine mai târziu ', h('kbd', '2'))),
        h('button.btn.good', { onClick: function () { grade(2); } }, 'Știam', h('small', 'mai rar ', h('kbd', '3')))
      ];
      actions.appendChild(h('div.grades', gradeBtns));
      actions.appendChild(h('div.kbd-hint', 'Alege cât de bine ai știut răspunsul'));
    }
    function grade(res) {
      var c = cur;
      if (opts.srs !== false) S.grade(c.id, res);
      stats[res === 2 ? 'ok' : res === 1 ? 'hard' : 'ko']++;
      if (res < 2 && missed.indexOf(c) < 0) missed.push(c);
      if (res < 2 && (c._rq || 0) < 2) {
        c._rq = (c._rq || 0) + 1;
        queue.splice(Math.min(queue.length, idx + 1 + (res === 0 ? 3 : 7)), 0, c);
      }
      idx++;
      show();
    }
    function finish() {
      S.saveNow();
      document.removeEventListener('keydown', onKey);
      U.clear(root);
      var total = stats.ok + stats.hard + stats.ko;
      root.appendChild(h('div.card.result',
        h('div.eyebrow', 'Sesiune încheiată'),
        h('div.score-big', total ? Math.round(100 * stats.ok / total) + '%' : '—', h('small', ' știute din prima')),
        h('div.stat-grid',
          h('div.stat', h('b', stats.ok), h('span', 'Știam')),
          h('div.stat', h('b', stats.hard), h('span', 'Greu')),
          h('div.stat', h('b', stats.ko), h('span', 'Nu știam')),
          h('div.stat', h('b', U.fmtDur(Date.now() - t0)), h('span', 'Timp'))),
        h('div.row',
          missed.length ? h('button.btn.primary', { onClick: function () { App.go('cards', { run: 1, ids: missed.map(function (m) { return m.id; }), mode: 'ids' }); } }, U.icon('redo', 16), 'Repetă ' + U.nr(missed.length, 'card greșit', 'carduri greșite')) : null,
          h('button.btn', { onClick: function () { App.go('cards', opts.params && opts.params.run ? opts.params : {}); } }, 'Încă o sesiune'),
          h('button.btn.ghost', { onClick: function () { App.go('practice'); } }, 'Înapoi la Exersează'))));
    }
    function onKey(e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) flip();
        else if (e.key === 'Enter') { var s = suggestion(); grade(s == null ? 2 : s); }
      } else if (flipped && (e.key === '1' || e.key === '2' || e.key === '3')) grade(parseInt(e.key, 10) - 1);
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });
    show();
    return root;
  }
  Cards.runSession = runSession;

  // sesiune pe liste de ID-uri (repetarea greșelilor)
  var baseView = Cards.view;
  Cards.view = function (params) {
    params = params || {};
    if (params.mode === 'ids' && params.ids) {
      var items = params.ids.map(function (id) { return D.cardById[id]; }).filter(Boolean);
      return runSession(U.shuffle(items), { title: 'Carduri greșite', params: {} });
    }
    return baseView(params);
  };

  /* ── completări din notițe ── */
  Cards.clozeView = function (params) {
    params = params || {};
    var App = g.App;
    var pool = D.cloze.filter(function (c) {
      if (params.sec) return c.sec === params.sec;
      if (params.ch) return c.ch === params.ch;
      return true;
    });
    // prioritate: greșite, nevăzute, apoi restul
    var scored = pool.map(function (c) {
      var x = S.data.line[c.id];
      var w = !x ? 1.0 : x.ko > x.ok ? 2.5 : x.ko > 0 ? 1.4 : 0.35;
      return { c: c, w: w * (0.6 + Math.random() * 0.8) };
    }).sort(function (a, b) { return b.w - a.w; });
    var items = scored.slice(0, params.n || 15).map(function (s) { return s.c; });
    if (!items.length) return h('div.card', h('p', 'Nu există propoziții pentru această selecție.'), h('button.btn', { onClick: function () { App.go('practice'); } }, 'Înapoi'));

    var idx = 0, stats = { ok: 0, ko: 0 }, missed = [], cur;
    var root = h('div'), host = h('div'), count = h('span.count'), prog = h('i');
    root.appendChild(h('div.sess-head',
      h('div.row', h('button.btn.sm.ghost', { onClick: function () { S.saveNow(); App.go('practice'); } }, U.icon('left', 16), 'Ieși'),
        h('span.title', 'Completează' + (params.sec ? ' · ' + D.sec[params.sec].title : '')), count),
      h('div.prog', prog)));
    root.appendChild(host);

    function show() {
      if (idx >= items.length) return finish();
      cur = items[idx];
      count.textContent = (idx + 1) + ' / ' + items.length;
      prog.style.width = Math.round(100 * idx / items.length) + '%';
      U.clear(host);
      var typed = cur.ans.split(/\s+/).length <= 3 && cur.ans.length <= 28;
      var gap = h('span.gap', cur.ans.replace(/./g, ' ').slice(0, 14) || ' ');
      var sentence = h('div.cz');
      var crumbs = [D.sec[cur.sec].title].concat(cur.ctx.chain).filter(function (x, i, a) { return i === 0 || x !== a[i - 1]; });
      sentence.appendChild(h('span.ctx', crumbs.join(' › ')));
      var p = h('p', { style: 'margin:0' });
      cur.segs.forEach(function (s) {
        if (s.t === 'text') p.appendChild(document.createTextNode(s.v));
        else if (s.i === cur.i) p.appendChild(gap);
        else p.appendChild(document.createTextNode(s.v));
      });
      sentence.appendChild(p);
      // contextul nu trebuie să dea răspunsul: se scot rândurile care îl conțin
      var ak = U.key(cur.ans);
      var noLeak = function (t) { return ak.length < 3 || U.key(t).indexOf(ak) < 0; };
      var kidsShown = (cur.kids || []).filter(noLeak);
      var sibsShown = cur.ctx.sibs.filter(noLeak);
      if (kidsShown.length) sentence.appendChild(h('div.small.muted', { style: 'margin-top:12px;font-family:var(--f-ui)' }, h('b', 'Sub acest punct, în notițe: '), kidsShown.join(' · ')));
      if (sibsShown.length) sentence.appendChild(h('details.small.muted', { style: 'margin-top:10px' }, h('summary', 'Alte puncte din aceeași listă'), h('ul', { style: 'margin:6px 0 0 18px;padding:0' }, sibsShown.map(function (t) { return h('li', t); }))));
      var input = h('input', { type: 'text', id: 'cz-in', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'Scrie cuvintele care lipsesc', 'aria-label': 'Răspuns' });
      var fb = h('div'), actions = h('div.row');
      var card = h('div.card', h('div.top.row', chChip(cur.ch), h('span.chip', 'completează')), sentence);
      host.appendChild(card);
      host.appendChild(h('div', { style: 'margin-top:14px;display:grid;gap:12px' }, typed ? h('div.type-row', input) : null, fb, actions));

      function reveal(ok, msg) {
        S.rec('line', cur.id, ok); S.touch('q');
        if (ok) stats.ok++; else { stats.ko++; missed.push(cur); }
        gap.textContent = cur.ans; gap.style.color = 'inherit'; gap.className = 'fill';
        U.clear(actions); U.clear(fb);
        fb.appendChild(h('div.feedback.' + (ok ? 'ok' : 'bad'), h('b.h', U.icon(ok ? 'check' : 'x', 18), ok ? 'Corect' : 'Răspunsul din notițe'), msg ? h('span', msg) : null));
        actions.appendChild(h('button.btn.primary', { onClick: next }, idx + 1 < items.length ? 'Următoarea' : 'Vezi rezultatul', ' ', h('kbd', 'Enter')));
        actions.firstChild.focus();
      }
      function check() {
        if (typed) {
          var m = U.match(input.value, [cur.ans]);
          if (!input.value.trim()) return;
          input.disabled = true;
          if (m === 2) reveal(true, null);
          else if (m === 1) reveal(true, 'Aproape: în notițe scrie „' + cur.ans + '”.');
          else reveal(false, 'Ai scris „' + input.value.trim() + '”; în notițe: „' + cur.ans + '”.');
        }
      }
      if (typed) {
        actions.appendChild(h('button.btn.primary', { onClick: check }, 'Verifică'));
        actions.appendChild(h('button.btn.ghost', { onClick: function () { input.disabled = true; reveal(false, null); } }, 'Nu știu'));
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); check(); } });
        setTimeout(function () { input.focus(); }, 30);
      } else {
        actions.appendChild(h('button.btn.primary', { onClick: function () {
          U.clear(actions);
          gap.textContent = cur.ans; gap.style.color = 'inherit'; gap.className = 'fill';
          actions.appendChild(h('button.btn.good', { onClick: function () { reveal(true, null); } }, 'Știam'));
          actions.appendChild(h('button.btn.bad', { onClick: function () { reveal(false, null); } }, 'Nu știam'));
        } }, 'Arată ce lipsește'));
      }
    }
    function next() { idx++; show(); }
    function finish() {
      S.saveNow();
      document.removeEventListener('keydown', onKey);
      U.clear(root);
      var total = stats.ok + stats.ko;
      root.appendChild(h('div.card.result',
        h('div.eyebrow', 'Completări încheiate'),
        h('div.score-big', Math.round(100 * stats.ok / Math.max(1, total)) + '%', h('small', ' corecte')),
        missed.length ? h('div.stack', h('b', 'De repetat:'), h('ul', { style: 'padding-left:18px;display:grid;gap:4px' }, missed.map(function (m) { return h('li', { style: 'font-family:var(--f-read)' }, m.line.plain, ' → ', h('b', m.ans)); }))) : h('p.muted', 'Toate au fost corecte.'),
        h('div.row',
          h('button.btn.primary', { onClick: function () { App.go('cloze', params); } }, U.icon('redo', 16), 'Alt set'),
          h('button.btn.ghost', { onClick: function () { App.go('practice'); } }, 'Înapoi la Exersează'))));
    }
    function onKey(e) {
      if (e.key === 'Enter') {
        var nb = U.$('.btn.primary', host);
        var tag = e.target && e.target.tagName;
        if (nb && /Următoarea|Vezi rezultatul/.test(nb.textContent) && tag !== 'INPUT') { e.preventDefault(); next(); }
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(function () { document.removeEventListener('keydown', onKey); });
    show();
    return root;
  };

  /* ── statistici pentru pagina de start ── */
  Cards.stats = function (chId) {
    var pool = D.cards.filter(function (c) { return !chId || c.ch === chId; });
    var t = [0, 0, 0, 0];
    pool.forEach(function (c) { t[S.tier(c.id)]++; });
    var due = pool.filter(function (c) { return S.isDue(c.id); }).length;
    return { total: pool.length, tiers: t, due: due, fresh: t[0] };
  };
  Cards.weakList = function (limit) {
    return D.cards.filter(isWeak).sort(function (a, b) { return (S.card(b.id).ko - S.card(b.id).ok) - (S.card(a.id).ko - S.card(a.id).ok); }).slice(0, limit || 5);
  };
})(typeof window !== 'undefined' ? window : globalThis);
