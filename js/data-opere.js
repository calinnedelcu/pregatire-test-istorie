/* Test „operă ↔ autor”: din fiecare pereche autor – lucrare din notițe se fac întrebări în ambele sensuri
   (dintr-o lucrare alegi autorul; dintr-un autor alegi lucrarea). Se generează la pornire, ca să rămână în pas cu notițele. */
(function (g) {
  var D = (g.DATA = g.DATA || {});
  var prev = D.genQuestions;

  // pairs: [autor, lucrare, secțiune, fragment din rândul autorului]
  // extra: autori care apar doar ca variante greșite; ban: autori care nu pot fi variante pentru o anumită lucrare;
  // banW: lucrări care nu pot fi variante pentru un anumit autor (în alt capitol îi sunt trecute lui)
  var SETS = [
    { id: 'c2', ctx: 'lecția Călători', extra: ['Badea Cârțan'], banW: { 'Miron Costin': ['Letopisețul Țării Moldovei'] }, pairs: [
      ['Grigore Ureche', 'Letopisețul Țării Moldovei', 'cal-peregrini', 'Grigore Ureche'],
      ['Miron Costin', 'Istoria Țării Moldovei', 'cal-peregrini', 'Miron Costin'],
      ['Miron Costin', 'De neamul moldovenilor', 'cal-peregrini', 'Miron Costin'],
      ['Ion Neculce', 'Letopisețul Țării Moldovei', 'cal-peregrini', 'Ion Neculce'],
      ['Ion Neculce', 'O samă de cuvinte', 'cal-peregrini', 'Ion Neculce'],
      ['Dimitrie Cantemir', 'Creșterea și descreșterea Curții otomane', 'cal-europeni', 'Dimitrie Cantemir'],
      ['Nicolaus Olahus', 'Hungaria', 'cal-europeni', 'Nicolaus Olahus'],
      ['Nicolae Milescu', 'Raportul soliei în China', 'cal-europeni', 'Nicolae Milescu'],
      ['Nicolae Milescu', 'Descrierea Chinei', 'cal-europeni', 'Nicolae Milescu'],
      ['Constantin Cantacuzino', 'Istoria Țării Românești dintru început', 'cal-europeni', 'Constantin Cantacuzino'],
      ['Dinicu Golescu', 'Însemnarea a călătoriei mele Constantin Radovici din Golești', 'cal-europeni', 'Dinicu Golescu']
    ] },
    { id: 'e17', ctx: 'lecția Etnogeneză, lista „Sec al XVII-lea” și Coresi', extra: ['Grigore Ureche', 'Nicolaus Olahus'], ban: { 'Letopisețul Țării Moldovei': ['Grigore Ureche'] }, pairs: [
      ['Miron Costin', 'Letopisețul Țării Moldovei', 'etno-xvii', 'M Costin'],
      ['Miron Costin', 'De neamul moldovenilor', 'etno-xvii', 'M Costin'],
      ['Constantin Cantacuzino', 'Istoria Țării Românești', 'etno-xvii', 'C-tin Cantacuzino'],
      ['Dimitrie Cantemir', 'Descrierea Moldovei', 'etno-xvii', 'D Cantemir'],
      ['Dimitrie Cantemir', 'Hronicul româno-moldo-vlahilor', 'etno-xvii', 'D Cantemir'],
      ['Coresi', 'Psaltire (1570)', 'etno-xiv-xvi', 'Coresi']
    ] },
    { id: 'etb', ctx: 'lecția Etnogeneză, tabelul surselor medievale', extra: ['Ioan Kynamos'], table: true }
  ];

  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  // ia k elemente din candidați, pornind de la o poziție care se schimbă de la o întrebare la alta (deterministic)
  function pick(c, k, seed) { var r = []; for (var t = 0; t < c.length && r.length < k; t++) r.push(c[(seed + t) % c.length]); return r; }

  function gen() {
    var out = [];
    SETS.forEach(function (S) {
      var pairs = S.pairs;
      if (S.table) {
        var T = D.tables && D.tables.sources;
        if (!T) return;
        pairs = T.rows.filter(function (r) { return r.lucrare; }).map(function (r) { return [r.autor, r.lucrare, 'etno-formarea', 'Călători străini']; });
      }
      var authorsOf = {}, worksOf = {}, secW = {}, secA = {}, snipA = {};
      pairs.forEach(function (p) {
        (authorsOf[p[1]] = authorsOf[p[1]] || []).push(p[0]);
        (worksOf[p[0]] = worksOf[p[0]] || []).push(p[1]);
        secW[p[1]] = p[2]; secA[p[0]] = p[2]; snipA[p[0]] = p[3];
      });
      var authors = uniq(pairs.map(function (p) { return p[0]; })), works = uniq(pairs.map(function (p) { return p[1]; }));
      var pool = authors.concat(S.extra || []), i = 0;

      // lucrare → autor
      works.forEach(function (w) {
        i++;
        var A = authorsOf[w], banned = (S.ban && S.ban[w]) || [];
        var others = pool.filter(function (a) { return A.indexOf(a) < 0 && banned.indexOf(a) < 0; });
        var base = { id: 'ow-' + S.id + '-a' + i, sec: secW[w], grp: 'opere', src: [snipA[A[0]]] };
        if (A.length === 1) {
          out.push(Object.assign(base, { t: 'mcq', lvl: 2, q: 'Cine a scris „' + w + '”? (' + S.ctx + ')', ok: A[0], bad: pick(others, 3, i * 2), why: '„' + w + '” – ' + A[0] + '.' }));
        } else {
          out.push(Object.assign(base, { t: 'multi', lvl: 3, q: 'Cine a scris „' + w + '”? Sunt mai mulți autori (' + S.ctx + ').',
            opts: A.map(function (a) { return { t: a, ok: true }; }).concat(pick(others, 2, i * 2).map(function (a) { return { t: a, ok: false }; })),
            why: '„' + w + '” e trecută la: ' + A.join(' și ') + '.' }));
        }
      });

      // autor → lucrare
      authors.forEach(function (a) {
        var W = worksOf[a];
        var bw = (S.banW && S.banW[a]) || [];
        var others = works.filter(function (w) { return authorsOf[w].indexOf(a) < 0 && bw.indexOf(w) < 0; });
        W.forEach(function (w) {
          i++;
          out.push({ id: 'ow-' + S.id + '-b' + i, t: 'mcq', sec: secA[a], lvl: 2, grp: 'opere', src: [snipA[a]], q: 'Care dintre aceste lucrări îi aparține lui ' + a + '? (' + S.ctx + ')', ok: w, bad: pick(others, 3, i * 3), why: a + ' – „' + W.join('”, „') + '”.' });
        });
        if (W.length > 1) {
          i++;
          out.push({ id: 'ow-' + S.id + '-b' + i, t: 'multi', sec: secA[a], lvl: 3, grp: 'opere', src: [snipA[a]], q: 'Care dintre aceste lucrări sunt ale lui ' + a + '? Sunt mai multe (' + S.ctx + ').',
            opts: W.map(function (w) { return { t: w, ok: true }; }).concat(pick(others, 2, i * 3).map(function (w) { return { t: w, ok: false }; })),
            why: a + ' – „' + W.join('”, „') + '”.' });
        }
      });
    });
    return out;
  }

  D.genQuestions = function () { return (prev ? prev() : []).concat(gen()); };
})(typeof window !== 'undefined' ? window : globalThis);
