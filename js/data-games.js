/* Jocuri (potrivire, ordonare, sortare) pentru capitolele 1 și 2. */
(function (g) {
  var D = (g.DATA = g.DATA || {});
  (D.gamesSrc = D.gamesSrc || []).push(

    /* ── Capitolul 1 ── */
    { id: 'gm-e1', t: 'match', sec: 'etno-romanizarea', lvl: 1, q: 'Potrivește fiecare strat al limbii române cu ce a adus.', pairs: [
      ['Substrat traco-dacic', 'cca 160 – 170 de cuvinte'], ['Strat latin', 'gramatica și majoritatea cuvintelor'], ['Adstrat slav', 'fonetică și vocabular']
    ], why: 'Substrat traco-dacic: cca 160–170 cuvinte; strat latin: gramatica și majoritatea cuvintelor; adstrat slav: fonetică și vocabular.', src: ['Substrat traco-dacic'] },
    { id: 'gm-e2', t: 'match', sec: 'etno-formarea', lvl: 2, q: 'Potrivește perioada cu ce se petrece.', pairs: [
      ['106 – 271', 'impusă Latina'], ['271 – 602', 'continuarea romanizării'], ['602', 'slavii trec Dunărea în S'], ['Sec VIII', 'limba română se formase'], ['Sec XIX', 'se constituie limba română literară']
    ], why: 'Etapele: 106–271 impusă Latina; 271–602 continuarea romanizării; 602 slavii trec Dunărea; sec. VIII limba se formase; sec. XIX limba literară.', src: ['106 – 271'] },
    { id: 'gm-e3', t: 'match', sec: 'etno-xvii', lvl: 2, q: 'Potrivește autorul cu lucrarea din lista „Sec al XVII-lea” / Coresi.', pairs: [
      ['M Costin', 'De neamul moldovenilor'], ['D Cantemir', 'Hronicul româno-moldo-vlahilor'], ['C-tin Cantacuzino', 'Istoria Țării Românești'], ['Coresi', 'Psaltire (1570)']
    ], why: 'M Costin – De neamul moldovenilor; D Cantemir – Hronicul româno-moldo-vlahilor; C-tin Cantacuzino – Istoria Țării Românești; Coresi – 1570 Psaltire.', src: ['De neamul moldovenilor'] },
    { id: 'gm-e4', t: 'match', sec: 'etno-politica', lvl: 2, q: 'Potrivește personajul sau evenimentul cu ideea din notițe.', pairs: [
      ['Școala Ardeleană', 'accent pe originea latină'], ['Supplex Libellus Valachorum (1791)', 'ideea romanității: o armă politică'], ['Unirea cu Roma', 'imbold luptei pentru drepturi'], ['Inochentie Micu', 'vechimea și continuitatea neamului'], ['N Olahus', 'unitatea neamului, a limbii și religiei']
    ], why: 'Vezi secțiunea „O problemă politică” și „Romanitatea românilor în sec XIV – XVI”.', src: ['Școala Ardeleană'] },
    { id: 'gm-e5', t: 'match', sec: 'etno-formarea', lvl: 2, q: 'Tabelul surselor (1): potrivește autorul cu lucrarea.', pairs: [
      ['Mauricius', 'Strategikon'], ['Moise Chorenati', 'Geografie armeană'], ['Cronică turcă', 'Oguzname'], ['Constantin al VII-lea Porfirogenetul', 'Despre administrarea imperiului']
    ], why: 'Rândurile 1–4 din tabelul surselor.' },
    { id: 'gm-e6', t: 'match', sec: 'etno-formarea', lvl: 2, q: 'Tabelul surselor (2): potrivește autorul cu lucrarea.', pairs: [
      ['Kekaumenos', 'Sfaturi și povestiri'], ['Gardizi', 'Podoaba istoriilor'], ['Ioniță cel Frumos', 'Corespondență cu papa']
    ], why: 'Rândurile 5, 6 și 9 din tabelul surselor.' },
    { id: 'gm-e7', t: 'match', sec: 'etno-formarea', lvl: 3, q: 'Tabelul surselor (3): potrivește autorul cu ce menționează despre români.', pairs: [
      ['Moise Chorenati', 'Țara Balak – Valahia'], ['Cronică turcă', 'Țară a vlahilor (Ulakili)'], ['Kekaumenos', 'Vlahii sud-dunăreni'], ['Gardizi', 'Așezare între Dunăre și un munte mare'], ['Ioniță cel Frumos', 'Originea etnică și mândria'], ['Simon de Keza', 'Păstorii romanilor']
    ], why: 'Coloana „Mențiunea referitoare la romanitatea românilor” din tabel.' },
    { id: 'go-e1', t: 'order', sec: 'etno-formarea', lvl: 2, q: 'Ordonează cronologic.', items: [
      { t: 'Sec I îHr – I dHr', k: 1 }, { t: '106 – 271: impusă Latina', k: 106 }, { t: '271 – 602: continuarea romanizării', k: 271 }, { t: '602: slavii trec Dunărea în S', k: 602 }, { t: 'Sec VIII: limba română se formase', k: 800 }, { t: 'Sec XIX: se constituie limba română literară', k: 1800 }
    ], why: 'Sec I îHr – I dHr → 106–271 → 271–602 → 602 → sec. VIII → sec. XIX.', src: ['106 – 271'] },
    { id: 'go-e2', t: 'order', sec: 'etno-politica', lvl: 2, q: 'Ordonează cronologic.', items: [
      { t: 'Coresi – Psaltire', k: 1570 }, { t: 'Supplex Libellus Valachorum', k: 1791 }, { t: '1848', k: 1848 }, { t: '1859', k: 1859 }, { t: '1877 – 1878', k: 1877 }, { t: '1918', k: 1918 }
    ], why: 'Coresi 1570 → Supplex 1791 → 1848 → 1859 → 1877–1878 → 1918.' },
    { id: 'go-e3', t: 'order', sec: 'etno-formarea', lvl: 3, q: 'Ordonează autorii din tabelul surselor după secol (de la cel mai vechi).', items: [
      { t: 'Mauricius (sec. VII)', k: 7 }, { t: 'Moise Chorenati (sec. IX)', k: 9 }, { t: 'Constantin al VII-lea Porfirogenetul (sec. X)', k: 10 }, { t: 'Kekaumenos (sec. XI)', k: 11 }, { t: 'Anonymus (sec. XII)', k: 12 }, { t: 'Simon de Keza (sec. XIII)', k: 13 }
    ], why: 'VII Mauricius, IX Moise Chorenati, X Constantin Porfirogenetul, XI Kekaumenos, XII Anonymus, XIII Simon de Keza.' },
    { id: 'gs-e1', t: 'sort', sec: 'etno-formarea', lvl: 1, q: 'Dialect sau grai?', buckets: ['Dialect', 'Grai'], items: [
      { t: 'Daco-român', b: 0 }, { t: 'Aromân', b: 0 }, { t: 'Istro-român', b: 0 }, { t: 'Megleno-român', b: 0 }, { t: 'Moldovenesc', b: 1 }, { t: 'Oltenesc', b: 1 }
    ], why: 'Dialecte: daco-român, aromân, istro-român, megleno-român. Graiuri: moldovenesc, oltenesc, etc.', src: ['Dialectele limbii române'] },
    { id: 'gs-e2', t: 'sort', sec: 'etno-comunista', lvl: 3, q: 'Istoriografia comunistă: împarte ideile pe perioade.', buckets: ['Teoriile staliniste', 'După 1965'], items: [
      { t: 'Caracterul imperialist și sclavagist al stăpânirii romane', b: 0 }, { t: 'Importanța civilizatoare a slavilor', b: 0 }, { t: 'Factorul roman este minimizat și considerat asupritor', b: 1 }, { t: 'Accentuată importanța factorului geto-dac', b: 1 }, { t: 'Supralicitată valoarea izvoarelor arheologice', b: 1 }
    ], why: 'Staliniste: stăpânire romană imperialistă/sclavagistă + rolul civilizator al slavilor. După 1965: roman minimizat, geto-dac accentuat, izvoare arheologice supralicitate.', src: ['Teoriile staliniste'] },

    /* ── Capitolul 2 ── */
    { id: 'gm-c1', t: 'match', sec: 'cal-europeni', lvl: 2, q: 'Potrivește autorul cu lucrarea.', pairs: [
      ['Miron Costin', 'De neamul moldovenilor'], ['Ion Neculce', 'O samă de cuvinte'], ['Dimitrie Cantemir', 'Creșterea și descreșterea Curții otomane'], ['Nicolaus Olahus', 'Hungaria'], ['Nicolae Milescu', 'Raportul soliei în China'], ['Constantin Cantacuzino', 'Istoria Țării Românești dintru început'], ['Dinicu Golescu', 'Însemnarea a călătoriei mele Constantin Radovici din Golești']
    ], why: 'Lucrările din „Peregrini și cronicari” și „Europeni și universaliști”.' },
    { id: 'gm-c2', t: 'match', sec: 'cal-europeni', lvl: 3, q: 'Potrivește persoana cu ce se spune despre ea.', pairs: [
      ['Nicolae Milescu', 'îi descrie pe mongoli și chinezi'], ['Dinicu Golescu', 'primul jurnal de călătorie'], ['Badea Cârțan', 'ajunge de trei ori la Roma'], ['Constantin Cantacuzino', 'argumentează continuitatea românilor'], ['Dimitrie Cantemir', 'studiază istorie, folclor, teologie islamică, muzică'], ['Nicolaus Olahus', 'susține caracterul latin al limbii române']
    ], why: 'Vezi „Europeni și universaliști”.' },
    { id: 'go-c1', t: 'order', sec: 'cal-europeni', lvl: 2, q: 'Ordonează după anul nașterii (de la cel mai vechi).', items: [
      { t: 'Nicolaus Olahus (1493)', k: 1493 }, { t: 'Grigore Ureche (1596)', k: 1596 }, { t: 'Nicolae Milescu (1636)', k: 1636 }, { t: 'Ion Neculce (1672)', k: 1672 }, { t: 'Dinicu Golescu (1777)', k: 1777 }, { t: 'Badea Cârțan (1849)', k: 1849 }
    ], why: 'Olahus 1493 → Ureche 1596 → Milescu 1636 → Neculce 1672 → Golescu 1777 → Cârțan 1849.' },
    { id: 'go-c2', t: 'order', sec: 'cal-europeni', lvl: 3, q: 'Ordonează toți cei 9 după anul nașterii.', items: [
      { t: 'Nicolaus Olahus (1493)', k: 1493 }, { t: 'Grigore Ureche (1596)', k: 1596 }, { t: 'Miron Costin (1633)', k: 1633 }, { t: 'Nicolae Milescu (1636)', k: 1636 }, { t: 'Constantin Cantacuzino (1640)', k: 1640 }, { t: 'Ion Neculce (1672)', k: 1672 }, { t: 'Dimitrie Cantemir (1673)', k: 1673 }, { t: 'Dinicu Golescu (1777)', k: 1777 }, { t: 'Badea Cârțan (1849)', k: 1849 }
    ], why: 'Anii nașterii: 1493, 1596, 1633, 1636, 1640, 1672, 1673, 1777, 1849.' },
    { id: 'gs-c1', t: 'sort', sec: 'cal-europeni', lvl: 2, q: 'În ce grupă din notițe sunt trecuți?', buckets: ['Cărturari (Peregrini și cronicari)', 'Europeni și universaliști'], items: [
      { t: 'Grigore Ureche', b: 0 }, { t: 'Miron Costin', b: 0 }, { t: 'Ion Neculce', b: 0 }, { t: 'Dimitrie Cantemir', b: 1 }, { t: 'Nicolaus Olahus', b: 1 }, { t: 'Nicolae Milescu', b: 1 }, { t: 'Constantin Cantacuzino', b: 1 }, { t: 'Dinicu Golescu', b: 1 }, { t: 'Badea Cârțan', b: 1 }
    ], why: 'Cărturari: Ureche, Costin, Neculce. Europeni și universaliști: Cantemir, Olahus, Milescu, Cantacuzino, Golescu, Cârțan.' }
  );
})(typeof window !== 'undefined' ? window : globalThis);
