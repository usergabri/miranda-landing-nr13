import type { ChaveWhatsApp } from './whatsapp';

export const nr13 = {
  equipamentos: [
    {
      titulo: 'Caldeiras',
      texto: 'Inspeção de segurança inicial, periódica e extraordinária.',
      foto: null,
      legendaPlaceholder: 'caldeira inspecionada em campo',
    },
    {
      titulo: 'Vasos de pressão',
      texto: 'Compressores, reservatórios de ar, autoclaves, digestores e demais vasos.',
      foto: 'bancada-valvula',
      alt: 'Válvula de segurança montada em bancada de teste com manômetro digital, durante aferição em uma indústria',
      legendaPlaceholder: '',
    },
    {
      titulo: 'Tubulações',
      texto: 'Inspeção e documentação das linhas sujeitas à NR-13.',
      foto: null,
      legendaPlaceholder: 'tubulação industrial sujeita à NR-13',
    },
  ],
  entregaveis: [
    'Inspeção inicial, periódica e extraordinária',
    'Medição de espessura por ultrassom',
    'Aferição de válvulas de segurança e manômetros',
    'Prontuário, registro de segurança e reconstituição de prontuário quando necessário',
    'Relatório de inspeção com ART',
    'Controle dos vencimentos, com aviso antes da próxima inspeção',
  ],
};

export interface GrupoServico {
  titulo: string;
  apoio: string;
  itens: { nome: string; chave: ChaveWhatsApp }[];
}

export const gruposServicos: GrupoServico[] = [
  {
    titulo: 'Segurança em máquinas e operações',
    apoio: 'Máquinas, equipamentos de movimentação e andaimes avaliados e documentados conforme a norma.',
    itens: [
      { nome: 'NR-12 — segurança em máquinas', chave: 'nr12' },
      { nome: 'NR-11 — movimentação e armazenagem', chave: 'nr11' },
      { nome: 'Laudo de andaimes', chave: 'andaimes' },
    ],
  },
  {
    titulo: 'Laudos técnicos mecânicos',
    apoio: 'Parecer técnico assinado, com ART, para fiscalização, seguro, perícia ou cliente.',
    itens: [
      { nome: 'Laudos de segurança, desempenho e conformidade', chave: 'laudos' },
      { nome: 'Laudo de exaustão para cozinhas', chave: 'exaustao' },
    ],
  },
  {
    titulo: 'Regularização e responsabilidade técnica',
    apoio: 'A Miranda assume a responsabilidade técnica e resolve a regularização no CREA.',
    itens: [
      { nome: 'Emissão de ART', chave: 'art' },
      { nome: 'Responsável Técnico para empresas, indústrias e prestadores', chave: 'rt' },
      { nome: 'Regularização de instalações e equipamentos junto ao CREA', chave: 'crea' },
    ],
  },
  {
    titulo: 'Climatização',
    apoio: 'Plano de manutenção exigido para ambientes climatizados, mais projetos e adequações.',
    itens: [
      { nome: 'PMOC — elaboração e atualização', chave: 'pmoc' },
      { nome: 'Projetos e adequações de climatização', chave: 'climatizacao' },
    ],
  },
];

/** Lista plana usada no JSON-LD (hasOfferCatalog). */
export const catalogoServicos = [
  'Inspeção NR-13 de caldeiras',
  'Inspeção NR-13 de vasos de pressão',
  'Inspeção NR-13 de tubulações',
  ...gruposServicos.flatMap((g) => g.itens.map((i) => i.nome)),
];
