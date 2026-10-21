/* Carduri (întrebare → răspuns) pentru capitolele 1 și 2. Tot conținutul vine din notițe.
   sec = secțiunea; src = fragmente din rândurile din notițe care stau la baza răspunsului. */
(function (g) {
  var D = (g.DATA = g.DATA || {});
  var L = 'list';
  (D.cardsSrc = D.cardsSrc || []).push(

    /* ── Capitolul 1: Etnogeneza românească ── */
    { id: 'e01', sec: 'etno-constiinta', kind: L, q: 'Din ce este alcătuită conștiința colectivă? (3 elemente)', items: ['Cultură de sinteză, originală', 'Ortodoxia', 'Romanitatea ⇒ nume'], src: ['Cultură de sinteză'] },
    { id: 'e02', sec: 'etno-constiinta', q: 'Ce fel de cultură face parte din conștiința colectivă?', a: 'O cultură **de sinteză, originală**.', src: ['Cultură de sinteză'] },
    { id: 'e03', sec: 'etno-constiinta', q: 'Ce conștiință apare la începutul Evului Mediu (titlu din notițe)?', a: 'Conștiința **romanității**.', src: ['Conștiința romanității la începutul'] },

    { id: 'e04', sec: 'etno-romanitate', q: 'Definește romanitatea (cele 2 sensuri din notițe).', a: '**1.** Totalitatea popoarelor romanice; lumea romană.\n**2.** Caracter roman sau romanic (al unui popor sau al unei culturi); origine, descendență romană.', src: ['Definiție (1. Totalitatea'] },
    { id: 'e05', sec: 'etno-romanitate', q: 'Romanitatea este caracteristica cărei identități?', a: 'A **identității lingvistice și culturale**.', src: ['Caracteristica identității'] },

    { id: 'e06', sec: 'etno-romanizarea', q: 'Definește romanizarea.', a: 'Proces **etno-lingvistic și cultural** prin care o populație cucerită adoptă cultura și civilizația și mai ales **limba cuceritorilor romani**, contribuind cu propriile elemente culturale și de civilizație la formarea unui nou popor (în cazul nostru, cel **daco-roman**).', src: ['Definiție (proces'] },
    { id: 'e07', sec: 'etno-romanizarea', q: 'Când a avut romanizarea intensitate mare și unde?', a: 'Între sec. **II – III**, atât la **sat**, cât și la **oraș**.', src: ['Între sec II – III'] },
    { id: 'e08', sec: 'etno-romanizarea', kind: L, q: 'Cele trei straturi ale limbii române și ce aduce fiecare', items: ['Substrat traco-dacic – cca 160 – 170 de cuvinte', 'Strat latin – gramatica și majoritatea cuvintelor', 'Adstrat slav – fonetică și vocabular'], src: ['Substrat traco-dacic'] },
    { id: 'e09', sec: 'etno-romanizarea', q: 'Câte cuvinte are limba română din substratul traco-dacic?', a: 'Cca **160 – 170** de cuvinte.', src: ['Substrat traco-dacic'] },
    { id: 'e10', sec: 'etno-romanizarea', q: 'Ce ne-a dat stratul latin?', a: '**Gramatica** și **majoritatea cuvintelor**.', src: ['Strat latin'] },
    { id: 'e11', sec: 'etno-romanizarea', q: 'Ce ne-a dat adstratul slav?', a: '**Fonetică** și **vocabular**.', src: ['Adstrat slav'] },

    { id: 'e12', sec: 'etno-formarea', kind: L, q: 'Etapele formării limbii române (4 repere de timp)', items: ['Sec I îHr – I dHr', '106 – 271 – impusă Latina', '271 – 602 – continuarea romanizării', '602 – slavii trec Dunărea în S'], src: ['106 – 271'] },
    { id: 'e13', sec: 'etno-formarea', q: 'Ce se întâmplă între 106 și 271?', a: 'Este **impusă Latina**.', src: ['106 – 271'] },
    { id: 'e14', sec: 'etno-formarea', q: 'Ce se întâmplă între 271 și 602?', a: '**Continuarea romanizării**.', src: ['271 – 602'] },
    { id: 'e15', sec: 'etno-formarea', q: 'Ce se întâmplă în 602 și ce urmări are?', a: '**Slavii trec Dunărea în S**.\nUrmări: fragmentarea comunităților locale, despărțirea de romanitatea nord-dunăreană.', src: ['602 - slavii', 'Fragmentarea comunităților'] },
    { id: 'e16', sec: 'etno-formarea', kind: L, q: 'Dialectele limbii române (4)', items: ['Daco-român – România, Moldova, Ucraina, alte state vecine', 'Aromân', 'Istro-român', 'Megleno-român'], src: ['Dialectele limbii române'] },
    { id: 'e17', sec: 'etno-formarea', q: 'Unde se vorbește dialectul daco-român?', a: 'În **România, Moldova, Ucraina, alte state vecine**.', src: ['Daco-român'] },
    { id: 'e18', sec: 'etno-formarea', q: 'Care sunt dialectele limbii române în afară de cel daco-român?', a: '**Aromân**, **istro-român**, **megleno-român**.', src: ['Aromân'] },
    { id: 'e19', sec: 'etno-formarea', q: 'Dă exemple de graiuri ale limbii române.', a: '**Moldovenesc**, **oltenesc**, etc.', src: ['Graiuri'] },
    { id: 'e20', sec: 'etno-formarea', q: 'Limba română literară: când s-a constituit și pe ce se bazează?', a: 'S-a constituit în **sec. XIX**; are la bază **graiul din Muntenia** și **opere literare din Moldova**.', src: ['Constituită în secolul', 'Are la bază graiul'] },
    { id: 'e21', sec: 'etno-formarea', q: 'Până în ce secol se formase limba română? (subliniat în notițe)', a: '**Sec. VIII** – limba română se formase.', src: ['Sec VIII'] },
    { id: 'e22', sec: 'etno-formarea', q: 'Cum ne numim noi singuri?', a: '**Români**.', src: ['Noi ne numim singuri'] },
    { id: 'e23', sec: 'etno-formarea', q: 'Ce păstrăm în folclor?', a: 'Amintirea **descălecării lui Traian**.', src: ['Păstrăm în folclor'] },
    { id: 'e24', sec: 'etno-formarea', q: 'Cum sunt numiți strămoșii noștri de către alte popoare?', a: '**Vlahi, valahi, olahi** …', src: ['Sunt numiți strămoșii'] },
    { id: 'e25', sec: 'etno-formarea', q: 'Unde s-au format poporul și limba română? (subliniat în notițe)', a: 'La **N și S de Dunăre**.', src: ['Poporul și limba română s-au format'] },
    { id: 'e26', sec: 'etno-formarea', q: 'Ce rol a avut creștinismul și cum a fost el?', a: 'Factor esențial al **romanizării**; de factură **populară**; de orientare **miceniană** (așa apare în notițe).', src: ['Factor esențial', 'De factură populară', 'De orientare miceniană'] },
    { id: 'e27', sec: 'etno-formarea', q: 'Cine remarcă originea latină a românilor, potrivit notițelor?', a: '**Călători străini** și **cărturarii medievali**.', src: ['Călători străini și cărturarii'] },

    { id: 'e28', sec: 'etno-xiv-xvi', q: 'Ce preocupări apar în sec. XIV – XVI?', a: '**Argumentarea originii romane**.', src: ['preocupări pt argumentarea'] },
    { id: 'e29', sec: 'etno-xiv-xvi', q: 'Cum ne spunem noi înșine în sec. XIV – XVI?', a: '**Rumâni**.', src: ['noi ne spunem rumâni'] },
    { id: 'e30', sec: 'etno-xiv-xvi', q: 'Din ce secol se afirmă limba română scrisă?', a: 'Din **sec. XVI**.', src: ['din sec XVI se afirmă'] },
    { id: 'e31', sec: 'etno-xiv-xvi', q: 'N. Olahus: ce idee susține și ce argument aduce?', a: 'Susține ideea **unității neamului, a limbii și religiei**; argument: **originea**.', src: ['Susține ideea unității', 'Argument: originea'] },
    { id: 'e32', sec: 'etno-xiv-xvi', q: 'Coresi: ce an și ce lucrare sunt menționate?', a: '**1570** – **Psaltire**.', src: ['Coresi'] },

    { id: 'e33', sec: 'etno-xvii', q: 'G. Ureche: cu ce contribuie?', a: 'Contribuie la dezvoltarea **conștiinței de neam**.', src: ['G Ureche'] },
    { id: 'e34', sec: 'etno-xvii', q: 'M. Costin: ce lucrări apar în listă și ce idee îl caracterizează?', a: '**Letopisețul Țării Moldovei**; **De neamul moldovenilor**.\nAccent pe **originea neamului**.', src: ['Letopisețul Țării Moldovei', 'De neamul moldovenilor', 'Accent pe originea'] },
    { id: 'e35', sec: 'etno-xvii', q: 'Cine are, în această listă, „Istoria Țării Românești”?', a: '**C-tin Cantacuzino**.', src: ['C-tin Cantacuzino'] },
    { id: 'e36', sec: 'etno-xvii', q: 'D. Cantemir: ce lucrări apar în listă și ce idee susține?', a: '**Descrierea Moldovei**; **Hronicul româno-moldo-vlahilor**.\nSusține ideea **originii pur romane**.', src: ['Descrierea Moldovei', 'Hronicul româno', 'Susține ideea originii'] },
    { id: 'e37', sec: 'etno-xvii', q: 'Care autor din listă susține ideea originii „pur” romane?', a: '**D. Cantemir**.', src: ['Susține ideea originii'] },
    { id: 'e38', sec: 'etno-xvii', q: 'Despre care autor din listă scrie exact „accent pe originea neamului”?', a: '**M. Costin**.', src: ['Accent pe originea'] },

    { id: 'e39', sec: 'etno-politica', q: 'Când apar primele semne ale conștiinței naționale?', a: 'La sfârșitul sec. **XVII** și începutul sec. **XVIII**.', src: ['Sf sec XVII'] },
    { id: 'e40', sec: 'etno-politica', q: 'Între cine sunt interese contradictorii în Transilvania?', a: 'Între **români, unguri și austrieci**.', src: ['Interese contradictorii'] },
    { id: 'e41', sec: 'etno-politica', q: 'Cum sunt priviți românii în Transilvania și cum justifică ungurii acest lucru?', a: 'Românii sunt doar **tolerați**, ceea ce ungurii justifică prin **Ortodoxia** românilor și prin **întâietatea** lor (a ungurilor) aici.', src: ['Românii sunt doar tolerați', 'Ortodoxia noastră', 'lor aici'] },
    { id: 'e42', sec: 'etno-politica', q: 'Ce este lupta pentru întâietate?', a: 'Lupta pentru **drepturi politice**.', src: ['Lupta pentru întâietate'] },
    { id: 'e43', sec: 'etno-politica', q: 'Inochentie Micu: cum își argumentează cererile politice?', a: 'Prin **vechimea și continuitatea neamului** ⇒ teoriile ce contestă întâietatea (așa e scris în notițe).', src: ['Inochentie Micu'] },
    { id: 'e44', sec: 'etno-politica', q: 'Școala Ardeleană: ce accent pune?', a: 'Accent pe **originea latină**.', src: ['Școala Ardeleană'] },
    { id: 'e45', sec: 'etno-politica', q: 'Supplex Libellus Valachorum: ce an și ce idee?', a: '**1791** – ideea romanității românilor: **o armă politică**.', src: ['Supplex Libellus'] },
    { id: 'e46', sec: 'etno-politica', q: 'Ce a dat un imbold luptei pentru drepturi a românilor?', a: '**Unirea cu Roma**.', src: ['Unirea cu Roma'] },
    { id: 'e47', sec: 'etno-politica', kind: L, q: 'Când se afirmă conștiința de neam? (4 momente)', items: ['1848', '1859', '1877 – 1878', '1918'], src: ['Conștiința de neam se afirmă'] },

    { id: 'e48', sec: 'etno-roesler', kind: L, q: 'Ce două teorii sunt trecute sub titlul „Teoria lui Roesler”?', items: ['Teorie imigraționistă', 'Teoria continuității'], src: ['Teorie imigraționistă', 'Teoria continuității'] },
    { id: 'e49', sec: 'etno-roesler', q: 'Ce a contribuit la consolidarea conștiinței naționale (la teoria continuității)?', a: '**Domnia lui A.I. Cuza**.', src: ['Domnia lui'] },
    { id: 'e50', sec: 'etno-roesler', q: 'Ce se întâmplă după 1918 cu disputa și cine scrie lucrări?', a: 'Disputa **continuă** ⇒ alte lucrări: **Iorga, Pârvan, Gh Brătianu**.', src: ['După 1918'] },

    { id: 'e51', sec: 'etno-comunista', q: 'Ce erau Ungaria și România în perioada comunistă?', a: '**State satelit ale URSS**.', src: ['Ungaria și România'] },
    { id: 'e52', sec: 'etno-comunista', q: 'Ce teorii se impun în istoriografia comunistă?', a: '**Teoriile staliniste**.', src: ['Teoriile staliniste'] },
    { id: 'e53', sec: 'etno-comunista', kind: L, q: 'Teoriile staliniste: care sunt cele 2 idei?', items: ['Caracterul imperialist și sclavagist al stăpânirii romane', 'Importanța civilizatoare a slavilor'], src: ['Caracterul imperialist', 'Importanța civilizatoare'] },
    { id: 'e54', sec: 'etno-comunista', q: 'Ce se dorește după 1965?', a: 'Revitalizarea **sentimentului național**.', src: ['După 1965'] },
    { id: 'e55', sec: 'etno-comunista', kind: L, q: 'După 1965: ce 3 schimbări apar în felul de a privi trecutul?', items: ['Factorul roman este minimizat și considerat asupritor', 'Accentuată importanța factorului geto – dac', 'Supralicitată valoarea izvoarelor arheologice'], src: ['Factorul roman este minimizat'] },
    { id: 'e56', sec: 'etno-comunista', q: 'Ce ar trebui să se întâmple cu disputa politică despre romanitate după aderarea la UE?', a: 'Nu ar mai trebui să aibă **conținut**.', src: ['După aderarea la UE'] },

    /* ── Capitolul 2: Călători români acasă și în lume ── */
    { id: 'c01', sec: 'cal-peregrini', q: 'Când apar primii peregrini și cronicari?', a: 'În **sec. XVI**.', src: ['Primii – sec'] },
    { id: 'c02', sec: 'cal-peregrini', kind: L, q: 'Cauzele călătoriilor (3)', items: ['diplomatice', 'culturale', 'pribegie'], src: ['Cauze călătorii'] },
    { id: 'c03', sec: 'cal-peregrini', kind: L, q: 'Preocupările călătorilor și cronicarilor (2)', items: ['reflectă starea societății românești', 'comparații cu „ceilalți”'], src: ['reflectă starea', 'comparații cu'] },

    { id: 'c04', sec: 'cal-peregrini', q: 'Grigore Ureche: în ce ani a trăit și ce lucrare a scris?', a: '**1596 – 1647**; „**Letopisețul Țării Moldovei**”.', src: ['Grigore Ureche', 'Letopisețul Țării Moldovei'] },
    { id: 'c05', sec: 'cal-peregrini', q: 'Grigore Ureche: ce stil are și ce idee susține?', a: 'Stil **narator**, asemănător celui **oral**; ideea **latinității** limbii române.', src: ['Stil narator', 'Ideea latinității'] },
    { id: 'c06', sec: 'cal-peregrini', q: 'Miron Costin: în ce ani a trăit și ce lucrări apar în notițe?', a: '**1633 – 1691**; „**Istoria Țării Moldovei**” și „**De neamul moldovenilor**”.', src: ['Miron Costin', 'Istoria Țării Moldovei', 'De neamul moldovenilor'] },
    { id: 'c07', sec: 'cal-peregrini', q: 'Miron Costin: ce rol are și ce idei susține?', a: '**Deschizător de drumuri** în istorie, geografie istorică, etnografie; ideea **originii romane** și a **unității neamului**.', src: ['Deschizător de drumuri', 'Ideea originii romane'] },
    { id: 'c08', sec: 'cal-peregrini', q: 'Ion Neculce: în ce ani a trăit și ce lucrări apar în notițe?', a: '**1672 – 1745**; „**Letopisețul Țării Moldovei**” și „**O samă de cuvinte**”.', src: ['Ion Neculce', 'O samă de cuvinte'] },

    { id: 'c09', sec: 'cal-europeni', q: 'Dimitrie Cantemir: în ce ani a trăit și ce lucrare apare în notițe?', a: '**1673 – 1723**; „**Creșterea și descreșterea Curții otomane**”.', src: ['Dimitrie Cantemir', 'Creșterea și descreșterea'] },
    { id: 'c10', sec: 'cal-europeni', q: 'Ce domenii studiază Dimitrie Cantemir?', a: '**Istorie, folclor, teologie islamică, muzică**.', src: ['Studiază: istorie'] },
    { id: 'c11', sec: 'cal-europeni', q: 'Nicolaus Olahus: în ce ani a trăit și ce lucrare a scris?', a: '**1493 – 1568**; „**Hungaria**”.', src: ['Nicolaus Olahus', 'Hungaria'] },
    { id: 'c12', sec: 'cal-europeni', q: 'Nicolaus Olahus: ce susține?', a: 'Susține **caracterul latin** al limbii române și **unitatea de neam**.', src: ['Susține caracterul latin'] },
    { id: 'c13', sec: 'cal-europeni', q: 'Nicolae Milescu: în ce ani a trăit și ce lucrări apar în notițe?', a: '**1636 – 1708**; „**Raportul soliei în China**” și „**Descrierea Chinei**”.', src: ['Nicolae Milescu', 'Raportul soliei', 'Descrierea Chinei'] },
    { id: 'c14', sec: 'cal-europeni', q: 'Nicolae Milescu: cine a fost (ce profesii) și ce a făcut?', a: '**Poliglot**, teolog, istoriograf, filozof, memorialist, scriitor; autor de **hărți**; îi descrie pe **mongoli** și **chinezi**.', src: ['Poliglot', 'Autor de hărți', 'Îi descrie pe mongoli'] },
    { id: 'c15', sec: 'cal-europeni', q: 'Constantin Cantacuzino: în ce ani a trăit și ce lucrare a scris?', a: '**1640 – 1716**; „**Istoria Țării Românești dintru început**”.', src: ['Constantin Cantacuzino', 'Istoria Țării Românești dintru'] },
    { id: 'c16', sec: 'cal-europeni', q: 'Constantin Cantacuzino: ce argumentează și ce hartă a făcut?', a: 'Argumentează **continuitatea** românilor; **hartă** a Țării Românești.', src: ['Argumentează continuitatea', 'Hartă a Țării Românești'] },
    { id: 'c17', sec: 'cal-europeni', q: 'Dinicu Golescu: în ce ani a trăit și ce lucrare a scris?', a: '**1777 – 1830**; „**Însemnarea a călătoriei mele Constantin Radovici din Golești**”.', src: ['Dinicu Golescu', 'Însemnarea a călătoriei'] },
    { id: 'c18', sec: 'cal-europeni', q: 'Dinicu Golescu: de ce este important?', a: '**Primul jurnal de călătorie**; sprijină **învățământul**.', src: ['Primul jurnal', 'Sprijină învățământul'] },
    { id: 'c19', sec: 'cal-europeni', q: 'Badea Cârțan: în ce ani a trăit și ce făcea?', a: '**1849 – 1911**; călătorește pentru a duce **carte românească** în **Ardeal**; ajunge de **trei ori** la **Roma**.', src: ['Badea Cârțan', 'Călătorește pentru', 'Ajunge de trei ori'] },

    /* „Cine este?” */
    { id: 'c20', sec: 'cal-peregrini', q: 'Cine a scris „De neamul moldovenilor”?', a: '**Miron Costin**.', src: ['De neamul moldovenilor'] },
    { id: 'c21', sec: 'cal-peregrini', q: 'Cine a scris „O samă de cuvinte”?', a: '**Ion Neculce**.', src: ['O samă de cuvinte'] },
    { id: 'c22', sec: 'cal-peregrini', q: 'Cine are stilul narator, asemănător celui oral?', a: '**Grigore Ureche**.', src: ['Stil narator'] },
    { id: 'c23', sec: 'cal-peregrini', q: 'Cine este „deschizător de drumuri în istorie, geografie istorică, etnografie”?', a: '**Miron Costin**.', src: ['Deschizător de drumuri'] },
    { id: 'c24', sec: 'cal-peregrini', q: 'Ale cui lucrări poartă titlul „Letopisețul Țării Moldovei” în aceste notițe?', a: 'Ale lui **Grigore Ureche** și **Ion Neculce** (și M. Costin, în lista din C1 L1+2).', src: ['Letopisețul Țării Moldovei'] },
    { id: 'c25', sec: 'cal-europeni', q: 'Cine a scris „Creșterea și descreșterea Curții otomane”?', a: '**Dimitrie Cantemir**.', src: ['Creșterea și descreșterea'] },
    { id: 'c26', sec: 'cal-europeni', q: 'Cine a scris „Hungaria”?', a: '**Nicolaus Olahus**.', src: ['Hungaria'] },
    { id: 'c27', sec: 'cal-europeni', q: 'Cine a scris „Raportul soliei în China” și „Descrierea Chinei”?', a: '**Nicolae Milescu**.', src: ['Raportul soliei'] },
    { id: 'c28', sec: 'cal-europeni', q: 'Cine a scris „Istoria Țării Românești dintru început”?', a: '**Constantin Cantacuzino**.', src: ['Istoria Țării Românești dintru'] },
    { id: 'c29', sec: 'cal-europeni', q: 'Cine a scris „Însemnarea a călătoriei mele Constantin Radovici din Golești”?', a: '**Dinicu Golescu**.', src: ['Însemnarea a călătoriei'] },
    { id: 'c30', sec: 'cal-europeni', q: 'Cine a făcut o hartă a Țării Românești?', a: '**Constantin Cantacuzino**.', src: ['Hartă a Țării Românești'] },
    { id: 'c31', sec: 'cal-europeni', q: 'Cine este autor de hărți și îi descrie pe mongoli și chinezi?', a: '**Nicolae Milescu**.', src: ['Autor de hărți'] },
    { id: 'c32', sec: 'cal-europeni', q: 'Cine a scris primul jurnal de călătorie?', a: '**Dinicu Golescu**.', src: ['Primul jurnal'] },
    { id: 'c33', sec: 'cal-europeni', q: 'Cine a dus carte românească în Ardeal și a ajuns de trei ori la Roma?', a: '**Badea Cârțan**.', src: ['Călătorește pentru'] },
    { id: 'c34', sec: 'cal-europeni', q: 'Cine studiază istorie, folclor, teologie islamică și muzică?', a: '**Dimitrie Cantemir**.', src: ['Studiază: istorie'] },
    { id: 'c35', sec: 'cal-europeni', q: 'Cine sprijină învățământul?', a: '**Dinicu Golescu**.', src: ['Sprijină învățământul'] },
    { id: 'c36', sec: 'cal-europeni', q: 'Cine este poliglot, teolog, istoriograf, filozof, memorialist și scriitor?', a: '**Nicolae Milescu**.', src: ['Poliglot'] },
    { id: 'c37', sec: 'cal-europeni', kind: L, q: 'Grupa „Europeni și universaliști” din notițe (6 persoane)', items: ['Dimitrie Cantemir (1673 – 1723)', 'Nicolaus Olahus (1493 – 1568)', 'Nicolae Milescu (1636 – 1708)', 'Constantin Cantacuzino (1640 – 1716)', 'Dinicu Golescu (1777 – 1830)', 'Badea Cârțan (1849 - 1911)'], src: ['Dimitrie Cantemir'] },
    { id: 'c38', sec: 'cal-peregrini', kind: L, q: 'Cărturarii din grupa „Peregrini și cronicari” (3 persoane, cu ani)', items: ['Grigore Ureche (1596 – 1647)', 'Miron Costin (1633 – 1691)', 'Ion Neculce (1672 – 1745)'], src: ['Grigore Ureche'] }
  );
})(typeof window !== 'undefined' ? window : globalThis);
