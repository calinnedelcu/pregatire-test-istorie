/* Axa timpului și trucuri de memorare (capitolele 1 și 2). Datele vin din notițe; trucurile sunt ajutoare. */
(function (g) {
  var D = (g.DATA = g.DATA || {});
  D.timeline = D.timeline || [];
  D.mnemonics = D.mnemonics || [];

  D.timeline.push(
    { y: 'sec. I îHr – I dHr', k: -50, t: 'Prima etapă din formarea limbii române', n: 'În notițe nu e scris nimic după această perioadă.', ch: 'etno' },
    { y: '106 – 271', k: 106, t: 'Impusă Latina', ch: 'etno' },
    { y: 'sec. II – III', k: 200, t: 'Romanizare cu intensitate mare, la sat și la oraș', ch: 'etno' },
    { y: '271 – 602', k: 271, t: 'Continuarea romanizării', ch: 'etno' },
    { y: '602', k: 602, t: 'Slavii trec Dunărea în S', n: 'Fragmentarea comunităților locale, despărțirea de romanitatea nord-dunăreană.', ch: 'etno' },
    { y: 'sec. VII', k: 650, t: 'Mauricius – Strategikon', n: 'Menționează: Romani.', ch: 'etno' },
    { y: 'sec. VIII', k: 750, t: 'Limba română se formase', ch: 'etno' },
    { y: 'sec. IX', k: 850, t: 'Moise Chorenati (Geografie armeană) și Cronica turcă (Oguzname)', n: 'Țara Balak – Valahia; Țară a vlahilor (Ulakili).', ch: 'etno' },
    { y: 'sec. X', k: 950, t: 'Constantin al VII-lea Porfirogenetul – Despre administrarea imperiului', n: 'Menționează: Romani.', ch: 'etno' },
    { y: 'sec. XI', k: 1050, t: 'Kekaumenos (Sfaturi și povestiri) și Gardizi (Podoaba istoriilor)', n: 'Vlahii sud-dunăreni; Așezare între Dunăre și un munte mare.', ch: 'etno' },
    { y: 'sec. XII', k: 1150, t: 'Ioan Kynamos și Anonymus (Cronică)', n: 'Vlahi; Popoare din Transilvania prezentate.', ch: 'etno' },
    { y: 'sec. XIII', k: 1250, t: 'Ioniță cel Frumos (Corespondență cu papa) și Simon de Keza (Cronică)', n: 'Originea etnică și mândria; Păstorii romanilor.', ch: 'etno' },
    { y: 'sec. XIV – XVI', k: 1400, t: 'Preocupări pentru argumentarea originii romane; „noi ne spunem rumâni”', ch: 'etno' },
    { y: '1493 – 1568', k: 1493, s: 'viața', t: 'Nicolaus Olahus – „Hungaria”', ch: 'calatori' },
    { y: '1570', k: 1570, t: 'Coresi – Psaltire', ch: 'etno' },
    { y: '1596 – 1647', k: 1596, s: 'viața', t: 'Grigore Ureche – „Letopisețul Țării Moldovei”', ch: 'calatori' },
    { y: '1633 – 1691', k: 1633, s: 'viața', t: 'Miron Costin – „Istoria Țării Moldovei”, „De neamul moldovenilor”', ch: 'calatori' },
    { y: '1636 – 1708', k: 1636, s: 'viața', t: 'Nicolae Milescu – „Raportul soliei în China”, „Descrierea Chinei”', ch: 'calatori' },
    { y: '1640 – 1716', k: 1640, s: 'viața', t: 'Constantin Cantacuzino – „Istoria Țării Românești dintru început”', ch: 'calatori' },
    { y: '1672 – 1745', k: 1672, s: 'viața', t: 'Ion Neculce – „Letopisețul Țării Moldovei”, „O samă de cuvinte”', ch: 'calatori' },
    { y: '1673 – 1723', k: 1673, s: 'viața', t: 'Dimitrie Cantemir – „Creșterea și descreșterea Curții otomane”', ch: 'calatori' },
    { y: 'sf. sec. XVII – înc. sec. XVIII', k: 1690, t: 'Primele semne ale apariției conștiinței naționale', ch: 'etno' },
    { y: '1777 – 1830', k: 1777, s: 'viața', t: 'Dinicu Golescu – primul jurnal de călătorie', ch: 'calatori' },
    { y: '1791', k: 1791, t: 'Supplex Libellus Valachorum', n: 'Ideea romanității românilor: o armă politică.', ch: 'etno' },
    { y: 'sec. XIX', k: 1801, t: 'Se constituie limba română literară', n: 'Bază: graiul din Muntenia și opere literare din Moldova.', ch: 'etno' },
    { y: '1848', k: 1848, t: 'Se afirmă conștiința de neam', ch: 'etno' },
    { y: '1849 – 1911', k: 1849, s: 'viața', t: 'Badea Cârțan – duce carte românească în Ardeal; ajunge de trei ori la Roma', ch: 'calatori' },
    { y: '1859', k: 1859, t: 'Se afirmă conștiința de neam', ch: 'etno' },
    { y: '1877 – 1878', k: 1877, t: 'Se afirmă conștiința de neam', ch: 'etno' },
    { y: '1918', k: 1918, t: 'Se afirmă conștiința de neam', n: 'După 1918 disputa continuă: Iorga, Pârvan, Gh Brătianu.', ch: 'etno' },
    { y: 'după 1965', k: 1966, t: 'Se dorește revitalizarea sentimentului național', n: 'Factorul roman minimizat, factorul geto-dac accentuat, izvoare arheologice supralicitate.', ch: 'etno' },
    { y: 'după aderarea la UE', k: 2007, t: 'Disputa politică despre romanitate nu ar mai trebui să aibă conținut', ch: 'etno' }
  );

  D.mnemonics.push(
    { id: 'mn-straturi', ch: 'etno', title: 'Cele trei straturi ale limbii',
      phrase: '**SUB** = dacii (puțin: 160–170 de cuvinte) · **STRAT** = latina (gramatica și majoritatea cuvintelor) · **AD** = slavii (fonetică și vocabular)',
      tip: 'Sub = dedesubt, ce a fost înainte. Strat = miezul. Ad = „lângă”, ce se adaugă mai târziu.' },
    { id: 'mn-dialecte', ch: 'etno', title: 'Dialectele limbii române', phrase: '**D**aco-român · **A**român · **I**stro-român · **M**egleno-român  →  **DAIM**',
      tip: 'Moldovenesc și oltenesc nu sunt dialecte, ci graiuri.' },
    { id: 'mn-etape', ch: 'etno', title: 'Etapele formării limbii',
      chunks: [{ t: 'Înainte', items: ['sec. I îHr – I dHr'] }, { t: 'Latina', items: ['106 – 271: impusă Latina', '271 – 602: continuarea romanizării'] }, { t: 'Ruptura', items: ['602: slavii trec Dunărea în S'] }, { t: 'Rezultat', items: ['sec. VIII: limba se formase', 'sec. XIX: limba literară'] }],
      tip: 'Povestea scurtă: se impune, continuă, se rupe, e gata.' },
    { id: 'mn-tabel', ch: 'etno', title: 'Tabelul surselor, pe secole',
      chunks: [
        { t: 'sec. VII – IX', items: ['VII Mauricius – Strategikon: Romani', 'IX Moise Chorenati: Țara Balak – Valahia', 'IX Cronică turcă – Oguzname: Țară a vlahilor (Ulakili)'] },
        { t: 'sec. X – XI', items: ['X Constantin al VII-lea Porfirogenetul: Romani', 'XI Kekaumenos: vlahii sud-dunăreni', 'XI Gardizi: între Dunăre și un munte mare'] },
        { t: 'sec. XII – XIII', items: ['XII Ioan Kynamos: Vlahi', 'XII Anonymus (Cronică): popoare din Transilvania', 'XIII Ioniță cel Frumos: originea etnică și mândria', 'XIII Simon de Keza (Cronică): păstorii romanilor'] }
      ],
      tip: 'Numărul de autori pe secol: VII 1 · IX 2 · X 1 · XI 2 · XII 2 · XIII 2. „Romani” apare de două ori: la Mauricius și la Constantin Porfirogenetul. „Cronică” e lucrarea lui Anonymus și a lui Simon de Keza.' },
    { id: 'mn-neam', ch: 'etno', title: 'Când se afirmă conștiința de neam', phrase: '**1848** · **1859** · **1877 – 1878** · **1918**', tip: '1848 și 1859 sunt la 11 ani distanță; apoi urmează 1877 – 1878 și 1918.' },
    { id: 'mn-comunista', ch: 'etno', title: 'Istoriografia comunistă: ce se schimbă',
      chunks: [{ t: 'Teoriile staliniste', items: ['stăpânirea romană: imperialistă și sclavagistă', 'slavii: civilizatori'] }, { t: 'După 1965', items: ['factorul roman: minimizat, asupritor', 'factorul geto-dac: accentuat', 'izvoarele arheologice: supralicitate'] }],
      tip: 'În ambele perioade romanii sunt priviți negativ. Diferența: la început sunt lăudați slavii, după 1965 sunt puși în față geto-dacii și arheologia.' },
    { id: 'mn-cronicari', ch: 'calatori', title: 'Cei trei cărturari din „Peregrini și cronicari”, într-un cuvânt',
      phrase: '**Ureche** = oral (povestește) · **Costin** = drumuri (deschizător de drumuri) · **Neculce** = samă („O samă de cuvinte”)',
      tip: 'Ureche: stil narator, asemănător celui oral. Costin: deschizător de drumuri în istorie, geografie istorică, etnografie. Neculce: „O samă de cuvinte”.' },
    { id: 'mn-europeni', ch: 'calatori', title: 'Europeni și universaliști: câte un cuvânt fiecare',
      chunks: [{ t: 'Cantemir', items: ['Curtea otomană', 'istorie, folclor, teologie islamică, muzică'] }, { t: 'Olahus', items: ['Hungaria', 'caracterul latin al limbii'] }, { t: 'Milescu', items: ['China', 'poliglot, hărți, mongoli și chinezi'] }, { t: 'Cantacuzino', items: ['Țara Românească', 'continuitate, hartă'] }, { t: 'Golescu', items: ['primul jurnal', 'sprijină învățământul'] }, { t: 'Cârțan', items: ['Roma de trei ori', 'carte românească în Ardeal'] }],
      tip: 'Câte un cuvânt-cheie fiecare: Curte, Ungaria, China, Țara Românească, jurnal, Roma.' },
    { id: 'mn-nasteri', ch: 'calatori', title: 'Anii nașterii, în grupe',
      chunks: [{ t: 'Cei mai vechi', items: ['1493 Olahus', '1596 Ureche'] }, { t: 'Trei apropiați', items: ['1633 Costin', '1636 Milescu', '1640 Cantacuzino'] }, { t: 'Doi vecini', items: ['1672 Neculce', '1673 Cantemir'] }, { t: 'Târziu', items: ['1777 Golescu', '1849 Cârțan'] }],
      tip: 'Cantemir se naște la un an după Neculce, iar Milescu la trei ani după Costin.' }
  );
})(typeof window !== 'undefined' ? window : globalThis);
