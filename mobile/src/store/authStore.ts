import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, User, LoginPayload, SignupPayload } from '../api/auth';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(payload);
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH_SESSION,
        JSON.stringify({ token: response.token, user: response.user })
      );
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await authApi.signup(payload);
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH_SESSION,
        JSON.stringify({ token: response.token, user: response.user })
      );
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (raw) {
        const session = JSON.parse(raw);
        if (session.token && session.user) {
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isInitialized: true,
          });
          return;
        }
      }
    } catch {
      // corrupted session
    }
    set({ isInitialized: true });
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const updatedUser = await authApi.updateProfile(data);
      const token = get().token;
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH_SESSION,
        JSON.stringify({ token, user: updatedUser })
      );
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
}));
