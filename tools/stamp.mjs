// Pune în index.html o amprentă (?v=...) pe fiecare fișier .js și .css, ca browserul să ia imediat versiunea nouă.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
let n = 0;
html = html.replace(/(<script src="|<link rel="stylesheet" href=")((?:js|css)\/[^"?]+)(\?v=[0-9a-f]+)?"/g, (m, pre, p) => {
  const hash = crypto.createHash('md5').update(fs.readFileSync(path.join(root, p))).digest('hex').slice(0, 8);
  n++;
  return pre + p + '?v=' + hash + '"';
});
fs.writeFileSync(file, html);
console.log('index.html: ' + n + ' fișiere cu amprentă');
