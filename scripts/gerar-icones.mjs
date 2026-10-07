// Extrai os ícones usados no site (lucide-static, licença ISC; simple-icons, CC0)
// para src/data/icones.ts, evitando dependência em tempo de execução.
// Uso: node scripts/gerar-icones.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
const lucideDir = path.join(root, 'node_modules/lucide-static/icons');

const nomes = [
  'check', 'arrow-right', 'menu', 'x', 'chevron-down', 'quote',
  'shield-check', 'badge-check', 'map-pin', 'ban', 'file-warning', 'scale',
  'clipboard-check', 'camera', 'send', 'file-text', 'hard-hat', 'calendar-check', 'mail',
];

const icones = {};
for (const nome of nomes) {
  const svg = fs.readFileSync(path.join(lucideDir, `${nome}.svg`), 'utf8');
  const corpo = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>[\s\S]*$/, '')
    .replace(/\s*\n\s*/g, '')
    .trim();
  icones[nome] = corpo;
}

const { siWhatsapp } = require('simple-icons');

fs.writeFileSync(
  path.join(root, 'src/data/icones.ts'),
  `// Gerado por scripts/gerar-icones.mjs. Ícones de traço: lucide (ISC). WhatsApp: simple-icons (CC0).
export const iconesTraco = ${JSON.stringify(icones, null, 2)} as const;
export const whatsappPath = ${JSON.stringify(siWhatsapp.path)};
export type NomeIcone = keyof typeof iconesTraco | 'whatsapp';
`,
);
console.log('Ícones gerados:', Object.keys(icones).length + 1);
