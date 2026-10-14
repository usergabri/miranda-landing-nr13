// Caminhos internos respeitando o `base` do Astro: o mesmo build funciona na raiz do
// domínio (Vercel, cPanel) e em subpasta (GitHub Pages: /miranda-landing-nr13/).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Caminho interno a partir da raiz do site, ex.: caminho('/politica-de-privacidade'). */
export const caminho = (p: string) => `${base}${p}` || '/';

/** URL absoluta para canonical, Open Graph e JSON-LD. */
export const urlAbsoluta = (p: string, site: URL | undefined) => new URL(caminho(p), site).href;
