import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

interface FavoritesState {
  favorites: string[];
  isLoaded: boolean;

  loadFavorites: () => Promise<void>;
  toggleFavorite: (stationId: string) => Promise<void>;
  isFavorite: (stationId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoaded: false,

  loadFavorites: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (raw) {
        set({ favorites: JSON.parse(raw), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  toggleFavorite: async (stationId) => {
    const { favorites } = get();
    const updated = favorites.includes(stationId)
      ? favorites.filter((id) => id !== stationId)
      : [...favorites, stationId];

    set({ favorites: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  },

  isFavorite: (stationId) => get().favorites.includes(stationId),
}));
