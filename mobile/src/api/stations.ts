import apiClient from './client';
import { ENDPOINTS } from '../constants';

export interface Station {
  id: string | number;
  external_id?: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  charger_types: string[];
  connectors?: string[];
  total_slots: number;
  available_slots: number;
  price_per_unit: number;
  address?: string;
  source?: string;
  // Normalized client fields
  availability?: string;
  rating?: number;
  openHours?: string;
  powerOutput?: string;
  amenities?: string[];
}

export interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
}

export interface StationFilters {
  search?: string;
  city?: string;
  availability?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}

const getAvailability = (station: Station): string => {
  if (station.available_slots > 2) return 'Available';
  if (station.available_slots > 0) return 'Low';
  return 'Busy';
};

const normalizeStation = (station: any): Station => {
  const chargerTypes = station.charger_types || station.chargerTypes || station.connectors || [];
  return {
    ...station,
    id: String(station.id),
    lat: Number(station.lat ?? station.latitude ?? 0),
    lng: Number(station.lng ?? station.longitude ?? 0),
    latitude: Number(station.latitude ?? station.lat ?? 0),
    longitude: Number(station.longitude ?? station.lng ?? 0),
    charger_types: chargerTypes,
    connectors: chargerTypes,
    total_slots: Number(station.total_slots ?? 0),
    available_slots: Number(station.available_slots ?? 0),
    price_per_unit: Number(station.price_per_unit ?? 20),
    availability: getAvailability(station),
    rating: Number(station.rating || (4 + Math.random() * 0.9).toFixed(1)),
    openHours: station.openHours || '24x7',
    powerOutput: station.powerOutput || (chargerTypes.includes('CCS2') ? '120 kW' : '60 kW'),
    amenities: station.amenities || ['Parking', 'Restroom'],
    address: station.address || station.city || 'Unknown',
  };
};

export const stationsApi = {
  getStations: async (filters?: StationFilters): Promise<Station[]> => {
    const params: Record<string, string> = {};
    if (filters?.search?.trim()) params.search = filters.search.trim();
    if (filters?.city && filters.city !== 'All Cities') params.city = filters.city;
    if (filters?.availability && filters.availability !== 'All Status') params.availability = filters.availability;
    if (filters?.lat) params.lat = String(filters.lat);
    if (filters?.lng) params.lng = String(filters.lng);
    if (filters?.radius) params.radius = String(filters.radius);

    const { data } = await apiClient.get(ENDPOINTS.STATIONS, { params });
    return (data as any[]).map(normalizeStation);
  },

  getStationById: async (id: string | number): Promise<Station> => {
    const { data } = await apiClient.get(ENDPOINTS.STATION_DETAIL(id));
    return normalizeStation(data);
  },

  getAvailableSlots: async (stationId: string | number): Promise<TimeSlot[]> => {
    const { data } = await apiClient.get(ENDPOINTS.STATION_SLOTS(stationId));
    return data;
  },

  importStation: async (station: Partial<Station> & { id: number | string }): Promise<{ id: number }> => {
    const { data } = await apiClient.post(ENDPOINTS.STATION_IMPORT, {
      id: station.id,
      name: station.name,
      city: station.city || 'Unknown',
      latitude: station.lat ?? station.latitude,
      longitude: station.lng ?? station.longitude,
      total_slots: station.total_slots || 6,
      available_slots: station.available_slots || 3,
      charger_types: station.charger_types || ['CCS2'],
      price_per_unit: station.price_per_unit || 20,
    });
    return data;
  },
};
