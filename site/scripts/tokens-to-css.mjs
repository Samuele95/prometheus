// site-design/tokens.json -> src/styles/tokens.css (one custom property per leaf) + src/tokens.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '../../site-design/tokens.json');
const tokens = JSON.parse(readFileSync(src, 'utf8'));
const lines = [];

const unitFor = (path, key) => {
  if (path[0] === 'motion' && path[1] === 'duration') return 'ms';
  if (key.endsWith('-ms')) return 'ms';
  if (key.endsWith('-deg')) return 'deg';
  if (key.endsWith('-px')) return 'px';
  if (key.endsWith('-vh')) return 'vh';
  return '';
};

function walk(node, path) {
  if (path[0] === 'meta' || path[0] === 'font') return; // fonts are written by hand as @font-face
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    if (node.type === 'gradient') {
      lines.push(`  --${path.join('-')}: linear-gradient(${node.angle}deg, ${node.stops.join(', ')});`);
      node.stops.forEach((s, i) => lines.push(`  --${path.join('-')}-${i + 1}: ${s};`));
      return;
    }
    for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
    return;
  }
  if (Array.isArray(node)) return;
  const key = path[path.length - 1];
  const unit = typeof node === 'number' ? unitFor(path, key) : '';
  lines.push(`  --${path.join('-')}: ${node}${unit};`);
}
walk(tokens, []);

writeFileSync(resolve(here, '../src/styles/tokens.css'),
  `/* generated from site-design/tokens.json by scripts/tokens-to-css.mjs; do not edit */\n:root {\n${lines.join('\n')}\n}\n`);
writeFileSync(resolve(here, '../src/tokens.ts'),
  `// generated from site-design/tokens.json; do not edit\nexport const tokens = ${JSON.stringify(tokens, null, 2)} as const;\n`);
console.log(`OK: tokens — ${lines.length} custom properties`);
