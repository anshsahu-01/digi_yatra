import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useStationStore } from '../../src/store/stationStore';
import { dashboardApi, DashboardData } from '../../src/api/dashboard';
import { getGreeting } from '../../src/utils';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { stations, fetchStations, isLoading: stationsLoading } = useStationStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [_, d] = await Promise.allSettled([fetchStations(), dashboardApi.getDashboard()]);
      if (d.status === 'fulfilled') setDashboard(d.value);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (loading && !dashboard) {
    return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /><Text className="text-sm text-secondary mt-3">Loading...</Text></View>;
  }

  const stats = dashboard?.stats || [];
  const nearby = stations.slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#467EE5" />}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-3">
          <View>
            <Text className="text-sm text-secondary">{getGreeting()}</Text>
            <Text className="text-2xl font-bold text-heading mt-0.5">{user?.name || 'Rider'}</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => router.push('/search')}>
              <Ionicons name="search" size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => router.push('/favorites')}>
              <Ionicons name="heart" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-3 px-5 mb-5">
          {[
            { icon: 'flash', label: 'Find Station', color: '#467EE5', bg: 'bg-primary-soft', route: '/(tabs)/stations' },
            { icon: 'map', label: 'Map View', color: '#22C55E', bg: 'bg-accent-soft', route: '/(tabs)/map' },
            { icon: 'calendar', label: 'Bookings', color: '#F59E0B', bg: 'bg-warning-soft', route: '/(tabs)/bookings' },
          ].map((a) => (
            <TouchableOpacity key={a.label} className={`flex-1 items-center py-4 rounded-2xl ${a.bg}`} onPress={() => router.push(a.route as any)} activeOpacity={0.7}>
              <View className="w-10 h-10 rounded-xl bg-white items-center justify-center shadow-sm shadow-black/5 mb-2">
                <Ionicons name={a.icon as any} size={20} color={a.color} />
              </View>
              <Text className="text-xs font-semibold text-body">{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        {stats.length > 0 && (
          <View className="mb-5">
            <Text className="text-lg font-semibold text-heading px-5 mb-3">Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              <View className="flex-row gap-3">
                {stats.map((s, i) => (
                  <View key={i} className="bg-surface rounded-2xl p-4 w-[150px] shadow-sm shadow-black/5">
                    <Ionicons name={['flash-outline', 'calendar-outline', 'speedometer-outline', 'wallet-outline'][i] as any} size={18} color="#467EE5" />
                    <Text className="text-2xl font-bold text-heading mt-2">{s.value}</Text>
                    <Text className="text-xs text-secondary mt-0.5" numberOfLines={1}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Nearby Stations */}
        <View className="mb-5">
          <View className="flex-row justify-between items-center px-5 mb-3">
            <Text className="text-lg font-semibold text-heading">Nearby Stations</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/stations')}><Text className="text-sm font-medium text-primary">See All</Text></TouchableOpacity>
          </View>
          <View className="px-5">
            {nearby.map((station) => (
              <TouchableOpacity key={String(station.id)} className="bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5" onPress={() => router.push(`/station/${station.id}`)} activeOpacity={0.7}>
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center">
                    <Ionicons name="flash" size={18} color="#467EE5" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-heading" numberOfLines={1}>{station.name}</Text>
                    <Text className="text-xs text-secondary mt-0.5">{station.city}</Text>
                  </View>
                  <View className={`px-2.5 py-1 rounded-full ${station.available_slots > 2 ? 'bg-success-soft' : station.available_slots > 0 ? 'bg-warning-soft' : 'bg-danger-soft'}`}>
                    <Text className={`text-xs font-semibold ${station.available_slots > 2 ? 'text-success' : station.available_slots > 0 ? 'text-warning' : 'text-danger'}`}>
                      {station.available_slots > 0 ? `${station.available_slots} slots` : 'Busy'}
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-4 mt-3 pt-3 border-t border-divider">
                  <View className="flex-row items-center gap-1"><Ionicons name="flash-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">{station.charger_types?.slice(0, 2).join(', ')}</Text></View>
                  <View className="flex-row items-center gap-1"><Ionicons name="wallet-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">₹{station.price_per_unit}/kWh</Text></View>
                </View>
              </TouchableOpacity>
            ))}
            {nearby.length === 0 && !stationsLoading && (
              <View className="bg-surface rounded-2xl p-6 items-center"><Text className="text-sm text-secondary">No stations found. Pull down to refresh.</Text></View>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        {dashboard?.recentActivity?.length ? (
          <View className="mb-5 px-5">
            <Text className="text-lg font-semibold text-heading mb-3">Recent Activity</Text>
            <View className="bg-surface rounded-2xl p-4 shadow-sm shadow-black/5">
              {dashboard.recentActivity.map((item, i) => (
                <View key={item.id} className={`flex-row gap-3 py-3 ${i > 0 ? 'border-t border-divider' : ''}`}>
                  <View className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <View className="flex-1">
                    <View className="flex-row justify-between"><Text className="text-sm font-medium text-body flex-1">{item.title}</Text><Text className="text-xs text-hint ml-2">{item.time}</Text></View>
                    <Text className="text-xs text-secondary mt-0.5">{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
