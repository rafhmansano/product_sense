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
  ChecklistItem,
  CustomRestaurant,
  FoodItem,
  EXPENSE_TO_BUDGET,
} from '@/types';
import {
  DEFAULT_BUDGET_CATEGORIES,
  DEFAULT_DOCUMENTS,
  DEFAULT_SUITCASE_ITEMS,
  DEFAULT_BACKPACK_ITEMS,
  DEFAULT_PHARMACY_ITEMS,
  DEFAULT_GROCERY_ITEMS,
} from '@/lib/data';

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
  suitcaseItems: ChecklistItem[];
  backpackItems: ChecklistItem[];
  pharmacyItems: ChecklistItem[];
  groceryItems: ChecklistItem[];
  customRestaurants: CustomRestaurant[];
  foodItems: FoodItem[];
}

interface AppState extends TripData {
  // Cloud sync
  tripCode: string | null;
  familyName: string | null;
  setTripCode: (code: string) => void;
  setFamilyName: (name: string) => void;
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

  // Checklists (suitcase, backpack, pharmacy, grocery)
  toggleChecklistItem: (list: 'suitcaseItems' | 'backpackItems' | 'pharmacyItems' | 'groceryItems', id: string) => void;
  addChecklistItem: (list: 'suitcaseItems' | 'backpackItems' | 'pharmacyItems' | 'groceryItems', item: ChecklistItem) => void;
  deleteChecklistItem: (list: 'suitcaseItems' | 'backpackItems' | 'pharmacyItems' | 'groceryItems', id: string) => void;

  // Custom Restaurants
  addRestaurant: (r: CustomRestaurant) => void;
  updateRestaurant: (id: string, data: Partial<CustomRestaurant>) => void;
  deleteRestaurant: (id: string) => void;

  // Food Items
  addFoodItem: (item: FoodItem) => void;
  updateFoodItem: (id: string, data: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodItem: (id: string) => void;
}

const DEFAULT_TRIP: Trip = {
  destination: 'Orlando, FL',
  origin: '',
  originCode: '',
  destinationCode: 'MCO',
  startDate: '',
  endDate: '',
  members: [],
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
      suitcaseItems: DEFAULT_SUITCASE_ITEMS,
      backpackItems: DEFAULT_BACKPACK_ITEMS,
      pharmacyItems: DEFAULT_PHARMACY_ITEMS,
      groceryItems: DEFAULT_GROCERY_ITEMS,
      customRestaurants: [],
      foodItems: [],
      tripCode: null,
      familyName: null,

      setTripCode: (code) => set({ tripCode: code }),
      setFamilyName: (name) => set({ familyName: name }),

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
          suitcaseItems: data.suitcaseItems ?? DEFAULT_SUITCASE_ITEMS,
          backpackItems: data.backpackItems ?? DEFAULT_BACKPACK_ITEMS,
          pharmacyItems: data.pharmacyItems ?? DEFAULT_PHARMACY_ITEMS,
          groceryItems: data.groceryItems ?? DEFAULT_GROCERY_ITEMS,
          customRestaurants: data.customRestaurants ?? [],
          foodItems: data.foodItems ?? [],
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
          suitcaseItems: s.suitcaseItems,
          backpackItems: s.backpackItems,
          pharmacyItems: s.pharmacyItems,
          groceryItems: s.groceryItems,
          customRestaurants: s.customRestaurants,
          foodItems: s.foodItems,
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

      // Checklists
      toggleChecklistItem: (list, id) =>
        set((state) => ({
          [list]: state[list].map((item: ChecklistItem) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      addChecklistItem: (list, item) =>
        set((state) => ({ [list]: [...state[list], item] })),
      deleteChecklistItem: (list, id) =>
        set((state) => ({
          [list]: state[list].filter((item: ChecklistItem) => item.id !== id),
        })),

      // Custom Restaurants
      addRestaurant: (r) =>
        set((state) => ({ customRestaurants: [...state.customRestaurants, r] })),
      updateRestaurant: (id, data) =>
        set((state) => ({
          customRestaurants: state.customRestaurants.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),
      deleteRestaurant: (id) =>
        set((state) => ({
          customRestaurants: state.customRestaurants.filter((r) => r.id !== id),
        })),

      // Food Items
      addFoodItem: (item) =>
        set((state) => ({ foodItems: [...state.foodItems, item] })),
      updateFoodItem: (id, data) =>
        set((state) => ({
          foodItems: state.foodItems.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),
      deleteFoodItem: (id) =>
        set((state) => ({ foodItems: state.foodItems.filter((f) => f.id !== id) })),
      toggleFoodItem: (id) =>
        set((state) => ({
          foodItems: state.foodItems.map((f) =>
            f.id === id ? { ...f, checked: !f.checked } : f
          ),
        })),
    }),
    {
      name: 'family-trip-storage',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          // Merge missing default documents
          const storedDocs = (state.documents as TripDocument[]) || [];
          const storedIds = new Set(storedDocs.map((d) => d.id));
          const missingDocs = DEFAULT_DOCUMENTS.filter((d) => !storedIds.has(d.id));
          state.documents = [...storedDocs, ...missingDocs];
        }
        return state as unknown as AppState;
      },
    }
  )
);
