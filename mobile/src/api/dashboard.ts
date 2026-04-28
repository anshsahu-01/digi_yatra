import apiClient from './client';
import { ENDPOINTS } from '../constants';

export interface DashboardStat {
  label: string;
  value: string | number;
  change: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivity: RecentActivity[];
  cityBands: string[];
  recommendations: any[];
}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get(ENDPOINTS.DASHBOARD);
    return data;
  },

  getRecommendations: async (lat?: number, lng?: number, energyNeeded?: number) => {
    const params: Record<string, string> = {};
    if (lat) params.lat = String(lat);
    if (lng) params.lng = String(lng);
    if (energyNeeded) params.energyNeeded = String(energyNeeded);

    const { data } = await apiClient.get(ENDPOINTS.RECOMMENDATIONS, { params });
    return data;
  },
};
