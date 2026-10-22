# Pregătire test istorie

Site de studiu făcut din notițele tale (11 poze): notițe interactive, carduri cu repetare la intervale, completări, întrebări, jocuri, test simulat, axă a timpului și trucuri de memorare.

## Online

Site-ul e publicat cu GitHub Pages la https://calinnedelcu.github.io/pregatire-test-istorie/ (public: oricine are linkul poate vedea notițele și pozele).
Ca să publici o schimbare: `node tools/stamp.mjs && git add -A && git commit -m "..." && git push` (`stamp.mjs` pune în `index.html` o amprentă pe fiecare fișier, ca browserul să ia imediat versiunea nouă); Pages se actualizează singur în cel mult un minut.

## Cum îl deschizi

- Dublu-click pe `index.html` (merge direct din folder; fonturile se încarcă de pe internet, fără ele folosește fonturile sistemului).
- Sau pornește un server local din acest folder: `python3 -m http.server 5188` și deschide http://localhost:5188
- Progresul (carduri, întrebări, ce ai citit, data testului) se salvează în browserul în care îl folosești. Din Setări îl poți exporta și importa pe alt dispozitiv.

## Unde sunt datele

| Fișier | Ce conține |
| --- | --- |
| `js/data-ch1.js`, `js/data-ch2.js`, `js/data-ch3.js` | Notițele, rând cu rând, în formă de text indentat (vezi comentariile din fișiere). `**cuvânt**` = cuvânt-cheie, `{{corect|original}}` = greșeală de tipar corectată, `{{citit|~explicație}}` = citire stabilită din context, `{?text|explicație}` = citire nesigură, `{c:1,3}` = apare în caietele 1 și 3 |
| `js/data-table.js` | Tabelul cu autorii medievali |
| `js/data-cards.js`, `js/data-cards3.js` | Carduri, întrebări, jocuri, trucuri (cap. 3) |
| `js/data-quiz.js`, `js/data-games.js` | Întrebări și jocuri (cap. 1–2) |
| `js/data-misc.js` | Axa timpului și trucuri (cap. 1–2) |
| `assets/foto/` | Pozele originale (orientate corect), afișate la „Poza originală” |

## Verificări

- `node tools/validate.mjs` verifică ID-urile, sursele din notițe, forma întrebărilor și acoperirea: fiecare rând din notițe trebuie să apară într-o completare, un card sau o întrebare. Scrie și `dist/notes-dump.txt`, textul curat al notițelor.
- `node tools/build-artifact.mjs` face `dist/artifact.html`, aceeași aplicație într-un singur fișier, pentru publicare.

## Publicare

Folderul e static (fără pas de build): rămâne publicat din ramura `main`, rădăcina depozitului. Îl poți muta la fel de ușor pe Netlify sau Vercel.
