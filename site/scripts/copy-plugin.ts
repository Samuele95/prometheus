import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

// Fills {{section.key}} placeholders in HTML from site-design/copy.md, verbatim and escaped.
export function parseCopy(file: string): Map<string, string> {
  const map = new Map<string, string>();
  let section = '';
  for (const raw of readFileSync(file, 'utf8').split('\n')) {
    const h = raw.match(/^##\s+(\S+)/);
    if (h) { section = h[1]; continue; }
    const kv = raw.match(/^([a-z0-9-]+):\s(.*)$/);
    if (kv && section) map.set(`${section}.${kv[1]}`, kv[2]);
  }
  return map;
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function copyPlugin(): Plugin {
  const file = resolve(__dirname, '../../site-design/copy.md');
  return {
    name: 'prometheus-copy',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const copy = parseCopy(file);
        return html.replace(/\{\{([a-z0-9-]+\.[a-z0-9-]+)\}\}/g, (_, key: string) => {
          const v = copy.get(key);
          if (v === undefined) throw new Error(`ERROR: copy — missing key ${key} in site-design/copy.md`);
          return esc(v);
        });
      },
    },
  };
}
