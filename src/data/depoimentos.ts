// Textos completos de conteudo/depoimentos-originais.txt (no kit: assets/depoimentos.txt),
// revisados apenas em ortografia e maiúsculas, sem alterar o sentido.

export interface Depoimento {
  id: string;
  destaque: boolean;
  nome: string;
  cargo: string;
  empresa: string;
  cidade: string;
  resumo: string;
  completo: string[];
  /** Arquivo da logo em src/assets/clientes (ainda não enviado pelo cliente). */
  logo: string | null;
}

export const depoimentos: Depoimento[] = [
  {
    id: 'leonardo',
    destaque: true,
    nome: 'Leonardo Campos',
    cargo: 'Sócio-proprietário',
    empresa: 'ART Mecânica Industrial',
    cidade: 'Sete Lagoas (MG)',
    resumo:
      'Contratamos a Miranda para cerca de 450 vasos de pressão, com medição de espessura e aferição de válvulas e manômetros. Mesmo com esse volume, a execução foi organizada e o cronograma foi cumprido.',
    // TODO: confirmar autorização para citar a Nemak
    // (original: "prestamos serviços para a Nemak, empresa multinacional")
    completo: [
      'Somos da ART Mecânica e Automação, atuante no setor automotivo, e prestamos serviços para uma multinacional do setor automotivo. Para atender uma demanda do projeto, contratamos a Miranda Engenharia para integrar nossa equipe e realizar os serviços em aproximadamente 450 vasos de pressão.',
      'Foi um trabalho de grande volume, envolvendo a medição de espessura dos equipamentos, a aferição das válvulas e dos manômetros. Mesmo diante da quantidade de equipamentos, a execução foi organizada e acompanhada de forma profissional.',
      'Foi demonstrado capacidade de planejamento e organização para atender ao cronograma estabelecido, mantendo um bom fluxo de trabalho durante a execução. Os horários e os serviços previamente combinados foram respeitados, o que foi importante para o andamento do projeto.',
      'Outro ponto positivo foi a organização das informações e da documentação gerada durante o processo. O trabalho foi conduzido de forma estruturada, permitindo que conseguíssemos acompanhar e atender às necessidades do projeto dentro dos prazos determinados.',
      'A Miranda Engenharia nos deu o suporte técnico necessário para atender uma demanda de grande porte com organização, responsabilidade e comprometimento.',
    ],
    logo: null,
  },
  {
    id: 'augusto',
    destaque: false,
    nome: 'Augusto Bernardes',
    cargo: 'Gerente Industrial',
    empresa: 'Protein Meal',
    cidade: 'Nova Esperança (PR)',
    resumo:
      'A equipe não se limitou a executar. Acompanhou as pendências encontradas até que todas fossem resolvidas, e entregou a documentação completa.',
    completo: [
      'Contratamos a Miranda Engenharia para realizar os serviços relacionados aos nossos digestores, incluindo os serviços nas válvulas, a aferição dos manômetros e a emissão das respectivas RTs e documentações técnicas.',
      'Um dos pontos que mais destacamos no trabalho foi a atenção dada às pendências encontradas durante o processo. A equipe não se limitou à execução dos serviços, mas acompanhou as necessidades identificadas e trabalhou para que todas fossem devidamente solucionadas.',
      'Também tivemos um atendimento muito organizado e profissional, com os serviços realizados conforme o que havia sido previamente combinado e dentro do cronograma estabelecido.',
      'Ao final, recebemos a documentação e os laudos necessários de forma completa, com as pendências que precisavam ser resolvidas devidamente atendidas. Foi um trabalho que nos trouxe mais segurança e tranquilidade em relação aos nossos equipamentos e à documentação técnica.',
    ],
    logo: null,
  },
  {
    id: 'larissa',
    destaque: false,
    nome: 'Larissa Sisti Brasinha',
    cargo: 'Sócia-proprietária',
    empresa: 'Biobras Biodiesel',
    cidade: 'Nova Esperança (PR)',
    resumo:
      'Cinco compressores e um vaso de pressão, com atendimento claro e próximo. Os laudos foram entregues completos e dentro do prazo.',
    completo: [
      'Contratamos a Miranda Engenharia para realizar os serviços relacionados a cinco compressores e um vaso de pressão da Biobras, incluindo a elaboração da documentação necessária, emissão da RT e atendimento às especificações técnicas aplicáveis.',
      'Durante todo o processo, tivemos um atendimento muito claro e próximo. Sempre que surgia alguma necessidade ou dúvida relacionada aos equipamentos ou à documentação, recebíamos as orientações necessárias para dar continuidade ao processo de forma adequada.',
      'Também foi demonstrado comprometimento com os horários e prazos estabelecidos. O serviço foi realizado conforme o combinado e os laudos e documentos necessários foram entregues completos dentro do prazo determinado.',
      'Além da parte técnica, considero que a organização e a facilidade de comunicação fizeram diferença durante o serviço. Tivemos a tranquilidade de saber o que estava sendo feito, quais informações eram necessárias e quais etapas precisavam ser concluídas.',
      'Ficamos satisfeitos com o atendimento e com a forma responsável e profissional como todo o serviço foi conduzido.',
    ],
    logo: null,
  },
];
