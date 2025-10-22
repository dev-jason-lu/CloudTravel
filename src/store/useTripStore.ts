import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Trip } from '@/types';

// 使用expo-secure-store作为存储适配器
const secureStore = {
  getItem: async (name: string) => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error('Error getting item from secure store:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure store:', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure store:', error);
    }
  },
};

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;

  // Actions
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: [],
      currentTrip: null,
      isLoading: false,

      setTrips: (trips) => set({ trips }),

      addTrip: (trip) =>
        set((state) => ({
          trips: [...state.trips, trip],
        })),

      updateTrip: (tripId, updates) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, ...updates, updatedAt: Date.now() } : trip
          ),
        })),

      deleteTrip: (tripId) =>
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== tripId),
        })),

      setCurrentTrip: (trip) => set({ currentTrip: trip }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => secureStore),
    }
  )
);
