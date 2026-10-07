/** Tokens da identidade Miranda Engenharia. Use somente estas cores. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,ts}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      steel: {
        950: '#0B1620', // fundo principal e texto em fundo claro
        900: '#132331', // superfícies
        800: '#1F3344', // bordas no escuro
      },
      mist: '#F2F6F8', // seções claras
      brand: {
        DEFAULT: '#00B8D9', // só sobre fundo escuro
        ink: '#00788F', // ciano para texto em fundo claro
      },
      muted: {
        DEFAULT: '#9FB0BF', // apoio no escuro
        light: '#5A6B7A', // apoio no claro
      },
      alert: '#F5A524', // somente seção Riscos
      whatsapp: {
        DEFAULT: '#25D366', // somente botões de WhatsApp
        hover: '#1EBE5A',
      },
    },
    fontFamily: {
      display: ['Montserrat', 'system-ui', 'sans-serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      borderRadius: { card: '6px' },
    },
  },
};
