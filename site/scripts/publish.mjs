// Copy the built site (dist/) into the repository's docs/ folder, which GitHub Pages serves.
// Replaces only what the previous site owned; keeps docs/source/, the redirect pages and robots.txt.
import { cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '../dist');
const docs = resolve(here, '../../docs');
if (!existsSync(dist)) { console.error('ERROR: publish — dist/ missing; run npm run build first'); process.exit(1); }

const owned = ['index.html', 'docs.html', 'assets', 'brand', 'fonts', 'favicon.svg', 'og.jpg', 'og.png', 'poster.jpg', 'poster-mobile.jpg'];
for (const name of owned) rmSync(resolve(docs, name), { recursive: true, force: true });
for (const name of readdirSync(dist)) cpSync(resolve(dist, name), resolve(docs, name), { recursive: true });
console.log(`OK: publish — dist/ copied to docs/ (${readdirSync(dist).length} entries); kept source/, code-forge.html, documentation-forge.html, robots.txt`);
