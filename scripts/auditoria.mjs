// Auditoria dos critérios de aceite no build servido localmente.
// Uso: node scripts/auditoria.mjs [url]
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4321/';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
let falhas = 0;
const falha = (msg) => {
  falhas += 1;
  console.log('  FALHA:', msg);
};

// 1. Links de WhatsApp
console.log('\n== Links de WhatsApp');
const links = await page.$$eval('a[data-servico]', (as) =>
  as.map((a) => ({
    href: a.href,
    servico: a.dataset.servico,
    secao: a.dataset.secao,
    target: a.target,
    rel: a.rel,
    classe: a.className,
  })),
);
const porServico = new Map();
for (const l of links) {
  const u = new URL(l.href);
  if (u.origin + u.pathname !== 'https://wa.me/5544997127007') falha(`número errado em ${l.href}`);
  if (l.target !== '_blank' || !l.rel.includes('noopener')) falha(`target/rel ausente em ${l.servico}/${l.secao}`);
  if (!l.secao) falha(`data-secao ausente em ${l.href}`);
  const texto = u.searchParams.get('text');
  if (!porServico.has(l.servico)) porServico.set(l.servico, { texto, secoes: [] });
  const reg = porServico.get(l.servico);
  if (reg.texto !== texto) falha(`mensagens diferentes para ${l.servico}`);
  reg.secoes.push(l.secao);
}
for (const [servico, { texto, secoes }] of porServico) {
  console.log(`  [${servico}] "${texto}"  ← ${secoes.join(', ')}`);
}
console.log(`  ${links.length} links, ${porServico.size} mensagens distintas`);
if (porServico.size !== 15) falha('esperava 15 mensagens distintas');

// 2. Títulos
console.log('\n== Títulos');
const titulos = await page.$$eval('h1, h2, h3', (hs) => hs.map((h) => `${h.tagName}: ${h.textContent.trim().replace(/\s+/g, ' ')}`));
const h1s = titulos.filter((t) => t.startsWith('H1'));
console.log(`  H1: ${h1s.length}`);
if (h1s.length !== 1) falha('deve haver exatamente um H1');
titulos.filter((t) => t.startsWith('H2')).forEach((t) => console.log('  ' + t));
// Eyebrow: algum texto antes do H2 dentro do mesmo bloco?
const eyebrows = await page.$$eval('section h2', (hs) =>
  hs.filter((h) => {
    const anterior = h.previousElementSibling;
    return anterior && anterior.textContent.trim().length > 0 && anterior.tagName !== 'IMG';
  }).map((h) => h.textContent.trim()),
);
if (eyebrows.length) falha(`texto acima do H2: ${eyebrows.join(' | ')}`);
else console.log('  Nenhum rótulo acima dos H2');

// 3. Imagens com alt
const semAlt = await page.$$eval('img', (imgs) => imgs.filter((i) => !i.hasAttribute('alt')).length);
console.log(`\n== Imagens sem atributo alt: ${semAlt}`);
if (semAlt) falha('imagens sem alt');

// 4. Cores
console.log('\n== Cores');
const resultado = await page.evaluate(() => {
  const permitidas = new Set([
    'rgb(11, 22, 32)', 'rgb(19, 35, 49)', 'rgb(31, 51, 68)', 'rgb(242, 246, 248)', 'rgb(0, 184, 217)',
    'rgb(0, 120, 143)', 'rgb(159, 176, 191)', 'rgb(90, 107, 122)', 'rgb(245, 165, 36)', 'rgb(37, 211, 102)',
    'rgb(30, 190, 90)', 'rgb(255, 255, 255)',
  ]);
  const base = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    if (m[4] !== undefined && Number(m[4]) === 0) return null;
    return `rgb(${m[1]}, ${m[2]}, ${m[3]})`;
  };
  const fora = new Set();
  const verdeFora = [];
  const ambarFora = [];
  const cianoNoClaro = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    const props = ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'];
    for (const p of props) {
      if (p.startsWith('border') && parseFloat(cs[p.replace('Color', 'Width')]) === 0) continue;
      if (p === 'color' && !el.childNodes.length) continue;
      const c = base(cs[p]);
      if (!c) continue;
      if (!permitidas.has(c)) fora.add(`${c} (${p} em ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)})`);
      if (c === 'rgb(37, 211, 102)' && p === 'backgroundColor' && !el.closest('a[data-servico]')) verdeFora.push(el.outerHTML.slice(0, 80));
      if (c === 'rgb(245, 165, 36)' && !el.closest('[aria-labelledby="riscos-titulo"]')) ambarFora.push(el.outerHTML.slice(0, 80));
      if (c === 'rgb(0, 184, 217)' && p === 'color' && el.closest('.on-light') && el.textContent.trim()) cianoNoClaro.push(el.outerHTML.slice(0, 80));
    }
  }
  // Verde também não pode aparecer em texto/borda fora dos botões
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (['color', 'borderTopColor'].some((p) => base(cs[p]) === 'rgb(37, 211, 102)')) verdeFora.push(el.outerHTML.slice(0, 80));
  }
  return { fora: [...fora], verdeFora, ambarFora, cianoNoClaro };
});
console.log('  Cores fora da tabela de tokens:', resultado.fora.length ? resultado.fora : 'nenhuma');
console.log('  Verde WhatsApp fora de links de conversão:', resultado.verdeFora.length ? resultado.verdeFora : 'nenhum');
console.log('  Âmbar fora da seção Riscos:', resultado.ambarFora.length ? resultado.ambarFora : 'nenhum');
console.log('  Texto #00B8D9 em fundo claro:', resultado.cianoNoClaro.length ? resultado.cianoNoClaro : 'nenhum');
if (resultado.verdeFora.length || resultado.ambarFora.length || resultado.cianoNoClaro.length) falha('uso indevido de cor');

// 5. Teclado e acordeões
console.log('\n== Teclado e acordeões');
const skip = await page.$eval('.skip-link', (el) => el.getBoundingClientRect().bottom);
console.log(`  Link "pular" escondido antes do foco: ${skip <= 0 ? 'sim' : 'NÃO'}`);
if (skip > 0) falha('skip link visível');
await page.keyboard.press('Tab');
const primeiro = await page.evaluate(() => ({
  texto: document.activeElement.textContent.trim(),
  visivel: document.activeElement.getBoundingClientRect().top >= 0,
  outline: getComputedStyle(document.activeElement).outlineStyle,
}));
console.log(`  1º Tab: "${primeiro.texto}" visível=${primeiro.visivel} outline=${primeiro.outline}`);

const botoes = await page.$$('button[data-acordeao]');
let okAcordeao = 0;
for (const b of botoes) {
  await b.focus();
  const antes = await b.getAttribute('aria-expanded');
  await page.keyboard.press('Enter');
  const depois = await b.getAttribute('aria-expanded');
  const painelVisivel = await b.evaluate((el) => !document.getElementById(el.getAttribute('aria-controls')).hidden);
  await page.keyboard.press('Space');
  const fechado = await b.getAttribute('aria-expanded');
  const foco = await b.evaluate((el) => getComputedStyle(el).outlineStyle);
  if (antes === 'false' && depois === 'true' && painelVisivel && fechado === 'false' && foco !== 'none') okAcordeao += 1;
  else falha(`acordeão ${await b.getAttribute('aria-controls')}: ${antes}→${depois}→${fechado}, painel=${painelVisivel}, foco=${foco}`);
}
console.log(`  Acordeões OK (Enter abre, Espaço fecha, foco visível): ${okAcordeao}/${botoes.length}`);

// Percorre toda a página com Tab e confere foco visível
const total = await page.$$eval('a[href], button:not([disabled])', (els) => els.filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').length);
let semFoco = 0;
await page.evaluate(() => document.body.focus());
for (let i = 0; i < total + 5; i += 1) {
  await page.keyboard.press('Tab');
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { tag: el.tagName, outline: cs.outlineStyle, w: cs.outlineWidth, txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) };
  });
  if (info.tag !== 'BODY' && (info.outline === 'none' || info.w === '0px')) {
    semFoco += 1;
    console.log('  sem foco visível:', info);
  }
}
console.log(`  Elementos focáveis visitados: ~${total}, sem contorno de foco: ${semFoco}`);
if (semFoco) falha('foco invisível');

// Menu móvel
await page.setViewportSize({ width: 375, height: 800 });
await page.click('#menu-toggle');
const menuAberto = await page.evaluate(() => ({
  exp: document.getElementById('menu-toggle').getAttribute('aria-expanded'),
  visivel: !document.getElementById('menu-mobile').hidden,
  foco: document.activeElement.id,
}));
await page.keyboard.press('Escape');
const menuFechado = await page.evaluate(() => ({
  exp: document.getElementById('menu-toggle').getAttribute('aria-expanded'),
  visivel: !document.getElementById('menu-mobile').hidden,
  foco: document.activeElement.id,
}));
console.log('  Menu móvel aberto:', menuAberto, '→ Esc:', menuFechado);
if (menuAberto.exp !== 'true' || menuFechado.exp !== 'false' || menuFechado.visivel) falha('menu móvel');

// Barra móvel aparece depois do hero
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(400);
const barra = await page.evaluate(() => ({
  barra: document.documentElement.dataset.barra,
  flutuante: getComputedStyle(document.querySelector('.wa-float')).display,
}));
console.log('  Mobile após o hero:', barra);
if (barra.barra !== 'on' || barra.flutuante !== 'none') falha('barra móvel');

await browser.close();
console.log(`\n${falhas ? `${falhas} falha(s)` : 'Todos os critérios automáticos passaram.'}`);
process.exit(falhas ? 1 : 0);
