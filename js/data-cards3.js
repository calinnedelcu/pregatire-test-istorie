/* Capitolul 3 (Marile descoperiri): carduri, întrebări, jocuri, axa timpului și trucuri. */
(function (g) {
  var D = (g.DATA = g.DATA || {});
  var L = 'list';
  D.pools = Object.assign(D.pools || {}, {
    descoperitori: ['Bartolomeu Diaz', 'Vasco da Gama', 'Cabral', 'Columb', 'Magellan', 'Amerigo Vespucci', 'Henric Navigatorul'],
    descoperiri: ['Capul Bunei Speranțe', 'India', 'Brazilia', 'America', 'înconjurul lumii', 'numele Americii'],
    aniDesc: ['1488', '1492', '1494', '1497', '1498', '1500', '1519', '1522']
  });

  (D.cardsSrc = D.cardsSrc || []).push(
    { id: 'd01', sec: 'desc-intro', q: 'Între ce secole au loc descoperirile (titlul din caietul 3)?', a: 'Între sec. **XV – XVIII**.', src: ['între sec.'] },
    { id: 'd02', sec: 'desc-intro', kind: L, q: 'Filmele trecute în notițe (2)', items: ['„Cucerirea paradisului”', '„Apocalipto”'], src: ['Cucerirea paradisului'] },

    { id: 'd03', sec: 'desc-cauze', kind: L, q: 'Cauzele descoperirilor (9 puncte)', items: ['Ideea că Pământul este sferic', 'Spiritul de aventură; existența unor personalități puternice', 'Nevoia de aur', 'Centralizarea statală', 'Expansiunea teritorială', 'Dezvoltarea economică', 'Răspândirea creștinismului', 'Progrese tehnice', 'Expansiunea otomană'], src: ['Ideea că Pământul'] },
    { id: 'd04', sec: 'desc-cauze', kind: L, q: 'Progresele tehnice (5)', items: ['apariția unor portulane / hărți mai bune', 'cârma dublă', 'apariția busolei', 'apariția astrolabului', 'apariția caravelei'], src: ['Progrese tehnice'] },
    { id: 'd05', sec: 'desc-cauze', q: 'Care cauză are legătură cu un imperiu?', a: '**Expansiunea otomană**.', src: ['Expansiunea otomană'] },
    { id: 'd06', sec: 'desc-cauze', q: 'Care cauză ține de ideea despre forma Pământului?', a: 'Ideea că **Pământul este sferic**. (Demonstrarea lui apare la consecințe.)', src: ['Ideea că Pământul'] },
    { id: 'd07', sec: 'desc-cauze', q: 'Ce punct din lista de cauze ține de oameni?', a: '**Spiritul de aventură**; existența unor **personalități puternice**.', src: ['Spiritul de aventură'] },
    { id: 'd08', sec: 'desc-cauze', q: 'Ce trei cauze sunt legate între ele printr-o săgeată în caietul 1?', a: '**Centralizarea statală**, **expansiunea teritorială**, **dezvoltarea economică** (săgeată curbă, cu vârf la ambele capete, care începe sub „nevoia de aur”).', src: ['Centralizarea statală', 'Expansiunea teritorială', 'Dezvoltarea economică'] },
    { id: 'd09', sec: 'desc-cauze', q: 'Ce apare atât la cauze, cât și la consecințe, în legătură cu religia?', a: '**Răspândirea creștinismului**: e și cauză, și consecință.', src: ['Răspândirea creștinismului'] },
    { id: 'd10', sec: 'desc-cauze', q: 'Cauză și consecință: ce se spune despre forma Pământului în fiecare listă?', a: 'Cauză: **ideea** că Pământul este sferic. Consecință: **se demonstrează** că Pământul este sferic.', src: ['Ideea că Pământul', 'desc-consecinte#Se demonstrează'] },

    { id: 'd11', sec: 'desc-consecinte', kind: L, q: 'Consecințele descoperirilor (8 puncte)', items: ['Începe comerțul cu sclavi', 'Mor mulți amerindieni (90% din amerindieni mor de la boli / exterminări…)', 'Apar imperii coloniale', 'Centrul de greutate al comerțului se mută din Mediterană în Atlantic ⇒ se dezvoltă țările cu ieșire la Atlantic (la ocean)', 'Se răspândește creștinismul', 'Se demonstrează că Pământul este sferic', 'Nou impuls dat curiozității, cercetării, științei', 'Biserica este afectată'], src: ['Începe comerțul cu sclavi'] },
    { id: 'd12', sec: 'desc-consecinte', q: 'Ce se întâmplă cu centrul de greutate al comerțului și ce urmează?', a: 'Se mută din **Mediterană** în **Atlantic** ⇒ se dezvoltă **țările cu ieșire la Atlantic** (la ocean).', src: ['Centrul de greutate'] },
    { id: 'd13', sec: 'desc-consecinte', q: 'Ce procent din amerindieni mor și de ce (caietul 3)?', a: '**90%**, de la **boli** / exterminări…', src: ['90% din amerindieni'] },
    { id: 'd14', sec: 'desc-consecinte', q: 'Ce comerț începe în urma descoperirilor?', a: 'Comerțul cu **sclavi**.', src: ['Începe comerțul cu sclavi'] },
    { id: 'd15', sec: 'desc-consecinte', q: 'Ce fel de imperii apar?', a: 'Imperii **coloniale**.', src: ['Apar imperii coloniale'] },
    { id: 'd16', sec: 'desc-consecinte', q: 'Ce primește un nou impuls?', a: '**Curiozitatea**, **cercetarea** și **știința** (în caietul 3: „curiozit., cercet., științ.”).', src: ['Un nou impuls'] },
    { id: 'd17', sec: 'desc-consecinte', q: 'Ce instituție este afectată de descoperiri?', a: '**Biserica**.', src: ['Biserica'] },
    { id: 'd18', sec: 'desc-consecinte', q: 'Ce se demonstrează prin descoperiri?', a: 'Că **Pământul este sferic** (rotund).', src: ['Se demonstrează'] },

    { id: 'd19', sec: 'desc-mari', kind: L, q: 'Marile descoperiri, cu anii, în ordine cronologică', items: ['1488 – Bartolomeu Diaz – Capul Bunei Speranțe', '1492 – Columb – America', '1494 – Tratatul de la Tordesillas (Papa împarte lumea în 2)', '1498 (1497 în caietul 2) – Vasco da Gama – India', '1500 – Cabral – Brazilia', '1519 – 1522 – Magellan – înconjurul lumii'], src: ['1488', '1492', 'Papa'] },
    { id: 'd20', sec: 'desc-mari', q: 'Cine este Henric Navigatorul în notițe și ce a sprijinit?', a: 'Rege al **Portugaliei**; a sprijinit **coasta Africii**.', src: ['Henric Navigatorul'] },
    { id: 'd21', sec: 'desc-mari', q: '1488: cine și ce?', a: '**Bartolomeu Diaz** – **Capul Bunei Speranțe**.', src: ['1488'] },
    { id: 'd22', sec: 'desc-mari', q: '1492: cine și ce?', a: '**Columb** – **America**.', src: ['1492'] },
    { id: 'd23', sec: 'desc-mari', q: '1494: ce se întâmplă?', a: '**Papa** împarte lumea în 2 – **Tratatul de la Tordesillas**.', src: ['Papa'] },
    { id: 'd24', sec: 'desc-mari', q: 'Vasco da Gama: ce an și ce loc?', a: '**1498** (anul ajungerii; a plecat din Lisabona în 1497, cum scrie caietul 2) – **India**.', src: ['Vasco da Gama'] },
    { id: 'd25', sec: 'desc-mari', q: '1500: cine și ce?', a: '**Cabral** – **Brazilia**.', src: ['1500'] },
    { id: 'd26', sec: 'desc-mari', q: '1519 – 1522: cine și ce?', a: '**Magellan** – **înconjurul lumii**.', src: ['Magellan'] },
    { id: 'd27', sec: 'desc-mari', q: 'Cine a ajuns la Capul Bunei Speranțe și când?', a: '**Bartolomeu Diaz**, în **1488**.', src: ['1488'] },
    { id: 'd28', sec: 'desc-mari', q: 'Cine a ajuns în India și când?', a: '**Vasco da Gama**, în **1498** (anul ajungerii; plecarea din Lisabona: 1497, cum scrie caietul 2).', src: ['Vasco da Gama'] },
    { id: 'd29', sec: 'desc-mari', q: 'Cine a ajuns în Brazilia și când?', a: '**Cabral**, în **1500**.', src: ['1500'] },
    { id: 'd30', sec: 'desc-mari', q: 'Cine a făcut înconjurul lumii și când?', a: '**Magellan**, în **1519 – 1522**.', src: ['Magellan'] },
    { id: 'd31', sec: 'desc-mari', q: 'Cine a ajuns în America și când?', a: '**Columb**, în **1492**.', src: ['1492'] },
    { id: 'd32', sec: 'desc-mari', q: 'Al cui nume a ajuns să denumească America și ce a înțeles el?', a: '**Amerigo Vespucci**: numele Americii; își dă seama că **s-a descoperit** un nou continent.', src: ['Amerigo Vespucci'] },
    { id: 'd33', sec: 'desc-mari', q: 'Cine împarte lumea în 2 în 1494 și prin ce act?', a: '**Papa**, prin **Tratatul de la Tordesillas**.', src: ['Papa'] },

    { id: 'd34', sec: 'desc-romani', kind: L, q: 'Românii trecuți la finalul lecției (3)', items: ['Spătarul Nicolae Milescu – China', 'Badea Cârțan – merge la Roma', 'Dimitrie Cantemir – (nu e scris nimic în notițe)'], src: ['Nicolae Milescu'] },
    { id: 'd35', sec: 'desc-romani', q: 'Spătarul Nicolae Milescu: ce loc?', a: '**China**.', src: ['Nicolae Milescu'] },
    { id: 'd36', sec: 'desc-romani', q: 'Badea Cârțan: unde merge (ultima listă din caiet)?', a: 'La **Roma**.', src: ['Badea Cârțan'] }
  );

  (D.quizSrc = D.quizSrc || []).push(
    { id: 'qd01', t: 'mcq', sec: 'desc-mari', lvl: 1, q: 'Cine a ajuns în **India** (1498)?', ok: 'Vasco da Gama', pool: 'descoperitori', why: '1498 – Vasco da Gama – India.', src: ['Vasco da Gama'] },
    { id: 'qd02', t: 'mcq', sec: 'desc-mari', lvl: 1, q: 'Cine a ajuns în **America** în 1492?', ok: 'Columb', pool: 'descoperitori', why: '1492 – Columb – America.', src: ['1492'] },
    { id: 'qd03', t: 'mcq', sec: 'desc-mari', lvl: 1, q: 'În ce an a ajuns **Bartolomeu Diaz** la Capul Bunei Speranțe?', ok: '1488', bad: ['1492', '1494', '1500'], why: '1488 – Bartolomeu Diaz – Capul Bunei Speranțe.', src: ['1488'] },
    { id: 'qd04', t: 'mcq', sec: 'desc-mari', lvl: 1, q: 'Cine a ajuns în **Brazilia** în 1500?', ok: 'Cabral', pool: 'descoperitori', why: '1500 – Cabral – Brazilia.', src: ['1500'] },
    { id: 'qd05', t: 'mcq', sec: 'desc-mari', lvl: 1, q: 'Cine a făcut **înconjurul lumii** (1519 – 1522)?', ok: 'Magellan', pool: 'descoperitori', why: '1519–1522 – Magellan – înconjurul lumii.', src: ['Magellan'] },
    { id: 'qd06', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Ce act din 1494 împarte lumea în două?', ok: 'Tratatul de la Tordesillas', bad: ['Tratatul de la Utrecht', 'Tratatul de la Paris', 'Pacea de la Augsburg'], why: 'Papa împarte lumea în 2 în 1494 – Tratatul de la Tordesillas.', src: ['Papa'] },
    { id: 'qd07', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Cine împarte lumea în două în 1494?', ok: 'Papa', bad: ['Regele Portugaliei', 'Columb', 'Regele Spaniei'], why: 'Papa împarte lumea în 2 în 1494.', src: ['Papa'] },
    { id: 'qd08', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Al cui nume a primit continentul America?', ok: 'Amerigo Vespucci', pool: 'descoperitori', why: 'Amerigo Vespucci – numele Americii.', src: ['Amerigo Vespucci'] },
    { id: 'qd09', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Ce a descoperit **Bartolomeu Diaz** (1488)?', ok: 'Capul Bunei Speranțe', bad: ['India', 'Brazilia', 'America'], why: '1488 – Bartolomeu Diaz – Capul Bunei Speranțe.', src: ['1488'] },
    { id: 'qd10', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Ce a descoperit **Cabral** în 1500?', ok: 'Brazilia', bad: ['India', 'Capul Bunei Speranțe', 'America'], why: '1500 – Cabral – Brazilia.', src: ['1500'] },
    { id: 'qd11', t: 'mcq', sec: 'desc-mari', lvl: 2, q: 'Care e rolul lui **Henric Navigatorul** în notițe?', ok: 'Rege al Portugaliei care a sprijinit coasta Africii', bad: ['Rege al Spaniei care a finanțat călătoria lui Columb', 'Papă care a împărțit lumea în 1494', 'Navigator care a înconjurat lumea'], why: 'Henric Navigatorul – rege al Portugaliei – coasta Africii.', src: ['Henric Navigatorul'] },
    { id: 'qd12', t: 'tf', sec: 'desc-mari', lvl: 1, q: 'Magellan a făcut înconjurul lumii între 1519 și 1522.', a: true, why: '1519–1522 – Magellan – înconjurul lumii.', src: ['Magellan'] },
    { id: 'qd13', t: 'tf', sec: 'desc-mari', lvl: 2, q: 'Columb a ajuns în America în 1488.', a: false, why: 'Columb – America în 1492. 1488 este anul lui Bartolomeu Diaz la Capul Bunei Speranțe.', src: ['1492'] },
    { id: 'qd14', t: 'tf', sec: 'desc-mari', lvl: 2, q: 'Potrivit notițelor, Cabral este trecut cu Brazilia în anul 1498.', a: false, why: 'Cabral – Brazilia, 1500. Anul 1498 este al lui Vasco da Gama (India).', src: ['1500'] },
    { id: 'qd15', t: 'type', sec: 'desc-mari', lvl: 1, q: 'Scrie anul în care Papa împarte lumea în două (Tordesillas).', a: ['1494'], why: 'Tratatul de la Tordesillas – 1494.', src: ['Papa'] },
    { id: 'qd16', t: 'type', sec: 'desc-mari', lvl: 1, q: 'Scrie anul în care Columb ajunge în America.', a: ['1492'], why: '1492 – Columb – America.', src: ['1492'] },
    { id: 'qd17', t: 'type', sec: 'desc-mari', lvl: 1, q: 'Scrie anul în care Cabral ajunge în Brazilia.', a: ['1500'], why: '1500 – Cabral – Brazilia.', src: ['1500'] },
    { id: 'qd18', t: 'type', sec: 'desc-mari', lvl: 2, q: 'Cine a ajuns în India în 1498? (scrie numele)', a: ['Vasco da Gama', 'da Gama', 'Gama'], why: 'Vasco da Gama – India.', src: ['Vasco da Gama'] },
    { id: 'qd19', t: 'mcq', sec: 'desc-mari', lvl: 3, q: 'În ce an a ajuns Vasco da Gama în India, potrivit caietelor 1 și 3?', ok: '1498', bad: ['1488', '1492', '1500'], why: 'Caietele 1 și 3 scriu 1498, anul ajungerii în India; caietul 2 scrie 1497, anul plecării din Lisabona.', src: ['Vasco da Gama'] },

    { id: 'qd20', t: 'multi', sec: 'desc-cauze', lvl: 2, q: 'Care dintre acestea sunt **cauze** ale descoperirilor?', opts: [{ t: 'Ideea că Pământul este sferic', ok: true }, { t: 'Nevoia de aur', ok: true }, { t: 'Centralizarea statală', ok: true }, { t: 'Expansiunea otomană', ok: true }, { t: 'Începutul comerțului cu sclavi', ok: false }, { t: 'Apariția imperiilor coloniale', ok: false }, { t: 'Afectarea Bisericii', ok: false }], why: 'Cauze: Pământ sferic, aventură, aur, centralizare, expansiune teritorială, dezvoltare economică, creștinism, progrese tehnice, expansiunea otomană. Sclavii, imperiile coloniale și Biserica afectată sunt consecințe.', src: ['Nevoia de aur'] },
    { id: 'qd21', t: 'multi', sec: 'desc-consecinte', lvl: 2, q: 'Care dintre acestea sunt **consecințe** ale descoperirilor?', opts: [{ t: 'Începutul comerțului cu sclavi', ok: true }, { t: 'Apariția imperiilor coloniale', ok: true }, { t: 'Mutarea centrului de greutate al comerțului în Atlantic', ok: true }, { t: 'Afectarea Bisericii', ok: true }, { t: 'Nevoia de aur', ok: false }, { t: 'Apariția busolei', ok: false }, { t: 'Apariția caravelei', ok: false }], why: 'Consecințe: sclavi, imperii coloniale, mutarea comerțului în Atlantic, Biserica afectată (și altele). Aurul, busola și caravela sunt cauze.', src: ['Începe comerțul cu sclavi'] },
    { id: 'qd22', t: 'multi', sec: 'desc-cauze', lvl: 2, q: 'Care dintre acestea sunt **progrese tehnice** din lista de cauze?', opts: [{ t: 'Busola', ok: true }, { t: 'Astrolabul', ok: true }, { t: 'Caravela', ok: true }, { t: 'Cârma dublă', ok: true }, { t: 'Expansiunea otomană', ok: false }, { t: 'Centralizarea statală', ok: false }], why: 'Progrese tehnice: portulane/hărți mai bune, cârma dublă, busola, astrolabul, caravela.', src: ['Progrese tehnice'] },
    { id: 'qd23', t: 'mcq', sec: 'desc-consecinte', lvl: 2, q: 'Ce se mută din Mediterană în Atlantic?', ok: 'Centrul de greutate al comerțului', bad: ['Capitala Imperiului Otoman', 'Centrul puterii Bisericii', 'Centrul comerțului cu sclavi'], why: 'Centrul de greutate al comerțului se mută din Mediterană în Atlantic.', src: ['Centrul de greutate'] },
    { id: 'qd24', t: 'mcq', sec: 'desc-consecinte', lvl: 2, q: 'Ce procent din amerindieni mor (de la boli / exterminări…), potrivit caietului 3?', ok: '90%', bad: ['10%', '25%', '50%'], why: '90% din amerindieni mor de la boli / exterminări…', src: ['90% din amerindieni'] },
    { id: 'qd25', t: 'mcq', sec: 'desc-consecinte', lvl: 3, q: 'Ce țări se dezvoltă ca urmare a mutării centrului de greutate al comerțului?', ok: 'Cele cu ieșire la Atlantic (la ocean)', bad: ['Cele cu ieșire la Mediterană', 'Cele din centrul Europei', 'Cele care făceau comerț cu sclavi'], why: 'Se dezvoltă țările cu ieșire la Atlantic (la ocean) / țările vestice.', src: ['Centrul de greutate'] },
    { id: 'qd26', t: 'multi', sec: 'desc-consecinte', lvl: 3, q: 'Care puncte apar **atât la cauze, cât și la consecințe** (cu aceeași temă)?', opts: [{ t: 'Răspândirea creștinismului', ok: true }, { t: 'Pământul sferic (ideea / demonstrarea lui)', ok: true }, { t: 'Nevoia de aur', ok: false }, { t: 'Comerțul cu sclavi', ok: false }], why: 'Creștinismul apare la cauze și la consecințe. Pământul sferic: ca idee la cauze, ca demonstrație la consecințe.', src: ['Se răspândește creștinismul'] },
    { id: 'qd27', t: 'mcq', sec: 'desc-intro', lvl: 1, q: 'Care dintre aceste filme apare în notițe?', ok: 'Apocalipto', bad: ['Gladiatorul', 'Troia', 'Patriotul'], why: 'Filme: „Cucerirea paradisului”, „Apocalipto”.', src: ['Apocalipto'] },
    { id: 'qd28', t: 'mcq', sec: 'desc-romani', lvl: 2, q: 'Care român e trecut în notițe cu **China**?', ok: 'Nicolae Milescu', bad: ['Badea Cârțan', 'Dimitrie Cantemir', 'Dinicu Golescu'], why: 'Spătarul Nicolae Milescu – China.', src: ['Nicolae Milescu'] },
    { id: 'qd29', t: 'mcq', sec: 'desc-romani', lvl: 2, q: 'Care român merge la **Roma** (în lista „Români” din caiet)?', ok: 'Badea Cârțan', bad: ['Nicolae Milescu', 'Dimitrie Cantemir', 'Grigore Ureche'], why: 'Badea Cârțan – merge la Roma.', src: ['Badea Cârțan'] },
    { id: 'qd30', t: 'mcq', sec: 'desc-cauze', lvl: 2, q: 'Care cauză a descoperirilor ține de un imperiu aflat în expansiune?', ok: 'Expansiunea otomană', bad: ['Centralizarea statală', 'Nevoia de aur', 'Dezvoltarea economică'], why: 'Ultima cauză din listă: expansiunea otomană.', src: ['Expansiunea otomană'] }
  );

  (D.quizSrc = D.quizSrc || []).push(
    { id: 'qh09', t: 'mcq', sec: 'desc-mari', lvl: 3, q: 'Care afirmație despre marile descoperiri este corectă potrivit notițelor?', ok: 'Cabral a ajuns în Brazilia în 1500, iar Columb în America în 1492', bad: ['Diaz a ajuns în India în 1488, iar Vasco da Gama la Capul Bunei Speranțe', 'Magellan a ajuns în America în 1492, iar Columb a făcut înconjurul lumii', 'Cabral a ajuns în India în 1500, iar Vasco da Gama în Brazilia'], why: 'Diaz – Capul Bunei Speranțe (1488); Columb – America (1492); Vasco da Gama – India (1498); Cabral – Brazilia (1500); Magellan – înconjurul lumii (1519–1522).', src: ['1500'] },
    { id: 'qh10', t: 'mcq', sec: 'desc-cauze', lvl: 3, q: 'Care dintre acestea este **cauză**, nu consecință, a descoperirilor?', ok: 'Expansiunea otomană', bad: ['Apariția imperiilor coloniale', 'Începutul comerțului cu sclavi', 'Afectarea Bisericii'], why: 'Expansiunea otomană e ultima cauză din listă. Imperiile coloniale, comerțul cu sclavi și Biserica afectată sunt consecințe.', src: ['Expansiunea otomană'] },
    { id: 'qh11', t: 'mcq', sec: 'desc-consecinte', lvl: 3, q: 'Care dintre acestea este **consecință**, nu cauză, a descoperirilor?', ok: 'Apariția imperiilor coloniale', bad: ['Apariția caravelei', 'Nevoia de aur', 'Centralizarea statală'], why: 'Apariția imperiilor coloniale este o consecință. Caravela, aurul și centralizarea statală sunt cauze.', src: ['Apar imperii coloniale'] },
    { id: 'qh12', t: 'mcq', sec: 'desc-mari', lvl: 3, q: 'Care afirmație despre Henric Navigatorul și despre anul 1494 este corectă potrivit notițelor?', ok: 'Henric Navigatorul e trecut ca rege al Portugaliei, iar în 1494 Papa împarte lumea în 2 (Tordesillas)', bad: ['Henric Navigatorul e trecut ca rege al Spaniei, iar în 1494 Papa împarte lumea în 2 (Tordesillas)', 'Henric Navigatorul e trecut ca rege al Portugaliei, iar în 1494 Columb ajunge în America', 'Henric Navigatorul a făcut înconjurul lumii, iar în 1494 se semnează Tratatul de la Tordesillas'], why: 'Henric Navigatorul – rege al Portugaliei; 1494 – Papa împarte lumea în 2 – Tratatul de la Tordesillas. Columb: 1492.', src: ['Henric Navigatorul'] },
    { id: 'qh14b', t: 'mcq', sec: 'desc-cauze', lvl: 3, q: 'Care afirmație despre cauzele descoperirilor este corectă?', ok: 'Busola, astrolabul și caravela sunt progrese tehnice, iar expansiunea otomană e o cauză listată separat', bad: ['Busola și expansiunea otomană sunt progrese tehnice, iar astrolabul e o cauză listată separat', 'Caravela și centralizarea statală sunt progrese tehnice, iar busola e o consecință', 'Astrolabul e un progres tehnic, iar busola și caravela sunt consecințe'], why: 'Progrese tehnice: portulane/hărți mai bune, cârma dublă, busola, astrolabul, caravela. Expansiunea otomană e ultima cauză din listă.', src: ['Progrese tehnice'] },
    { id: 'qh15b', t: 'mcq', sec: 'desc-consecinte', lvl: 3, q: 'Care afirmație despre consecințe este corectă?', ok: 'Centrul de greutate al comerțului se mută din Mediterană în Atlantic ⇒ se dezvoltă țările cu ieșire la Atlantic', bad: ['Centrul de greutate al comerțului se mută din Atlantic în Mediterană ⇒ se dezvoltă țările cu ieșire la Mediterană', 'Centrul de greutate al comerțului se mută din Mediterană în Atlantic ⇒ se dezvoltă țările fără ieșire la mare', 'Centrul de greutate al Bisericii se mută din Mediterană în Atlantic ⇒ se dezvoltă imperiile coloniale'], why: 'Centrul de greutate al comerțului se mută din Mediterană în Atlantic ⇒ se dezvoltă țările cu ieșire la Atlantic (la ocean).', src: ['Centrul de greutate'] },
    { id: 'qh13', t: 'multi', sec: 'desc-consecinte', lvl: 3, q: 'Care dintre acestea sunt **consecințe** ale descoperirilor (nu cauze)?', opts: [{ t: 'Moartea multor amerindieni', ok: true }, { t: 'Demonstrarea faptului că Pământul este sferic', ok: true }, { t: 'Nou impuls dat curiozității, cercetării, științei', ok: true }, { t: 'Apariția astrolabului', ok: false }, { t: 'Dezvoltarea economică', ok: false }, { t: 'Spiritul de aventură', ok: false }], why: 'Consecințe: mor mulți amerindieni, se demonstrează că Pământul e sferic, nou impuls cercetării. Astrolabul, dezvoltarea economică și spiritul de aventură sunt cauze.', src: ['Mor mulți'] }
  );

  (D.gamesSrc = D.gamesSrc || []).push(
    { id: 'gm-d1', t: 'match', sec: 'desc-mari', lvl: 1, q: 'Potrivește exploratorul cu ce a descoperit sau a făcut.', pairs: [['Bartolomeu Diaz', 'Capul Bunei Speranțe'], ['Vasco da Gama', 'India'], ['Cabral', 'Brazilia'], ['Columb', 'America'], ['Magellan', 'înconjurul lumii'], ['Amerigo Vespucci', 'numele Americii']], why: 'Diaz – Capul Bunei Speranțe; da Gama – India; Cabral – Brazilia; Columb – America; Magellan – înconjurul lumii; Vespucci – numele Americii.', src: ['Magellan'] },
    { id: 'gm-d2', t: 'match', sec: 'desc-mari', lvl: 2, q: 'Potrivește anul cu evenimentul.', pairs: [['1488', 'Bartolomeu Diaz – Capul Bunei Speranțe'], ['1492', 'Columb – America'], ['1494', 'Tratatul de la Tordesillas'], ['1498', 'Vasco da Gama – India'], ['1500', 'Cabral – Brazilia'], ['1519 – 1522', 'Magellan – înconjurul lumii']], why: 'Anii marilor descoperiri din caiete.', src: ['Papa'] },
    { id: 'go-d1', t: 'order', sec: 'desc-mari', lvl: 2, q: 'Ordonează cronologic marile descoperiri.', items: [{ t: 'Bartolomeu Diaz – Capul Bunei Speranțe', k: 1488 }, { t: 'Columb – America', k: 1492 }, { t: 'Tratatul de la Tordesillas', k: 1494 }, { t: 'Vasco da Gama – India', k: 1498 }, { t: 'Cabral – Brazilia', k: 1500 }, { t: 'Magellan – înconjurul lumii', k: 1519 }], why: '1488 → 1492 → 1494 → 1498 → 1500 → 1519–1522.', src: ['1488'] },
    { id: 'gs-d1', t: 'sort', sec: 'desc-cauze', lvl: 3, q: 'Cauză, consecință sau ambele?', buckets: ['Cauză', 'Consecință', 'Ambele'], items: [
      { t: 'Nevoia de aur', b: 0 }, { t: 'Centralizarea statală', b: 0 }, { t: 'Expansiunea otomană', b: 0 },
      { t: 'Începutul comerțului cu sclavi', b: 1 }, { t: 'Apariția imperiilor coloniale', b: 1 }, { t: 'Afectarea Bisericii', b: 1 }, { t: 'Nou impuls dat curiozității, cercetării, științei', b: 1 },
      { t: 'Creștinismul (răspândirea lui)', b: 2 }, { t: 'Pământul sferic (ideea / demonstrarea)', b: 2 }
    ], why: 'Creștinismul apare la ambele liste; Pământul sferic apare ca idee (cauză) și ca demonstrație (consecință).', src: ['Nevoia de aur'] },
    { id: 'gs-d2', t: 'sort', sec: 'desc-cauze', lvl: 2, q: 'Progres tehnic sau altă cauză?', buckets: ['Progres tehnic', 'Altă cauză'], items: [
      { t: 'Busola', b: 0 }, { t: 'Astrolabul', b: 0 }, { t: 'Caravela', b: 0 }, { t: 'Cârma dublă', b: 0 }, { t: 'Portulane / hărți mai bune', b: 0 },
      { t: 'Nevoia de aur', b: 1 }, { t: 'Expansiunea otomană', b: 1 }, { t: 'Centralizarea statală', b: 1 }
    ], why: 'Progrese tehnice: portulane/hărți mai bune, cârma dublă, busola, astrolabul, caravela.', src: ['Progrese tehnice'] }
  );

  D.timeline = D.timeline || [];
  D.timeline.push(
    { y: 'sec. XV – XVIII', k: 1450, t: 'Descoperitori de noi lumi și civilizații', n: 'Intervalul din caietul 3 (în caietul 1 al doilea secol se citește greu).', ch: 'descoperiri' },
    { y: '1488', k: 1488, t: 'Bartolomeu Diaz – Capul Bunei Speranțe', ch: 'descoperiri' },
    { y: '1492', k: 1492, t: 'Columb – America', ch: 'descoperiri' },
    { y: '1494', k: 1494, t: 'Tratatul de la Tordesillas', n: 'Papa împarte lumea în 2.', ch: 'descoperiri' },
    { y: '1498', k: 1498, t: 'Vasco da Gama – India', n: 'Anul ajungerii; a plecat din Lisabona în 1497, cum scrie caietul 2.', ch: 'descoperiri' },
    { y: '1500', k: 1500, t: 'Cabral – Brazilia', ch: 'descoperiri' },
    { y: '1519 – 1522', k: 1519, t: 'Magellan – înconjurul lumii', ch: 'descoperiri' }
  );

  D.mnemonics = D.mnemonics || [];
  D.mnemonics.push(
    { id: 'mn-ani-desc', ch: 'descoperiri', title: 'Anii descoperirilor: pasul 4, 2, 4, 2',
      phrase: '**1488** Diaz → **1492** Columb → **1494** Papa → **1498** Gama → **1500** Cabral → **1519 – 1522** Magellan',
      tip: 'Între primii cinci ani diferențele sunt 4, 2, 4, 2: 1488 → 1492 → 1494 → 1498 → 1500. Magellan vine mai târziu, 1519–1522.' },
    { id: 'mn-cine-desc', ch: 'descoperiri', title: 'Cine ce a găsit', phrase: '**Diaz** = Capul · **Gama** = India · **Columb** = America · **Cabral** = Brazilia · **Magellan** = înconjurul lumii · **Vespucci** = numele',
      tip: 'Diaz și Gama sunt perechea „Africa → India” (Capul Bunei Speranțe, apoi India). Columb și Cabral sunt perechea „spre America” (America, Brazilia).' },
    { id: 'mn-cauze', ch: 'descoperiri', title: 'Cauzele în cinci grupe',
      chunks: [
        { t: 'Idei și oameni', items: ['Pământul este sferic', 'spirit de aventură, personalități puternice'] },
        { t: 'Bani și putere', items: ['nevoia de aur', 'centralizarea statală · expansiunea teritorială · dezvoltarea economică'] },
        { t: 'Credință', items: ['răspândirea creștinismului'] },
        { t: 'Tehnică', items: ['portulane / hărți mai bune', 'cârma dublă', 'busola', 'astrolabul', 'caravela'] },
        { t: 'Presiune', items: ['expansiunea otomană'] }
      ],
      tip: 'Cinci cuvinte: Idei · Bani · Credință · Tehnică · Presiune.' },
    { id: 'mn-consecinte', ch: 'descoperiri', title: 'Consecințele în trei grupe',
      chunks: [
        { t: 'Oamenii', items: ['comerț cu sclavi', 'mor mulți amerindieni (90%: boli / exterminări)'] },
        { t: 'Puterea și comerțul', items: ['imperii coloniale', 'centrul comerțului: Mediterană → Atlantic', 'se dezvoltă țările cu ieșire la Atlantic'] },
        { t: 'Idei și credință', items: ['se răspândește creștinismul', 'se demonstrează că Pământul e sferic', 'nou impuls dat curiozității, cercetării, științei', 'Biserica afectată'] }
      ],
      tip: 'Oameni · Putere și comerț · Idei și credință.' },
    { id: 'mn-ambele', ch: 'descoperiri', title: 'Ce apare și la cauze, și la consecințe', phrase: '**Creștinismul** (se răspândește) · **Pământul sferic** (întâi ideea, apoi dovada)',
      tip: 'Dacă la test întreabă cauză sau consecință, aceste două pot apărea în ambele liste, cu sens ușor diferit.' }
  );
})(typeof window !== 'undefined' ? window : globalThis);
