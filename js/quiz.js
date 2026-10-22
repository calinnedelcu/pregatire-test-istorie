/* Motor de întrebări: alegere, adevărat/fals, selecție multiplă, răspuns scris, ordonare, potrivire, sortare. */
(function (g) {
  'use strict';
  var U = g.U, h = U.h, S = g.Store, Notes = g.Notes;
  var D = (g.DATA = g.DATA || {});
  var Quiz = (g.Quiz = {});

  var TYPE_LABEL = { mcq: 'alegere', tf: 'adevărat / fals', multi: 'alegeri multiple', type: 'răspuns scris', order: 'ordonare', match: 'potrivire', sort: 'sortare', list: 'enumerare' };
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  /* ── construire ── */
  Quiz.build = function () {
    var out = [], byId = {};
    function add(q) {
      var sec = D.sec[q.sec];
      if (!sec) { console.warn('Întrebare fără secțiune validă:', q.id, q.sec); return; }
      q.ch = sec.ch;
      q.srcLines = (q.src || []).map(function (s) { return g.Cards.findLine(q.sec, s); }).filter(Boolean);
      out.push(q); byId[q.id] = q;
    }
    (D.quizSrc || []).forEach(add);
    (D.gamesSrc || []).forEach(function (q) { q.game = true; add(q); });
    if (D.genQuestions) D.genQuestions().forEach(add);
    D.questions = out;
    D.qById = byId;
  };

  /* distractori din „pool” */
  function distractors(q, n) {
    var okSet = {};
    [].concat(q.ok).concat(q.also || []).forEach(function (a) { okSet[U.key(a)] = 1; });
    // un distractor care conține răspunsul corect (sau invers) ar putea fi acceptat ca bun: se exclude
    var oks = [].concat(q.ok).concat(q.also || []).map(U.key);
    var near = function (x) {
      var k = U.key(x);
      return oks.some(function (o) { return o.length >= 4 && k.length >= 4 && (k.indexOf(o) >= 0 || o.indexOf(k) >= 0); });
    };
    var pool = (q.pool && D.pools[q.pool] || []).filter(function (x) { return !okSet[U.key(x)] && !near(x); });
    var fixed = (q.bad || []).filter(function (x) { return !okSet[U.key(x)]; });
    var res = U.uniq(U.shuffle(fixed).concat(U.shuffle(pool)));
    return res.slice(0, n);
  }

  /* ── pregătire (amestecă opțiuni) ── */
  Quiz.prepare = function (q) {
    var p = Object.assign({}, q);
    if (q.t === 'mcq') {
      var opts = [{ t: Array.isArray(q.ok) ? q.ok[0] : q.ok, ok: true }].concat(distractors(q, 3).map(function (t) { return { t: t, ok: false }; }));
      p.opts = U.shuffle(opts);
    } else if (q.t === 'multi') {
      p.opts = U.shuffle(q.opts.map(function (o) { return { t: o.t, ok: !!o.ok }; }));
    } else if (q.t === 'match') {
      p.left = U.shuffle(q.pairs.map(function (pr, i) { return { t: pr[0], i: i }; }));
      p.right = U.shuffle(q.pairs.map(function (pr, i) { return { t: pr[1], i: i }; }));
    } else if (q.t === 'order') {
      p.bank = U.shuffle(q.items.map(function (it, i) { return { t: it.t, k: it.k, i: i }; }));
    } else if (q.t === 'sort') {
      p.pool = U.shuffle(q.items.map(function (it, i) { return { t: it.t, b: it.b, i: i }; }));
    }
    return p;
  };

  /* ── randare pe tipuri; fiecare întoarce {el, ready(), submit(), onChange(fn), lock()} ── */
  var R = {};

  R.mcq = function (q) {
    var sel = -1, locked = false, cb = function () {};
    var btns = q.opts.map(function (o, i) {
      var b = h('button.opt', { type: 'button', onClick: function () { if (locked) return; sel = i; refresh(); cb(); } },
        h('span.l', LETTERS[i]), h('span', Notes.inline(o.t)));
      return b;
    });
    function refresh() { btns.forEach(function (b, i) { b.classList.toggle('sel', i === sel); }); }
    return {
      el: h('div.opts', btns),
      ready: function () { return sel >= 0; },
      onChange: function (f) { cb = f; },
      keys: function (k) { var i = LETTERS.indexOf(k.toUpperCase()); var n = parseInt(k, 10); var idx = !isNaN(n) ? n - 1 : i; if (idx >= 0 && idx < btns.length && !locked) { sel = idx; refresh(); cb(); return true; } return false; },
      submit: function () {
        locked = true;
        var correct = q.opts.findIndex(function (o) { return o.ok; });
        btns.forEach(function (b, i) {
          b.disabled = true;
          b.classList.remove('sel');
          if (i === correct) b.classList.add('right');
          else if (i === sel) b.classList.add('wrong');
          else b.classList.add('dim');
        });
        var good = sel === correct;
        return { score: good ? 1 : 0, given: sel >= 0 ? q.opts[sel].t : '— (nu știu)', correct: q.opts[correct].t };
      }
    };
  };

  R.tf = function (q) {
    var sel = null, locked = false, cb = function () {};
    var bT = h('button.opt', { type: 'button', onClick: function () { if (!locked) { sel = true; refresh(); cb(); } } }, h('span.l', 'A'), 'Adevărat');
    var bF = h('button.opt', { type: 'button', onClick: function () { if (!locked) { sel = false; refresh(); cb(); } } }, h('span.l', 'F'), 'Fals');
    function refresh() { bT.classList.toggle('sel', sel === true); bF.classList.toggle('sel', sel === false); }
    return {
      el: h('div.opts', bT, bF),
      ready: function () { return sel !== null; },
      onChange: function (f) { cb = f; },
      keys: function (k) { var c = k.toLowerCase(); if (locked) return false; if (c === 'a' || c === '1') { sel = true; refresh(); cb(); return true; } if (c === 'f' || c === '2') { sel = false; refresh(); cb(); return true; } return false; },
      submit: function () {
        locked = true; bT.disabled = bF.disabled = true;
        bT.classList.remove('sel'); bF.classList.remove('sel');
        var good = sel === q.a;
        (q.a ? bT : bF).classList.add('right');
        if (!good && sel !== null) (sel ? bT : bF).classList.add('wrong');
        return { score: good ? 1 : 0, given: sel === null ? '— (nu știu)' : sel ? 'Adevărat' : 'Fals', correct: q.a ? 'Adevărat' : 'Fals' };
      }
    };
  };

  R.multi = function (q) {
    var chosen = {}, locked = false, cb = function () {};
    var btns = q.opts.map(function (o, i) {
      return h('button.opt', { type: 'button', onClick: function () { if (locked) return; chosen[i] = !chosen[i]; btns[i].classList.toggle('sel', !!chosen[i]); cb(); } },
        h('span.l', LETTERS[i]), h('span', Notes.inline(o.t)));
    });
    return {
      el: h('div.opts', h('p.small.muted', 'Poate fi unul sau mai multe răspunsuri corecte.'), btns),
      ready: function () { return Object.keys(chosen).some(function (k) { return chosen[k]; }); },
      onChange: function (f) { cb = f; },
      keys: function (k) { var n = parseInt(k, 10) - 1; if (n >= 0 && n < btns.length && !locked) { chosen[n] = !chosen[n]; btns[n].classList.toggle('sel', !!chosen[n]); cb(); return true; } return false; },
      submit: function () {
        locked = true;
        var total = q.opts.filter(function (o) { return o.ok; }).length, right = 0, wrong = 0;
        btns.forEach(function (b, i) {
          b.disabled = true; b.classList.remove('sel');
          var o = q.opts[i];
          if (o.ok && chosen[i]) { right++; b.classList.add('right'); }
          else if (o.ok && !chosen[i]) { b.classList.add('right'); b.classList.add('dim'); }
          else if (!o.ok && chosen[i]) { wrong++; b.classList.add('wrong'); }
          else b.classList.add('dim');
        });
        var score = U.clamp((right - wrong) / total, 0, 1);
        return { score: score, given: q.opts.filter(function (o, i) { return chosen[i]; }).map(function (o) { return o.t; }).join('; ') || '—', correct: q.opts.filter(function (o) { return o.ok; }).map(function (o) { return o.t; }).join('; ') };
      }
    };
  };

  R.type = function (q) {
    var input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: q.hint || 'Scrie răspunsul', 'aria-label': 'Răspuns' });
    var cb = function () {}, locked = false;
    input.addEventListener('input', function () { cb(); });
    setTimeout(function () { input.focus(); }, 40);
    return {
      el: h('div.type-row', input),
      ready: function () { return input.value.trim().length > 0; },
      onChange: function (f) { cb = f; },
      focus: function () { input.focus(); },
      submit: function () {
        locked = true; input.disabled = true;
        var m = U.match(input.value, [].concat(q.a));
        input.style.borderColor = m ? 'var(--ok)' : 'var(--bad)';
        return { score: m === 2 ? 1 : m === 1 ? 0.9 : 0, given: input.value.trim(), correct: [].concat(q.a)[0], close: m === 1 };
      }
    };
  };

  R.order = function (q) {
    var seq = [], locked = false, cb = function () {};
    var slots = h('div.slots');
    var bank = h('div.bank');
    var ansLine = h('div.ans');
    function draw() {
      U.clear(slots); U.clear(bank);
      q.bank.forEach(function (it) {
        var used = seq.indexOf(it.i) >= 0;
        bank.appendChild(h('button.pbtn', { type: 'button', disabled: used || locked, onClick: function () { if (locked) return; seq.push(it.i); draw(); cb(); } }, Notes.inline(it.t)));
      });
      for (var s = 0; s < q.bank.length; s++) {
        var idx = seq[s];
        var it = idx == null ? null : q.bank.filter(function (b) { return b.i === idx; })[0];
        slots.appendChild(h('div.slot' + (it ? '.filled' : ''),
          it ? h('button', { type: 'button', 'aria-label': 'Scoate din ordine', onClick: function () { if (locked) return; seq.splice(seq.indexOf(it.i), 1); draw(); cb(); } }, Notes.inline(it.t)) : null));
      }
    }
    draw();
    return {
      el: h('div.ord', h('p.small.muted', 'Atinge elementele în ordinea corectă. Atinge un element din listă ca să-l scoți.'), slots, bank, ansLine),
      ready: function () { return seq.length === q.bank.length; },
      onChange: function (f) { cb = f; },
      submit: function () {
        locked = true;
        var ks = seq.map(function (i) { return q.items[i].k; });
        var good = 0;
        var kids = U.$$('.slot', slots);
        // fiecare poziție e corectă dacă valoarea k e potrivită cu cea așteptată (egalitățile sunt acceptate)
        var sorted = q.items.map(function (it) { return it.k; }).slice().sort(function (a, b) { return a - b; });
        ks.forEach(function (k, p) {
          var ok = k === sorted[p];
          if (ok) good++;
          if (kids[p]) kids[p].classList.add(ok ? 'ok' : 'bad');
        });
        draw();
        U.$$('.slot', slots).forEach(function (el, p) { el.classList.add(ks[p] === sorted[p] ? 'ok' : 'bad'); });
        var correctText = q.items.slice().sort(function (a, b) { return a.k - b.k; }).map(function (it) { return Notes.strip(it.t); }).join('  →  ');
        return { score: good === ks.length ? 1 : good / ks.length * 0.6, given: seq.map(function (i) { return Notes.strip(q.items[i].t); }).join(' → '), correct: correctText };
      }
    };
  };

  R.match = function (q) {
    var selL = null, selR = null, done = {}, miss = 0, locked = false, cb = function () {};
    var colL = h('div.col'), colR = h('div.col');
    function draw() {
      U.clear(colL); U.clear(colR);
      q.left.forEach(function (it) {
        colL.appendChild(h('button.pbtn' + (done[it.i] ? '.done' : '') + (selL === it.i ? '.sel' : ''), { type: 'button', disabled: !!done[it.i] || locked, onClick: function () { selL = selL === it.i ? null : it.i; tryPair(); draw(); } }, Notes.inline(it.t)));
      });
      q.right.forEach(function (it) {
        colR.appendChild(h('button.pbtn' + (done[it.i] ? '.done' : '') + (selR === it.i ? '.sel' : ''), { type: 'button', disabled: !!done[it.i] || locked, onClick: function () { selR = selR === it.i ? null : it.i; tryPair(); draw(); } }, Notes.inline(it.t)));
      });
    }
    function tryPair() {
      if (selL == null || selR == null) return;
      if (selL === selR) { done[selL] = true; selL = selR = null; cb(); }
      else {
        miss++;
        var l = selL, r = selR; selL = selR = null;
        draw();
        U.$$('.pbtn', colL).forEach(function (b, i) { if (q.left[i].i === l) b.classList.add('shake'); });
        U.$$('.pbtn', colR).forEach(function (b, i) { if (q.right[i].i === r) b.classList.add('shake'); });
        setTimeout(draw, 350);
        return;
      }
    }
    draw();
    return {
      el: h('div', h('p.small.muted', 'Atinge un element din stânga, apoi perechea lui din dreapta.'), h('div.pair-cols', colL, colR)),
      ready: function () { return Object.keys(done).length === q.pairs.length; },
      onChange: function (f) { cb = f; },
      submit: function () {
        locked = true;
        var n = q.pairs.length;
        var score = U.clamp(1 - miss / (n * 1.5), 0, 1);
        return { score: miss === 0 ? 1 : Math.max(0.2, score), given: miss === 0 ? 'toate perechile din prima' : miss + ' încercări greșite', correct: q.pairs.map(function (p) { return Notes.strip(p[0]) + ' – ' + Notes.strip(p[1]); }).join('; ') };
      }
    };
  };

  R.sort = function (q) {
    var placed = {}, selected = null, locked = false, cb = function () {};
    var poolEl = h('div.pool'), bucketsEl = h('div.buckets');
    function draw() {
      U.clear(poolEl); U.clear(bucketsEl);
      q.pool.forEach(function (it) {
        if (placed[it.i] == null) poolEl.appendChild(h('button.pbtn' + (selected === it.i ? '.sel' : ''), { type: 'button', disabled: locked, onClick: function () { selected = selected === it.i ? null : it.i; draw(); } }, Notes.inline(it.t)));
      });
      q.buckets.forEach(function (name, bi) {
        var items = q.pool.filter(function (it) { return placed[it.i] === bi; });
        var el = h('div.bucket' + (selected != null ? '.target' : ''), {
          onClick: function () { if (selected != null && !locked) { placed[selected] = bi; selected = null; draw(); cb(); } }
        }, h('h4', name), items.map(function (it) {
          return h('button.pbtn' + (locked ? (it.b === bi ? '.ok' : '.bad') : ''), { type: 'button', onClick: function (e) { e.stopPropagation(); if (!locked) { delete placed[it.i]; draw(); cb(); } } }, Notes.inline(it.t));
        }));
        bucketsEl.appendChild(el);
      });
    }
    draw();
    return {
      el: h('div.sort', h('p.small.muted', 'Atinge un element, apoi coloana în care îl pui. Atinge-l din nou ca să-l scoți.'), poolEl, bucketsEl),
      ready: function () { return Object.keys(placed).length === q.pool.length; },
      onChange: function (f) { cb = f; },
      submit: function () {
        locked = true; selected = null;
        var good = 0;
        q.pool.forEach(function (it) { if (placed[it.i] === it.b) good++; });
        draw();
        var map = q.buckets.map(function (name, bi) { return name + ': ' + q.items.filter(function (it) { return it.b === bi; }).map(function (it) { return Notes.strip(it.t); }).join(', '); }).join(' | ');
        return { score: good / q.pool.length, given: good + ' din ' + q.pool.length + ' puse corect', correct: map };
      }
    };
  };

  Quiz.renderers = R;

  /* ── sesiune ── */
  /* opts: {title, questions, mode:'practice'|'exam', back, onFinish(results)} */
  Quiz.session = function (opts) {
    var App = g.App;
    var qs = opts.questions.map(Quiz.prepare);
    var exam = opts.mode === 'exam';
    var idx = 0, results = [], ctl = null, submitted = false, cur = null;
    var t0 = Date.now();
    var root = h('div'), host = h('div'), foot = h('div', { style: 'margin-top:16px;display:grid;gap:12px' });
    var prog = h('i'), count = h('span.count'), timer = h('span.count');
    var tick = null;
    if (opts.timer) {
      var limit = opts.timer * 1000;
      tick = setInterval(function () {
        var left = limit - (Date.now() - t0);
        timer.textContent = '⏱ ' + U.fmtDur(Math.max(0, left));
        if (left <= 0) { finish(true); }
      }, 500);
    }
    root.appendChild(h('div.sess-head',
      h('div.row', h('button.btn.sm.ghost', { onClick: function () { cleanup(); S.saveNow(); App.go(opts.back || 'practice'); } }, U.icon('left', 16), 'Ieși'), h('span.title', opts.title), timer, count),
      h('div.prog', prog)));
    root.appendChild(host);
    root.appendChild(foot);

    function cleanup() { document.removeEventListener('keydown', onKey); if (tick) clearInterval(tick); }
    App.onLeave(cleanup);

    function show() {
      if (idx >= qs.length) return finish(false);
      cur = qs[idx]; submitted = false;
      count.textContent = (idx + 1) + ' / ' + qs.length;
      prog.style.width = Math.round(100 * idx / qs.length) + '%';
      U.clear(host); U.clear(foot);
      ctl = R[cur.t](cur);
      var meta = h('div.qmeta', chipFor(cur.ch), h('span.chip', TYPE_LABEL[cur.t] || cur.t), cur.lvl === 3 ? h('span.chip.warn', 'grea') : cur.lvl >= 4 ? h('span.chip.bad', 'foarte grea') : null);
      host.appendChild(h('div.card.qcard', meta, h('div.qtext', Notes.inline(cur.q)), ctl.el));
      var btn = h('button.btn.primary.lg', { disabled: !ctl.ready(), onClick: submit }, exam ? (idx + 1 < qs.length ? 'Răspunde și continuă' : 'Răspunde și termină') : 'Verifică', ' ', h('kbd', 'Enter'));
      ctl.onChange(function () { btn.disabled = !ctl.ready(); });
      foot.appendChild(btn);
      if (!exam && cur.t !== 'match') foot.appendChild(h('button.btn.ghost', { onClick: skip }, 'Nu știu'));
    }
    function chipFor(chId) { var ch = D.chById[chId]; return h('span.chip.' + (ch ? ch.cls : ''), Notes.short(chId)); }

    function skip() {
      if (submitted) return;
      // „Nu știu”: se completează automat greșit și se arată răspunsul
      var r;
      try { r = forceReveal(); } catch (e) { r = { score: 0, given: '—', correct: '' }; }
      finishQuestion(r);
    }
    function forceReveal() {
      // pentru mcq/tf se alege o opțiune greșită; pentru restul se predă ca greșit
      var r = ctl.submit();
      r.score = 0; r.given = '— (nu știu)';
      return r;
    }
    function submit() {
      if (submitted || !ctl.ready()) return;
      finishQuestion(ctl.submit());
    }
    function finishQuestion(r) {
      submitted = true;
      var res = { q: cur, score: r.score, given: r.given, correct: r.correct, close: r.close };
      results.push(res);
      S.rec('q', cur.id, r.score >= 0.99);
      S.touch('q');
      if (exam) { idx++; show(); return; }
      var cls = r.score >= 0.99 ? 'ok' : r.score > 0 ? 'mid' : 'bad';
      var srcTxt = cur.srcLines && cur.srcLines.length ? cur.srcLines.slice(0, 3).map(function (l) { return l.plain; }).join(' · ') : '';
      U.clear(foot);
      foot.appendChild(h('div.feedback.' + cls,
        h('b.h', U.icon(cls === 'bad' ? 'x' : 'check', 18), cls === 'ok' ? (r.close ? 'Corect (scris puțin diferit)' : 'Corect') : cls === 'mid' ? 'Parțial corect' : 'Greșit'),
        cls !== 'ok' && r.correct ? h('span', h('b', 'Răspuns: '), r.correct) : null,
        cur.why ? h('span', Notes.inline(cur.why)) : null,
        srcTxt ? h('span.src', h('b', 'Din notițe: '), srcTxt) : null));
      var nxt = h('button.btn.primary.lg', { onClick: next }, idx + 1 < qs.length ? 'Următoarea' : 'Vezi rezultatul', ' ', h('kbd', 'Enter'));
      foot.appendChild(nxt);
      nxt.focus({ preventScroll: true });
    }
    function next() { idx++; show(); }

    function onKey(e) {
      var tag = e.target && e.target.tagName;
      if (e.key === 'Enter') {
        if (tag === 'TEXTAREA') return;
        e.preventDefault();
        if (!submitted) submit(); else if (!exam) next();
        return;
      }
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!submitted && ctl && ctl.keys && e.key.length === 1) { if (ctl.keys(e.key)) e.preventDefault(); }
    }
    document.addEventListener('keydown', onKey);

    function finish(timeUp) {
      cleanup();
      S.saveNow();
      var spent = Date.now() - t0;
      if (opts.onFinish) { U.clear(root); root.appendChild(opts.onFinish(results, spent, timeUp)); return; }
      U.clear(root);
      root.appendChild(Quiz.resultView(results, spent, { back: opts.back, again: opts.again }));
    }
    show();
    return root;
  };

  Quiz.resultView = function (results, spent, o) {
    var App = g.App;
    o = o || {};
    var total = results.length;
    var pts = results.reduce(function (a, r) { return a + r.score; }, 0);
    var pct = total ? pts / total : 0;
    var missed = results.filter(function (r) { return r.score < 0.99; });
    var review = results.map(function (r, i) {
      var cls = r.score >= 0.99 ? 'ok' : r.score > 0 ? 'mid' : 'bad';
      return h('details',
        h('summary', h('span.st.' + cls, cls === 'ok' ? '✓' : cls === 'mid' ? '~' : '✕'), h('span', Notes.strip(r.q.q))),
        h('div.body',
          h('div', h('b', 'Răspunsul tău: '), r.given || '—'),
          cls !== 'ok' ? h('div', h('b', 'Corect: '), r.correct) : null,
          r.q.why ? h('div', Notes.inline(r.q.why)) : null));
    });
    return h('div.stack',
      h('div.card.result',
        o.hideScore ? null : h('div.eyebrow', 'Rezultat'),
        o.hideScore ? null : h('div.score-big', Math.round(pct * 100) + '%', h('small', ' · ' + (Math.round(pts * 10) / 10) + ' din ' + total + ' puncte')),
        h('div.stat-grid',
          h('div.stat', h('b', results.filter(function (r) { return r.score >= 0.99; }).length), h('span', 'Corecte')),
          h('div.stat', h('b', missed.length), h('span', 'De repetat')),
          h('div.stat', h('b', U.fmtDur(spent)), h('span', 'Timp'))),
        h('div.row',
          missed.length ? h('button.btn.primary', { onClick: function () { App.go('quiz', { ids: missed.map(function (r) { return r.q.id; }) }); } }, U.icon('redo', 16), 'Repetă ' + U.nr(missed.length, 'întrebare greșită', 'întrebări greșite')) : null,
          h('button.btn', { onClick: function () { App.go(o.again ? o.again.route : 'quiz', o.again ? o.again.params : {}); } }, 'Alt set'),
          h('button.btn.ghost', { onClick: function () { App.go(o.back || 'practice'); } }, 'Înapoi'))),
      h('div.card.flat', h('h3', { style: 'margin-bottom:10px' }, 'Răspunsuri, pe rând'), h('div.review', review)));
  };

  /* ── alegerea întrebărilor ── */
  Quiz.pick = function (o) {
    var pool = D.questions.filter(function (q) {
      if (o.game && !q.game) return false;
      if (o.sec && q.sec !== o.sec) return false;
      if (o.grp && q.grp !== o.grp) return false;
      if (o.chs && o.chs.length && o.chs.indexOf(q.ch) < 0) return false;
      if (o.types && o.types.length && o.types.indexOf(q.t) < 0) return false;
      if (o.ids && o.ids.indexOf(q.id) < 0) return false;
      if (o.minLvl && (q.lvl || 1) < o.minLvl) return false;
      return true;
    });
    // cele greșite și cele nevăzute vin primele; puțin zgomot ca să nu iasă mereu aceeași ordine
    var scored = pool.map(function (q) {
      var x = S.data.q[q.id];
      var w = !x ? 1.2 : x.ko > x.ok ? 2.6 : x.ko > 0 ? 1.5 : 0.5;
      return { q: q, w: w * (0.5 + Math.random()) };
    }).sort(function (a, b) { return b.w - a.w; });
    if (o.spread) {
      // câte o întrebare din fiecare secțiune, pe rând, ca să fie acoperită toată lecția (nu doar secțiunile mari)
      var bySec = {};
      scored.forEach(function (x) { (bySec[x.q.sec] = bySec[x.q.sec] || []).push(x); });
      var queues = U.shuffle(Object.keys(bySec)).map(function (k) { return bySec[k]; }), mixed = [];
      for (var more = true; more;) {
        more = false;
        queues.forEach(function (qu) { if (qu.length) { mixed.push(qu.shift()); more = true; } });
      }
      scored = mixed;
    }
    var n = o.n || 10, out = [], rest = [];
    // plafon: tabelul surselor și jocurile nu iau tot setul
    var capTab = Math.max(1, Math.ceil(n * 0.3)), capGame = Math.max(1, Math.ceil(n * 0.25)), cTab = 0, cGame = 0;
    scored.forEach(function (s) {
      var q = s.q;
      if (out.length >= n) { return; }
      if (!o.ids && !o.game) {
        if (q.grp === 'tabel' && cTab >= capTab) { rest.push(q); return; }
        if (q.game && cGame >= capGame) { rest.push(q); return; }
      }
      if (q.grp === 'tabel') cTab++;
      if (q.game) cGame++;
      out.push(q);
    });
    for (var k = 0; out.length < n && k < rest.length; k++) out.push(rest[k]);
    return out;
  };

  /* ── pagina „Întrebări” ── */
  Quiz.view = function (params) {
    params = params || {};
    var App = g.App;
    if (params.run || params.sec || params.ids || params.grp) {
      var qs = Quiz.pick({ sec: params.sec, chs: params.chs, types: params.types, ids: params.ids, minLvl: params.lvl || (params.hard ? 3 : 0), n: params.ids ? params.ids.length : (params.n || 10), spread: params.spread, grp: params.grp });
      if (!qs.length) return h('div.card', h('p', 'Nu există întrebări pentru această selecție.'), h('button.btn', { onClick: function () { App.go('practice'); } }, 'Înapoi'));
      return Quiz.session({ title: (params.grp === 'opere' ? 'Operă ↔ autor' : 'Întrebări') + (params.sec ? ' · ' + D.sec[params.sec].title : params.grp === 'opere' && params.chs && params.chs.length === 1 ? ' · ' + D.chById[params.chs[0]].title : params.spread && params.chs && params.chs.length === 1 ? ' · ' + D.chById[params.chs[0]].title : ''), questions: U.shuffle(qs), mode: 'practice', again: { route: 'quiz', params: params.ids ? {} : params } });
    }
    var sel = {}; D.chapters.forEach(function (c) { sel[c.id] = true; });
    var n = 10, lvl = 0;
    var chipsCh = h('div.chips-pick'), chipsN = h('div.chips-pick'), chipsLvl = h('div.chips-pick'), info = h('p.muted');
    function pool() { return D.questions.filter(function (q) { return sel[q.ch] && (q.lvl || 1) >= lvl; }); }
    function draw() {
      U.clear(chipsCh); U.clear(chipsN); U.clear(chipsLvl);
      [[0, 'Toate'], [3, 'Grele'], [4, 'Foarte grele']].forEach(function (x) { chipsLvl.appendChild(h('button' + (lvl === x[0] ? '.on' : ''), { onClick: function () { lvl = x[0]; draw(); } }, x[1])); });
      D.chapters.forEach(function (c) { chipsCh.appendChild(h('button' + (sel[c.id] ? '.on' : ''), { onClick: function () { sel[c.id] = !sel[c.id]; draw(); } }, Notes.short(c.id))); });
      [5, 10, 20].forEach(function (k) { chipsN.appendChild(h('button' + (n === k ? '.on' : ''), { onClick: function () { n = k; draw(); } }, k + ' întrebări')); });
      info.textContent = pool().length + ' întrebări disponibile în selecție. Cele greșite înainte apar mai des.' + (lvl === 3 ? ' Cele grele au afirmații apropiate, din care una singură e corectă.' : lvl === 4 ? ' Cele foarte grele leagă mai multe informații din notițe și cer să deosebești detalii apropiate.' : '');
    }
    draw();
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Întrebări'), h('p', 'Alegi răspunsul, primești explicația și rândul din notițe. Tipuri: alegere, adevărat/fals, alegeri multiple, răspuns scris, ordonare, potrivire.'))),
      h('div.card.opts-card', h('div.field', h('span.lab', 'Capitole'), chipsCh), h('div.field', h('span.lab', 'Câte întrebări'), chipsN), h('div.field', h('span.lab', 'Dificultate'), chipsLvl), info,
        h('button.btn.primary.lg', { onClick: function () { App.go('quiz', { run: 1, chs: Object.keys(sel).filter(function (k) { return sel[k]; }), n: n, lvl: lvl }); } }, 'Începe')),
      h('button.btn.ghost', { onClick: function () { App.go('practice'); } }, U.icon('left', 16), 'Înapoi la Exersează'));
  };
})(typeof window !== 'undefined' ? window : globalThis);
