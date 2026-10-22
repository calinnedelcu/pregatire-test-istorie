/* Cadrul aplicației: navigare, teme, ferestre (modal), pornire. */
(function (g) {
  'use strict';
  var U = g.U, h = U.h, Store = g.Store;
  var D = (g.DATA = g.DATA || {});
  var App = (g.App = { state: { route: 'home', params: {}, noteCh: null, recite: false }, views: {}, leave: [] });

  var TABS = [
    { id: 'home', label: 'Acasă', icon: 'home', also: [] },
    { id: 'notes', label: 'Notițe', icon: 'book', also: ['timeline', 'mnemo'] },
    { id: 'practice', label: 'Exersează', icon: 'zap', also: ['cards', 'quiz', 'cloze', 'games', 'recall', 'stats'] },
    { id: 'test', label: 'Test', icon: 'test', also: ['testrun'] }
  ];

  App.onLeave = function (fn) { App.leave.push(fn); };

  App.go = function (name, params, opts) {
    App.leave.forEach(function (fn) { try { fn(); } catch (e) {} });
    App.leave = [];
    App.state.route = name;
    App.state.params = params || {};
    render();
    if (!opts || opts.scroll !== false) g.scrollTo(0, 0);
    try { g.history.replaceState(null, '', '#' + name); } catch (e) {}
  };

  function activeTab(route) {
    var t = TABS.filter(function (x) { return x.id === route || x.also.indexOf(route) >= 0; })[0];
    return t ? t.id : 'home';
  }

  function render() {
    var view = U.$('#view');
    var fn = App.views[App.state.route] || (g.Notes && App.state.route === 'notes' ? g.Notes.view : null);
    U.clear(view);
    var el;
    try {
      el = fn ? fn(App.state.params) : h('div.card', 'Pagina nu există încă.');
    } catch (err) {
      console.error(err);
      el = h('div.card', h('h2', 'Ceva nu a mers'), h('p.muted', String(err && err.message || err)), h('button.btn', { onClick: function () { App.go('home'); } }, 'Înapoi acasă'));
    }
    view.appendChild(el);
    var act = activeTab(App.state.route);
    U.$$('[data-route]').forEach(function (b) {
      var on = b.dataset.route === act;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  App.render = render;

  /* ── teme ── */
  var THEME_NEXT = { auto: 'light', light: 'dark', dark: 'auto' };
  var THEME_ICON = { auto: 'auto', light: 'sun', dark: 'moon' };
  var THEME_LABEL = { auto: 'Temă: automată', light: 'Temă: luminoasă', dark: 'Temă: întunecată' };
  function applyTheme() {
    var t = Store.data.settings.theme;
    var root = document.documentElement;
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    var btn = U.$('#theme-btn');
    if (btn) { U.clear(btn); btn.appendChild(U.icon(THEME_ICON[t], 20)); btn.title = THEME_LABEL[t]; btn.setAttribute('aria-label', THEME_LABEL[t]); }
  }

  /* ── ferestre ── */
  App.modal = function (opts) {
    var root = U.$('#modal-root');
    var prev = document.activeElement;
    var done = false;
    var box = h('div.box', { role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.title || 'Fereastră' },
      h('div.mhead', opts.head || h('b', opts.title || ''), opts.headExtra || null,
        h('button.iconbtn', { 'aria-label': 'Închide', onClick: close }, U.icon('x', 20))),
      h('div.mbody' + (opts.img ? '.img' : ''), opts.body));
    var wrap = h('div.modal', { onClick: function (e) { if (e.target === wrap) close(); } }, box);
    function key(e) { if (e.key === 'Escape') close(); }
    function close() {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', key);
      wrap.remove();
      if (prev && prev.focus) { try { prev.focus(); } catch (e) {} }
      if (opts.onClose) opts.onClose();
    }
    document.addEventListener('keydown', key);
    root.appendChild(wrap);
    var f = U.$('button, input, [tabindex]', box);
    if (f) f.focus();
    return { close: close, box: box };
  };

  App.photos = function (list, i0) {
    var i = i0 || 0, zoom = false;
    var img = h('img.photo', { alt: '' });
    var title = h('b');
    var pos = h('span.small.muted');
    var prev = h('button.iconbtn', { 'aria-label': 'Poza anterioară', onClick: function () { go(i - 1); } }, U.icon('left', 20));
    var next = h('button.iconbtn', { 'aria-label': 'Poza următoare', onClick: function () { go(i + 1); } }, U.icon('right', 20));
    function go(n) {
      i = U.clamp(n, 0, list.length - 1);
      zoom = false; img.classList.remove('zoom');
      var num = list[i];
      img.src = 'assets/foto/' + String(num).padStart(2, '0') + '.webp';
      img.alt = 'Poza ' + num + ' din notițele tale';
      title.textContent = 'Poza ' + num + ' din notițe';
      pos.textContent = list.length > 1 ? (i + 1) + ' / ' + list.length : '';
      prev.disabled = i === 0; next.disabled = i === list.length - 1;
      prev.style.visibility = next.style.visibility = list.length > 1 ? 'visible' : 'hidden';
    }
    img.addEventListener('click', function () { zoom = !zoom; img.classList.toggle('zoom', zoom); });
    img.addEventListener('error', function () { U.toast('Poza nu s-a putut încărca aici. O găsești în folderul assets/foto.'); });
    go(i);
    var m = App.modal({ title: 'Poze', head: [title], headExtra: h('div.pg', prev, pos, next), body: img, img: true });
    return m;
  };

  /* meniu de exersare pentru o secțiune */
  App.sectionMenu = function (secId) {
    var sec = D.sec[secId];
    var nCards = (D.cards || []).filter(function (c) { return c.sec === secId; }).length;
    var nQ = (D.questions || []).filter(function (q) { return q.sec === secId; }).length;
    var nCz = (D.cloze || []).filter(function (c) { return c.sec === secId; }).length;
    var m;
    function item(icon, title, sub, fn, disabled) {
      return h('button.mode', { disabled: disabled, onClick: function () { m.close(); fn(); }, style: 'width:100%' },
        h('div.mi', U.icon(icon, 22)), h('b', title), h('span', sub));
    }
    m = App.modal({
      title: sec.title,
      body: h('div.stack',
        h('p.muted', 'Alege cum exersezi această secțiune:'),
        item('layers', 'Carduri', nCards ? U.nr(nCards, 'card', 'carduri') + ' din această secțiune' : 'Nu există carduri pentru această secțiune', function () { App.go('cards', { sec: secId }); }, !nCards),
        item('pencil', 'Completează din notițe', nCz ? U.nr(nCz, 'propoziție', 'propoziții') + ' cu spații goale' : 'Nu există completări', function () { App.go('cloze', { sec: secId }); }, !nCz),
        item('target', 'Întrebări', nQ ? U.nr(nQ, 'întrebare', 'întrebări') : 'Nu există întrebări pentru această secțiune', function () { App.go('quiz', { sec: secId }); }, !nQ),
        item('pencil', 'Scrie din memorie', 'Scrii tot ce știi, apoi compari cu notițele', function () { App.go('recall', { sec: secId }); }, false)
      )
    });
  };

  /* meniu de exersare pentru o lecție întreagă (capitol) */
  var EX_TYPES = [['mcq', 'Alegere'], ['tf', 'Adevărat / Fals'], ['multi', 'Selecție multiplă'], ['type', 'Răspuns scris'], ['order', 'Ordonare'], ['match', 'Potrivire'], ['sort', 'Sortare']];
  App.lessonMenu = function (chId) {
    var ch = D.chById[chId];
    var qs = (D.questions || []).filter(function (q) { return q.ch === chId; });
    var cardsAll = (D.cards || []).filter(function (c) { return c.ch === chId; });
    var clozeAll = (D.cloze || []).filter(function (c) { return c.ch === chId; });
    var lvl = 0, type = '', sec = '', n = 20, m;
    // întrebările care se potrivesc filtrelor curente; o mică înlocuire permite să numărăm cum ar ieși dacă am schimba un filtru
    function pool(o) {
      o = o || {};
      var l = o.lvl != null ? o.lvl : lvl, t = o.type != null ? o.type : type, s = o.sec != null ? o.sec : sec;
      return qs.filter(function (q) { return (q.lvl || 1) >= l && (!t || q.t === t) && (!s || q.sec === s); });
    }
    function chip(label, on, fn) { return h('button' + (on ? '.on' : ''), { type: 'button', onClick: fn }, label); }
    function tile(icon, title, fn) {
      var sub = h('span'), el = h('button.mode', { type: 'button', style: 'width:100%', onClick: function () { if (!el.disabled) { m.close(); fn(); } } }, h('div.mi', U.icon(icon, 22)), h('b', title), sub);
      return { el: el, sub: sub };
    }
    var chipsLvl = h('div.chips-pick'), chipsType = h('div.chips-pick'), chipsN = h('div.chips-pick');
    var secSel = h('select', { 'aria-label': 'Secțiune' });
    secSel.addEventListener('change', function () { sec = secSel.value; draw(); });
    var cardsT = tile('layers', 'Carduri', function () { App.go('cards', sec ? { run: 1, sec: sec, mode: 'smart' } : { run: 1, ch: chId, mode: 'smart' }); });
    var clozeT = tile('pencil', 'Completează din notițe', function () { App.go('cloze', sec ? { sec: sec } : { ch: chId }); });
    var recallT = tile('pencil', 'Scrie din memorie', function () { App.go('recall', { sec: sec }); });
    function draw() {
      // dacă filtrele alese nu mai lasă nicio întrebare, se renunță la ele, pe rând
      if (!pool().length && type) type = '';
      if (!pool().length && sec) sec = '';
      if (!pool().length && lvl) lvl = 0;
      U.clear(chipsLvl); U.clear(chipsType); U.clear(chipsN); U.clear(secSel);
      [[0, 'Toate'], [3, 'Grele'], [4, 'Foarte grele']].forEach(function (x) {
        var c = pool({ lvl: x[0] }).length;
        if (x[0] && !c && lvl !== x[0]) return;
        chipsLvl.appendChild(chip(x[1] + ' (' + c + ')', lvl === x[0], function () { lvl = x[0]; draw(); }));
      });
      chipsType.appendChild(chip('Toate (' + pool({ type: '' }).length + ')', !type, function () { type = ''; draw(); }));
      EX_TYPES.forEach(function (x) {
        var c = pool({ type: x[0] }).length;
        if (!c && type !== x[0]) return;
        chipsType.appendChild(chip(x[1] + ' (' + c + ')', type === x[0], function () { type = x[0]; draw(); }));
      });
      secSel.appendChild(h('option', { value: '' }, 'Toată lecția (' + pool({ sec: '' }).length + ')'));
      ch.sections.forEach(function (sc) {
        var c = pool({ sec: sc.id }).length;
        var o = h('option', { value: sc.id }, sc.title + ' (' + c + ')');
        if (!c) o.disabled = true;
        secSel.appendChild(o);
      });
      secSel.value = sec;
      var np = pool().length, sizes = [10, 20, 30].filter(function (k) { return k < np; }).concat([np]);
      if (sizes.indexOf(n) < 0) n = sizes.indexOf(20) >= 0 ? 20 : sizes[sizes.length - 1];
      sizes.forEach(function (k) { chipsN.appendChild(chip(k === np ? 'Toate (' + np + ')' : String(k), n === k, function () { n = k; draw(); })); });
      startBtn.disabled = !np;
      var nc = sec ? cardsAll.filter(function (c) { return c.sec === sec; }).length : cardsAll.length;
      var nz = sec ? clozeAll.filter(function (c) { return c.sec === sec; }).length : clozeAll.length;
      cardsT.sub.textContent = nc ? U.nr(nc, 'card', 'carduri') + (sec ? ' din secțiunea aleasă' : ' din lecție') + '; cele scadente vin primele' : 'Nu există carduri';
      cardsT.el.disabled = !nc;
      clozeT.sub.textContent = nz ? U.nr(nz, 'propoziție', 'propoziții') + ' cu spații goale' + (sec ? ' din secțiunea aleasă' : ' din lecție') : 'Nu există completări';
      clozeT.el.disabled = !nz;
      recallT.sub.textContent = sec ? 'Scrii tot ce știi despre secțiunea aleasă, apoi compari cu notițele' : 'Alege mai sus o secțiune ca să scrii despre ea';
      recallT.el.disabled = !sec;
    }
    function start() {
      m.close();
      var p = { run: 1, chs: [chId], n: n, lvl: lvl };
      if (sec) p.sec = sec; else p.spread = 1;
      if (type) p.types = [type];
      App.go('quiz', p);
    }
    var startBtn = h('button.btn.primary', { onClick: start }, U.icon('target', 16), 'Începe întrebările');
    var main = qs.length
      ? h('div.lesson-q',
          h('div.mi', U.icon('target', 22)), h('b', 'Întrebări'),
          h('span', 'Alege ce vrei să exersezi. Fără alegeri, primești câte puțin din fiecare secțiune, amestecat.'),
          h('div.field', h('span.lab', 'Secțiune'), secSel),
          h('div.field', h('span.lab', 'Tip de exercițiu'), chipsType),
          h('div.field', h('span.lab', 'Dificultate'), chipsLvl),
          h('div.field', h('span.lab', 'Câte întrebări'), chipsN),
          startBtn)
      : h('p.muted', 'Nu există întrebări pentru această lecție.');
    draw();
    m = App.modal({
      title: 'Exersează lecția',
      body: h('div.stack', h('p.muted', ch.title), main, cardsT.el, clozeT.el, recallT.el)
    });
  };

  /* ── setări ── */
  App.settings = function () {
    var s = Store.data.settings;
    var date = h('input', { type: 'date', id: 'set-date', value: s.testDate || '' });
    date.addEventListener('change', function () { s.testDate = date.value; Store.save(); U.toast(date.value ? 'Data testului a fost salvată' : 'Data testului a fost ștearsă'); });
    var per = h('input', { type: 'number', id: 'set-per', min: '5', max: '60', value: s.perSession });
    per.addEventListener('change', function () { s.perSession = U.clamp(parseInt(per.value, 10) || 20, 5, 60); Store.save(); });
    var exp = h('textarea.in', { id: 'set-export', rows: '3', readonly: true, hidden: true, 'aria-label': 'Progres exportat' });
    var imp = h('textarea.in', { id: 'set-import', rows: '3', hidden: true, placeholder: 'Lipește aici progresul exportat', 'aria-label': 'Progres de importat' });
    var impGo = h('button.btn.sm.primary', { hidden: true, onClick: function () {
      try { Store.importJSON(imp.value); U.toast('Progresul a fost importat'); m.close(); applyTheme(); App.render(); }
      catch (e) { U.toast('Textul lipit nu e un export valid'); }
    } }, 'Importă');
    var resetBtn = h('button.btn.sm.bad', { onClick: function () {
      if (resetBtn.dataset.sure) { Store.reset(); U.toast('Progresul a fost șters'); m.close(); applyTheme(); App.go('home'); }
      else { resetBtn.dataset.sure = '1'; resetBtn.textContent = 'Sigur? Atinge încă o dată'; }
    } }, U.icon('trash', 15), 'Șterge tot progresul');
    var m = App.modal({
      title: 'Setări',
      body: h('div.stack',
        h('div.field', h('label', { for: 'set-date' }, 'Data testului'), date, h('span.small.muted', 'Dacă o setezi, repetițiile se strâng ca să apuci să revezi tot înainte de test.')),
        h('div.field', h('label', { for: 'set-per' }, 'Carduri într-o sesiune'), per),
        h('div.field', h('span.lab', 'Mutare între dispozitive'),
          h('div.row',
            h('button.btn.sm', { onClick: function () { exp.hidden = false; exp.value = Store.exportJSON(); exp.select(); } }, U.icon('copy', 15), 'Exportă progresul'),
            h('button.btn.sm', { onClick: function () { imp.hidden = false; impGo.hidden = false; imp.focus(); } }, 'Importă progres')),
          exp, imp, impGo),
        h('div.field', h('span.lab', 'Date'), resetBtn)
      )
    });
  };

  /* ── pornire ── */
  App.boot = function () {
    Store.load();
    g.Notes.parse(D.notesSrc || []);
    if (g.Cards && g.Cards.build) g.Cards.build();
    if (g.Quiz && g.Quiz.build) g.Quiz.build();

    var topnav = h('nav.topnav', { 'aria-label': 'Navigare principală' }, TABS.map(function (t) {
      return h('button.navbtn', { dataset: { route: t.id }, onClick: function () { App.go(t.id); } }, U.icon(t.icon, 18), t.label);
    }));
    var tabbar = h('nav.tabbar', { 'aria-label': 'Navigare' }, TABS.map(function (t) {
      return h('button.tabbtn', { dataset: { route: t.id }, onClick: function () { App.go(t.id); } }, h('span.ti', U.icon(t.icon, 22)), t.label);
    }));
    var app = U.$('#app');
    app.appendChild(h('header.topbar',
      h('a.brand', { href: '#home', onClick: function (e) { e.preventDefault(); App.go('home'); } }, U.icon('compass', 28), h('span', 'Pregătire test', h('small', 'Istorie'))),
      topnav,
      h('div.top-actions',
        h('button.iconbtn#theme-btn', { onClick: function () { var s = Store.data.settings; s.theme = THEME_NEXT[s.theme] || 'auto'; Store.save(); applyTheme(); } }),
        h('button.iconbtn', { 'aria-label': 'Setări', title: 'Setări', onClick: App.settings }, U.icon('sliders', 20))
      )));
    app.appendChild(h('main#view', { tabindex: '-1' }));
    app.appendChild(tabbar);
    applyTheme();

    var start = (g.location.hash || '').replace('#', '');
    var map = { acasa: 'home', home: 'home', notite: 'notes', notes: 'notes', exerseaza: 'practice', practice: 'practice', test: 'test' };
    App.go(map[start] || 'home', {}, { scroll: false });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { App.boot(); });
  else App.boot();
})(typeof window !== 'undefined' ? window : globalThis);
