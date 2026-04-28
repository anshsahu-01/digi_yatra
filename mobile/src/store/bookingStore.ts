import { create } from 'zustand';
import { bookingsApi, Booking, CreateBookingPayload } from '../api/bookings';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  cancelBooking: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingsApi.getBookings();
      set({ bookings, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to load bookings' });
    }
  },

  createBooking: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingsApi.createBooking(payload);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isLoading: false,
      }));
      return booking;
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await bookingsApi.cancelBooking(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
