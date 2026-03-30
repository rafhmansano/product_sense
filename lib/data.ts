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
  { id: 'doc-1', name: 'Passaportes', owner: 'Todos', status: 'nao-iniciado', notes: 'Validade mínima de 6 meses além da data de retorno. Crianças precisam de passaporte próprio.' },
  { id: 'doc-4', name: 'Visto Americano (B-1/B-2)', owner: 'Todos', status: 'nao-iniciado', notes: 'Necessário para cada membro da família. Ou ESTA se elegível.' },
  { id: 'doc-5', name: 'CNH Internacional', owner: 'Motorista', status: 'nao-iniciado', notes: 'Para condução do veículo alugado nos EUA' },
  { id: 'doc-6', name: 'Cartão de Vacinação', owner: 'Todos', status: 'nao-iniciado', notes: 'Verificar requisitos atuais para entrada nos EUA' },
  { id: 'doc-7', name: 'Seguro Viagem', owner: 'Todos', status: 'nao-iniciado', notes: 'Com cobertura médica para todos os membros da família, incluindo crianças.' },
  { id: 'doc-8', name: 'Confirmação de Reserva - Hotel', owner: 'Responsável', status: 'nao-iniciado', notes: 'Cópia digital e impressa' },
  { id: 'doc-9', name: 'Confirmação - Aluguel de Carro', owner: 'Responsável', status: 'nao-iniciado', notes: 'Com nome do motorista principal' },
  { id: 'doc-10', name: 'Cartões de Embarque', owner: 'Todos', status: 'nao-iniciado', notes: 'Digitais ou impressos para todos os viajantes' },
  { id: 'doc-11', name: 'Ingressos dos Parques', owner: 'Todos', status: 'nao-iniciado', notes: 'Digital ou impressão - acessar sem internet. Crianças menores de 3 anos não precisam de ingresso.' },
  { id: 'doc-12', name: 'Cartão de Crédito Internacional', owner: 'Responsável', status: 'nao-iniciado', notes: 'Mastercard/Visa com limite suficiente. IOF 6.38%' },
  { id: 'doc-13', name: 'Contatos de Emergência', owner: 'Todos', status: 'nao-iniciado', notes: 'Embaixada brasileira, seguro viagem, hotel, familiar no país de origem' },
  { id: 'doc-14', name: 'Autorização de Viagem (menores)', owner: 'Responsável', status: 'nao-iniciado', notes: 'Obrigatório se criança viaja sem ambos os pais. Autenticar em cartório.' },
];

// === PARK DATA ===
const MK_ROUTE: ParkRoute[] = [
  { time: '07:30', activity: 'Chegada antes da abertura (Early Entry para hóspedes Disney)' },
  { time: '08:00', activity: 'Fantasyland: Peter Pan\'s Flight, It\'s a Small World, Dumbo (ótimo para todas as idades)' },
  { time: '09:30', activity: 'Encontro com personagens (Mickey, princesas) enquanto o parque está vazio' },
  { time: '10:30', activity: 'Buzz Lightyear e Tomorrowland. Adolescentes: Space Mountain e Big Thunder Mountain' },
  { time: '11:30', activity: 'Almoço: Be Our Guest (reservar!), Pinocchio Village Haus ou Cosmic Ray\'s' },
  { time: '13:00', activity: 'Pausa opcional: descanso no hotel para crianças pequenas ou explorar Adventureland' },
  { time: '15:30', activity: 'Retorno: Haunted Mansion, Jungle Cruise, encontros com personagens' },
  { time: '17:00', activity: 'Festival of Fantasy Parade - posicionar com 30min de antecedência' },
  { time: '18:30', activity: 'Jantar e compras na Main Street' },
  { time: '20:00', activity: 'Happily Ever After Fireworks - imperdível para todas as idades!' },
];

export const PARKS_DATA: ParkInfo[] = [
  {
    id: 'magic-kingdom',
    name: 'Magic Kingdom',
    icon: '🏰',
    color: '#1E4DB7',
    description: 'O parque mais icônico da Disney, com atrações para todas as idades',
    attractions: [
      { name: 'Dumbo the Flying Elephant', suitability: 'perfeito', description: 'Sem restrição de altura. Todas as idades.', tip: 'Ir logo cedo para evitar fila' },
      { name: 'Peter Pan\'s Flight', suitability: 'perfeito', description: 'Encantador para todas as idades, sem restrição', tip: 'Uma das filas mais longas - ir primeiro!' },
      { name: 'It\'s a Small World', suitability: 'perfeito', description: 'Clássico - sem restrição. Ótimo para bebês e crianças' },
      { name: 'Buzz Lightyear\'s Space Ranger Spin', suitability: 'perfeito', description: 'Divertido para crianças e adolescentes - competição de pontos' },
      { name: 'The Many Adventures of Winnie the Pooh', suitability: 'perfeito', description: 'Ideal para crianças pequenas e bebês' },
      { name: 'Tomorrowland Speedway', suitability: 'perfeito', description: 'Crianças dirigem com acompanhante. Adolescentes podem ir sozinhos.' },
      { name: 'Fantasyland Carousel', suitability: 'perfeito', description: 'Carrossel clássico - todas as idades' },
      { name: 'Mickey\'s PhilharMagic', suitability: 'perfeito', description: 'Show 4D suave - ótimo para descansar e curtir com a família' },
      { name: 'Meeting Mickey Mouse', suitability: 'perfeito', description: 'Encontro personalizado com o Mickey', tip: 'Agende com antecedência!' },
      { name: 'Festival of Fantasy Parade', suitability: 'perfeito', description: 'Desfile com todos os personagens', tip: 'Posicionar 30min antes para bom lugar' },
      { name: 'Haunted Mansion', suitability: 'cuidado', description: 'Pode assustar crianças sensíveis (menores de 6). Adolescentes adoram!' },
      { name: 'Space Mountain', suitability: 'restrito', heightRestriction: 112, description: 'Montanha-russa no escuro. Mín. 112cm. Ótima para adolescentes e adultos.' },
      { name: 'Big Thunder Mountain', suitability: 'restrito', heightRestriction: 102, description: 'Montanha-russa moderada. Mín. 102cm. Boa para crianças maiores e adolescentes.' },
      { name: 'Tiana\'s Bayou Adventure', suitability: 'restrito', heightRestriction: 102, description: 'Mín. 102cm. Diversão para toda família que atingir a altura.' },
      { name: 'Jungle Cruise', suitability: 'perfeito', description: 'Passeio de barco com piadas - divertido para todas as idades' },
      { name: 'Pirates of the Caribbean', suitability: 'perfeito', description: 'Passeio de barco temático. Pode assustar bebês em partes escuras.' },
    ],
    route: MK_ROUTE,
    tips: [
      'Rider Switch: um adulto fica com crianças pequenas enquanto o outro vai na atração, depois trocam sem fila',
      'Stroller Parking: Disney tem áreas específicas. Identifique o seu para não confundir!',
      'Disney Genie+ e Lightning Lane: válidos para pular filas - avaliar custo x benefício',
      'Park Pass Reservations: OBRIGATÓRIO reservar com antecedência no Disney Parks site',
      'Early Entry: hóspedes Disney entram 30min antes - aproveitar atrações populares',
      'Snacks imperdíveis: Mickey waffle, churro, Dole Whip, Mickey ice cream bar',
      'Bebês e crianças pequenas: Baby Care Center na Main Street com fraldário, micro-ondas e área de amamentação',
      'Adolescentes: Space Mountain, Big Thunder e TRON (quando disponível) são imperdíveis',
    ],
  },
  {
    id: 'epcot',
    name: 'EPCOT',
    icon: '🌍',
    color: '#6B21A8',
    description: 'Países do mundo, shows e atrações para toda a família',
    attractions: [
      { name: 'Frozen Ever After', suitability: 'perfeito', description: 'Imperdível para fãs de Frozen - todas as idades' },
      { name: 'Remy\'s Ratatouille Adventure', suitability: 'perfeito', description: 'Divertido para todas as idades, sem restrição' },
      { name: 'Figment\'s Imagination', suitability: 'perfeito', description: 'Colorido e estimulante - todas as idades' },
      { name: 'Living with the Land', suitability: 'perfeito', description: 'Passeio de barco calmo e educativo - ótimo para descansar' },
      { name: 'The Seas with Nemo & Friends', suitability: 'perfeito', description: 'Aquário interativo - crianças e bebês adoram' },
      { name: 'Test Track', suitability: 'restrito', heightRestriction: 102, description: 'Simulador de carro - mín. 102cm. Adolescentes adoram projetar o carro!' },
      { name: 'Guardians of the Galaxy: Cosmic Rewind', suitability: 'restrito', heightRestriction: 107, description: 'Montanha-russa indoor - mín. 107cm. Favorita dos adolescentes!' },
      { name: 'World Showcase', suitability: 'ok', description: 'Passeio pelos países - culturalmente rico. Adolescentes curtem provar comidas do mundo' },
      { name: 'EPCOT Fireworks (Luminous)', suitability: 'perfeito', description: 'Um dos melhores shows de fogos do mundo - imperdível!' },
    ],
    tips: [
      'World Showcase é ótimo para passear - tudo plano e acessível para carrinhos',
      'Frozen Ever After tem fila longa - usar Lightning Lane ou ir cedo',
      'Jantar no World Showcase: cada país tem restaurante temático - ótimo para adolescentes experimentarem',
      'Adolescentes: Guardians of the Galaxy e Test Track são imperdíveis',
      'Kidcot Fun Stops: atividades gratuitas para crianças em cada pavilhão do World Showcase',
    ],
  },
  {
    id: 'hollywood-studios',
    name: 'Hollywood Studios',
    icon: '🎬',
    color: '#DC2626',
    description: 'Shows e atrações temáticas: Star Wars, Toy Story, Indiana Jones',
    attractions: [
      { name: 'Toy Story Mania!', suitability: 'perfeito', description: 'Diversão para toda família - sem restrição. Competição de pontos!' },
      { name: 'Alien Swirling Saucers', suitability: 'perfeito', description: 'Diversão para crianças e adultos', tip: 'Sem restrição de altura' },
      { name: 'Muppet*Vision 3D', suitability: 'perfeito', description: 'Show 3D divertido para toda família' },
      { name: 'Disney Junior Dance Party', suitability: 'perfeito', description: 'Ideal para crianças de 2-5 anos', tip: 'Favorito dos pequenos! Interativo.' },
      { name: 'Star Wars: Galaxy\'s Edge', suitability: 'ok', description: 'Área temática impressionante. Adolescentes fãs de Star Wars vão adorar!' },
      { name: 'Slinky Dog Dash', suitability: 'cuidado', heightRestriction: 96, description: 'Montanha-russa suave - mín. 96cm. Ótima primeira montanha-russa para crianças!' },
      { name: 'Tower of Terror', suitability: 'restrito', heightRestriction: 102, description: 'Queda livre - mín. 102cm. Favorita dos adolescentes!' },
      { name: 'Rock \'n\' Roller Coaster', suitability: 'restrito', heightRestriction: 122, description: 'Montanha-russa intensa - mín. 122cm. Para adolescentes e adultos.' },
      { name: 'Millennium Falcon: Smugglers Run', suitability: 'restrito', heightRestriction: 96, description: 'Pilotar o Millennium Falcon! Mín. 96cm. Crianças maiores e adolescentes adoram.' },
    ],
    tips: [
      'Disney Junior Dance Party: perfeito para crianças de 2-5 anos',
      'Toy Story Land: toda a área temática é boa para crianças de todas as idades',
      'Galaxy\'s Edge: impressiona visualmente. Construir sabre de luz (~$250) é experiência inesquecível para fãs',
      'Adolescentes: Tower of Terror + Rock \'n\' Roller Coaster são imperdíveis',
      'Rider Switch disponível em todas as atrações com restrição de altura',
    ],
  },
  {
    id: 'animal-kingdom',
    name: 'Animal Kingdom',
    icon: '🦁',
    color: '#15803D',
    description: 'Animais reais, shows ao ar livre e Avatar Land',
    attractions: [
      { name: 'Festival of the Lion King', suitability: 'perfeito', description: 'Show emocionante para todas as idades - imperdível!' },
      { name: 'Finding Nemo: The Big Blue... and Beyond!', suitability: 'perfeito', description: 'Show musical aquático - ótimo para crianças pequenas' },
      { name: 'Kilimanjaro Safaris', suitability: 'perfeito', description: 'Ver animais reais de perto - todas as idades adoram', tip: 'Ir de manhã - animais mais ativos' },
      { name: 'Triceratop Spin', suitability: 'perfeito', description: 'Diversão para crianças pequenas na DinoLand' },
      { name: 'Na\'vi River Journey', suitability: 'perfeito', description: 'Passeio de barco calmo em Pandora - visual incrível para todas as idades' },
      { name: 'Avatar Flight of Passage', suitability: 'restrito', heightRestriction: 112, description: 'Melhor atração da Disney para muitos! Mín. 112cm. Adolescentes e adultos.' },
      { name: 'Expedition Everest', suitability: 'restrito', heightRestriction: 112, description: 'Montanha-russa com Yeti! Mín. 112cm. Favorita dos adolescentes.' },
    ],
    tips: [
      'Safaris pela manhã = animais mais ativos. Último horário também é bom!',
      'Shows musicais são o ponto alto para toda a família',
      'Playground do Boneyard: área de escavação para crianças gastarem energia',
      'Avatar Flight of Passage: fila de 2h+ é normal. Use Lightning Lane!',
      'Adolescentes: Expedition Everest e Flight of Passage são imperdíveis',
    ],
  },
  {
    id: 'universal-studios',
    name: 'Universal Studios',
    icon: '🎥',
    color: '#0369A1',
    description: 'Parque original com Diagon Alley (Harry Potter) e Minions',
    attractions: [
      { name: 'DreamWorks Destination', suitability: 'perfeito', description: 'Encontro com Shrek, Kung Fu Panda - ótimo para crianças pequenas' },
      { name: 'Despicable Me Minion Mayhem', suitability: 'cuidado', description: 'Simulador 3D - pode enjoar crianças sensíveis. Mín. 102cm.', heightRestriction: 102 },
      { name: 'Harry Potter - Diagon Alley', suitability: 'perfeito', description: 'Área temática incrível - todas as idades. Adolescentes vão pirar!' },
      { name: 'Harry Potter and the Escape from Gringotts', suitability: 'restrito', heightRestriction: 107, description: 'Atração principal de Diagon Alley - mín. 107cm. Imperdível para fãs!' },
      { name: 'Hogwarts Express', suitability: 'perfeito', description: 'Imperdível - conecta os dois parques', tip: 'Precisa de ingresso Park-to-Park!' },
      { name: 'Transformers: The Ride', suitability: 'restrito', heightRestriction: 102, description: 'Simulador de ação 3D - mín. 102cm. Adolescentes adoram!' },
      { name: 'E.T. Adventure', suitability: 'perfeito', description: 'Clássico! Passeio de bicicleta - ótimo para todas as idades' },
    ],
    tips: [
      'Express Pass: recomendado se orçamento permitir - economiza 2-4h de fila',
      'Butterbeer: obrigatório! Versão frozen é a mais popular para todas as idades',
      'Crianças pequenas: DreamWorks Destination e E.T. Adventure são os destaques',
      'Adolescentes: Escape from Gringotts e Transformers são imperdíveis',
      'Ollivanders Wand Shop: experiência interativa de escolha de varinha (para todas as idades!)',
    ],
  },
  {
    id: 'islands-of-adventure',
    name: 'Islands of Adventure',
    icon: '🏝️',
    color: '#7C3AED',
    description: 'Hogsmeade (Harry Potter), Dr. Seuss, Jurassic World e super-heróis',
    attractions: [
      { name: 'The Cat in the Hat', suitability: 'perfeito', description: 'Perfeito para crianças pequenas - sem restrição' },
      { name: 'One Fish, Two Fish, Red Fish, Blue Fish', suitability: 'perfeito', description: 'Diversão aquática para crianças pequenas!' },
      { name: 'Caro-Seuss-el', suitability: 'perfeito', description: 'Carrossel temático Dr. Seuss - todas as idades' },
      { name: 'Pteranodon Flyers', suitability: 'perfeito', description: 'Voo suave com acompanhante - experiência única para crianças' },
      { name: 'Hogsmeade Village', suitability: 'perfeito', description: 'Área temática Harry Potter - imperdível para todas as idades' },
      { name: 'Harry Potter and the Forbidden Journey', suitability: 'restrito', heightRestriction: 122, description: 'Dentro do castelo de Hogwarts! Mín. 122cm. Incrível para adolescentes.' },
      { name: 'Hagrid\'s Magical Creatures Motorbike Adventure', suitability: 'restrito', heightRestriction: 122, description: 'Melhor montanha-russa para muitos! Mín. 122cm.' },
      { name: 'The Amazing Adventures of Spider-Man', suitability: 'restrito', heightRestriction: 102, description: 'Simulador 3D de super-heróis - mín. 102cm' },
      { name: 'Velocicoaster', suitability: 'restrito', heightRestriction: 137, description: 'Montanha-russa extrema - mín. 137cm. Top para adolescentes corajosos!' },
      { name: 'Jurassic World VelociCoaster', suitability: 'restrito', heightRestriction: 137, description: 'Mín. 137cm. Uma das melhores montanhas-russas do mundo!' },
    ],
    tips: [
      'Dr. Seuss Landing: área perfeitamente adequada para crianças de 2-6 anos',
      'Hogsmeade: abrir o parque e ir direto - fica lotado rapidamente',
      'Butterbeer gelado em Hogsmeade é obrigatório para toda a família!',
      'Adolescentes: Hagrid\'s, VelociCoaster e Forbidden Journey são os destaques do parque',
      'Crianças pequenas: ficar em Seuss Landing e Camp Jurassic (playground)',
    ],
  },
  {
    id: 'epic-universe',
    name: 'Universal Epic Universe',
    icon: '🌌',
    color: '#6D28D9',
    description: 'Novo mega parque da Universal com 5 mundos temáticos imersivos',
    attractions: [
      { name: 'Celestial Park (área central)', suitability: 'perfeito', description: 'Hub central com jardins, fontes e atrações para toda família' },
      { name: 'Super Nintendo World - Mario Kart: Bowser\'s Challenge', suitability: 'ok', heightRestriction: 102, description: 'Corrida interativa com AR - mín. 102cm. Crianças maiores e adolescentes vão adorar!', tip: 'Imperdível! Ir logo na abertura do parque' },
      { name: 'Super Nintendo World - Yoshi\'s Adventure', suitability: 'perfeito', description: 'Passeio calmo e colorido - perfeito para todas as idades', tip: 'Sem restrição de altura' },
      { name: 'Super Nintendo World - Power-Up Band Activities', suitability: 'perfeito', description: 'Atividades interativas - colecionar moedas e selos. Toda família se diverte!' },
      { name: 'The Wizarding World - Ministry of Magic', suitability: 'ok', heightRestriction: 102, description: 'Atração principal de Harry Potter - mín. 102cm. Fãs da saga vão pirar!' },
      { name: 'The Wizarding World - Paris Wizarding Quarter', suitability: 'perfeito', description: 'Área temática de Paris mágica - imersiva para todas as idades' },
      { name: 'How to Train Your Dragon - Isle of Berk', suitability: 'perfeito', description: 'Vila Viking com encontro de dragões - crianças de todas as idades adoram!' },
      { name: 'How to Train Your Dragon - Hiccup\'s Wing Gliders', suitability: 'perfeito', description: 'Voo suave sobre a ilha - adequado para crianças pequenas' },
      { name: 'How to Train Your Dragon - Dragon Racer\'s Rally', suitability: 'ok', heightRestriction: 102, description: 'Montanha-russa familiar - mín. 102cm. Ótima para crianças maiores!' },
      { name: 'Dark Universe - Monsters Unchained', suitability: 'cuidado', heightRestriction: 102, description: 'Tema de monstros clássicos - pode assustar crianças sensíveis. Adolescentes adoram!', tip: 'Avaliar se crianças menores lidam bem com temas de monstros' },
      { name: 'Dark Universe - Curse of the Werewolf', suitability: 'restrito', heightRestriction: 122, description: 'Montanha-russa intensa - mín. 122cm. Para adolescentes e adultos.' },
      { name: 'Starfall Racers', suitability: 'ok', heightRestriction: 102, description: 'Montanha-russa familiar no Celestial Park - mín. 102cm. Divertida para toda família!' },
    ],
    route: [
      { time: '08:00', activity: 'Chegada antes da abertura - posicionar na entrada' },
      { time: '08:30', activity: 'Direto para Super Nintendo World (área mais concorrida)' },
      { time: '09:00', activity: 'Mario Kart + Yoshi\'s Adventure. Adolescentes: Dark Universe primeiro!' },
      { time: '10:00', activity: 'Power-Up Band activities e explorar a área Nintendo' },
      { time: '11:00', activity: 'How to Train Your Dragon - Isle of Berk e atrações' },
      { time: '12:00', activity: 'Almoço: Toadstool Cafe (Nintendo) ou restaurantes temáticos' },
      { time: '13:30', activity: 'Pausa opcional para descanso no hotel, ou continuar explorando' },
      { time: '15:30', activity: 'Wizarding World: Ministry of Magic + Paris Quarter' },
      { time: '17:00', activity: 'Celestial Park - atrações centrais e Starfall Racers' },
      { time: '18:30', activity: 'Jantar temático em um dos restaurantes do parque' },
      { time: '20:00', activity: 'Shows noturnos e retorno ao hotel' },
    ],
    tips: [
      'Super Nintendo World: Power-Up Band (~$40) para experiência interativa - vale para toda família!',
      'Parque novo = filas longas - chegar cedo é essencial',
      'Crianças pequenas: Yoshi\'s Adventure, Isle of Berk e Celestial Park são os destaques',
      'Adolescentes: Mario Kart, Curse of the Werewolf e Dark Universe são imperdíveis',
      'Isle of Berk: encontro com dragões animatrônicos ao vivo - todas as idades adoram!',
      'Dark Universe: temática de monstros - avaliar se adequado para crianças sensíveis',
      'Express Pass disponível e altamente recomendado para evitar filas',
      'Parque é o maior da Universal - usar sapato muito confortável. Considere 2 dias.',
      'Toadstool Cafe (Nintendo) é o mais disputado - reservar se possível',
    ],
  },
  {
    id: 'seaworld',
    name: 'SeaWorld',
    icon: '🌊',
    color: '#0891B2',
    description: 'Animais marinhos, montanhas-russas, shows e Sesame Street',
    attractions: [
      { name: 'Sesame Street Land', suitability: 'perfeito', description: 'Área temática perfeita para crianças de 2-6 anos' },
      { name: 'Elmo\'s Choo Choo Train', suitability: 'perfeito', description: 'Trenzinho da turma do Sesame Street - bebês e crianças pequenas' },
      { name: 'Orca Encounter', suitability: 'perfeito', description: 'Apresentação educacional com orcas - todas as idades!' },
      { name: 'Dolphin Nursery', suitability: 'perfeito', description: 'Ver golfinhos bebês de perto - experiência para toda família' },
      { name: 'Penguin Encounter', suitability: 'perfeito', description: 'Pinguins em ambiente refrigerado - fascina crianças e adultos' },
      { name: 'Mako', suitability: 'restrito', heightRestriction: 137, description: 'Montanha-russa radical - mín. 137cm. Favorita dos adolescentes!' },
      { name: 'Manta', suitability: 'restrito', heightRestriction: 137, description: 'Montanha-russa voadora - mín. 137cm. Sensação de voar como uma arraia!' },
      { name: 'Journey to Atlantis', suitability: 'restrito', heightRestriction: 107, description: 'Passeio aquático com queda - mín. 107cm. Prepare para se molhar!' },
    ],
    tips: [
      'Mais tranquilo que Disney e Universal - ótimo para um dia mais relaxado com a família',
      'Sesame Street Land: perfeita para crianças pequenas (2-6 anos)',
      'Adolescentes: Mako, Manta e Kraken são montanhas-russas de classe mundial!',
      'Chegada pela manhã: animais mais ativos e filas menores',
      'Alimentar golfinhos: atividade paga (~$10) - muito especial para crianças de todas as idades',
      'Combinar com Aquatica (parque aquático) no mesmo dia ou dia seguinte',
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
  { name: 'The Boathouse', location: 'Disney Springs', highlight: 'Frutos do mar premium. Tour de barcos anfíbios. Bom para famílias com crianças maiores e adolescentes.', kidFriendly: true },
  { name: 'T-Rex Cafe', location: 'Disney Springs', highlight: 'Temático com dinossauros e animatrônicos. Crianças de todas as idades adoram! Barulhento.', kidFriendly: true },
  { name: 'Rainforest Cafe', location: 'Disney Springs / Animal Kingdom', highlight: 'Animatrônicos de animais. Divertido para crianças. Menu kids disponível.', kidFriendly: true },
  { name: 'Voodoo Doughnut', location: 'Universal CityWalk', highlight: 'Donuts temáticos gigantes - sobremesa imperdível para toda família.', kidFriendly: true },
  { name: 'Shake Shack', location: 'I-Drive / Disney Springs', highlight: 'Hambúrgueres e shakes de qualidade. Menu kids disponível.', kidFriendly: true },
  { name: 'Olive Garden', location: 'Várias localizações', highlight: 'Italiano acessível com breadsticks ilimitados. Ótimo para famílias grandes e crianças seletivas.', kidFriendly: true },
  { name: 'Chick-fil-A', location: 'Várias localizações', highlight: 'Fast food premium - nuggets e sanduíches de frango. Playground em algumas unidades.', kidFriendly: true },
  { name: 'Culver\'s', location: 'Várias localizações', highlight: 'ButterBurgers e frozen custard. Menu kids variado.', kidFriendly: true },
  { name: 'Be Our Guest', location: 'Magic Kingdom', highlight: 'Jantar no castelo da Bela! Reservar com 60 dias. Experiência mágica para crianças.', kidFriendly: true },
  { name: 'Cinderella\'s Royal Table', location: 'Magic Kingdom', highlight: 'Jantar dentro do Castelo da Cinderela com princesas. Reservar com antecedência!', kidFriendly: true },
  { name: 'Three Broomsticks', location: 'Universal IoA - Hogsmeade', highlight: 'Comida britânica no mundo de Harry Potter. Butterbeer! Ambiente imersivo para fãs.', kidFriendly: true },
  { name: 'Boma - Flavors of Africa', location: 'Animal Kingdom Lodge', highlight: 'Buffet africano com variedade enorme. Ótimo para famílias grandes e crianças seletivas.', kidFriendly: true },
  { name: 'Bubba Gump Shrimp Co.', location: 'I-Drive / CityWalk', highlight: 'Temático Forrest Gump. Frutos do mar e menu kids divertido. Adolescentes curtem!', kidFriendly: true },
  { name: 'Texas de Brazil', location: 'I-Drive', highlight: 'Churrascaria rodízio estilo brasileiro. Salad bar extenso. Ótimo para famílias que sentem saudade de casa!', kidFriendly: true },
];

export interface SupermarketInfo {
  name: string;
  description: string;
}

export const SUPERMARKETS: SupermarketInfo[] = [
  { name: 'Publix', description: 'Principal rede da Florida. Qualidade excelente. Seção infantil completa. Subs (sanduíches) famosos!' },
  { name: 'Walmart Supercenter', description: 'Mais barato. Aberto 24h. Ótimo para compras em volume e itens básicos para famílias grandes.' },
  { name: 'Whole Foods', description: 'Premium e orgânico. Perto de Disney Springs e I-Drive. Ótimo para restrições alimentares.' },
  { name: 'Target', description: 'Equilíbrio entre preço e qualidade. Seção de bebê e criança excelente.' },
  { name: 'Aldi', description: 'Mais econômico. Marcas próprias de qualidade. Ótimo para frutas e laticínios.' },
];

export const FOOD_TIPS: string[] = [
  'Quick Service vs. Table Service: Quick é mais rápido e 30-40% mais barato. Ideal para famílias com crianças pequenas.',
  'Mobile Order (Disney e Universal apps): pedir pelo celular e retirar sem fila. Essencial com crianças!',
  'Refill Cup Disney: caneca recarregável de refrigerante - economia em dias de parque para famílias grandes.',
  'Porções grandes: porções americanas são generosas. Dividir pratos entre crianças ou entre adulto e criança.',
  'Snacks gratuitos: EPCOT World Showcase tem degustações. Ótimo para adolescentes explorarem sabores do mundo!',
  'Horário das refeições: almoçar às 11h ou 14h para evitar filas. Com crianças pequenas, manter rotina de horários.',
  'Alergias alimentares: Disney e Universal são excelentes em atender restrições. Avisar ao pedir - chefs podem preparar refeições especiais.',
  'Bebês: a maioria dos restaurantes aquece mamadeiras e papinhas. Baby Care Centers nos parques Disney têm micro-ondas.',
  'Adolescentes: dar autonomia para escolher onde comer pode tornar a viagem mais divertida para eles.',
  'Famílias grandes: buffets são a melhor opção (Boma, Crystal Palace, Biergarten). Todos comem o que querem.',
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
  // Roupas (por pessoa)
  { id: sId(), name: 'Camisetas (1 por dia + 2 extras) — por pessoa', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Shorts / bermudas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Calças compridas (2 para dias frios/restaurantes)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Meias (1 par por dia + 2 extras)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Roupas íntimas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Pijamas', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Casaco / moletom leve (ar condicionado forte nos EUA)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Roupa de banho / biquíni / sunga', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Tênis confortável para parques (cada membro!)', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Chinelo / sandália', checked: false, category: 'Roupas' },
  { id: sId(), name: 'Boné / chapéu', checked: false, category: 'Roupas' },
  // Bebês e crianças pequenas (se aplicável)
  { id: sId(), name: 'Roupas extras para crianças (para acidentes/trocas)', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Fraldas — se necessário (comprar lá é mais prático)', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Lenços umedecidos', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Brinquedo / pelúcia favorita', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Mamadeira / copo com tampa (se usar)', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Carrinho / stroller (ou alugar nos parques ~$15-50/dia)', checked: false, category: 'Bebês e Crianças' },
  { id: sId(), name: 'Cadeirinha de carro (obrigatória na FL para < 5 anos)', checked: false, category: 'Bebês e Crianças' },
  // Higiene
  { id: sId(), name: 'Escova e pasta de dente (para cada membro)', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Shampoo / condicionador', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Sabonete', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Desodorante', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Protetor solar (FPS 50+) — adulto e infantil', checked: false, category: 'Higiene' },
  { id: sId(), name: 'Repelente de insetos', checked: false, category: 'Higiene' },
  // Eletrônicos
  { id: sId(), name: 'Celulares + carregadores', checked: false, category: 'Eletrônicos' },
  { id: sId(), name: 'Power bank (fundamental nos parques!)', checked: false, category: 'Eletrônicos' },
  { id: sId(), name: 'Adaptador de tomada (EUA usa tipo A/B)', checked: false, category: 'Eletrônicos' },
  { id: sId(), name: 'Fones de ouvido', checked: false, category: 'Eletrônicos' },
  { id: sId(), name: 'Câmera / GoPro', checked: false, category: 'Eletrônicos' },
  { id: sId(), name: 'Tablet / iPad (para entretenimento no avião)', checked: false, category: 'Eletrônicos' },
  // Documentos
  { id: sId(), name: 'Passaportes de todos os membros', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Vistos / ESTA', checked: false, category: 'Documentos' },
  { id: sId(), name: 'CNH Internacional', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Autorização de viagem (menores sem ambos os pais)', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Comprovantes de reserva impressos', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Seguro viagem (cópia digital e impressa)', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Cartão de crédito internacional', checked: false, category: 'Documentos' },
  { id: sId(), name: 'Dólares em espécie', checked: false, category: 'Documentos' },
  // Outros
  { id: sId(), name: 'Capa de chuva compacta (para cada membro)', checked: false, category: 'Outros' },
  { id: sId(), name: 'Garrafa de água reutilizável', checked: false, category: 'Outros' },
  { id: sId(), name: 'Mochila pequena para os parques', checked: false, category: 'Outros' },
  { id: sId(), name: 'Saco plástico para roupa suja', checked: false, category: 'Outros' },
  { id: sId(), name: 'Almofada de pescoço (avião)', checked: false, category: 'Outros' },
];

// === BACKPACK CHECKLIST (Mochila do Parque) ===
let _bId = 0;
const bId = () => `back-${++_bId}`;

export const DEFAULT_BACKPACK_ITEMS: ChecklistItem[] = [
  { id: bId(), name: 'Protetor solar', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Garrafas de água (geladas)', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Snacks / biscoitos para a família', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Power bank carregado', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Celular + carregador', checked: false, category: 'Essenciais' },
  { id: bId(), name: 'Boné / chapéu', checked: false, category: 'Proteção' },
  { id: bId(), name: 'Capa de chuva compacta', checked: false, category: 'Proteção' },
  { id: bId(), name: 'Casaco leve (ar condicionado)', checked: false, category: 'Proteção' },
  { id: bId(), name: 'Óculos de sol', checked: false, category: 'Proteção' },
  { id: bId(), name: 'Remédios básicos (dor, febre, alergia)', checked: false, category: 'Saúde' },
  { id: bId(), name: 'Band-aid', checked: false, category: 'Saúde' },
  { id: bId(), name: 'Repelente', checked: false, category: 'Saúde' },
  { id: bId(), name: 'Álcool em gel', checked: false, category: 'Saúde' },
  { id: bId(), name: 'Fraldas + lenços umedecidos (se necessário)', checked: false, category: 'Bebês e Crianças' },
  { id: bId(), name: 'Troca de roupa extra (crianças pequenas)', checked: false, category: 'Bebês e Crianças' },
  { id: bId(), name: 'Brinquedo / livro / tablet para filas', checked: false, category: 'Bebês e Crianças' },
  { id: bId(), name: 'Mamadeira / copo / lanche (se necessário)', checked: false, category: 'Bebês e Crianças' },
  { id: bId(), name: 'Cartão de crédito / dólares', checked: false, category: 'Outros' },
  { id: bId(), name: 'Ingressos do parque (digital/impresso)', checked: false, category: 'Outros' },
  { id: bId(), name: 'Autógrafo book + caneta (para personagens)', checked: false, category: 'Outros' },
];

// === PHARMACY CHECKLIST ===
let _pId = 0;
const pId = () => `pharm-${++_pId}`;

export const DEFAULT_PHARMACY_ITEMS: ChecklistItem[] = [
  { id: pId(), name: 'Paracetamol / Dipirona (adulto)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Paracetamol / Dipirona infantil (se tiver crianças)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Ibuprofeno (adulto e/ou infantil)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Antialérgico (Allegra / Loratadina)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Soro fisiológico (spray nasal)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Remédio para enjoo', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Buscopan (cólica)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Antidiarreico', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Pomada para assadura (se tiver bebês)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Medicamentos de uso contínuo (receita em inglês)', checked: false, category: 'Medicamentos' },
  { id: pId(), name: 'Termômetro digital', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Band-aids variados', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Gaze e esparadrapo', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Álcool em gel', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Pomada para picada de inseto', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Colírio lubrificante', checked: false, category: 'Primeiros Socorros' },
  { id: pId(), name: 'Protetor solar FPS 50+ (para cada membro)', checked: false, category: 'Proteção' },
  { id: pId(), name: 'Protetor labial com FPS', checked: false, category: 'Proteção' },
  { id: pId(), name: 'Repelente de insetos (adulto e infantil)', checked: false, category: 'Proteção' },
];

// === GROCERY CHECKLIST ===
let _gId = 0;
const gId = () => `groc-${++_gId}`;

export const DEFAULT_GROCERY_ITEMS: ChecklistItem[] = [
  { id: gId(), name: 'Água mineral (pack)', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Suco de frutas', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Leite (e/ou fórmula infantil se necessário)', checked: false, category: 'Bebidas' },
  { id: gId(), name: 'Cereal matinal', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Pão de forma', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Manteiga / cream cheese', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Iogurte', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Frutas (banana, maçã, uva)', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Ovos', checked: false, category: 'Café da Manhã' },
  { id: gId(), name: 'Barra de cereal / granola', checked: false, category: 'Snacks para Parques' },
  { id: gId(), name: 'Biscoito / bolacha', checked: false, category: 'Snacks para Parques' },
  { id: gId(), name: 'Fruta seca / castanhas', checked: false, category: 'Snacks para Parques' },
  { id: gId(), name: 'Goldfish / crackers', checked: false, category: 'Snacks para Parques' },
  { id: gId(), name: 'Queijo em tablete / Babybel', checked: false, category: 'Snacks para Parques' },
  { id: gId(), name: 'Presunto / peito de peru', checked: false, category: 'Refeições' },
  { id: gId(), name: 'Queijo fatiado', checked: false, category: 'Refeições' },
  { id: gId(), name: 'Macarrão instantâneo / cup noodles', checked: false, category: 'Refeições' },
  { id: gId(), name: 'Papinha / comida de bebê (se necessário)', checked: false, category: 'Refeições' },
  { id: gId(), name: 'Papel toalha', checked: false, category: 'Utilitários' },
  { id: gId(), name: 'Sacos plásticos ziplock', checked: false, category: 'Utilitários' },
  { id: gId(), name: 'Guardanapos', checked: false, category: 'Utilitários' },
  { id: gId(), name: 'Protetor solar (mais barato no Walmart!)', checked: false, category: 'Utilitários' },
];

export const GENERAL_TIPS: { category: string; icon: string; tips: string[] }[] = [
  {
    category: 'Clima e Proteção',
    icon: '☀️',
    tips: [
      'Orlando é quente e chuvoso (jun-set). Protetor solar e capa de chuva fina são obrigatórios para todos.',
      'Hidratação: todos precisam beber água frequentemente. Temperatura pode passar dos 35°C.',
      'Sapatos: usar tênis confortável - a família pode caminhar 15-20km por dia nos parques.',
      'Ar condicionado é muito forte nos EUA. Levar casaco leve para restaurantes e atrações indoor.',
    ],
  },
  {
    category: 'Crianças e Bebês',
    icon: '👶',
    tips: [
      'Crianças menores de 3 anos entram de graça nos parques Disney e Universal.',
      'Strollers: alugar nos parques ($15-50/dia) ou levar o próprio. Essencial para menores de 5 anos.',
      'Baby Care Centers: Disney tem em todos os parques com fraldário, micro-ondas, área de amamentação e venda de itens básicos.',
      'Rider Switch: adultos se revezam em atrações com restrição - o segundo não pega fila novamente!',
      'Pausas: crianças pequenas (0-5) precisam de descanso após o almoço. Planejar retorno ao hotel ou encontrar áreas sombreadas.',
      'Cadeirinha de carro: obrigatória na Florida para crianças abaixo de 5 anos ou menos de 18kg.',
    ],
  },
  {
    category: 'Adolescentes',
    icon: '🧑',
    tips: [
      'Montanhas-russas imperdíveis: VelociCoaster, Hagrid\'s, Space Mountain, Expedition Everest, Guardians of the Galaxy.',
      'Dar autonomia: adolescentes podem explorar áreas sozinhos (com celular e ponto de encontro combinado).',
      'Galaxy\'s Edge (Star Wars) e Wizarding World (Harry Potter): áreas favoritas dos teens.',
      'Construir sabre de luz ($250) ou varinha interativa (~$65): experiências inesquecíveis para fãs.',
      'Apps dos parques: adolescentes podem ajudar gerenciando filas virtuais e Lightning Lanes!',
    ],
  },
  {
    category: 'Fotos e Memórias',
    icon: '📸',
    tips: [
      'PhotoPass Disney ou Universal Photo: avaliar pacote de fotos (economia para famílias grandes!).',
      'Reserva de restaurantes: fazer com 60 dias de antecedência (Disney table service).',
      'Memory Maker (Disney) inclui fotos ilimitadas em todas atrações e com personagens.',
    ],
  },
  {
    category: 'Comunicação e Dinheiro',
    icon: '💳',
    tips: [
      'Chip americano ou eSIM - T-Mobile e AT&T têm melhor cobertura em Orlando.',
      'Usar cartão de crédito sem anuidade internacional. Levar algum cash para gorjetas.',
      'Gorjetas: 18-20% em restaurantes é obrigatório culturalmente nos EUA.',
      'Orçamento por pessoa/dia nos parques: $30-60 para alimentação (Quick Service).',
    ],
  },
  {
    category: 'Saúde e Farmácia',
    icon: '🏥',
    tips: [
      'Walgreens e CVS têm itens básicos de saúde. Walmart é mais barato para compras maiores.',
      'Garden Grocer, Instacart e Walmart+ fazem delivery no hotel.',
      'Seguro viagem com cobertura médica é imprescindível para toda a família.',
      'Medicamentos infantis: levar do Brasil. Versões americanas têm dosagens e nomes diferentes.',
    ],
  },
  {
    category: 'Transporte',
    icon: '🚗',
    tips: [
      'Famílias grandes: SUV ou Minivan são essenciais para acomodar carrinhos e malas.',
      'Famílias pequenas: carro médio (Sedan) pode ser suficiente.',
      'Tollroads (pedágios) em Orlando - configurar SunPass ou usar All Inclusive na locadora.',
      'Estacionamento nos parques: Disney (~$30/dia) e Universal (~$30/dia). Preferred parking vale a pena com crianças.',
      'Waze funciona muito bem em Orlando. Uber/Lyft também são opções para dias sem carro.',
    ],
  },
  {
    category: 'Famílias Grandes',
    icon: '👨‍👩‍👧‍👦',
    tips: [
      'Ingressos: comprar com antecedência em sites autorizados (Undercover Tourist, etc.) para economia.',
      'Hospedagem: casas de aluguel (Airbnb, VRBO) podem ser mais econômicas que hotéis para famílias grandes.',
      'Divisão de grupo: em parques grandes, dividir a família por faixa etária pode otimizar o dia.',
      'Walkie-talkies ou grupo no WhatsApp: essencial para coordenar em parques lotados.',
      'Refeições no hotel: café da manhã e jantar no hotel economizam tempo e dinheiro significativamente.',
    ],
  },
];
