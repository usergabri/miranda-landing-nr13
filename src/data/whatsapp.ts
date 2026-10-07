import { site } from './site';

export const mensagens = {
  geral: 'Olá! Vim pelo site da Miranda Engenharia e gostaria de um orçamento.',
  riscos: 'Olá! Quero verificar se meus equipamentos estão em dia com a NR-13.',
  nr13: 'Olá! Preciso de inspeção NR-13 para caldeira, vaso de pressão ou tubulação.',
  nr12: 'Olá! Preciso de adequação ou laudo de NR-12 (segurança em máquinas).',
  nr11: 'Olá! Preciso de serviço de NR-11 (movimentação e armazenagem).',
  andaimes: 'Olá! Preciso de laudo de andaimes.',
  laudos: 'Olá! Preciso de um laudo técnico mecânico.',
  exaustao: 'Olá! Preciso de laudo de exaustão para cozinha.',
  art: 'Olá! Preciso de emissão de ART.',
  rt: 'Olá! Preciso de Responsável Técnico para minha empresa.',
  crea: 'Olá! Preciso regularizar instalações ou equipamentos junto ao CREA.',
  pmoc: 'Olá! Preciso de elaboração ou atualização de PMOC.',
  climatizacao: 'Olá! Preciso de projeto ou adequação de climatização.',
  engenheiro: 'Olá! Gostaria de falar diretamente com o engenheiro.',
  depoimentos: 'Olá! Vi os casos de clientes no site e quero um orçamento.',
} as const;

export type ChaveWhatsApp = keyof typeof mensagens;

export const waLink = (chave: ChaveWhatsApp) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagens[chave])}`;

/** Atributos comuns a todo link de WhatsApp (nova aba + rastreamento). */
export const waAttrs = (chave: ChaveWhatsApp, secao: string) => ({
  href: waLink(chave),
  target: '_blank',
  rel: 'noopener',
  'data-servico': chave,
  'data-secao': secao,
});
