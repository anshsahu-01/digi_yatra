import apiClient from './client';
import { ENDPOINTS } from '../constants';

export interface Booking {
  id: number;
  stationName: string;
  station_external_id?: string;
  source?: string;
  date: string;
  slot: string;
  charger_type: string;
  chargerType?: string;
  energy_needed: number;
  energyNeeded?: number;
  vehicle_number: string;
  vehicleNumber?: string;
  notes: string;
  status: string;
  amount: number;
}

export interface CreateBookingPayload {
  station: number;
  date: string;
  slot: string;
  charger_type: string;
  energy_needed: number;
  vehicle_number: string;
  notes?: string;
}

const normalizeBooking = (booking: any): Booking => ({
  ...booking,
  chargerType: booking.charger_type || booking.chargerType || '',
  energyNeeded: Number(booking.energy_needed ?? booking.energyNeeded ?? 0),
  vehicleNumber: booking.vehicle_number || booking.vehicleNumber || '',
  amount: Number(booking.amount ?? 0),
});

export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get(ENDPOINTS.BOOKINGS);
    return (data as any[]).map(normalizeBooking);
  },

  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const { data } = await apiClient.post(ENDPOINTS.BOOKINGS, payload);
    return normalizeBooking(data);
  },

  cancelBooking: async (id: number): Promise<Booking> => {
    const { data } = await apiClient.patch(ENDPOINTS.BOOKING_CANCEL(id));
    return normalizeBooking(data);
  },
};
