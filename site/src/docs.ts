// Reading room: header, section rail, language and runtime switches, code copy, source browser, filter, scroll-spy.
// Ported feature for feature from the previous reading room; restyled only.
import './styles/tokens.css';
import './styles/base.css';
import './styles/docs.css';

type Lang = 'en' | 'it';
const GITHUB = 'https://github.com/Samuele95/prometheus';
const LANG_KEY = 'prometheus:lang';
const RUNTIME_KEY = 'prometheus:runtime';

const STRINGS: Record<string, [string, string]> = {
  'meta.docsTitle': ['Reading room — Prometheus', 'Sala di lettura — Prometheus'],
  copied: ['Copied', 'Copiato'],
  copyFailed: ['Copy failed — select the text', 'Copia non riuscita — seleziona il testo'],
  index: ['Sections', 'Sezioni'],
  menu: ['Sections', 'Sezioni'],
  site: ['Site', 'Sito'],
  language: ['Language', 'Lingua'],
  home: ['Prometheus — back to the main page', 'Prometheus — torna alla pagina principale'],
  'nav.home': ['The site', 'Il sito'],
  'nav.install': ['Install', 'Installazione'],
  'nav.github': ['GitHub', 'GitHub'],
  'group.start': ['Start here', 'Inizia da qui'],
  'group.model': ['The model', 'Il modello'],
  'group.pipeline': ['The pipeline', 'La pipeline'],
  'group.lifecycle': ['Lifecycle', 'Ciclo di vita'],
  'group.start2': ['Get started', 'Installazione'],
  runtime: ['Runtime', 'Runtime'],
  'runtime.agentic': ['Agentic runtime', 'Runtime agentico'],
  'runtime.gem': ['Gemini Gem', 'Gemini Gem'],
  'runtime.note': ['Claude Code, Codex, opencode, Cursor & other filesystem-based agents share one path; the Gem is the ported form.', 'Claude Code, Codex, opencode, Cursor e gli altri agenti basati su filesystem condividono un solo percorso; il Gem è la forma portata.'],
  'footer.line': ['Prometheus — a meta-prompting framework', 'Prometheus — un framework di meta-prompting'],
  'footer.copy': ['© 2026 · MIT', '© 2026 · MIT'],
  top: ['Back to top', 'Torna su'],
  loading: ['Loading…', 'Caricamento…'],
  failed: ['Could not load this file.', 'Impossibile caricare questo file.'],
  'overview.head': ['Overview — how the pieces fit', 'Panoramica — come si incastrano i pezzi'],
  'core.head': ['Core System', 'Sistema centrale'],
  'quantum.head': ['Quantum Principles', 'Principi quantistici'],
  'shapes.head': ['Shapes & Drafting', 'Forme e stesura'],
  'interview.head': ['Adaptive Interview', 'Intervista adattiva'],
  'reasoning.head': ['Reasoning Patterns', 'Schemi di ragionamento'],
  'audit.head': ['Audit & Evaluation', 'Audit e valutazione'],
  'verification.head': ['Verification', 'Verifica'],
  'manage.head': ['Manage Mode', 'Modalità gestione'],
  'setup.head': ['Installation Guide', 'Guida all’installazione'],
  'sources.head': ['Reading map & source layout', 'Mappa di lettura e struttura dei sorgenti'],
  'cover.kicker': ['Prometheus · Documentation', 'Prometheus · Documentazione'],
  'cover.title': ['The Reading Room', 'La Sala di Lettura'],
  'cover.sub': ['A prompt is an operator, not a key. The full documentation of the Prometheus meta-prompting framework.', 'Un prompt è un operatore, non una chiave. La documentazione completa del framework di meta-prompting Prometheus.'],
  'cover.start': ['Begin reading', 'Inizia a leggere'],
  'cover.contents': ['Contents', 'Indice'],
  ticks: ['Chapters', 'Capitoli'],
};
const SECTIONS = [
  { id: 'overview', group: 'start', num: '01' }, { id: 'core', group: 'model', num: '02' },
  { id: 'quantum', group: 'model', num: '03' }, { id: 'shapes', group: 'pipeline', num: '04' },
  { id: 'interview', group: 'pipeline', num: '05' }, { id: 'reasoning', group: 'pipeline', num: '06' },
  { id: 'audit', group: 'pipeline', num: '07' }, { id: 'verification', group: 'pipeline', num: '08' },
  { id: 'manage', group: 'lifecycle', num: '09' }, { id: 'setup', group: 'start2', num: '10' },
  { id: 'sources', group: 'start2', num: '—' },
];
const ALIASES: Record<string, string> = { flows: 'core-the-flows', 'source-browser': 'sources-folder-open-source-browser' };

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
let lang: Lang = (store.get(LANG_KEY) as Lang) || (navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en');
let runtime = store.get(RUNTIME_KEY) === 'gem' ? 'gem' : 'agentic';
const t = (k: string) => (STRINGS[k] ?? [k, k])[lang === 'it' ? 1 : 0];
const i18n: Array<() => void> = [];
const bind = (el: Element, key: string, attr?: string) => {
  const apply = () => (attr ? el.setAttribute(attr, t(key)) : (el.textContent = t(key)));
  apply(); i18n.push(apply);
};

const root = document.getElementById('docs-root')!;
const main = root.querySelector<HTMLElement>('#content')!;

// header
const header = document.createElement('header');
header.className = 'rr-header';
header.innerHTML = `
  <a class="rr-mark" href="./index.html"><img src="./brand/lockup-horizontal.svg" alt="" width="200" height="32"></a>
  <p class="rr-hud__chapter" aria-live="polite"><span class="rr-hud__counter">00 / 11</span> <span class="rr-hud__name"></span></p>
  <nav class="rr-nav">
    <a href="./index.html" data-k="nav.home"></a><a href="#setup" data-k="nav.install"></a><a href="${GITHUB}" rel="noopener" data-k="nav.github"></a>
  </nav>
  <div class="rr-lang" role="group"><button type="button" data-lang="en" lang="en">EN</button><span aria-hidden="true">/</span><button type="button" data-lang="it" lang="it">IT</button></div>`;
bind(header.querySelector('.rr-mark')!, 'home', 'aria-label');
bind(header.querySelector('.rr-nav')!, 'site', 'aria-label');
bind(header.querySelector('.rr-lang')!, 'language', 'aria-label');
header.querySelectorAll('[data-k]').forEach((el) => bind(el, (el as HTMLElement).dataset.k!));

// rail
const aside = document.createElement('aside');
aside.className = 'rr-aside';
const pill = document.createElement('fieldset');
pill.className = 'rr-pill';
pill.innerHTML = `<legend data-k="runtime"></legend>
  <div class="rr-pill__opts">
    <label><input type="radio" name="runtime" value="agentic"><span data-k="runtime.agentic"></span></label>
    <label><input type="radio" name="runtime" value="gem"><span data-k="runtime.gem"></span></label>
  </div><p class="rr-pill__note" data-k="runtime.note"></p>`;
pill.querySelectorAll('[data-k]').forEach((el) => bind(el, (el as HTMLElement).dataset.k!));
const radios = Array.from(pill.querySelectorAll<HTMLInputElement>('input'));
const applyRuntime = () => {
  radios.forEach((r) => (r.checked = r.value === runtime));
  document.querySelectorAll<HTMLElement>('[data-runtime]').forEach((el) => (el.hidden = el.dataset.runtime !== runtime));
};
radios.forEach((r) => r.addEventListener('change', () => { runtime = r.value; store.set(RUNTIME_KEY, runtime); applyRuntime(); }));

const drawer = document.createElement('details');
drawer.className = 'rr-drawer';
drawer.innerHTML = `<summary data-k="menu"></summary><nav class="rr-index"></nav>`;
bind(drawer.querySelector('summary')!, 'menu');
const index = drawer.querySelector('.rr-index')!;
bind(index, 'index', 'aria-label');
const groups = [...new Set(SECTIONS.map((s) => s.group))];
for (const g of groups) {
  const p = document.createElement('p'); p.className = 'rr-index__group'; bind(p, `group.${g}`);
  const ol = document.createElement('ol');
  for (const s of SECTIONS.filter((x) => x.group === g)) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${s.id}"><span class="rr-index__num">${s.num}</span><span></span></a>`;
    bind(li.querySelector('span:last-child')!, `${s.id}.head`);
    ol.append(li);
  }
  index.append(p, ol);
}
aside.append(pill, drawer);

const layout = document.createElement('div');
layout.className = 'rr-layout';
main.before(layout);
layout.append(aside, main);
layout.before(header);

// ---------- the cover: an engraved astrolabe and a dial of contents ----------
const ring = (r: number, ticks: number, cls: string) => {
  let d = '';
  for (let i = 0; i < ticks; i++) { const a = (i / ticks) * Math.PI * 2, l = i % 5 === 0 ? 7 : 3.5; d += `M${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}L${(Math.cos(a) * (r - l)).toFixed(1)} ${(Math.sin(a) * (r - l)).toFixed(1)}`; }
  return `<g class="${cls}"><circle r="${r}"/><path d="${d}"/></g>`;
};
const NUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ROMAN = NUM;
const numerals = NUM.map((n, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; return `<text x="${(Math.cos(a) * 168).toFixed(1)}" y="${(Math.sin(a) * 168).toFixed(1)}" transform="rotate(${i * 30} ${(Math.cos(a) * 168).toFixed(1)} ${(Math.sin(a) * 168).toFixed(1)})">${n}</text>`; }).join('');
const cover = document.createElement('section');
cover.className = 'rr-cover';
cover.innerHTML = `
  <svg class="rr-cover__astrolabe" viewBox="-220 -220 440 440" aria-hidden="true">
    ${ring(210, 180, 'rr-ring rr-ring--1')}${ring(186, 120, 'rr-ring rr-ring--2')}
    <g class="rr-ring rr-ring--3"><circle r="160"/>${numerals}</g>
    ${ring(132, 72, 'rr-ring rr-ring--4')}<g class="rr-ring rr-ring--5"><circle r="96" cy="-14"/><circle r="58"/></g>
    <g class="rr-cover__mark"><image href="./brand/mark.svg" x="-64" y="-64" width="128" height="128"/></g>
  </svg>
  <div class="rr-cover__copy">
    <p class="rr-cover__kicker" data-k="cover.kicker"></p>
    <h1 class="rr-cover__title" data-k="cover.title"></h1>
    <p class="rr-cover__sub" data-k="cover.sub"></p>
    <a class="rr-cover__start" href="#overview" data-k="cover.start"></a>
  </div>
  <nav class="rr-cover__contents"><p class="rr-cover__contents-label" data-k="cover.contents"></p><ol></ol></nav>`;
cover.querySelectorAll('[data-k]').forEach((el) => bind(el, (el as HTMLElement).dataset.k!));
const contents = cover.querySelector('.rr-cover__contents ol')!;
for (const sct of SECTIONS) {
  const li = document.createElement('li');
  li.innerHTML = `<a href="#${sct.id}"><span class="rr-cover__num">${ROMAN[SECTIONS.indexOf(sct)]}</span><span class="rr-cover__head"></span></a>`;
  bind(li.querySelector('.rr-cover__head')!, `${sct.id}.head`);
  contents.append(li);
}
header.after(cover);

// ---------- section openers: a large outlined numeral and an engraved rule ----------
main.querySelectorAll<HTMLElement>('.rr-section').forEach((sec) => {
  const meta = SECTIONS.find((x) => x.id === sec.id);
  if (!meta) return;
  const n = document.createElement('div');
  n.className = 'rr-opener'; n.setAttribute('aria-hidden', 'true');
  n.innerHTML = `<span class="rr-opener__num">${ROMAN[SECTIONS.indexOf(meta)]}</span><span class="rr-opener__rule"></span>`;
  sec.prepend(n);
});

// ---------- reading progress and the turning watermark ----------
const progress = document.createElement('div'); progress.className = 'rr-progress'; progress.setAttribute('aria-hidden', 'true');
const watermark = document.createElement('div'); watermark.className = 'rr-watermark'; watermark.setAttribute('aria-hidden', 'true');
watermark.innerHTML = `<svg viewBox="-220 -220 440 440">${ring(210, 180, 'rr-ring')}${ring(170, 120, 'rr-ring')}<g class="rr-ring"><circle r="160"/>${numerals}</g>${ring(120, 60, 'rr-ring')}</svg>`;
const ticks = document.createElement('nav'); ticks.className = 'rr-ticks';
bind(ticks, 'ticks', 'aria-label');
ticks.innerHTML = `<ol>${SECTIONS.map((x) => `<li><a href="#${x.id}"><span class="sr-only" data-k="${x.id}.head"></span></a></li>`).join('')}</ol>`;
ticks.querySelectorAll('[data-k]').forEach((el) => bind(el, (el as HTMLElement).dataset.k!));
document.body.append(progress, watermark, ticks);
const tickLinks = Array.from(ticks.querySelectorAll<HTMLAnchorElement>('a'));
const sectionEls = SECTIONS.map((x) => document.getElementById(x.id)!);
let ticking = false;
const onScroll = () => {
  ticking = false;
  const h = document.documentElement.scrollHeight - innerHeight;
  const p = h > 0 ? scrollY / h : 0;
  document.documentElement.style.setProperty('--read', p.toFixed(4));
  // each tick fills with the reader's progress through its section
  const mid = scrollY + innerHeight * 0.35;
  sectionEls.forEach((el, i) => {
    if (!el) return;
    const top = el.offsetTop, h = el.offsetHeight || 1;
    tickLinks[i].style.setProperty('--fill', Math.max(0, Math.min(1, (mid - top) / h)).toFixed(3));
  });
};
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const footer = document.createElement('footer');
footer.className = 'rr-footer';
footer.innerHTML = `<p><span data-k="footer.line"></span> · <a href="./index.html" data-k="nav.home"></a> · <a href="#setup" data-k="nav.install"></a> · <a href="${GITHUB}" rel="noopener">GitHub</a> · <span data-k="footer.copy"></span></p><a href="#content" data-k="top"></a>`;
footer.querySelectorAll('[data-k]').forEach((el) => bind(el, (el as HTMLElement).dataset.k!));
layout.after(footer);

const wide = window.matchMedia('(min-width: 961px)');
const syncDrawer = () => (drawer.open = wide.matches);
syncDrawer();
wide.addEventListener('change', syncDrawer);
index.addEventListener('click', (e) => { if ((e.target as Element).closest('a') && !wide.matches) drawer.open = false; });

// language
const langButtons = Array.from(header.querySelectorAll<HTMLButtonElement>('.rr-lang button'));
function setLang(next: Lang) {
  lang = next; store.set(LANG_KEY, next);
  document.documentElement.lang = next;
  document.title = t('meta.docsTitle');
  main.querySelectorAll<HTMLElement>('.rr-l').forEach((block) => {
    const on = block.lang === next;
    block.hidden = !on;
    block.querySelectorAll<HTMLElement>('[data-id]').forEach((h) => (on ? (h.id = h.dataset.id!) : h.removeAttribute('id')));
  });
  langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
  i18n.forEach((fn) => fn());
}
langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang as Lang)));
setLang(lang);
applyRuntime();

// copy, source browser, filter
const cache = new Map<string, Promise<string>>();
const load = (src: string) => {
  if (!cache.has(src)) cache.set(src, fetch(`./source/${src}`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); }));
  return cache.get(src)!;
};
async function copyText(text: string, btn: HTMLElement) {
  const label = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = t('copied'); setTimeout(() => (btn.textContent = label), 1600); }
  catch { btn.textContent = t('copyFailed'); setTimeout(() => (btn.textContent = label), 2400); }
}
function filterGroups(chips: HTMLElement): HTMLElement[][] {
  const groups: HTMLElement[][] = [];
  let el = chips.nextElementSibling as HTMLElement | null;
  while (el && !(el.matches('h3, h2') && !/^core-0\d-/.test(el.dataset.id ?? ''))) {
    if (el.matches('h4') && /^core-0\d-/.test(el.dataset.id ?? '')) groups.push([el]);
    else if (groups.length) groups[groups.length - 1].push(el);
    el = el.nextElementSibling as HTMLElement | null;
  }
  if (groups.length === 6) return groups;
  const list = [chips.previousElementSibling, chips.nextElementSibling].find((x) => x?.matches('.rr-list') && x.children.length === 6);
  return list ? Array.from(list.children).map((c) => [c as HTMLElement]) : [];
}
main.addEventListener('click', (e) => {
  const target = e.target as Element;
  const copy = target.closest<HTMLElement>('.rr-code__copy');
  if (copy) { copyText(copy.parentElement!.querySelector('code')?.textContent ?? '', copy); return; }
  const file = target.closest<HTMLButtonElement>('button.rr-browser__file');
  if (file) {
    const browser = file.closest('.rr-browser')!;
    const name = browser.querySelector('.rr-browser__name')!;
    const code = browser.querySelector('.rr-browser__pre code')!;
    browser.querySelectorAll('button.rr-browser__file').forEach((b) => b.removeAttribute('aria-current'));
    file.setAttribute('aria-current', 'true');
    name.textContent = t('loading');
    load(file.dataset.src!).then((txt) => { code.textContent = txt; name.textContent = file.dataset.src!.replace(/^(skill|gem)\//, ''); })
      .catch(() => (name.textContent = t('failed')));
    return;
  }
  const chip = target.closest<HTMLElement>('.rr-filter__chip');
  if (chip) {
    const bar = chip.parentElement!;
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
    const map: Record<string, number[]> = { prompts: [0, 1], agents: [2, 3], evaluators: [4, 5] };
    const f = chip.dataset.filter!;
    filterGroups(bar).forEach((g, i) => { const hide = f !== 'all' && !map[f]?.includes(i); g.forEach((el) => (el.hidden = hide)); });
  }
});
main.querySelectorAll<HTMLDetailsElement>('details.rr-source').forEach((d) => d.addEventListener('toggle', () => {
  if (!d.open || d.dataset.loaded) return;
  const code = d.querySelector('pre code')!;
  code.textContent = t('loading');
  load(d.dataset.src!).then((txt) => { code.textContent = txt; d.dataset.loaded = '1'; }).catch(() => (code.textContent = t('failed')));
}));

// scroll-spy and hash aliases
const links = new Map(Array.from(index.querySelectorAll('a')).map((a) => [a.hash.slice(1), a]));
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) {
    links.forEach((a) => a.removeAttribute('aria-current'));
    links.get(en.target.id)?.setAttribute('aria-current', 'location');
    const i = SECTIONS.findIndex((x) => x.id === en.target.id);
    if (i >= 0) {
      header.querySelector('.rr-hud__counter')!.textContent = `${ROMAN[i]} / ${ROMAN[SECTIONS.length - 1]}`;
      header.querySelector('.rr-hud__name')!.textContent = t(`${SECTIONS[i].id}.head`);
      tickLinks.forEach((a, k) => a.toggleAttribute('aria-current', k === i));
    }
  }
}, { rootMargin: '-30% 0px -60% 0px' });
main.querySelectorAll('.rr-section').forEach((s) => spy.observe(s));
// on the cover the HUD names the room itself, like the film's gate
const coverSpy = new IntersectionObserver(([en]) => {
  if (!en.isIntersecting) return;
  header.querySelector('.rr-hud__counter')!.textContent = `— / ${ROMAN[SECTIONS.length - 1]}`;
  header.querySelector('.rr-hud__name')!.textContent = t('cover.title');
  tickLinks.forEach((a) => a.removeAttribute('aria-current'));
}, { rootMargin: '-40% 0px -40% 0px' });
coverSpy.observe(cover);
const jump = () => { const h = decodeURIComponent(location.hash.slice(1)); if (h) document.getElementById(ALIASES[h] ?? h)?.scrollIntoView(); };
jump();
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (ALIASES[h]) document.getElementById(ALIASES[h])?.scrollIntoView(); });
