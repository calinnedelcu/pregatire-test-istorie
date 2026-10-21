/* Pagini: acasă, exersează, jocuri, scrie din memorie, test simulat, axa timpului, trucuri. */
(function (g) {
  'use strict';
  var U = g.U, h = U.h, S = g.Store, App = g.App, Notes = g.Notes, Cards = g.Cards, Quiz = g.Quiz;
  var D = (g.DATA = g.DATA || {});
  var V = App.views;

  V.cards = function (p) { return Cards.view(p); };
  V.cloze = function (p) { return Cards.clozeView(p); };
  V.quiz = function (p) { return Quiz.view(p); };
  V.notes = function (p) { return Notes.view(p || {}); };

  function chChip(chId) { var ch = D.chById[chId]; return h('span.chip.' + (ch ? ch.cls : ''), Notes.short(chId)); }
  function modeTile(icon, title, desc, badge, fn, disabled) {
    return h('button.mode', { onClick: fn, disabled: disabled }, h('div.mi', U.icon(icon, 22)), h('b', title), h('span', desc), badge ? h('span.chip.badge', badge) : null);
  }
  function missedQuestions() {
    return D.questions.filter(function (q) { var x = S.data.q[q.id]; return x && x.ko > 0 && x.ko >= x.ok; });
  }

  /* ── statistici ── */
  function chapterStats(ch) {
    var read = ch.sections.filter(function (s) { return S.data.read[s.id]; }).length;
    var cs = Cards.stats(ch.id);
    var qs = D.questions.filter(function (q) { return q.ch === ch.id; });
    var seen = 0, ok = 0, ko = 0;
    qs.forEach(function (q) { var x = S.data.q[q.id]; if (x) { seen++; ok += x.ok; ko += x.ko; } });
    return { read: read, total: ch.sections.length, cs: cs, qseen: seen, qtotal: qs.length, acc: ok + ko ? ok / (ok + ko) : null };
  }
  function mastery() {
    var cs = Cards.stats();
    if (!cs.total) return 0;
    return (cs.tiers[1] * 0.3 + cs.tiers[2] * 0.7 + cs.tiers[3]) / cs.total;
  }
  function tierBar(t, total) {
    var w = function (n) { return total ? (100 * n / total) + '%' : '0%'; };
    return h('div.bar', { role: 'img', 'aria-label': t[3] + ' stăpânite, ' + t[2] + ' aproape, ' + t[1] + ' în lucru, ' + t[0] + ' noi' },
      h('i.s3', { style: 'width:' + w(t[3]) }), h('i.s2', { style: 'width:' + w(t[2]) }), h('i.s1', { style: 'width:' + w(t[1]) }));
  }

  /* ── Acasă ── */
  var TIPS = [
    ['Întâi răspunzi, apoi verifici.', 'Spune răspunsul în minte, sau cu voce tare, înainte să întorci cardul. Efortul de a-ți aminti e cel care fixează informația.'],
    ['Puțin, dar des.', 'Trei sesiuni de 15 minute în zile diferite țin mai bine decât o oră deodată. Aplicația îți arată ce e scadent.'],
    ['Cuvintele-cheie ascunse.', 'În Notițe pornește „Ascunde cuvintele-cheie” și încearcă să recitești fiecare secțiune din memorie, apoi atinge cuvântul ca să verifici.'],
    ['Greșelile sunt cele mai utile.', 'Cardurile și întrebările greșite revin mai des. Nu le ocoli; la ele câștigi cele mai multe puncte.'],
    ['Scrie tot ce știi.', 'La „Scrie din memorie” scrii despre o secțiune fără să te uiți, apoi compari. Vezi exact ce ți-a scăpat.'],
    ['Seara și dimineața.', 'O repetiție înainte de somn și una dimineața, înainte de test, fixează mai bine decât o noapte pierdută.']
  ];

  V.home = function () {
    var left = U.daysUntil(S.data.settings.testDate);
    var m = Math.round(mastery() * 100);
    var cs = Cards.stats();
    var allRead = D.chapters.reduce(function (a, c) { return a + c.sections.filter(function (s) { return S.data.read[s.id]; }).length; }, 0);
    var allSecs = D.chapters.reduce(function (a, c) { return a + c.sections.length; }, 0);
    var today = S.today(), streak = S.streak();

    // ce faci acum
    var next;
    if (cs.due >= 5) next = { label: 'Repetă ' + U.nr(cs.due, 'card scadent', 'carduri scadente'), sub: 'Sunt cardurile pe care le-ai început și care trebuie revăzute acum.', go: function () { App.go('cards', { run: 1, mode: 'smart' }); } };
    else if (allRead === 0) next = { label: 'Începe cu notițele', sub: 'Citește prima secțiune, apoi trecem la carduri.', go: function () { App.go('notes'); } };
    else if (cs.fresh > 0) next = { label: 'Învață ' + U.nr(Math.min(cs.fresh, S.data.settings.perSession), 'card nou', 'carduri noi'), sub: 'Un set scurt de carduri noi din materie.', go: function () { App.go('cards', { run: 1, mode: 'smart' }); } };
    else if (!S.data.tests.length) next = { label: 'Fă un test simulat', sub: 'Vezi cât de pregătit ești și ce mai trebuie repetat.', go: function () { App.go('test'); } };
    else next = { label: 'Exersează greșelile', sub: 'Cardurile și întrebările la care ai greșit.', go: function () { App.go('practice'); } };

    var heroTitle, heroCount;
    if (left == null) { heroTitle = 'Pregătire pentru test'; heroCount = 'DATA TESTULUI NESETATĂ'; }
    else if (left > 1) { heroTitle = 'Mai sunt ' + left + ' zile până la test'; heroCount = 'DATA TESTULUI: ' + S.data.settings.testDate; }
    else if (left === 1) { heroTitle = 'Testul e mâine'; heroCount = 'DATA TESTULUI: ' + S.data.settings.testDate; }
    else if (left === 0) { heroTitle = 'Testul e azi'; heroCount = 'DATA TESTULUI: ' + S.data.settings.testDate; }
    else { heroTitle = 'Testul a trecut'; heroCount = 'DATA TESTULUI: ' + S.data.settings.testDate; }

    var perDay = null;
    if (left != null && left > 0) {
      var remaining = cs.tiers[0] + cs.tiers[1] + cs.tiers[2] * 0.5;
      perDay = Math.ceil(remaining / Math.max(1, left));
    }

    var hero = h('div.hero',
      h('div.compass', U.icon('compass', 190)),
      h('div.count', heroCount),
      h('h1', heroTitle),
      h('p', m + '% din materie stăpânit pe carduri' + (perDay ? ' · ca să termini la timp: cam ' + U.nr(perDay, 'card', 'carduri') + ' pe zi' : '') + '.'),
      h('div.row',
        h('button.btn.primary.lg', { onClick: next.go }, next.label, U.icon('right', 18)),
        h('button.btn.ghost', { onClick: App.settings }, U.icon('calendar', 16), left == null ? 'Setează data testului' : 'Schimbă data')),
      h('p.small', next.sub),
      h('div.row.small', { style: 'gap:18px' },
        h('span', U.icon('flame', 15), ' ', streak ? U.nr(streak, 'zi', 'zile') + ' la rând' : 'Azi începe seria'),
        h('span', 'Azi: ' + U.nr(today.c || 0, 'card', 'carduri') + ', ' + U.nr(today.q || 0, 'întrebare', 'întrebări'))));

    var chapters = h('div.grid-3', D.chapters.map(function (ch) {
      var st = chapterStats(ch);
      return h('div.card.chcard',
        h('div', h('div.code', ch.code), h('h3', ch.title),
          ch.sections.some(function (s) { return s.opts.indexOf('test') >= 0; })
            ? h('div.row', { style: 'margin-top:8px;gap:8px' }, h('span.stamp', 'TEST'), h('span.small.muted', 'încercuit în caiet: „Mari descoperiri”'))
            : null),
        h('div.meta',
          h('div', h('span', 'Notițe citite'), h('b', st.read + ' / ' + st.total)),
          h('div', h('span', 'Carduri stăpânite'), h('b', st.cs.tiers[3] + ' / ' + st.cs.total)),
          h('div', h('span', 'Întrebări corecte'), h('b', st.acc == null ? '—' : Math.round(st.acc * 100) + '%'))),
        tierBar(st.cs.tiers, st.cs.total),
        h('div.row',
          h('button.btn.sm', { onClick: function () { App.go('notes', { ch: ch.id }); } }, U.icon('book', 15), 'Citește'),
          h('button.btn.sm', { onClick: function () { App.go('cards', { run: 1, ch: ch.id, mode: 'smart' }); } }, U.icon('layers', 15), 'Carduri'),
          h('button.btn.sm', { onClick: function () { App.go('quiz', { run: 1, chs: [ch.id], n: 10 }); } }, U.icon('target', 15), 'Întrebări')));
    }));

    // parcurs
    var lineSeen = Object.keys(S.data.line).length;
    var qSeen = Object.keys(S.data.q).length;
    var started = cs.total - cs.tiers[0];
    var steps = [
      { t: 'Citește notițele', s: allRead + ' din ' + allSecs + ' secțiuni', done: allRead === allSecs, go: function () { App.go('notes'); } },
      { t: 'Învață cardurile', s: started + ' din ' + cs.total + ' începute', done: started >= cs.total, go: function () { App.go('cards'); } },
      { t: 'Completează propozițiile din notițe', s: lineSeen + ' completate', done: lineSeen >= 40, go: function () { App.go('cloze', {}); } },
      { t: 'Rezolvă întrebări și jocuri', s: qSeen + ' întrebări încercate', done: qSeen >= 40, go: function () { App.go('quiz'); } },
      { t: 'Fă un test simulat', s: S.data.tests.length ? U.nr(S.data.tests.length, 'test făcut', 'teste făcute') : 'încă niciunul', done: S.data.tests.length > 0, go: function () { App.go('test'); } }
    ];
    var path = h('ol.path', steps.map(function (s) {
      return h('li' + (s.done ? '.done' : ''), h('span.dot', U.icon('check', 15)), h('div.t', h('b', s.t), h('span', s.s)), h('button.btn.sm.ghost', { onClick: s.go, 'aria-label': 'Deschide: ' + s.t }, U.icon('right', 16)));
    }));

    // zone slabe
    var weak = Cards.weakList(5);
    var weakBox = h('div.stack',
      h('h2', 'De repetat mai mult'),
      weak.length
        ? [h('ul', { style: 'list-style:none;display:grid;gap:8px' }, weak.map(function (c) {
            return h('li.row', { style: 'justify-content:space-between;flex-wrap:nowrap' }, h('span', { style: 'min-width:0' }, Notes.strip(c.q)), chChip(c.ch));
          })),
          h('button.btn.primary', { onClick: function () { App.go('cards', { run: 1, mode: 'weak' }); } }, U.icon('redo', 16), 'Repetă greșelile')]
        : h('p.muted', 'Aici apar cardurile la care greșești. Încă nu ai niciunul.'));

    var tips = h('div.tips', TIPS.map(function (t, i) { return h('div.tip', h('div.n', String(i + 1)), h('div', h('b', t[0]), h('span', t[1]))); }));

    return h('div.stack', hero, chapters,
      h('div.grid-2', h('div.card', h('h2', { style: 'margin-bottom:12px' }, 'Parcursul tău'), path), h('div.card', weakBox)),
      h('div.card', h('h2', { style: 'margin-bottom:8px' }, 'Cum înveți mai repede'), tips));
  };

  /* ── Exersează ── */
  V.practice = function () {
    var cs = Cards.stats();
    var games = D.questions.filter(function (q) { return q.game; }).length;
    var missedQ = missedQuestions();
    var weakC = Cards.weakList(999);
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Exersează'), h('p', 'Alege cum repeți. Cel mai bine merge să le combini: cardurile pentru memorie, întrebările pentru recunoaștere, scrisul din memorie pentru liniște înainte de test.'))),
      h('div.modes',
        modeTile('layers', 'Carduri', 'Întrebare pe față, răspuns pe spate. Cele greșite revin mai repede.', cs.due ? U.nr(cs.due, 'scadent', 'scadente') : U.nr(cs.fresh, 'nou', 'noi'), function () { App.go('cards'); }),
        modeTile('target', 'Întrebări', 'Alegere, adevărat/fals, alegeri multiple, răspuns scris. Cu explicație și rândul din notițe.', U.nr(D.questions.length, 'întrebare', 'întrebări'), function () { App.go('quiz'); }),
        modeTile('pencil', 'Completează', 'Propoziții din notițele tale cu cuvinte lipsă.', U.nr(D.cloze.length, 'propoziție', 'propoziții'), function () { App.go('cloze', {}); }),
        modeTile('link', 'Jocuri', 'Potrivește perechi, pune în ordine cronologică, sortează pe categorii.', U.nr(games, 'joc', 'jocuri'), function () { App.go('games'); }),
        modeTile('pencil', 'Scrie din memorie', 'Scrii tot ce știi despre o secțiune, apoi compari cu notițele.', null, function () { App.go('recall', {}); }),
        modeTile('flag', 'Greșelile mele', 'Cardurile și întrebările la care ai greșit.', (weakC.length + missedQ.length) ? String(weakC.length + missedQ.length) : 'niciuna', function () { mistakesMenu(weakC, missedQ); }),
        modeTile('clock', 'Axa timpului', 'Toate datele din notițe, în ordine.', null, function () { App.go('timeline'); }),
        modeTile('bulb', 'Trucuri de memorare', 'Propoziții și grupări care te ajută să ții minte listele lungi.', U.nr((D.mnemonics || []).length, 'truc', 'trucuri'), function () { App.go('mnemo'); })
      ));
  };
  function mistakesMenu(weakC, missedQ) {
    var m;
    m = App.modal({ title: 'Greșelile mele', body: h('div.stack',
      h('button.btn.lg', { disabled: !weakC.length, onClick: function () { m.close(); App.go('cards', { run: 1, mode: 'weak' }); } }, U.icon('layers', 18), U.nr(weakC.length, 'card greșit', 'carduri greșite')),
      h('button.btn.lg', { disabled: !missedQ.length, onClick: function () { m.close(); App.go('quiz', { ids: missedQ.map(function (q) { return q.id; }) }); } }, U.icon('target', 18), U.nr(missedQ.length, 'întrebare greșită', 'întrebări greșite'))) });
  }

  /* ── Jocuri ── */
  V.games = function () {
    var sets = D.questions.filter(function (q) { return q.game; });
    var kinds = [['match', 'Potrivește', 'link'], ['order', 'Ordonează', 'updown'], ['sort', 'Sortează', 'list']];
    var quick = h('button.btn.primary.lg', { onClick: function () { App.go('quiz', { ids: U.sample(sets, 5).map(function (q) { return q.id; }) }); } }, U.icon('shuffle', 18), 'Joc rapid: 5 la întâmplare');
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Jocuri'), h('p', 'Perechi, ordine, categorii. Se rezolvă repede și fixează legăturile dintre date, nume și lucrări.')), quick),
      kinds.map(function (k) {
        var list = sets.filter(function (q) { return q.t === k[0]; });
        return h('div.card', h('h2', { style: 'display:flex;gap:10px;align-items:center;margin-bottom:12px' }, U.icon(k[2], 20), k[1], h('span.chip', String(list.length))),
          h('div.stack', list.map(function (q) {
            return h('div.row', { style: 'justify-content:space-between;flex-wrap:nowrap;border-top:1px solid var(--line);padding-top:10px' },
              h('div', { style: 'min-width:0' }, h('div', Notes.strip(q.q)), h('div.row', { style: 'margin-top:4px' }, chChip(q.ch), h('span.small.muted', D.sec[q.sec].title))),
              h('button.btn.sm.primary', { onClick: function () { App.go('quiz', { ids: [q.id] }); } }, 'Joacă'));
          })));
      }));
  };

  /* ── Scrie din memorie ── */
  V.recall = function (p) {
    var secId = p.sec || null;
    var root = h('div.stack');
    function pick() {
      U.clear(root);
      root.appendChild(h('div.page-head', h('div', h('h1', 'Scrie din memorie'), h('p', 'Alege o secțiune și scrie tot ce știi despre ea, fără să te uiți. Apoi compari cu notițele și vezi ce ți-a scăpat.'))));
      D.chapters.forEach(function (ch) {
        root.appendChild(h('div.card',
          h('h3', { style: 'margin-bottom:10px' }, chChip(ch.id), ' ', ch.title),
          h('div.stack', ch.sections.map(function (s) {
            var r = S.data.recall[s.id];
            return h('div.row', { style: 'justify-content:space-between;flex-wrap:nowrap' },
              h('span', { style: 'min-width:0' }, s.title, r ? h('span.chip.ok', { style: 'margin-left:8px' }, Math.round(r.pct) + '%') : null),
              h('button.btn.sm', { onClick: function () { secId = s.id; write(); } }, 'Scrie'));
          }))));
      });
    }
    function write() {
      var sec = D.sec[secId];
      U.clear(root);
      var ta = h('textarea.mynote', { id: 'recall-ta', style: 'width:100%;margin:0;min-height:260px', placeholder: 'Scrie aici tot ce îți amintești despre „' + sec.title + '”…', 'aria-label': 'Ce îmi amintesc' });
      root.appendChild(h('div.sess-head', h('div.row', h('button.btn.sm.ghost', { onClick: function () { App.go('practice'); } }, U.icon('left', 16), 'Ieși'), h('span.title', sec.title), chChip(sec.ch))));
      root.appendChild(h('div.card.stack', h('p.muted', 'Nu te uita în notițe. Scrie cu cuvintele tale, în liste sau propoziții.'), ta,
        h('button.btn.primary.lg', { onClick: function () { compare(ta.value); } }, 'Gata, compară cu notițele')));
      setTimeout(function () { ta.focus(); }, 50);
    }
    function compare(text) {
      var sec = D.sec[secId];
      var lines = Notes.linesOf(secId).filter(function (l) { return l.plain; });
      U.clear(root);
      var checks = [];
      var list = h('ul', { style: 'list-style:none;display:grid;gap:6px;padding:0' }, lines.map(function (l, i) {
        var cb = h('input', { type: 'checkbox', id: 'rc-' + i });
        checks.push(cb);
        return h('li', { style: 'padding-left:' + (l.depth * 18) + 'px' }, h('label.row', { for: 'rc-' + i, style: 'flex-wrap:nowrap;align-items:flex-start;cursor:pointer;font-family:var(--f-read)' }, cb, h('span', Notes.inline(l.text))));
      }));
      var res = h('div');
      function finish() {
        var n = checks.filter(function (c) { return c.checked; }).length;
        var pct = 100 * n / Math.max(1, checks.length);
        S.data.recall[secId] = { pct: pct, t: Date.now() };
        S.saveNow();
        U.clear(res);
        var missed = lines.filter(function (l, i) { return !checks[i].checked; });
        res.appendChild(h('div.card.result',
          h('div.score-big', Math.round(pct) + '%', h('small', ' din puncte amintite')),
          missed.length ? h('div.stack', h('b', 'Ți-au scăpat:'), h('ul', { style: 'padding-left:18px;display:grid;gap:4px;font-family:var(--f-read)' }, missed.map(function (l) { return h('li', Notes.inline(l.text)); }))) : h('p', 'Ai amintit tot. Foarte bine.'),
          h('div.row', h('button.btn.primary', { onClick: function () { App.go('cloze', { sec: secId }); } }, U.icon('pencil', 16), 'Completează secțiunea'), h('button.btn', { onClick: function () { App.go('recall', {}); } }, 'Altă secțiune'))));
        res.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      root.appendChild(h('div.sess-head', h('div.row', h('button.btn.sm.ghost', { onClick: function () { App.go('practice'); } }, U.icon('left', 16), 'Ieși'), h('span.title', 'Compară: ' + sec.title))));
      root.appendChild(h('div.card', h('h3', { style: 'margin-bottom:8px' }, 'Ce ai scris'), h('p', { style: 'white-space:pre-wrap;font-family:var(--f-read);color:var(--ink-2)' }, text.trim() || '(nimic)')));
      root.appendChild(h('div.card.stack', h('h3', 'Notițele secțiunii'), h('p.muted.small', 'Bifează ce ai amintit, chiar dacă cu alte cuvinte.'), list, h('button.btn.primary.lg', { onClick: finish }, 'Vezi cât ai amintit')));
      root.appendChild(res);
    }
    if (secId) write(); else pick();
    return root;
  };

  /* ── Test simulat ── */
  V.test = function () {
    var sel = {}; D.chapters.forEach(function (c) { sel[c.id] = true; });
    var n = 20, timed = true, hard = false;
    var chipsCh = h('div.chips-pick'), chipsN = h('div.chips-pick'), hardBtn = h('button.toggle', { 'aria-pressed': 'false' }, h('span.knob'), 'Doar întrebări grele'), timerBtn = h('button.toggle', { 'aria-pressed': 'true' }, h('span.knob'), 'Cu cronometru');
    var info = h('p.muted');
    function draw() {
      U.clear(chipsCh); U.clear(chipsN);
      D.chapters.forEach(function (c) { chipsCh.appendChild(h('button' + (sel[c.id] ? '.on' : ''), { onClick: function () { sel[c.id] = !sel[c.id]; draw(); } }, Notes.short(c.id))); });
      [10, 20, 30].forEach(function (k) { chipsN.appendChild(h('button' + (n === k ? '.on' : ''), { onClick: function () { n = k; draw(); } }, k + ' întrebări')); });
      timerBtn.setAttribute('aria-pressed', timed ? 'true' : 'false');
      hardBtn.setAttribute('aria-pressed', hard ? 'true' : 'false');
      info.textContent = 'Timp: ' + (timed ? U.nr(Math.round(n * 45 / 60), 'minut', 'minute') + ' (45 de secunde pe întrebare)' : 'nelimitat') + '. Răspunsurile corecte apar abia la sfârșit.';
    }
    timerBtn.addEventListener('click', function () { timed = !timed; draw(); });
    hardBtn.addEventListener('click', function () { hard = !hard; draw(); });
    draw();
    function start() {
      var chs = Object.keys(sel).filter(function (k) { return sel[k]; });
      if (!chs.length) { U.toast('Alege cel puțin un capitol'); return; }
      var per = Math.ceil(n / chs.length), qs = [];
      chs.forEach(function (c) { qs = qs.concat(Quiz.pick({ chs: [c], n: per, minLvl: hard ? 3 : 0 })); });
      qs = U.shuffle(qs).slice(0, n);
      var total = qs.length;
      App.go('testrun', { qs: qs.map(function (q) { return q.id; }), total: total, timed: timed });
    }
    var hist = S.data.tests.slice(-5).reverse();
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Test simulat'), h('p', 'Întrebări amestecate din tot materialul, ca la test. Nu primești răspunsurile pe parcurs; la final vezi nota estimată și greșelile.'))),
      h('div.card.opts-card', h('div.field', h('span.lab', 'Capitole'), chipsCh), h('div.field', h('span.lab', 'Lungime'), chipsN), h('div.field', timerBtn), h('div.field', hardBtn), info, h('button.btn.primary.lg', { onClick: start }, 'Începe testul')),
      hist.length ? h('div.card', h('h3', { style: 'margin-bottom:10px' }, 'Ultimele teste'), h('div.stack', hist.map(function (t) {
        return h('div.row', { style: 'justify-content:space-between' }, h('span', new Date(t.t).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }) + ' · ' + t.n + ' întrebări'), h('b', 'Nota ' + t.grade.toFixed(1).replace('.', ',') + ' · ' + Math.round(t.pct * 100) + '%'));
      }))) : null);
  };
  V.testrun = function (p) {
    var qs = p.qs.map(function (id) { return D.qById[id]; }).filter(Boolean);
    return Quiz.session({
      title: 'Test simulat', questions: qs, mode: 'exam', back: 'test', timer: p.timed ? qs.length * 45 : 0,
      onFinish: function (results, spent, timeUp) { return testResult(results, spent, timeUp, p.total); }
    });
  };
  function testResult(results, spent, timeUp, total) {
    var pts = results.reduce(function (a, r) { return a + r.score; }, 0);
    var pct = pts / Math.max(1, total);
    var grade = 1 + 9 * pct;
    S.data.tests.push({ t: Date.now(), n: total, pct: pct, grade: grade });
    if (S.data.tests.length > 40) S.data.tests.shift();
    S.saveNow();
    var by = {};
    results.forEach(function (r) { var b = by[r.q.ch] || (by[r.q.ch] = { p: 0, n: 0 }); b.p += r.score; b.n++; });
    var base = Quiz.resultView(results, spent, { back: 'test', again: { route: 'test', params: {} }, hideScore: true });
    var head = h('div.card.result',
      h('div.eyebrow', timeUp ? 'Timpul a expirat' : 'Test încheiat'),
      h('div.score-big', grade.toFixed(1).replace('.', ','), h('small', ' nota estimată (1 + 9 × scor)')),
      h('p.muted', Math.round(pct * 100) + '% puncte' + (results.length < total ? ' · ' + (total - results.length) + ' fără răspuns' : '')),
      h('div.stack', Object.keys(by).map(function (k) {
        var ch = D.chById[k];
        return h('div', h('div.row', { style: 'justify-content:space-between' }, h('span', chChip(k), ' ', ch.title), h('b', Math.round(100 * by[k].p / by[k].n) + '%')), h('div.prog', h('i', { style: 'width:' + Math.round(100 * by[k].p / by[k].n) + '%' })));
      })));
    base.insertBefore(head, base.firstChild);
    return base;
  }

  /* ── Axa timpului ── */
  V.timeline = function (p) {
    var sel = p.ch || 'all';
    var root = h('div.stack');
    function draw() {
      U.clear(root);
      var ev = (D.timeline || []).slice().sort(function (a, b) { return a.k - b.k; }).filter(function (e) { return sel === 'all' || e.ch === sel; });
      var seg = h('div.seg', [['all', 'Toate']].concat(D.chapters.map(function (c) { return [c.id, Notes.short(c.id)]; })).map(function (x) {
        return h('button' + (sel === x[0] ? '.on' : ''), { onClick: function () { sel = x[0]; draw(); } }, x[1]);
      }));
      root.appendChild(h('div.page-head', h('div', h('h1', 'Axa timpului'), h('p', 'Toate datele și perioadele din notițe, în ordine. Cele ale unor persoane sunt anii vieții.')),
        h('button.btn.primary', { onClick: function () { App.go('quiz', { ids: D.questions.filter(function (q) { return q.t === 'order'; }).map(function (q) { return q.id; }) }); } }, U.icon('updown', 16), 'Exersează ordinea')));
      root.appendChild(h('div.row', seg));
      root.appendChild(h('div.tl', ev.map(function (e) {
        var ch = D.chById[e.ch];
        return h('div.tl-item.' + (ch ? ch.cls : ''),
          h('div.yr', e.y, e.s ? h('small', e.s) : null),
          h('div.tl-card', h('b', Notes.inline(e.t)), e.n ? h('span', Notes.inline(e.n)) : null, h('div', chChip(e.ch))));
      })));
    }
    draw();
    return root;
  };

  /* ── Trucuri de memorare ── */
  V.mnemo = function () {
    return h('div.stack',
      h('div.page-head', h('div', h('h1', 'Trucuri de memorare'), h('p', 'Grupări și propoziții care te ajută să ții minte listele lungi. Nu sunt din notițele tale; sunt ajutoare, iar conținutul din ele vine din notițe.'))),
      D.chapters.map(function (ch) {
        var list = (D.mnemonics || []).filter(function (m) { return m.ch === ch.id; });
        if (!list.length) return null;
        return h('div.stack', h('h2', chChip(ch.id), ' ', ch.title), list.map(function (m) { return Notes.mnemoCard(m); }));
      }));
  };
})(typeof window !== 'undefined' ? window : globalThis);
