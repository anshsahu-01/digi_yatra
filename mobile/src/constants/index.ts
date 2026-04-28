import { Platform } from 'react-native';

// Android emulator: 10.0.2.2 maps to host machine's localhost
// iOS simulator: localhost works directly
// Physical device: use your machine's LAN IP
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    return 'http://localhost:8000/api';
  }
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  LOGIN: '/auth/login/',
  SIGNUP: '/auth/signup/',
  GOOGLE_AUTH: '/auth/google/',
  ME: '/auth/me/',
  STATIONS: '/stations/',
  STATION_DETAIL: (id: string | number) => `/stations/${id}/`,
  STATION_SLOTS: (id: string | number) => `/stations/${id}/available-slots/`,
  STATION_IMPORT: '/stations/import/',
  BOOKINGS: '/bookings/',
  BOOKING_CANCEL: (id: number) => `/bookings/${id}/cancel/`,
  DASHBOARD: '/dashboard/',
  RECOMMENDATIONS: '/recommendations/',
} as const;

export const CHARGER_TYPES = ['CCS2', 'CHAdeMO', 'Type 2', 'GB/T', 'Tesla'] as const;

export const BOOKING_STATUSES = {
  CONFIRMED: 'Confirmed', UPCOMING: 'Upcoming', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
} as const;

export const STORAGE_KEYS = {
  AUTH_SESSION: 'chargev-session',
  FAVORITES: 'chargev-favorites',
  RECENT_SEARCHES: 'chargev-recent-searches',
} as const;

export const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.2090, label: 'New Delhi' };
