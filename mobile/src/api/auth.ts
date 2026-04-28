import apiClient from './client';
import { ENDPOINTS } from '../constants';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicleModel: string;
  vehicleNumber: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  vehicleModel?: string;
  vehicleNumber?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, payload);
    return data;
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(ENDPOINTS.SIGNUP, payload);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<User>(ENDPOINTS.ME);
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch<User>(ENDPOINTS.ME, payload);
    return data;
  },
};
