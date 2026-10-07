// Gera public/og-image.png (1200×630): logo principal + H1 sobre #0B1620.
// Uso: node scripts/gerar-og.mjs  (requer Google Chrome instalado)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const fonte = (p) => `data:font/woff2;base64,${fs.readFileSync(path.join(root, 'node_modules', p)).toString('base64')}`;
const logo = fs.readFileSync(path.join(root, 'src/assets/logo/logo-principal.svg'), 'utf8');
const mD = logo.match(/<path fill="#00B8D9"[^>]* d="([^"]+)"/)[1];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Montserrat;font-weight:800;src:url(${fonte('@fontsource/montserrat/files/montserrat-latin-800-normal.woff2')})}
@font-face{font-family:Inter;font-weight:500;src:url(${fonte('@fontsource/inter/files/inter-latin-500-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0B1620;color:#fff;position:relative;overflow:hidden;font-family:Inter}
.marca{position:absolute;right:-120px;bottom:-60px;width:640px;opacity:.06}
.logo{position:absolute;left:80px;top:72px;height:84px}
h1{position:absolute;left:80px;top:212px;width:960px;font-family:Montserrat;font-weight:800;font-size:60px;line-height:1.1;letter-spacing:-.02em}
.linha{position:absolute;left:80px;bottom:72px;display:flex;align-items:center;gap:20px;font-size:24px;color:#9FB0BF}
.linha span{display:block;width:120px;height:2px;background:#00B8D9}
</style></head><body>
<svg class="marca" viewBox="84 75 424 258"><path fill="#00B8D9" fill-rule="evenodd" d="${mD}"/></svg>
<div class="logo">${logo.replace('<svg ', '<svg height="84" ')}</div>
<h1>Inspeção NR-13 de caldeiras, vasos de pressão e tubulações em todo o Brasil</h1>
<div class="linha"><span></span>Laudo, ART e documentação completa · CREA 216375/D</div>
</body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, 'public/og-image.png') });
await browser.close();
console.log('public/og-image.png gerada');
