// Prepara os arquivos do kit (pasta assets/) para o projeto:
// - copia e deriva as variações da logo a partir do SVG vetorial original;
// - gera favicons e ícones a partir do símbolo M;
// - copia as fotos reais para src/assets/fotos com nomes sem acento;
// - converte o mapa do Brasil (MapSVG) em dados TypeScript.
// Uso: node scripts/preparar-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const kit = path.join(root, 'assets');
const out = (...p) => path.join(root, ...p);
const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });

ensure(out('src/assets/logo'));
ensure(out('src/assets/fotos'));
ensure(out('public'));

// ---------- Logo ----------
const original = fs.readFileSync(path.join(kit, 'miranda-engenharia-logo.svg'), 'utf8');
const mPath = original.match(/<path fill="#00B8D9"[^>]*\/>/)[0];
const mD = mPath.match(/ d="([^"]+)"/)[1];

// Texto "MIRANDA ENGENHARIA" ampliado para PROPORCAO_TEXTO da altura do M e centralizado
// verticalmente nele, mantendo o espaço original entre símbolo e texto. Escala uniforme, sem distorção.
const PROPORCAO_TEXTO = 0.72;
const caixa = (d) => {
  const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
const textoD = original.match(/<path fill="#FFFFFF"[^>]* d="([^"]+)"/)[1];
const m = caixa(mD);
const t = caixa(textoD);
const escala = (PROPORCAO_TEXTO * (m.y1 - m.y0)) / (t.y1 - t.y0);
const vao = t.x0 - m.x1;
const tx = m.x1 + vao - t.x0 * escala;
const ty = (m.y0 + m.y1) / 2 - ((t.y0 + t.y1) / 2) * escala;
const larguraFinal = m.x1 + vao + (t.x1 - t.x0) * escala + 4 - 82;
const ajustada = original
  .replace(/viewBox="[^"]+"/, `viewBox="82 74 ${larguraFinal.toFixed(1)} 261"`)
  .replace(/<path fill="#FFFFFF"/, `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${escala.toFixed(4)})" fill="#FFFFFF"`);

fs.writeFileSync(out('src/assets/logo/logo-principal.svg'), ajustada);
fs.writeFileSync(
  out('src/assets/logo/logo-fundo-claro.svg'),
  ajustada.replace('fill="#FFFFFF"', 'fill="#0B1620"'),
);
fs.writeFileSync(
  out('src/assets/logo/logo-branca.svg'),
  ajustada.replace('fill="#00B8D9"', 'fill="#FFFFFF"'),
);

// Caixa do M no SVG original: x 86,5–505,2 / y 77,8–330,2
const simbolo = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="84 75 424 258" role="img" aria-label="Miranda Engenharia"><path fill="${fill}" fill-rule="evenodd" d="${mD}"/></svg>`;
fs.writeFileSync(out('src/assets/logo/simbolo-m.svg'), simbolo('#00B8D9'));

// Ícone quadrado: M ciano sobre #0B1620, com respiro de ~18%
const iconeSvg = (size) => {
  const pad = 0.18;
  const inner = size * (1 - pad * 2);
  const scale = inner / 424;
  const h = 258 * scale;
  const tx = size * pad - 84 * scale;
  const ty = (size - h) / 2 - 75 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#0B1620"/><path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})" fill="#00B8D9" fill-rule="evenodd" d="${mD}"/></svg>`;
};
fs.writeFileSync(out('public/favicon.svg'), iconeSvg(64));
for (const [nome, size] of [
  ['favicon-32.png', 32],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(Buffer.from(iconeSvg(size))).png().toFile(out('public', nome));
}
fs.writeFileSync(
  out('public/manifest.webmanifest'),
  JSON.stringify(
    {
      name: 'Miranda Engenharia',
      short_name: 'Miranda',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      background_color: '#0B1620',
      theme_color: '#0B1620',
      display: 'browser',
    },
    null,
    2,
  ),
);

// ---------- Fotos ----------
const fotos = [
  ['foto_engenheiro.png', 'hero-engenheiro.png'],
  ['imagem_engenheiro_atuando.jpeg', 'engenheiro-valvula.jpeg'],
  ['imagem_serviço.jpeg', 'bancada-valvula.jpeg'],
];
for (const [de, para] of fotos) {
  const src = path.join(kit, de);
  if (fs.existsSync(src)) fs.copyFileSync(src, out('src/assets/fotos', para));
}

// ---------- Mapa do Brasil ----------
const mapa = fs.readFileSync(path.join(kit, 'mapa-brasil.svg'), 'utf8');
const estados = [...mapa.matchAll(/<path\s+d="([^"]+)"\s+title="([^"]+)"\s+id="BR-([A-Z]{2})"/g)].map(
  ([, d, nome, uf]) => ({ uf, nome, d: d.replace(/\s+/g, ' ').trim() }),
);
if (estados.length !== 27) throw new Error(`Esperava 27 estados, encontrei ${estados.length}`);
fs.writeFileSync(
  out('src/data/mapa-brasil.ts'),
  `// Gerado por scripts/preparar-assets.mjs a partir de assets/mapa-brasil.svg (MapSVG, uso livre).
// Não edite à mão.
export const mapaViewBox = '0 0 612.52 639.04';
// Limites geográficos do SVG (lon/lat) para posicionar pontos
export const mapaGeo = { lonMin: -74.008595, lonMax: -34.789914, latMax: 5.275696, latMin: -33.743888, largura: 612.51611, altura: 639.04297 };
export const estados: { uf: string; nome: string; d: string }[] = ${JSON.stringify(estados)};
`,
);

console.log('Assets preparados.');
