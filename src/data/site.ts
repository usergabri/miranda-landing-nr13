export const site = {
  nome: 'Miranda Engenharia',
  cidade: 'Nova Esperança',
  uf: 'PR',
  areaAtendimento: 'Todo o Brasil',
  whatsapp: '5544997127007', // CONFIRMAR: o cliente enviou "44 9712-7007"; assumido o 9 extra
  whatsappExibicao: '(44) 99712-7007',
  creaResponsavel: '216375/D', // confirmar se exibe como "CREA-PR 216375/D"
  nomeEngenheiro: '{{NOME_ENGENHEIRO}}',
  anoFundacao: '2024', // CONFIRMAR
  prazoLaudo: '{{PRAZO_LAUDO}}',
  cnpj: '{{CNPJ}}',
  email: '{{EMAIL}}',
  estadosAtendidos: ['PR', 'MG', '{{UF_3}}', '{{UF_4}}'],
  numeros: [
    { valor: 1000, prefixo: '+', legenda: 'laudos técnicos emitidos' },
    { valor: 500, prefixo: '+', legenda: 'equipamentos inspecionados' },
    { valor: 300, prefixo: '+', legenda: 'ARTs emitidas' },
    { valor: 4, prefixo: '', sufixo: ' estados', legenda: 'já atendidos, com atuação em todo o Brasil' },
  ],
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? '',
};

/** Indica se um valor ainda é um marcador {{...}} a ser preenchido. */
export const ehMarcador = (valor: string) => /^\{\{.+\}\}$/.test(valor);
