import { BudgetCategory, TripDocument, ParkInfo, ParkRoute, ChecklistItem, FoodItem } from '@/types';

// === DEFAULT BUDGET CATEGORIES ===
export const DEFAULT_BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: 'passagens', name: 'Passagens Aereas', icon: '✈️', plannedBRL: 0, plannedUSD: 0 },
  { id: 'acomodacao', name: 'Hospedagem', icon: '🏨', plannedBRL: 0, plannedUSD: 0 },
  { id: 'transporte', name: 'Transporte', icon: '🚗', plannedBRL: 0, plannedUSD: 0 },
  { id: 'ingressos', name: 'Ingressos Parques', icon: '🎢', plannedBRL: 0, plannedUSD: 0 },
  { id: 'fastpass', name: 'FastPass / Extras', icon: '⚡', plannedBRL: 0, plannedUSD: 0 },
  { id: 'alimentacao', name: 'Alimentacao', icon: '🍽️', plannedBRL: 0, plannedUSD: 0 },
  { id: 'compras', name: 'Compras / Presentes', icon: '🛍️', plannedBRL: 0, plannedUSD: 0 },
  { id: 'seguro', name: 'Seguro Viagem', icon: '🛡️', plannedBRL: 0, plannedUSD: 0 },
  { id: 'cambio', name: 'Cambio e Taxas', icon: '💱', plannedBRL: 0, plannedUSD: 0 },
  { id: 'saude', name: 'Saude / Farmacia', icon: '💊', plannedBRL: 0, plannedUSD: 0 },
  { id: 'emergencia', name: 'Emergencia (10-15%)', icon: '🆘', plannedBRL: 0, plannedUSD: 0 },
];

// === DEFAULT DOCUMENTS ===
export const DEFAULT_DOCUMENTS: TripDocument[] = [
  { id: 'doc-1', name: 'Passaporte - Pai', owner: 'Rafael', status: 'nao-iniciado', notes: 'Validade minima 6 meses alem da data de retorno' },
  { id: 'doc-2', name: 'Passaporte - Mae', owner: 'Jac', status: 'nao-iniciado', notes: 'Validade minima 6 meses alem da data de retorno' },
  { id: 'doc-3', name: 'Passaporte - Crianca', owner: 'Crianca', status: 'nao-iniciado', notes: 'Passaporte infantil - validade de 5 anos' },
  { id: 'doc-4', name: 'Visto Americano (B-1/B-2)', owner: 'Todos', status: 'nao-iniciado', notes: 'Ou ESTA se elegivel' },
  { id: 'doc-5', name: 'CNH Internacional', owner: 'Rafael', status: 'nao-iniciado', notes: 'Para conducao do veiculo alugado nos EUA' },
  { id: 'doc-6', name: 'Cartao de Vacinacao', owner: 'Todos', status: 'nao-iniciado', notes: 'Verificar requisitos atuais para entrada nos EUA' },
  { id: 'doc-7', name: 'Seguro Viagem', owner: 'Todos', status: 'nao-iniciado', notes: 'Com cobertura medica. Crianca deve estar incluida.' },
  { id: 'doc-8', name: 'Confirmacao de Reserva - Hotel', owner: 'Rafael', status: 'nao-iniciado', notes: 'Copia digital e impressa' },
  { id: 'doc-9', name: 'Confirmacao - Aluguel de Carro', owner: 'Rafael', status: 'nao-iniciado', notes: 'Com nome do motorista principal' },
  { id: 'doc-10', name: 'Cartoes de Embarque', owner: 'Todos', status: 'nao-iniciado', notes: 'Digitais ou impressos para todos' },
  { id: 'doc-11', name: 'Ingressos dos Parques', owner: 'Todos', status: 'nao-iniciado', notes: 'Digital ou impressao - acessar sem internet' },
  { id: 'doc-12', name: 'Cartao de Credito Internacional', owner: 'Rafael', status: 'nao-iniciado', notes: 'Mastercard/Visa com limite suficiente. IOF 6.38%' },
  { id: 'doc-13', name: 'Contatos de Emergencia', owner: 'Todos', status: 'nao-iniciado', notes: 'Embaixada brasileira, seguro viagem, hotel, familiar no Brasil' },
];

// === PARK DATA ===
const MK_ROUTE: ParkRoute[] = [
  { time: '07:30', activity: 'Chegada antes da abertura (Early Entry para hospedes Disney)' },
  { time: '08:00', activity: 'Direto para Fantasyland: Peter Pan\'s Flight, It\'s a Small World, Dumbo' },
  { time: '09:30', activity: 'Meeting com Mickey ou Personagens enquanto parque ainda esta vazio' },
  { time: '10:30', activity: 'Buzz Lightyear e Tomorrowland antes do rush' },
  { time: '11:30', activity: 'Almoco tranquilo: Be Our Guest ou Pinocchio Village Haus' },
  { time: '13:00', activity: 'Cochilo no hotel (fundamental para crianca de 3 anos!)' },
  { time: '15:30', activity: 'Retorno ao parque: encontros com princesas, carrossel' },
  { time: '17:00', activity: 'Festival of Fantasy Parade - posicionar com 30min de antecedencia' },
  { time: '18:30', activity: 'Jantar e compras na Main Street' },
  { time: '20:00', activity: 'Happily Ever After Fireworks (ou retorno ao hotel se crianca estiver cansada)' },
];

export const PARKS_DATA: ParkInfo[] = [
  {
    id: 'magic-kingdom',
    name: 'Magic Kingdom',
    icon: '🏰',
    color: '#1E4DB7',
    description: 'O parque mais iconico da Disney, ideal para criancas pequenas',
    attractions: [
      { name: 'Dumbo the Flying Elephant', suitability: 'perfeito', description: 'Sem restricao de altura', tip: 'Ir logo cedo para evitar fila' },
      { name: 'Peter Pan\'s Flight', suitability: 'perfeito', description: 'Encantador, sem restricao de altura', tip: 'Uma das filas mais longas - ir primeiro!' },
      { name: 'It\'s a Small World', suitability: 'perfeito', description: 'Classico - sem restricao de altura' },
      { name: 'Buzz Lightyear\'s Space Ranger Spin', suitability: 'perfeito', description: 'Divertido - sem restricao' },
      { name: 'The Many Adventures of Winnie the Pooh', suitability: 'perfeito', description: 'Perfeito para pequenos' },
      { name: 'Tomorrowland Speedway', suitability: 'perfeito', description: 'Com acompanhante adulto' },
      { name: 'Fantasyland Carousel', suitability: 'perfeito', description: 'Carrossel classico' },
      { name: 'Mickey\'s PhilharMagic', suitability: 'perfeito', description: 'Show 4D suave e divertido' },
      { name: 'Meeting Mickey Mouse', suitability: 'perfeito', description: 'Encontro personalizado', tip: 'Essencial! Agende com antecedencia' },
      { name: 'Festival of Fantasy Parade', suitability: 'perfeito', description: 'Desfile com todos os personagens', tip: 'Nao perca! Posicionar 30min antes' },
      { name: 'Haunted Mansion', suitability: 'cuidado', description: 'Pode assustar criancas sensiveis' },
      { name: 'Space Mountain', suitability: 'restrito', heightRestriction: 112, description: 'Restrito - min. 112cm de altura' },
      { name: 'Big Thunder Mountain', suitability: 'restrito', heightRestriction: 102, description: 'Restrito - min. 102cm de altura' },
      { name: 'Tiana\'s Bayou Adventure', suitability: 'restrito', heightRestriction: 102, description: 'Restrito - min. 102cm de altura' },
    ],
    route: MK_ROUTE,
    tips: [
      'Rider Switch: um pai fica com a crianca, o outro usa a atracao, depois trocam sem fila',
      'Stroller Parking: Disney tem areas especificas para estacionar strollers',
      'Disney Genie+ e Lightning Lane: validos para pular filas - avaliar custo x beneficio',
      'Park Pass Reservations: OBRIGATORIO reservar com antecedencia no Disney Parks site',
      'Chegada early entry: hospedes Disney entram 30min antes - aproveitar Fantasyland vazia',
      'Snacks imperdiveis: Mickey waffle, churro, Dole Whip, Mickey ice cream bar',
    ],
  },
  {
    id: 'epcot',
    name: 'EPCOT',
    icon: '🌍',
    color: '#6B21A8',
    description: 'Paises do mundo, shows e algumas atracoes para criancas',
    attractions: [
      { name: 'Frozen Ever After', suitability: 'perfeito', description: 'Atracao imperdivel para pequenos' },
      { name: 'Remy\'s Ratatouille Adventure', suitability: 'perfeito', description: 'Divertido e sem grandes emocoes' },
      { name: 'Figment\'s Imagination', suitability: 'perfeito', description: 'Colorido e estimulante' },
      { name: 'Living with the Land', suitability: 'perfeito', description: 'Passeio de barco calmo e educativo' },
      { name: 'The Seas with Nemo & Friends', suitability: 'perfeito', description: 'Aquario interativo' },
      { name: 'World Showcase', suitability: 'ok', description: 'Passeio pelas replicas de paises - visualmente rico' },
      { name: 'EPCOT Fireworks (Luminous)', suitability: 'perfeito', description: 'Um dos melhores shows de fogos do mundo' },
    ],
    tips: [
      'World Showcase e otimo para passear com stroller - tudo plano',
      'Frozen Ever After tem fila longa - usar Lightning Lane ou ir cedo',
      'Jantar no World Showcase: cada pais tem restaurante tematico',
    ],
  },
  {
    id: 'hollywood-studios',
    name: 'Hollywood Studios',
    icon: '🎬',
    color: '#DC2626',
    description: 'Shows e atracoes tematicas (Star Wars, Toy Story)',
    attractions: [
      { name: 'Toy Story Mania!', suitability: 'perfeito', description: 'Imperdivel para pequenos - sem restricao de altura' },
      { name: 'Alien Swirling Saucers', suitability: 'perfeito', description: 'Diversao garantida' },
      { name: 'Muppet*Vision 3D', suitability: 'perfeito', description: 'Show 3D divertido para toda familia' },
      { name: 'Disney Junior Dance Party', suitability: 'perfeito', description: 'Ideal para criancas de 2-5 anos', tip: 'Programacao favorita dos pequenos!' },
      { name: 'Star Wars: Galaxy\'s Edge', suitability: 'ok', description: 'Walking area impressionante' },
      { name: 'Slinky Dog Dash', suitability: 'cuidado', heightRestriction: 96, description: 'Restrito min 96cm - verificar altura da crianca' },
    ],
    tips: [
      'Disney Junior Dance Party e o highlight para criancas de 3 anos',
      'Toy Story Land: toda a area tematica e boa para criancas',
      'Galaxy\'s Edge impressiona visualmente mesmo sem ir nas atracoes restritas',
    ],
  },
  {
    id: 'animal-kingdom',
    name: 'Animal Kingdom',
    icon: '🦁',
    color: '#15803D',
    description: 'Animais, shows ao ar livre, Avatar Land',
    attractions: [
      { name: 'Festival of the Lion King', suitability: 'perfeito', description: 'Show imperdivel, emocionante' },
      { name: 'Finding Nemo: The Big Blue... and Beyond!', suitability: 'perfeito', description: 'Show musical aquatico' },
      { name: 'Kilimanjaro Safaris', suitability: 'perfeito', description: 'Ver animais reais de perto', tip: 'Ir de manha - animais mais ativos' },
      { name: 'Triceratop Spin', suitability: 'perfeito', description: 'Diversao na DinoLand' },
      { name: 'Avatar Flight of Passage', suitability: 'restrito', heightRestriction: 112, description: 'Restrito 112cm - para os pais quando crianca dorme no stroller' },
    ],
    tips: [
      'Safaris pela manha = animais mais ativos',
      'Shows musicais sao o ponto alto para familias com criancas',
      'DinoLand tem area de playground para criancas',
    ],
  },
  {
    id: 'universal-studios',
    name: 'Universal Studios',
    icon: '🎥',
    color: '#0369A1',
    description: 'Parque original com Diagon Alley (Harry Potter)',
    attractions: [
      { name: 'DreamWorks Destination', suitability: 'perfeito', description: 'Encontro com personagens Shrek, Kung Fu Panda' },
      { name: 'Despicable Me Minion Mayhem', suitability: 'cuidado', description: 'Movimento de tela - pode enjoar' },
      { name: 'Harry Potter - Diagon Alley', suitability: 'perfeito', description: 'Walking area impressionante - ambientacao incrivel' },
      { name: 'Hogwarts Express', suitability: 'perfeito', description: 'Imperdivel - conecta os dois parques', tip: 'Precisa de ingresso Park-to-Park!' },
    ],
    tips: [
      'Express Pass: recomendado se orcamento permitir - economiza 2-4h de fila',
      'Butterbeer: obrigatorio! Versao frozen e a favorita das criancas',
      'Character meet & greet: DreamWorks Destination com Shrek, Fiona, Burro',
    ],
  },
  {
    id: 'islands-of-adventure',
    name: 'Islands of Adventure',
    icon: '🏝️',
    color: '#7C3AED',
    description: 'Hogsmeade (Harry Potter), Dr. Seuss, Jurassic World',
    attractions: [
      { name: 'The Cat in the Hat', suitability: 'perfeito', description: 'Perfeito - sem restricao' },
      { name: 'One Fish, Two Fish, Red Fish, Blue Fish', suitability: 'perfeito', description: 'Crianca adora!' },
      { name: 'Caro-Seuss-el', suitability: 'perfeito', description: 'Carrossel tematico Dr. Seuss' },
      { name: 'Pteranodon Flyers', suitability: 'perfeito', description: 'Com acompanhante - experiencia unica' },
      { name: 'Hogsmeade', suitability: 'perfeito', description: 'Walking area + Butterbeer' },
      { name: 'Velocicoaster', suitability: 'restrito', heightRestriction: 137, description: 'Restrito - minimo 137cm' },
    ],
    tips: [
      'Dr. Seuss Landing: toda a area e perfeitamente adequada para criancas de 2-5 anos',
      'Chegada: abrir o parque - direto para Hogsmeade antes do rush',
      'Butterbeer gelado em Hogsmeade e obrigatorio!',
    ],
  },
  {
    id: 'seaworld',
    name: 'SeaWorld',
    icon: '🌊',
    color: '#0891B2',
    description: 'Experiencias com animais marinhos, shows e Sesame Street',
    attractions: [
      { name: 'Sesame Street Land', suitability: 'perfeito', description: 'Area tematica perfeita para criancas 2-5 anos' },
      { name: 'Elmo\'s Choo Choo Train', suitability: 'perfeito', description: 'Trenzinho da turma do Sesame Street' },
      { name: 'Orca Encounter', suitability: 'perfeito', description: 'Apresentacao educacional com orcas' },
      { name: 'Dolphin Nursery', suitability: 'perfeito', description: 'Ver golfinhos bebes de perto' },
      { name: 'Penguin Encounter', suitability: 'perfeito', description: 'Pinguins em ambiente refrigerado' },
    ],
    tips: [
      'Mais tranquilo que Disney e Universal - otimo para um dia mais relaxado',
      'Sesame Street Land e referencia cultural perfeita para crianca de 3 anos',
      'Chegada pela manha: animais mais ativos e filas menores',
      'Alimentar golfinhos: atividade paga - muito especial para criancas',
    ],
  },
];

// === RESTAURANT DATA ===
export interface RestaurantInfo {
  name: string;
  location: string;
  highlight: string;
  kidFriendly: boolean;
}

export const RESTAURANTS: RestaurantInfo[] = [
  { name: 'The Boathouse', location: 'Disney Springs', highlight: 'Frutos do mar. Barcos anfibios para tour.', kidFriendly: true },
  { name: 'T-Rex Cafe', location: 'Disney Springs', highlight: 'Tematico com dinossauros - criancas adoram. Barulhento.', kidFriendly: true },
  { name: 'Rainforest Cafe', location: 'Disney Springs', highlight: 'Animatronics de animais - muito divertido para criancas.', kidFriendly: true },
  { name: 'Voodoo Doughnut', location: 'Universal CityWalk', highlight: 'Donuts tematicos - sobremesa imperdivel.', kidFriendly: true },
  { name: 'Shake Shack', location: 'I-Drive / Disney Springs', highlight: 'Hamburguers e shakes - criancas adoram.', kidFriendly: true },
  { name: 'Olive Garden', location: 'Varias localizacoes', highlight: 'Italiano acessivel - boa para criancas seletivas.', kidFriendly: true },
  { name: 'Chick-fil-A', location: 'Varias localizacoes', highlight: 'Fast food premium - melhor nuggets dos EUA.', kidFriendly: true },
  { name: 'Culver\'s', location: 'Varias localizacoes', highlight: 'Butter Burgers e custard gelado - muito popular.', kidFriendly: true },
];

export interface SupermarketInfo {
  name: string;
  description: string;
}

export const SUPERMARKETS: SupermarketInfo[] = [
  { name: 'Publix', description: 'Principal rede da Florida. Qualidade excelente. Secao infantil completa.' },
  { name: 'Walmart Supercenter', description: 'Mais barato. Aberto 24h. Otimo para volume e itens basicos.' },
  { name: 'Whole Foods', description: 'Premium e organico. Perto de Disney Springs e I-Drive.' },
  { name: 'Target', description: 'Equilibrio entre preco e qualidade. Secao de bebe e crianca excelente.' },
  { name: 'Aldi', description: 'Mais economico. Marcas proprias de qualidade. Otimo para frutas e laticinios.' },
];

export const FOOD_TIPS: string[] = [
  'Quick Service vs. Table Service: Quick e mais rapido e 30-40% mais barato',
  'Mobile Order (Disney e Universal apps): pedir pelo celular - evitar fila',
  'Refill Cup Disney: comprar a caneca de refrigerante recarregavel - economia em park days',
  'Refeicao dividida: porcoes americanas sao grandes - compartilhar prato entre crianca e adulto',
  'Snacks gratuitos: algumas areas oferecem degustacoes (EPCOT World Showcase)',
  'Horario das refeicoes: almocar as 11h ou 14h - evitar rush 12h-13h30',
];

export const SUPERMARKET_ESSENTIALS: string[] = [
  'Cafe da manha no hotel: cereal, leite, frutas, iogurte, pao, suco',
  'Snacks para os parques: barra de cereal, fruta seca, bolacha, biscoito de arroz',
  'Bebidas: agua mineral (mais barata que nos parques - $4-5 vs. $0.50)',
  'Protetor solar: muito mais barato no Walmart',
  'Medicina infantil: Tylenol, band-aid, termometro - ter em maos',
  'Snacks brasileiros: caso a crianca seja seletiva com comida',
];

// === GENERAL TIPS ===
// === SUITCASE CHECKLIST (Mala de Viagem) ===
let _sId = 0;
const sId = () => `suit-${++_sId}`;

export const DEFAULT_SUITCASE_ITEMS: ChecklistItem[] = [
  // Roupas
  { id: sId(), name: 'Camisetas (1 por dia + 2 extras)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Shorts / bermudas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Calcas compridas (2 para dias frios/restaurantes)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Meias (1 par por dia + 2 extras)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Roupas intimas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Pijamas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Casaco / moletom leve (ar condicionado forte)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Roupa de banho / biquini / sunga', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Tenis confortavel para parques', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Chinelo / sandalia', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Bone / chapeu', checked: false, category: 'Roupas' },
  // Crianca
  { id: sId(), name: 'Roupas da crianca (extras para acidentes)', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Fraldas (quantidade para os primeiros dias)', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Lencos umedecidos', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Brinquedo / pelucia favorita', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Mamadeira / copo com tampa', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Carrinho de bebe / stroller', checked: false, category: 'Crianca' },
  { id: sId(), name: 'Cadeirinha de carro (ou alugar la)', checked: false, category: 'Crianca' },
  // Higiene
  { id: sId(), name: 'Escova e pasta de dente', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Shampoo / condicionador', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Sabonete', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Desodorante', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Protetor solar (FPS 50+)', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Repelente de insetos', checked: false, category: 'Higiene' },
  // Eletronicos
  { id: sId(), name: 'Celular + carregador', checked: false, category: 'Eletronicos' },
  { id: sId(), name: 'Power bank', checked: false, category: 'Eletronicos' },
  { id: sId(), name: 'Adaptador de tomada (EUA usa tipo A/B)', checked: false, category: 'Eletronicos' },
  { id: sId(), name: 'Fone de ouvido', checked: false, category: 'Eletronicos' },
  { id: sId(), name: 'Camera / GoPro', checked: false, category: 'Eletronicos' },
  { id: sId(), name: 'Tablet / iPad (para crianca no aviao)', checked: false, category: 'Eletronicos' },
  // Documentos
  { id: sId(), name: 'Passaportes de todos', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Vistos / ESTA', checked: false, category: 'Documentos' },
  { id: sId(), name: 'CNH Internacional', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Comprovantes de reserva impressos', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Seguro viagem (copia digital e impressa)', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Cartao de credito internacional', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Dolares em especie', checked: false, category: 'Documentos' },
  // Outros
  { id: sId(), name: 'Capa de chuva compacta', checked: false, category: 'Outros' },
  { id: sId(), name: 'Garrafa de agua reutilizavel', checked: false, category: 'Outros' },
  { id: sId(), name: 'Mochila pequena para os parques', checked: false, category: 'Outros' },
  { id: sId(), name: 'Saco plastico para roupa suja', checked: false, category: 'Outros' },
  { id: sId(), name: 'Almofada de pescoco (aviao)', checked: false, category: 'Outros' },
];

// === BACKPACK CHECKLIST (Mochila do Parque) ===
let _bId = 0;
const bId = () => `back-${++_bId}`;

export const DEFAULT_BACKPACK_ITEMS: ChecklistItem[] = [
  { id: bId(), name: 'Protetor solar', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Garrafas de agua (geladas)', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Snacks / biscoitos para crianca', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Fraldas + lencos umedecidos', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Troca de roupa da crianca', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Power bank carregado', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Celular + carregador', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Bone / chapeu', checked: false, category: 'Protecao' },
  { id: bId(), name: 'Capa de chuva compacta', checked: false, category: 'Protecao' },
  { id: bId(), name: 'Casaco leve (ar condicionado)', checked: false, category: 'Protecao' },
  { id: bId(), name: 'Oculos de sol', checked: false, category: 'Protecao' },
  { id: bId(), name: 'Remedios basicos (dor, febre, alergia)', checked: false, category: 'Saude' },
  { id: bId(), name: 'Band-aid', checked: false, category: 'Saude' },
  { id: bId(), name: 'Repelente', checked: false, category: 'Saude' },
  { id: bId(), name: 'Alcool em gel', checked: false, category: 'Saude' },
  { id: bId(), name: 'Brinquedo pequeno / livro para filas', checked: false, category: 'Crianca' },
  { id: bId(), name: 'Mamadeira / copo com tampa', checked: false, category: 'Crianca' },
  { id: bId(), name: 'Chupeta (se usar)', checked: false, category: 'Crianca' },
  { id: bId(), name: 'Cartao de credito / dolares', checked: false, category: 'Outros' },
  { id: bId(), name: 'Ingressos do parque (digital/impresso)', checked: false, category: 'Outros' },
  { id: bId(), name: 'Autografo book + caneta (para personagens)', checked: false, category: 'Outros' },
];

// === PHARMACY CHECKLIST ===
let _pId = 0;
const pId = () => `pharm-${++_pId}`;

export const DEFAULT_PHARMACY_ITEMS: ChecklistItem[] = [
  { id: pId(), name: 'Dipirona / Paracetamol infantil', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Ibuprofeno infantil', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Antialergico (Allegra / Loratadina)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Soro fisiologico (spray nasal)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Remedio para enjoo', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Buscopan (colica)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Antidiarreico', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Pomada para assadura', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Termometro digital', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Band-aids variados', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Gaze e esparadrapo', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Alcool em gel', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Pomada para picada de inseto', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Colirio lubrificante', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Protetor solar FPS 50+ (adulto)', checked: false, category: 'Protecao' },
  { id: pId(), name: 'Protetor solar FPS 50+ (infantil)', checked: false, category: 'Protecao' },
  { id: pId(), name: 'Protetor labial com FPS', checked: false, category: 'Protecao' },
  { id: pId(), name: 'Repelente de insetos (adulto)', checked: false, category: 'Protecao' },
  { id: pId(), name: 'Repelente de insetos (infantil)', checked: false, category: 'Protecao' },
];

// === GROCERY CHECKLIST ===
let _gId = 0;
const gId = () => `groc-${++_gId}`;

export const DEFAULT_GROCERY_ITEMS: ChecklistItem[] = [
  { id: gId(), name: 'Agua mineral (pack)', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Suco de frutas (caixinha)', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Leite', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Cereal matinal', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Pao de forma', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Manteiga / cream cheese', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Iogurte', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Frutas (banana, maca, uva)', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Ovos', checked: false, category: 'Cafe da Manha' },
  { id: gId(), name: 'Barra de cereal', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Biscoito / bolacha', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Fruta seca / castanhas', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Biscoito de arroz', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Goldfish crackers (crianca adora)', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Queijo em tablete / babybel', checked: false, category: 'Snacks' },
  { id: gId(), name: 'Presunto / peito de peru', checked: false, category: 'Refeicoes' },
  { id: gId(), name: 'Queijo fatiado', checked: false, category: 'Refeicoes' },
  { id: gId(), name: 'Macarrao instantaneo / cup noodles', checked: false, category: 'Refeicoes' },
  { id: gId(), name: 'Papel toalha', checked: false, category: 'Utilitarios' },
  { id: gId(), name: 'Sacos plasticos ziplock', checked: false, category: 'Utilitarios' },
  { id: gId(), name: 'Guardanapos', checked: false, category: 'Utilitarios' },
];

export const GENERAL_TIPS: { category: string; icon: string; tips: string[] }[] = [
  {
    category: 'Clima e Protecao',
    icon: '☀️',
    tips: [
      'Orlando e quente e chuvoso (jun-set). Protetor solar e capa de chuva fina sao obrigatorios.',
      'Hidratacao: crianca precisa beber agua frequentemente. Temperatura pode passar dos 35C.',
      'Sapatos: usar tenis confortavel - familia pode caminhar 15-20km por dia nos parques.',
    ],
  },
  {
    category: 'Stroller e Crianca',
    icon: '👶',
    tips: [
      'Alugar stroller nos parques (~$50/dia) OU levar o proprio.',
      'Horario dos parques: abrir o parque e ir embora quando crianca cansar.',
      'Criancas menores de 3 anos entram de graca na maioria das atracoes.',
      'Cochilo apos o almoco e fundamental - planejar retorno ao hotel.',
    ],
  },
  {
    category: 'Fotos e Memorias',
    icon: '📸',
    tips: [
      'PhotoPass Disney ou Universal Photo - avaliar pacote de fotos.',
      'Reserva de restaurantes: fazer com 60 dias de antecedencia (Disney table service).',
    ],
  },
  {
    category: 'Comunicacao e Dinheiro',
    icon: '💳',
    tips: [
      'Chip americano ou eSIM - T-Mobile e AT&T tem melhor cobertura em Orlando.',
      'Usar cartao de credito sem anuidade internacional. Levar algum cash para gorjetas.',
      'Gorjetas: 18-20% em restaurantes e obrigatorio culturalmente nos EUA.',
    ],
  },
  {
    category: 'Saude e Farmacia',
    icon: '🏥',
    tips: [
      'Walgreens e CVS tem itens basicos de saude.',
      'Garden Grocer faz delivery no hotel.',
      'Seguro viagem com cobertura medica e imprescindivel.',
    ],
  },
  {
    category: 'Transporte',
    icon: '🚗',
    tips: [
      'SUV ou Minivan sao mais confortaveis para familia com stroller e malas.',
      'Cadeirinha infantil obrigatoria para criancas abaixo de 4 anos na Florida.',
      'Tollroads (pedagios) em Orlando - configurar SunPass ou usar All Inclusive.',
      'Estacionamento nos parques Disney (~$30/dia) e Universal (~$30/dia).',
      'Waze funciona muito bem em Orlando; baixar offline antes de embarcar.',
    ],
  },
];
