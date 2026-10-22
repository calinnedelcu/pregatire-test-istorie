// Construiește dist/artifact.html: același site, dar ca fragment cu CSS și JS inline (pentru publicare ca pagină găzduită),
// și dist/artifact-preview.html: același fragment într-un document complet, pentru verificare locală.
// Rulare: node tools/build-artifact.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const html = read('index.html');
const title = html.match(/<title>([^<]+)<\/title>/)[1];
const fontLink = html.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/)[1];
const scripts = [...html.matchAll(/<script src="(js\/[^"?]+)/g)].map((m) => m[1]);
const css = read('css/app.css');
const js = scripts.map((f) => '/* ' + f + ' */\n' + read(f)).join('\n');

if (/<\/script/i.test(js)) throw new Error('JS conține </script — trebuie escapat');

const fragment = [
  '<title>' + title + '</title>',
  '<meta name="claude:viewport-fit-sides" content="cover">',
  '<link rel="stylesheet" href="' + fontLink + '">',
  '<style>',
  css,
  '</style>',
  '<div id="app"></div>',
  '<div id="modal-root"></div>',
  '<div id="toast-root" class="toast-root"></div>',
  '<script>',
  js,
  '</script>',
  ''
].join('\n');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/artifact.html'), fragment);
fs.writeFileSync(
  path.join(root, 'dist/artifact-preview.html'),
  '<!doctype html>\n<html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><base href="../"></head><body>\n' + fragment + '</body></html>\n'
);
console.log('dist/artifact.html: ' + (Buffer.byteLength(fragment) / 1024).toFixed(0) + ' KB · ' + scripts.length + ' scripturi');
