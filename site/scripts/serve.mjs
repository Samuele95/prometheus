// Serve ../docs at /prometheus/ exactly as GitHub Pages does. Usage: node scripts/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../docs');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain' };
createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (!url.startsWith('/prometheus/')) { res.writeHead(404); return res.end(); }
  const rel = url.slice('/prometheus'.length); // directories serve their index.html, as GitHub Pages does
  const p = resolve(docsDir, '.' + (rel.endsWith('/') ? rel + 'index.html' : rel));
  try { const body = await readFile(p); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream', 'cache-control': p.endsWith('.html') ? 'no-cache' : 'max-age=600' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
}).listen(Number(process.argv[2] ?? 4173), () => console.log('serving docs/ at http://localhost:' + (process.argv[2] ?? 4173) + '/prometheus/'));
