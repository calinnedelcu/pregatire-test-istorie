/* Notițele: analizor (DSL -> arbore) și afișare, tabel interactiv, fișe pe persoane. */
(function (g) {
  'use strict';
  var U = g.U, h = U.h;
  var D = (g.DATA = g.DATA || {});
  var Notes = (g.Notes = {});
  Notes.tab = { etno: 'Etnogeneza românească', calatori: 'Călători români', descoperiri: 'Marile descoperiri' };

  var TOKEN_SRC = '\\*\\*([\\s\\S]+?)\\*\\*|\\{\\{([^|{}]+)\\|([^{}]+)\\}\\}|\\{\\?([^|{}]+)\\|([^{}]+)\\}|\\{gol\\}|\\{c:([0-9, ]+)\\}';

  /* ── text fără marcaje ── */
  function strip(t) {
    return String(t)
      .replace(/\*\*/g, '')
      .replace(/\{\{([^|{}]+)\|([^{}]+)\}\}/g, '$1')
      .replace(/\{\?([^|{}]+)\|([^{}]+)\}/g, '$1')
      .replace(/\{gol\}/g, '')
      .replace(/\{c:[0-9, ]+\}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  Notes.strip = strip;

  function keysOf(t) {
    var out = [], m, re = /\*\*([\s\S]+?)\*\*/g;
    while ((m = re.exec(t))) out.push(strip(m[1]));
    return out;
  }

  /* ── segmente (pentru completări) ── */
  Notes.segments = function (text) {
    var out = [], last = 0, m, ki = 0, re = new RegExp(TOKEN_SRC, 'g');
    function pushText(s) { if (s) out.push({ t: 'text', v: s }); }
    while ((m = re.exec(text))) {
      pushText(text.slice(last, m.index));
      if (m[1] != null) out.push({ t: 'key', v: strip(m[1]), i: ki++ });
      else if (m[2] != null) pushText(m[2]);
      else if (m[4] != null) pushText(m[4]);
      last = re.lastIndex;
    }
    pushText(text.slice(last));
    return out;
  };

  /* ── analizor DSL ── */
  Notes.parse = function (srcs) {
    var chapters = [], secs = {}, lines = {}, clsIdx = 0;
    srcs.forEach(function (src) {
      var ch = null, sec = null, stack = [], counter = 0;
      src.split('\n').forEach(function (raw, ln) {
        if (!raw.trim() || /^\s*\/\//.test(raw)) return;
        var m;
        if ((m = raw.match(/^# (.+)$/))) {
          var p = m[1].split('|').map(function (s) { return s.trim(); });
          ch = { id: p[0], code: p[1], title: p[2], subtitle: p[3] || '', photos: (p[4] || '').split(',').filter(Boolean).map(Number), note: p[5] || '', sections: [], cls: 'c' + (++clsIdx) };
          chapters.push(ch);
          return;
        }
        if ((m = raw.match(/^## (.+)$/))) {
          var q = m[1].split('|').map(function (s) { return s.trim(); });
          sec = { id: q[0], title: q[1], photos: (q[2] || '').split(',').filter(Boolean).map(Number), opts: (q[3] || '').split(/\s+/).filter(Boolean), ch: ch.id, body: [] };
          ch.sections.push(sec);
          secs[sec.id] = sec;
          stack = []; counter = 0;
          return;
        }
        var indent = raw.match(/^ */)[0].length;
        var depth = Math.floor(indent / 2);
        var body = raw.trim();
        var node;
        if (body.indexOf('@embed ') === 0) node = { kind: 'embed', name: body.slice(7).trim() };
        else if (body.indexOf('?> ') === 0) node = { kind: 'warn', text: body.slice(3) };
        else if (body.indexOf('> ') === 0) node = { kind: 'note', text: body.slice(2) };
        else if (body[0] === '-' || body[0] === '+') {
          var t = body.slice(2), em = false;
          if (t[0] === '!') { em = true; t = t.slice(1); }
          node = { kind: body[0] === '+' ? 'group' : 'li', text: t, em: em };
        } else throw new Error('Linie necunoscută (' + ch.id + ' rând ' + (ln + 1) + '): ' + raw);
        node.depth = depth;
        node.kids = [];
        if (node.kind === 'li' || node.kind === 'group') {
          node.id = sec.id + ':' + (++counter);
          node.keys = keysOf(node.text);
          node.plain = strip(node.text);
          node.sec = sec.id;
          node.ch = ch.id;
          lines[node.id] = node;
        }
        stack.length = Math.min(stack.length, depth);
        var parent = depth === 0 ? null : stack[depth - 1];
        if (depth > 0 && !parent) throw new Error('Indentare greșită (' + ch.id + ' rând ' + (ln + 1) + '): ' + raw);
        node.parent = parent;
        (parent ? parent.kids : sec.body).push(node);
        stack[depth] = node;
      });
    });
    D.chapters = chapters;
    D.sec = secs;
    D.line = lines;
    D.chById = {};
    chapters.forEach(function (c) { D.chById[c.id] = c; });
    return D;
  };

  /* se parcurg toate liniile, în ordinea din notițe */
  Notes.walk = function (nodes, fn) {
    nodes.forEach(function (n) { fn(n); if (n.kids && n.kids.length) Notes.walk(n.kids, fn); });
  };
  Notes.linesOf = function (secId) {
    var out = [];
    Notes.walk(D.sec[secId].body, function (n) { if (n.id) out.push(n); });
    return out;
  };

  /* context pentru completări */
  Notes.ctxOf = function (node) {
    var chain = [], p = node.parent;
    while (p) { chain.unshift(strip(p.text)); p = p.parent; }
    var sibs = [];
    var pool = node.parent ? node.parent.kids : D.sec[node.sec].body;
    if (node.plain.length <= 56) {
      pool.forEach(function (s) { if (s !== node && s.id && s.kind !== 'group') sibs.push(s.plain); });
    }
    return { chain: chain, sibs: sibs.slice(0, 8) };
  };

  /* ── marcaje inline -> DOM ── */
  function inline(text) {
    var frag = document.createDocumentFragment(), last = 0, m, re = new RegExp(TOKEN_SRC, 'g');
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (m[1] != null) {
        var kw = h('span.kw', { tabindex: '-1' });
        kw.appendChild(inline(m[1]));
        frag.appendChild(kw);
      } else if (m[2] != null) {
        var fx = h('span.fix', { title: 'În notițe: ' + m[3], tabindex: '0', role: 'button', 'aria-label': 'Greșeală de tipar corectată: în notițe scria ' + m[3] }, m[2], h('span.was', ' (în notițe: ' + m[3] + ')'));
        frag.appendChild(fx);
      } else if (m[4] != null) {
        frag.appendChild(h('span.unsure', { title: 'Citire nesigură în scrisul de mână. ' + m[5], tabindex: '0' }, m[4], h('sup', '?')));
      } else if (m[6] != null) {
        var nums = m[6].replace(/\s/g, '').split(',').filter(Boolean);
        frag.appendChild(h('span.src-tag', { title: 'Apare în ' + (nums.length > 1 ? 'caietele ' : 'caietul ') + nums.join(', ') }, 'caiet ' + nums.join(', ')));
      } else {
        frag.appendChild(h('span.blank', 'gol în notițe'));
      }
      last = re.lastIndex;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  }
  Notes.inline = inline;

  /* ── observații pe secțiune ── */
  function observations(sec) {
    var fixes = [], unsure = [], blanks = [];
    Notes.walk(sec.body, function (n) {
      if (n.kind === 'warn') unsure.push(strip(n.text));
      if (!n.text || n.kind === 'note' || n.kind === 'warn') return;
      var re = new RegExp(TOKEN_SRC, 'g'), m;
      while ((m = re.exec(n.text))) {
        if (m[2] != null) fixes.push('„' + m[3] + '” → „' + m[2] + '” (greșeală de tipar corectată)');
        else if (m[4] != null) unsure.push('„' + m[4] + '” – ' + m[5]);
        else if (m[0] === '{gol}') blanks.push('După „' + n.plain + '” nu e scris nimic în notițe.');
      }
    });
    return { fixes: fixes, unsure: unsure, blanks: blanks };
  }

  /* ── arbore ── */
  function renderKids(kids, depth) {
    var sub = kids.filter(function (k) { return k.kind === 'li' || k.kind === 'group'; });
    if (!sub.length) return null;
    return h('ul.tree', sub.map(function (k) { return renderNode(k); }));
  }
  function renderNode(n) {
    var li = h('li.node.' + n.kind + (n.em ? '.em' : ''), { dataset: { id: n.id } });
    li.appendChild(h('span.txt', h('span.tx', inline(n.text))));
    n.kids.forEach(function (k) {
      if (k.kind === 'note' || k.kind === 'warn') {
        li.appendChild(h('div.callout.' + (k.kind === 'warn' ? 'warn' : 'note'), U.icon(k.kind === 'warn' ? 'alert' : 'info', 16), h('span', inline(k.text))));
      } else if (k.kind === 'embed') {
        var el = Notes.embed(k.name);
        if (el) li.appendChild(h('div.embed', el));
      }
    });
    var ul = renderKids(n.kids, n.depth + 1);
    if (ul) li.appendChild(ul);
    return li;
  }
  function renderBody(sec) {
    var wrap = h('div'), cur = null;
    sec.body.forEach(function (k) {
      if (k.kind === 'li' || k.kind === 'group') {
        if (!cur) { cur = h('ul.tree'); wrap.appendChild(cur); }
        cur.appendChild(renderNode(k));
        return;
      }
      cur = null;
      if (k.kind === 'note' || k.kind === 'warn') {
        wrap.appendChild(h('div.callout.' + (k.kind === 'warn' ? 'warn' : 'note'), { style: 'margin:4px 0 10px' }, U.icon(k.kind === 'warn' ? 'alert' : 'info', 16), h('span', inline(k.text))));
      } else if (k.kind === 'embed') {
        var el = Notes.embed(k.name);
        if (el) wrap.appendChild(h('div.embed', { style: 'margin:8px 0' }, el));
      }
    });
    return wrap;
  }

  /* ── fișe pe persoane ── */
  var YEARS = /\(\s*(\d{4})\s*[–-]\s*(\d{4})\s*\)/;
  function renderPeople(sec) {
    var cards = [];
    Notes.walk(sec.body, function (n) {
      if (!n.text) return;
      var plain = strip(n.text);
      var ym = plain.match(YEARS);
      if (!ym) return;
      var name = plain.replace(YEARS, '').replace(/\s+/g, ' ').trim();
      var items = n.kids.filter(function (k) { return k.kind === 'li'; });
      cards.push(h('div.person',
        h('h4', name),
        h('div.yrs', ym[1] + ' – ' + ym[2]),
        h('ul', items.map(function (k) { return h('li', { class: /^\s*(\*\*)?„/.test(k.text) ? 'work' : '' }, inline(k.text)); }))
      ));
    });
    return h('div.people', cards);
  }

  /* ── tabel interactiv (surse medievale) ── */
  Notes.embeds = {};
  Notes.embed = function (name) {
    var parts = name.split(':');
    var fn = Notes.embeds[parts[0]];
    return fn ? fn(parts[1]) : null;
  };
  Notes.embeds['sources-table'] = function () {
    var T = D.tables && D.tables.sources;
    if (!T) return null;
    var hiddenCols = {};
    var wrap = h('div');
    var tools = h('div.tbl-tools');
    var table = h('table.src');
    function draw() {
      U.clear(tools);
      tools.appendChild(h('span.muted', 'Ascunde coloana ca să te verifici:'));
      T.cols.forEach(function (c, i) {
        if (i === 0) return;
        tools.appendChild(h('button.btn.sm' + (hiddenCols[i] ? '.primary' : ''), {
          'aria-pressed': hiddenCols[i] ? 'true' : 'false',
          onClick: function () { hiddenCols[i] = !hiddenCols[i]; draw(); }
        }, hiddenCols[i] ? U.icon('eyeoff', 15) : U.icon('eye', 15), stripCol(c)));
      });
      tools.appendChild(h('button.btn.sm.ghost', { onClick: function () { hiddenCols = {}; draw(); } }, 'Arată tot'));
      U.clear(table);
      table.appendChild(h('thead', h('tr', T.cols.map(function (c) { return h('th', inline(c)); }))));
      table.appendChild(h('tbody', T.rows.map(function (r) {
        var vals = [String(r.n), r.sec, r.autor, r.lucrare, r.mentiune];
        return h('tr', vals.map(function (v, i) {
          var cls = i === 0 ? 'n' : i === 1 ? 'c' : '';
          var empty = (v === '' || v == null);
          var content = empty ? h('span.v', '(gol în notițe)') : h('span.v', v);
          if (hiddenCols[i] && !empty) {
            var td = h('td.hide', { class: cls, tabindex: '0', role: 'button', 'aria-label': 'Arată celula ascunsă', onClick: function () { td.classList.toggle('on'); } }, content);
            td.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); td.classList.toggle('on'); } });
            return td;
          }
          return h('td', { class: cls + (empty ? ' empty' : '') }, content);
        }));
      })));
    }
    function stripCol(c) { return strip(c).replace(/^Mențiunea referitoare la romanitatea românilor$/, 'mențiunea'); }
    draw();
    wrap.appendChild(tools);
    wrap.appendChild(h('div.tbl-wrap', table));
    return wrap;
  };

  /* ── bandă cronologică (marile descoperiri) ── */
  Notes.embeds['desc-strip'] = function () {
    var ev = (D.timeline || []).filter(function (e) { return e.ch === 'descoperiri' && /^\d{4}/.test(e.y); }).sort(function (a, b) { return a.k - b.k; });
    if (!ev.length) return null;
    var kids = [];
    ev.forEach(function (e, i) {
      if (i > 0) kids.push(h('div.gap', '+' + (e.k - ev[i - 1].k)));
      kids.push(h('div.ev', h('div.y', e.y), h('div.t', e.t)));
    });
    return h('div',
      h('div.small.muted', { style: 'font-family:var(--f-ui);margin-bottom:6px' }, 'Aceleași evenimente, în ordine cronologică (între ani: câți ani trec)'),
      h('div.strip', kids));
  };

  /* ── mnemonic încorporat în notițe ── */
  Notes.embeds['mnemo'] = function (id) {
    var m = (D.mnemonics || []).filter(function (x) { return x.id === id; })[0];
    return m ? Notes.mnemoCard(m) : null;
  };
  Notes.mnemoCard = function (m) {
    var el = h('div.card.flat.mn',
      h('h3', U.icon('bulb', 20), m.title, h('span.mn-flag', 'truc de memorare – nu e din notițe')),
      m.phrase ? h('div.phrase', inline(m.phrase)) : null,
      m.chunks ? h('div.chunks', m.chunks.map(function (c) { return h('div.chunk', h('b', c.t), h('ul', c.items.map(function (i) { return h('li', inline(i)); }))); })) : null,
      m.tip ? h('p.muted.small', inline(m.tip)) : null
    );
    return el;
  };

  /* ── pagina Notițe ── */
  Notes.view = function (params) {
    var App = g.App;
    var chId = params.ch || App.state.noteCh || D.chapters[0].id;
    App.state.noteCh = chId;
    var ch = D.chById[chId];
    var root = h('div');

    var recite = !!App.state.recite;
    var layoutCards = {}; // secțiune -> bool (fișe)

    // bara de sus
    var seg = h('div.seg', { role: 'tablist' }, D.chapters.map(function (c) {
      return h('button.' + c.cls + (c.id === chId ? '.on' : ''), { role: 'tab', 'aria-selected': c.id === chId ? 'true' : 'false', onClick: function () { App.go('notes', { ch: c.id }); } }, (Notes.tab[c.id] || c.title));
    }));
    function syncKw() {
      var on = root.classList.contains('recite');
      U.$$('.kw', root).forEach(function (k) {
        if (on && !k.closest('.legend')) { k.setAttribute('tabindex', '0'); k.setAttribute('role', 'button'); k.setAttribute('aria-label', 'Cuvânt-cheie ascuns; apasă ca să-l vezi'); }
        else { k.setAttribute('tabindex', '-1'); k.removeAttribute('role'); k.removeAttribute('aria-label'); }
      });
    }
    var reciteBtn = h('button.toggle', { 'aria-pressed': recite ? 'true' : 'false', onClick: function () {
      App.state.recite = !App.state.recite;
      var on = App.state.recite;
      reciteBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      root.classList.toggle('recite', on);
      syncKw();
      U.$$('.kw', root).forEach(function (k) { k.classList.remove('on'); });
      if (on) U.toast('Cuvintele-cheie sunt ascunse. Atinge un cuvânt ca să-l vezi.');
    } }, h('span.knob'), 'Ascunde cuvintele-cheie');
    var showAll = h('button.btn.sm.ghost', { onClick: function () { U.$$('.kw', root).forEach(function (k) { k.classList.add('on'); }); } }, U.icon('eye', 15), 'Arată tot');
    var hideAll = h('button.btn.sm.ghost', { onClick: function () { U.$$('.kw', root).forEach(function (k) { k.classList.remove('on'); }); } }, U.icon('eyeoff', 15), 'Ascunde tot');
    var content = h('div');
    var results = h('div', { hidden: true });
    var search = h('input', { type: 'text', id: 'notes-search', placeholder: 'Caută în notițe (ex.: Cabral, 1570, romanizare)', autocomplete: 'off', 'aria-label': 'Caută în notițe', style: 'max-width:440px' });
    search.addEventListener('input', U.debounce(function () { runSearch(search.value, results, content); }, 120));
    root.appendChild(h('div.notes-bar', seg));
    root.appendChild(h('div.notes-bar', reciteBtn, showAll, hideAll));
    root.appendChild(h('div.notes-bar', h('span', { style: 'color:var(--ink-3)' }, U.icon('search', 18)), search));
    root.appendChild(results);
    root.appendChild(content);

    // capul capitolului
    var readCount = ch.sections.filter(function (s) { return g.Store.data.read[s.id]; }).length;
    content.appendChild(h('div.ch-head',
      h('div.row', h('h1', ch.title), h('span.ch-code', ch.code), h('span.stamp', { title: 'Capitolul intră la test' }, 'TEST')),
      ch.subtitle ? h('p.sub', ch.subtitle) : null,
      h('div.row', h('span.chip.' + ch.cls, readCount + ' / ' + ch.sections.length + ' secțiuni citite'), ch.photos.length ? photoLink(ch.photos, 'Toate pozele originale') : null)
    ));
    content.appendChild(h('div.card.flat.banner.legend', { style: 'margin-bottom:16px' }, U.icon('info', 20),
      h('p', 'Textul de mai jos e preluat din notițele tale, rând cu rând. ',
        h('span.kw', 'Galbenul'), ' marchează cuvintele-cheie; ',
        h('span.fix', 'liniuța punctată'), ' arată o greșeală de tipar corectată (atinge-o ca să vezi ce scria); ',
        h('span.unsure', 'fundalul portocaliu', h('sup', '?')), ' arată un loc unde scrisul de mână e greu de citit. Pozele originale le deschizi cu butonul de mai sus. Toate cele ' + D.chapters.length + ' capitole intră la test.')));

    var toc = h('div.toc', { role: 'navigation', 'aria-label': 'Secțiunile capitolului' }, ch.sections.map(function (sec, i) {
      return h('button.chip' + (g.Store.data.read[sec.id] ? '.ok' : ''), { title: sec.title, onClick: function () {
        var el = document.getElementById('sec-' + sec.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } }, (i + 1) + '. ' + sec.title);
    }));
    content.appendChild(toc);
    if (ch.note) content.appendChild(h('div.callout.note', { style: 'margin-bottom:16px' }, U.icon('info', 16), h('span', inline(ch.note))));
    // secțiuni
    ch.sections.forEach(function (sec) { content.appendChild(renderSection(sec, ch)); });
    root.classList.toggle('recite', recite);
    syncKw();

    // tapul pe cuvinte-cheie în modul de recitare
    root.addEventListener('click', function (e) {
      var kw = e.target.closest && e.target.closest('.kw');
      if (kw && root.classList.contains('recite')) { kw.classList.toggle('on'); e.stopPropagation(); }
      var fx = e.target.closest && e.target.closest('.fix');
      if (fx) fx.classList.toggle('open');
    });
    root.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('fix')) { e.preventDefault(); e.target.classList.toggle('open'); }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('kw') && root.classList.contains('recite')) { e.preventDefault(); e.target.classList.toggle('on'); }
    });
    root.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.seg')) setTimeout(syncKw, 0); });

    if (params.sec) setTimeout(function () { var el = document.getElementById('sec-' + params.sec); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
    return root;
  };

  /* ── căutare în notițe ── */
  function fuzzyRe(q) {
    var map = { a: '[aăâáà]', i: '[iîíì]', s: '[sșş]', t: '[tțţ]' };
    var out = '';
    q.toLowerCase().split('').forEach(function (c) {
      if (/\s/.test(c)) out += '\\s+';
      else if (map[c]) out += map[c];
      else out += c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    return new RegExp(out, 'i');
  }
  function runSearch(q, box, content) {
    q = (q || '').trim();
    U.clear(box);
    if (q.length < 2) { box.hidden = true; content.hidden = false; return; }
    var re = fuzzyRe(q), hits = [];
    D.chapters.forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        Notes.walk(sec.body, function (n) { if (n.id && n.plain && re.test(n.plain)) hits.push({ n: n, ch: ch, sec: sec }); });
      });
    });
    content.hidden = true; box.hidden = false;
    box.appendChild(h('p.muted', { style: 'margin-bottom:10px' }, hits.length ? U.nr(hits.length, 'rând găsit', 'rânduri găsite') : 'Nimic găsit pentru „' + q + '”. Încearcă un singur cuvânt.'));
    hits.slice(0, 60).forEach(function (x) {
      var txt = x.n.plain, m = re.exec(txt);
      var line = h('div', { style: 'font-family:var(--f-read);font-size:16.5px' },
        m ? [txt.slice(0, m.index), h('span.kw', { style: 'background:var(--mark)' }, m[0]), txt.slice(m.index + m[0].length)] : txt);
      box.appendChild(h('button.card.flat', { style: 'text-align:left;width:100%;margin-bottom:8px;padding:12px 14px;cursor:pointer', onClick: function () { g.App.go('notes', { ch: x.ch.id, sec: x.sec.id }); } },
        h('div.row', { style: 'margin-bottom:4px' }, h('span.chip.' + x.ch.cls, Notes.short ? Notes.short(x.ch.id) : x.ch.id), h('span.small.muted', x.sec.title)), line));
    });
  }

  function photoLink(photos, label) {
    return h('button.btn.sm.photo-btn', { onClick: function () { g.App.photos(photos, 0); } }, U.icon('image', 15), label);
  }

  function renderSection(sec, ch) {
    var Store = g.Store;
    var isRead = !!Store.data.read[sec.id];
    var hasCards = sec.opts.indexOf('cards') >= 0;
    var bodyHost = h('div.sec-body');
    var showPeople = false;
    function drawBody() {
      U.clear(bodyHost);
      if (showPeople) { bodyHost.style.padding = '0'; bodyHost.appendChild(renderPeople(sec)); }
      else { bodyHost.style.padding = ''; bodyHost.appendChild(renderBody(sec)); }
    }
    drawBody();
    var el = h('section.sec' + (isRead ? '.read' : ''), { id: 'sec-' + sec.id },
      h('div.sec-head',
        h('h2', sec.title)
      )
    );
    if (hasCards) {
      var seg = h('div.seg', { style: 'margin:12px 18px 0' },
        h('button.on', { onClick: function (e) { showPeople = false; drawBody(); U.$$('button', seg).forEach(function (b, i) { b.classList.toggle('on', i === 0); }); } }, 'Listă, ca în notițe'),
        h('button', { onClick: function () { showPeople = true; drawBody(); U.$$('button', seg).forEach(function (b, i) { b.classList.toggle('on', i === 1); }); } }, 'Fișe pe persoane'));
      el.appendChild(seg);
    }
    el.appendChild(bodyHost);

    // observații
    var ob = observations(sec);
    var total = ob.fixes.length + ob.unsure.length + ob.blanks.length;
    if (total) {
      el.appendChild(h('details.sec-obs', h('summary', 'Observații despre notițe (' + total + ')'),
        h('ul', ob.fixes.concat(ob.unsure, ob.blanks).map(function (t) { return h('li', t); }))));
    }

    // secțiunea se bifează singură ca citită când ajungi cu derularea la capătul ei
    if (!isRead && g.IntersectionObserver) {
      var end = h('div', { 'aria-hidden': 'true', style: 'height:48px;margin-top:-48px;pointer-events:none' });
      var io = new g.IntersectionObserver(function (entries) {
        if (!el.isConnected) { io.disconnect(); return; }
        if (!entries.some(function (e) { return e.isIntersecting; })) return;
        Store.markRead(sec.id, true);
        el.classList.add('read');
        io.disconnect();
      });
      el.appendChild(end);
      io.observe(end);
    }
    return el;
  }
})(typeof window !== 'undefined' ? window : globalThis);
