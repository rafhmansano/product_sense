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
  FileAttachment,
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
  hotels: Hotel[];
  carRentals: CarRental[];
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
  familyInviteCode: string | null;
  setTripCode: (code: string) => void;
  setFamilyName: (name: string) => void;
  setFamilyInviteCode: (code: string | null) => void;
  hydrateFromCloud: (data: TripData) => void;
  getTripData: () => TripData;
  // Trip
  updateTrip: (trip: Partial<Trip>) => void;
  // Flights
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, data: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  addFlightAttachment: (flightId: string, attachment: FileAttachment) => void;
  removeFlightAttachment: (flightId: string, attachmentId: string) => void;
  // Hotels (multiple)
  addHotel: (hotel: Hotel) => void;
  updateHotel: (id: string, data: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
  addHotelAttachment: (hotelId: string, attachment: FileAttachment) => void;
  removeHotelAttachment: (hotelId: string, attachmentId: string) => void;
  // Car Rentals (multiple)
  addCarRental: (car: CarRental) => void;
  updateCarRental: (id: string, data: Partial<CarRental>) => void;
  deleteCarRental: (id: string) => void;
  addCarAttachment: (carId: string, attachment: FileAttachment) => void;
  removeCarAttachment: (carId: string, attachmentId: string) => void;
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
      hotels: [],
      carRentals: [],
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
      familyInviteCode: null,

      setTripCode: (code) => set({ tripCode: code }),
      setFamilyName: (name) => set({ familyName: name }),
      setFamilyInviteCode: (code) => set({ familyInviteCode: code }),

      hydrateFromCloud: (data) => {
        // Merge any categories added to DEFAULT_BUDGET_CATEGORIES after the cloud snapshot was saved
        const cloudCats = data.budgetCategories ?? DEFAULT_BUDGET_CATEGORIES;
        const cloudIds = new Set(cloudCats.map((c) => c.id));
        const missing = DEFAULT_BUDGET_CATEGORIES.filter((c) => !cloudIds.has(c.id));
        let mergedCategories = cloudCats;
        if (missing.length > 0) {
          const cats = [...cloudCats];
          const emergenciaIdx = cats.findIndex((c) => c.id === 'emergencia');
          if (emergenciaIdx >= 0) {
            cats.splice(emergenciaIdx, 0, ...missing);
          } else {
            cats.push(...missing);
          }
          mergedCategories = cats;
        }

        set({
          trip: data.trip,
          flights: (data.flights ?? []).map((f) => ({ ...f, attachments: f.attachments ?? [] })),
          hotels: (data.hotels ?? []).map((h) => ({ ...h, attachments: h.attachments ?? [] })),
          carRentals: (data.carRentals ?? []).map((c) => ({ ...c, attachments: c.attachments ?? [] })),
          events: data.events,
          budgetCategories: mergedCategories,
          expenses: data.expenses,
          documents: data.documents,
          exchangeRate: data.exchangeRate,
          suitcaseItems: data.suitcaseItems ?? DEFAULT_SUITCASE_ITEMS,
          backpackItems: data.backpackItems ?? DEFAULT_BACKPACK_ITEMS,
          pharmacyItems: data.pharmacyItems ?? DEFAULT_PHARMACY_ITEMS,
          groceryItems: data.groceryItems ?? DEFAULT_GROCERY_ITEMS,
          customRestaurants: data.customRestaurants ?? [],
          foodItems: data.foodItems ?? [],
        });
      },

      getTripData: () => {
        const s = get();
        return {
          trip: s.trip,
          flights: s.flights,
          hotels: s.hotels,
          carRentals: s.carRentals,
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

      // Flights
      addFlight: (flight) =>
        set((state) => ({ flights: [...state.flights, flight] })),

      updateFlight: (id, data) =>
        set((state) => ({
          flights: state.flights.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),

      deleteFlight: (id) =>
        set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),

      addFlightAttachment: (flightId, attachment) =>
        set((state) => ({
          flights: state.flights.map((f) =>
            f.id === flightId
              ? { ...f, attachments: [...(f.attachments ?? []), attachment] }
              : f
          ),
        })),

      removeFlightAttachment: (flightId, attachmentId) =>
        set((state) => ({
          flights: state.flights.map((f) =>
            f.id === flightId
              ? { ...f, attachments: (f.attachments ?? []).filter((a) => a.id !== attachmentId) }
              : f
          ),
        })),

      // Hotels
      addHotel: (hotel) =>
        set((state) => ({ hotels: [...state.hotels, hotel] })),

      updateHotel: (id, data) =>
        set((state) => ({
          hotels: state.hotels.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),

      deleteHotel: (id) =>
        set((state) => ({ hotels: state.hotels.filter((h) => h.id !== id) })),

      addHotelAttachment: (hotelId, attachment) =>
        set((state) => ({
          hotels: state.hotels.map((h) =>
            h.id === hotelId
              ? { ...h, attachments: [...(h.attachments ?? []), attachment] }
              : h
          ),
        })),

      removeHotelAttachment: (hotelId, attachmentId) =>
        set((state) => ({
          hotels: state.hotels.map((h) =>
            h.id === hotelId
              ? { ...h, attachments: (h.attachments ?? []).filter((a) => a.id !== attachmentId) }
              : h
          ),
        })),

      // Car Rentals
      addCarRental: (car) =>
        set((state) => ({ carRentals: [...state.carRentals, car] })),

      updateCarRental: (id, data) =>
        set((state) => ({
          carRentals: state.carRentals.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCarRental: (id) =>
        set((state) => ({ carRentals: state.carRentals.filter((c) => c.id !== id) })),

      addCarAttachment: (carId, attachment) =>
        set((state) => ({
          carRentals: state.carRentals.map((c) =>
            c.id === carId
              ? { ...c, attachments: [...(c.attachments ?? []), attachment] }
              : c
          ),
        })),

      removeCarAttachment: (carId, attachmentId) =>
        set((state) => ({
          carRentals: state.carRentals.map((c) =>
            c.id === carId
              ? { ...c, attachments: (c.attachments ?? []).filter((a) => a.id !== attachmentId) }
              : c
          ),
        })),

      // Events
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
            { ...expense, budgetCategoryId: expense.category },
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
      version: 4,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;

        if (version < 2) {
          const storedDocs = (state.documents as TripDocument[]) || [];
          const storedIds = new Set(storedDocs.map((d) => d.id));
          const missingDocs = DEFAULT_DOCUMENTS.filter((d) => !storedIds.has(d.id));
          state.documents = [...storedDocs, ...missingDocs];
        }

        if (version < 3) {
          // Migrate single hotel → hotels array
          const oldHotel = state.hotel as Hotel | null | undefined;
          if (oldHotel) {
            state.hotels = [{ ...oldHotel, attachments: (oldHotel as Hotel).attachments ?? [] }];
          } else {
            state.hotels = state.hotels ?? [];
          }
          delete state.hotel;

          // Migrate single carRental → carRentals array
          const oldCar = state.carRental as CarRental | null | undefined;
          if (oldCar) {
            state.carRentals = [{ ...oldCar, attachments: (oldCar as CarRental).attachments ?? [] }];
          } else {
            state.carRentals = state.carRentals ?? [];
          }
          delete state.carRental;

          // Ensure flights have attachments array
          state.flights = ((state.flights as Flight[]) ?? []).map((f) => ({
            ...f,
            attachments: (f as Flight).attachments ?? [],
          }));
        }

        if (version < 4) {
          // Inject missing budget categories for existing users
          const stored = (state.budgetCategories as BudgetCategory[]) ?? [];
          const storedIds = new Set(stored.map((c) => c.id));
          const missing = DEFAULT_BUDGET_CATEGORIES.filter((c) => !storedIds.has(c.id));
          if (missing.length > 0) {
            // Insert missing categories before 'emergencia'
            const emergenciaIdx = stored.findIndex((c) => c.id === 'emergencia');
            if (emergenciaIdx >= 0) {
              stored.splice(emergenciaIdx, 0, ...missing);
              state.budgetCategories = stored;
            } else {
              state.budgetCategories = [...stored, ...missing];
            }
          }
        }

        return state as unknown as AppState;
      },
    }
  )
);
