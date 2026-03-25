'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Trip,
  Flight,
  Hotel,
  CarRental,
  AgendaEvent,
  BudgetCategory,
  Expense,
  TripDocument,
  EXPENSE_TO_BUDGET,
} from '@/types';
import { DEFAULT_BUDGET_CATEGORIES, DEFAULT_DOCUMENTS } from '@/lib/data';

export interface TripData {
  trip: Trip;
  flights: Flight[];
  hotel: Hotel | null;
  carRental: CarRental | null;
  events: AgendaEvent[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  documents: TripDocument[];
  exchangeRate: number;
}

interface AppState extends TripData {
  // Cloud sync
  tripCode: string | null;
  setTripCode: (code: string) => void;
  hydrateFromCloud: (data: TripData) => void;
  getTripData: () => TripData;
  // Trip
  updateTrip: (trip: Partial<Trip>) => void;
  // Flights
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, data: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  // Hotel
  setHotel: (hotel: Hotel) => void;
  updateHotel: (data: Partial<Hotel>) => void;
  // Car
  setCarRental: (car: CarRental) => void;
  updateCarRental: (data: Partial<CarRental>) => void;
  // Events
  addEvent: (event: AgendaEvent) => void;
  updateEvent: (id: string, data: Partial<AgendaEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventComplete: (id: string) => void;
  // Budget
  updateBudgetCategory: (id: string, data: Partial<BudgetCategory>) => void;
  setExchangeRate: (rate: number) => void;
  // Expenses
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  // Documents
  updateDocument: (id: string, data: Partial<TripDocument>) => void;
  addDocument: (doc: TripDocument) => void;
  deleteDocument: (id: string) => void;
}

const DEFAULT_TRIP: Trip = {
  destination: 'Orlando, FL',
  origin: 'Sao Paulo, SP',
  originCode: 'GRU',
  destinationCode: 'MCO',
  startDate: '',
  endDate: '',
  members: [
    { name: 'Rafael', role: 'pai' },
    { name: 'Jac', role: 'mae' },
    { name: '', role: 'crianca', age: 3, heightCm: 95 },
  ],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      trip: DEFAULT_TRIP,
      flights: [],
      hotel: null,
      carRental: null,
      events: [],
      budgetCategories: DEFAULT_BUDGET_CATEGORIES,
      expenses: [],
      documents: DEFAULT_DOCUMENTS,
      exchangeRate: 5.5,
      tripCode: null,

      setTripCode: (code) => set({ tripCode: code }),

      hydrateFromCloud: (data) =>
        set({
          trip: data.trip,
          flights: data.flights,
          hotel: data.hotel,
          carRental: data.carRental,
          events: data.events,
          budgetCategories: data.budgetCategories,
          expenses: data.expenses,
          documents: data.documents,
          exchangeRate: data.exchangeRate,
        }),

      getTripData: () => {
        const s = get();
        return {
          trip: s.trip,
          flights: s.flights,
          hotel: s.hotel,
          carRental: s.carRental,
          events: s.events,
          budgetCategories: s.budgetCategories,
          expenses: s.expenses,
          documents: s.documents,
          exchangeRate: s.exchangeRate,
        };
      },

      updateTrip: (data) =>
        set((state) => ({ trip: { ...state.trip, ...data } })),

      addFlight: (flight) =>
        set((state) => ({ flights: [...state.flights, flight] })),

      updateFlight: (id, data) =>
        set((state) => ({
          flights: state.flights.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),

      deleteFlight: (id) =>
        set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),

      setHotel: (hotel) => set({ hotel }),

      updateHotel: (data) =>
        set((state) => ({ hotel: state.hotel ? { ...state.hotel, ...data } : null })),

      setCarRental: (car) => set({ carRental: car }),

      updateCarRental: (data) =>
        set((state) => ({
          carRental: state.carRental ? { ...state.carRental, ...data } : null,
        })),

      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

      toggleEventComplete: (id) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, completed: !e.completed } : e
          ),
        })),

      updateBudgetCategory: (id, data) =>
        set((state) => ({
          budgetCategories: state.budgetCategories.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      setExchangeRate: (rate) => set({ exchangeRate: rate }),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            { ...expense, budgetCategoryId: EXPENSE_TO_BUDGET[expense.category] },
            ...state.expenses,
          ],
        })),

      updateExpense: (id, data) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      updateDocument: (id, data) =>
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...data } : d)),
        })),

      addDocument: (doc) =>
        set((state) => ({ documents: [...state.documents, doc] })),

      deleteDocument: (id) =>
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),
    }),
    { name: 'family-trip-storage' }
  )
);
