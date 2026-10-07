// Screenshots e checagem de rolagem horizontal do build servido localmente.
// Uso: node scripts/screenshots.mjs [url] [larguras separadas por vírgula] [--secoes]
// Requer o site servido (ex.: npm run preview) e o Google Chrome instalado.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4321/';
const larguras = (process.argv[3] ?? '360,375,768,1280,1440').split(',').map(Number);
const porSecao = process.argv.includes('--secoes');
const outDir = path.resolve(import.meta.dirname, '../screenshots');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
let falhou = false;

for (const largura of larguras) {
  const page = await browser.newPage({
    viewport: { width: largura, height: largura < 768 ? 800 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  // Esconde o aviso de cookies nas capturas
  await page.evaluate(() => {
    const b = document.getElementById('cookie-banner');
    if (b) b.hidden = true;
  });
  // Rola a página para disparar observers e carregar imagens lazy
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);

  const { scrollW, clientW, culpados } = await page.evaluate(() => {
    const clientW = document.documentElement.clientWidth;
    const culpados = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.right > clientW + 1 && getComputedStyle(el).position !== 'fixed';
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
    return { scrollW: document.documentElement.scrollWidth, clientW, culpados };
  });
  const ok = scrollW <= clientW;
  if (!ok) falhou = true;
  console.log(`${largura}px: scrollWidth=${scrollW} clientWidth=${clientW} ${ok ? 'OK' : 'ROLAGEM HORIZONTAL'}`);
  if (!ok || culpados.length) console.log('  elementos além da borda:', culpados);

  if (porSecao) {
    const secoes = await page.$$('main > section, main > div > section, footer');
    let i = 0;
    for (const s of secoes) {
      i += 1;
      await s.screenshot({ path: path.join(outDir, `${largura}-${String(i).padStart(2, '0')}.png`) });
    }
  } else {
    await page.screenshot({ path: path.join(outDir, `${largura}-pagina.png`), fullPage: true });
  }
  await page.close();
}

await browser.close();
process.exit(falhou ? 1 : 0);
