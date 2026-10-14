// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domínio final ainda não definido: configure SITE_URL no ambiente (Vercel) antes do deploy.
// TODO: definir o domínio definitivo da Miranda Engenharia
const site = process.env.SITE_URL || 'https://dominio-a-definir.example';

// Subpasta de publicação (GitHub Pages usa /miranda-landing-nr13). Raiz por padrão.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
