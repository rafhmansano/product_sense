// Family Trip Manager — Types

export type TripPhase = 'pre-trip' | 'during' | 'post-trip';

export interface FamilyMember {
  name: string;
  role: 'pai' | 'mae' | 'crianca' | 'bebe' | 'adolescente' | 'avo' | 'avó' | 'tio' | 'tia' | 'outro';
  age?: number;
  heightCm?: number;
}

export interface Trip {
  destination: string;
  origin: string;
  originCode: string;
  destinationCode: string;
  startDate: string;
  endDate: string;
  members: FamilyMember[];
}

// === FILE ATTACHMENTS ===
export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  addedAt: string;
}

// === FLIGHTS ===
export interface Flight {
  id: string;
  type: 'ida' | 'volta';
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  pnr: string;
  seats: string;
  baggage: string;
  checkInAvailable: string;
  boardingPass: string;
  notes: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  attachments: FileAttachment[];
}

// === HOTEL ===
export interface Hotel {
  id: string;
  name: string;
  address: string;
  mapsUrl: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  reservationCode: string;
  roomType: string;
  breakfast: string;
  pool: string;
  parking: string;
  distanceToParks: string;
  shuttle: string;
  wifi: string;
  crib: string;
  cancellationPolicy: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  attachments: FileAttachment[];
}

// === CAR RENTAL ===
export interface CarRental {
  id: string;
  company: string;
  vehicleCategory: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  reservationCode: string;
  insurance: string;
  childSeat: string;
  gps: string;
  fuelPolicy: string;
  totalPrice: string;
  paymentMethod: string;
  notes: string;
  attachments: FileAttachment[];
}

// === AGENDA / EVENTS ===
export type EventType =
  | 'logistica'
  | 'hospedagem'
  | 'parque'
  | 'show'
  | 'restaurante'
  | 'lembrete'
  | 'saude'
  | 'financeiro';

export const EVENT_COLORS: Record<EventType, string> = {
  logistica: '#3B82F6',
  hospedagem: '#F97316',
  parque: '#22C55E',
  show: '#A855F7',
  restaurante: '#EC4899',
  lembrete: '#6B7280',
  saude: '#EF4444',
  financeiro: '#EAB308',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  logistica: 'Logistica',
  hospedagem: 'Hospedagem',
  parque: 'Parque',
  show: 'Show',
  restaurante: 'Restaurante',
  lembrete: 'Lembrete',
  saude: 'Saude',
  financeiro: 'Financeiro',
};

export interface AgendaEvent {
  id: string;
  date: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: EventType;
  completed: boolean;
}

// === BUDGET ===
export type BudgetCategoryId =
  | 'passagens'
  | 'acomodacao'
  | 'transporte'
  | 'ingressos'
  | 'fastpass'
  | 'alimentacao'
  | 'compras'
  | 'seguro'
  | 'cambio'
  | 'saude'
  | 'internet'
  | 'emergencia';

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: string;
  icon: string;
  plannedBRL: number;
  plannedUSD: number;
}

// === EXPENSES ===
export type ExpenseCategoryId =
  | 'comida-cafe'
  | 'comida-almoco'
  | 'comida-jantar'
  | 'comida-snack'
  | 'comida-supermercado'
  | 'presente-parque'
  | 'presente-outlet'
  | 'presente-souvenir'
  | 'presente-familia'
  | 'transporte'
  | 'farmacia'
  | 'ingresso'
  | 'estacionamento'
  | 'outro';

export interface Expense {
  id: string;
  amount: number;
  currency: 'USD' | 'BRL';
  category: BudgetCategoryId;
  description: string;
  date: string;
  budgetCategoryId: BudgetCategoryId;
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategoryId, string> = {
  'comida-cafe': 'Cafe da manha',
  'comida-almoco': 'Almoco',
  'comida-jantar': 'Jantar',
  'comida-snack': 'Snacks',
  'comida-supermercado': 'Supermercado',
  'presente-parque': 'Loja no parque',
  'presente-outlet': 'Outlet',
  'presente-souvenir': 'Souvenir',
  'presente-familia': 'Presente p/ familia',
  'transporte': 'Transporte',
  'farmacia': 'Farmacia',
  'ingresso': 'Ingresso',
  'estacionamento': 'Estacionamento',
  'outro': 'Outro',
};

export const EXPENSE_TO_BUDGET: Record<ExpenseCategoryId, BudgetCategoryId> = {
  'comida-cafe': 'alimentacao',
  'comida-almoco': 'alimentacao',
  'comida-jantar': 'alimentacao',
  'comida-snack': 'alimentacao',
  'comida-supermercado': 'alimentacao',
  'presente-parque': 'compras',
  'presente-outlet': 'compras',
  'presente-souvenir': 'compras',
  'presente-familia': 'compras',
  'transporte': 'transporte',
  'farmacia': 'saude',
  'ingresso': 'ingressos',
  'estacionamento': 'transporte',
  'outro': 'emergencia',
};

// === DOCUMENTS ===
export type DocStatus = 'concluido' | 'pendente' | 'nao-iniciado';

export interface TripDocument {
  id: string;
  name: string;
  owner: string;
  status: DocStatus;
  expiryDate?: string;
  notes: string;
  attachments?: FileAttachment[];
}

// === PARKS ===
export type SuitabilityLevel = 'perfeito' | 'ok' | 'cuidado' | 'restrito';

export interface ParkAttraction {
  name: string;
  suitability: SuitabilityLevel;
  heightRestriction?: number;
  description: string;
  tip?: string;
}

export interface ParkRoute {
  time: string;
  activity: string;
}

export interface ParkInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  attractions: ParkAttraction[];
  route?: ParkRoute[];
  tips: string[];
}

// === CHECKLISTS ===
export interface ChecklistItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
  passenger?: string;
}

// === CUSTOM RESTAURANTS ===
export interface CustomRestaurant {
  id: string;
  name: string;
  location: string;
  parkOrArea: string;
  internalLocation: string;
  highlight: string;
  kidFriendly: boolean;
}

// === CUSTOM FOOD ITEMS (Alimentacao) ===
export interface FoodItem {
  id: string;
  name: string;
  category: 'mercado' | 'farmacia' | 'parque-snack' | 'outro';
  notes: string;
  checked: boolean;
}
