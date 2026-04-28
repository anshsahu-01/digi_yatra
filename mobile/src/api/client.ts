import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API URL in dev
if (__DEV__) {
  console.log('[ChargEV] API Base URL:', API_BASE_URL);
}

// Request interceptor - inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (__DEV__) {
      console.log('[API Error]', error.response?.status, error.response?.data || error.message);
    }

    if (error.response?.data) {
      const data = error.response.data;
      let message = 'Something went wrong. Please try again.';

      // Django REST Framework error formats
      if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (typeof data === 'string') {
        message = data;
      } else if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
        message = data.non_field_errors[0];
      } else if (typeof data === 'object') {
        // Field-specific errors: { email: ["This field is required."] }
        const entries = Object.entries(data);
        if (entries.length > 0) {
          const [field, errors] = entries[0];
          if (Array.isArray(errors) && errors.length > 0) {
            message = `${field}: ${errors[0]}`;
          }
        }
      }

      return Promise.reject(new Error(message));
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Check your connection.'));
    }

    if (!error.response) {
      return Promise.reject(new Error(`Cannot reach server at ${API_BASE_URL}. Make sure the Django backend is running.`));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
