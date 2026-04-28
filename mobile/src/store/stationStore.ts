import { create } from 'zustand';
import { stationsApi, Station, StationFilters } from '../api/stations';

interface StationState {
  stations: Station[];
  selectedStation: Station | null;
  filters: StationFilters;
  isLoading: boolean;
  error: string | null;

  fetchStations: (filters?: StationFilters) => Promise<void>;
  setFilters: (filters: StationFilters) => void;
  setSelectedStation: (station: Station | null) => void;
  fetchStationById: (id: string | number) => Promise<Station>;
  clearError: () => void;
}

export const useStationStore = create<StationState>((set, get) => ({
  stations: [],
  selectedStation: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchStations: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const mergedFilters = { ...get().filters, ...filters };
      const stations = await stationsApi.getStations(mergedFilters);
      set({ stations, isLoading: false, filters: mergedFilters });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to load stations' });
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  setSelectedStation: (station) => set({ selectedStation: station }),

  fetchStationById: async (id) => {
    try {
      const station = await stationsApi.getStationById(id);
      set({ selectedStation: station });
      return station;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
