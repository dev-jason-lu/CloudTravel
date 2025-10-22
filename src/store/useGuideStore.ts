import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { GuideContent, GuideFilter } from '@/types';

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

interface GuideState {
  guides: GuideContent[];
  filter: GuideFilter;
  favorites: string[]; // 收藏的攻略ID
  isLoading: boolean;

  // Actions
  setGuides: (guides: GuideContent[]) => void;
  updateFilter: (filter: Partial<GuideFilter>) => void;
  resetFilter: () => void;
  toggleFavorite: (guideId: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set) => ({
      guides: [],
      filter: {},
      favorites: [],
      isLoading: false,

      setGuides: (guides) => set({ guides }),

      updateFilter: (filter) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),

      resetFilter: () => set({ filter: {} }),

      toggleFavorite: (guideId) =>
        set((state) => ({
          favorites: state.favorites.includes(guideId)
            ? state.favorites.filter((id) => id !== guideId)
            : [...state.favorites, guideId],
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'guide-storage',
      storage: createJSONStorage(() => secureStore),
      partialize: (state) => ({
        favorites: state.favorites,
        filter: state.filter,
      }),
    }
  )
);
