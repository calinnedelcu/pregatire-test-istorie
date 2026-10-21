// Verifică integritatea datelor: ID-uri unice, surse găsite, acoperirea notițelor, forma întrebărilor.
// Rulare: node tools/validate.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map((m) => m[1]).filter((f) => !/(app|views)\.js$/.test(f));
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { console.error('Eroare la încărcarea ' + f + ': ' + e.message); process.exit(1); }
}

const D = ctx.DATA, U = ctx.U, N = ctx.Notes;
let errors = 0, warns = 0;
const err = (m) => { errors++; console.log('  ✗ ' + m); };
const warn = (m) => { warns++; console.log('  ! ' + m); };

try { N.parse(D.notesSrc); ctx.Cards.build(); ctx.Quiz.build(); }
catch (e) { console.error('Eroare la construirea datelor: ' + e.stack); process.exit(1); }

console.log('Capitole: ' + D.chapters.map((c) => c.id + ' (' + c.sections.length + ' secțiuni)').join(', '));
console.log('Linii în notițe: ' + Object.keys(D.line).length + ' · completări (cloze): ' + D.cloze.length + ' · carduri: ' + D.cards.length + ' · întrebări: ' + D.questions.length);

// ── ID-uri unice
console.log('\nID-uri');
const seen = {};
[...D.cards.map((c) => 'card:' + c.id), ...D.questions.map((q) => 'q:' + q.id), ...Object.keys(D.sec).map((s) => 'sec:' + s)].forEach((id) => {
  if (seen[id]) err('ID duplicat: ' + id); seen[id] = 1;
});

// ── poze
console.log('Poze');
D.chapters.forEach((c) => c.photos.concat(...c.sections.map((s) => s.photos)).forEach((p) => {
  if (!fs.existsSync(path.join(root, 'assets/foto/' + String(p).padStart(2, '0') + '.webp'))) err('Lipsește poza ' + p + ' (' + c.id + ')');
}));

// ── surse găsite
console.log('Surse');
D.cards.forEach((c) => { if ((c.src || []).length !== (c.srcLines || []).length) err('Card ' + c.id + ': nu găsesc în secțiunea „' + c.sec + '” fragmentul ' + JSON.stringify((c.src || []).filter((s) => !D.line || !N.linesOf(c.sec).some((l) => l.plain.includes(s))))); });
D.questions.forEach((q) => { if ((q.src || []).length !== (q.srcLines || []).length) err('Întrebare ' + q.id + ': nu găsesc în „' + q.sec + '” fragmentul ' + JSON.stringify((q.src || []).filter((s) => !N.linesOf(q.sec).some((l) => l.plain.includes(s))))); });

// ── forma întrebărilor
console.log('Întrebări');
const poolOk = (q) => {
  const okSet = {}; [].concat(q.ok).concat(q.also || []).forEach((a) => (okSet[U.key(a)] = 1));
  const oks = [].concat(q.ok).concat(q.also || []).map(U.key);
  const near = (x) => { const k = U.key(x); return oks.some((o) => o.length >= 4 && k.length >= 4 && (k.includes(o) || o.includes(k))); };
  const pool = ((q.pool && D.pools[q.pool]) || []).filter((x) => !okSet[U.key(x)] && !near(x));
  const fixed = (q.bad || []).filter((x) => !okSet[U.key(x)]);
  return U.uniq(fixed.concat(pool)).length;
};
D.questions.forEach((q) => {
  const id = q.id;
  if (!['mcq', 'tf', 'multi', 'type', 'order', 'match', 'sort'].includes(q.t)) return err(id + ': tip necunoscut ' + q.t);
  if (!q.q) err(id + ': fără text');
  if (q.t === 'mcq') {
    if (!q.ok) err(id + ': fără răspuns corect');
    if (poolOk(q) < 3) err(id + ': mai puțin de 3 distractori');
    (q.bad || []).forEach((b) => { if (U.key(b) === U.key(q.ok)) err(id + ': un distractor e identic cu răspunsul'); });
    if (U.uniq((q.bad || []).map(U.key)).length !== (q.bad || []).length) err(id + ': distractori repetați');
  }
  if (q.t === 'tf' && typeof q.a !== 'boolean') err(id + ': tf fără boolean');
  if (q.t === 'multi') {
    if (!q.opts || q.opts.length < 3) err(id + ': prea puține opțiuni');
    if (!q.opts.some((o) => o.ok)) err(id + ': nicio opțiune corectă');
    if (!q.opts.some((o) => !o.ok)) err(id + ': nicio opțiune greșită');
    if (U.uniq(q.opts.map((o) => U.key(o.t))).length !== q.opts.length) err(id + ': opțiuni repetate');
  }
  if (q.t === 'type' && !(q.a && q.a.length)) err(id + ': type fără răspuns');
  if (q.t === 'order') {
    if (q.items.length < 3) err(id + ': prea puține elemente');
    const ks = q.items.map((i) => i.k);
    if (ks.some((k) => typeof k !== 'number')) err(id + ': k nenumeric');
    if (U.uniq(ks).length !== ks.length) warn(id + ': valori k egale (ordinea nu e unică)');
  }
  if (q.t === 'match') {
    if (q.pairs.length < 3) err(id + ': prea puține perechi');
    if (U.uniq(q.pairs.map((p) => U.key(p[0]))).length !== q.pairs.length) err(id + ': elemente stânga repetate');
    if (U.uniq(q.pairs.map((p) => U.key(p[1]))).length !== q.pairs.length) err(id + ': elemente dreapta repetate');
  }
  if (q.t === 'sort') {
    if (q.buckets.length < 2) err(id + ': coloane puține');
    q.items.forEach((it) => { if (it.b < 0 || it.b >= q.buckets.length) err(id + ': b invalid'); });
    q.buckets.forEach((b, i) => { if (!q.items.some((it) => it.b === i)) warn(id + ': coloana „' + b + '” e goală'); });
  }
  if (!q.why) warn(id + ': fără explicație');
});

// ── forma cardurilor
console.log('Carduri');
D.cards.forEach((c) => {
  if (c.kind === 'list' && !(c.items && c.items.length >= 2)) err(c.id + ': listă fără elemente');
  if (c.kind === 'qa' && !c.a) err(c.id + ': fără răspuns');
  if (!c.q) err(c.id + ': fără întrebare');
});

// ── acoperirea notițelor
console.log('Acoperire (fiecare rând din notițe trebuie să apară într-o completare, un card sau o întrebare)');
const refs = new Set();
D.cards.concat(D.questions).forEach((x) => (x.srcLines || []).forEach((l) => refs.add(l.id)));
let uncovered = 0;
Object.values(D.line).forEach((l) => {
  if (!l.plain) return;
  const hasCloze = l.keys.length > 0;
  const hasRef = refs.has(l.id);
  if (!hasCloze && !hasRef) { uncovered++; warn('Neacoperit: [' + l.id + '] ' + l.plain); }
});
const clozeLines = new Set(D.cloze.map((c) => c.line.id)).size;
console.log('  rânduri cu completări: ' + clozeLines + ' · rânduri citate de carduri/întrebări: ' + refs.size + ' · rânduri neacoperite: ' + uncovered);
// rânduri care au carduri/întrebări dar nu și completări
// ── mnemonice / axa timpului
console.log('Axă și trucuri');
(D.timeline || []).forEach((e) => { if (!D.chById[e.ch]) err('Eveniment cu capitol necunoscut: ' + e.t); });
(D.mnemonics || []).forEach((m) => { if (!D.chById[m.ch]) err('Truc cu capitol necunoscut: ' + m.id); });

// ── tabel
(D.tables.sources.rows).forEach((r) => { if (!r.autor || !r.sec || !r.mentiune) err('Tabel: rând incomplet ' + r.n); });

// ── export text curat al notițelor, pentru verificare
const out = [];
D.chapters.forEach((c) => {
  out.push('# ' + c.code + ' — ' + c.title + (c.subtitle ? ' / ' + c.subtitle : ''));
  c.sections.forEach((s) => {
    out.push('', '## ' + s.title + '   [poze: ' + s.photos.join(',') + ']');
    N.walk(s.body, (n) => {
      const pad = '  '.repeat(n.depth);
      if (n.kind === 'li') out.push(pad + '- ' + n.plain);
      else if (n.kind === 'group') out.push(pad + n.plain);
      else if (n.kind === 'note' || n.kind === 'warn') out.push(pad + '> ' + N.strip(n.text));
      else if (n.kind === 'embed') out.push(pad + '[' + n.name + ']');
    });
  });
  out.push('');
});
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/notes-dump.txt'), out.join('\n'));

console.log('\n' + (errors ? '✗ ' + errors + ' erori' : '✓ fără erori') + ', ' + warns + ' avertismente');
process.exit(errors ? 1 : 0);
