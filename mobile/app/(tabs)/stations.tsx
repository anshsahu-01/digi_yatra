import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStationStore } from '../../src/store/stationStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { Station } from '../../src/api/stations';

function StationItem({ station, onPress }: { station: Station; onPress: () => void }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(String(station.id));
  return (
    <TouchableOpacity className="bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5" onPress={onPress} activeOpacity={0.7}>
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center">
          <Ionicons name="flash" size={18} color="#467EE5" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-heading" numberOfLines={1}>{station.name}</Text>
          <Text className="text-xs text-secondary mt-0.5">{station.address || station.city}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(String(station.id))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#EF4444' : '#94a3b8'} />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center gap-2 mt-3 flex-wrap">
        <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${station.available_slots > 2 ? 'bg-success-soft' : station.available_slots > 0 ? 'bg-warning-soft' : 'bg-danger-soft'}`}>
          <View className={`w-1.5 h-1.5 rounded-full ${station.available_slots > 2 ? 'bg-success' : station.available_slots > 0 ? 'bg-warning' : 'bg-danger'}`} />
          <Text className={`text-xs font-semibold ${station.available_slots > 2 ? 'text-success' : station.available_slots > 0 ? 'text-warning' : 'text-danger'}`}>
            {station.available_slots > 2 ? 'Available' : station.available_slots > 0 ? 'Limited' : 'Busy'}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-4 mt-3 pt-3 border-t border-divider">
        <View className="flex-row items-center gap-1"><Ionicons name="flash-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">{station.charger_types?.slice(0, 2).join(', ') || 'CCS2'}</Text></View>
        <View className="flex-row items-center gap-1"><Ionicons name="wallet-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">₹{station.price_per_unit}/kWh</Text></View>
        <View className="flex-row items-center gap-1"><Ionicons name="star" size={13} color="#F59E0B" /><Text className="text-xs font-medium text-body">{station.rating || '4.5'}</Text></View>
      </View>
    </TouchableOpacity>
  );
}

export default function StationsScreen() {
  const router = useRouter();
  const { stations, fetchStations, isLoading } = useStationStore();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => { fetchStations(); }, []);
  const onRefresh = useCallback(async () => { setRefreshing(true); await fetchStations(); setRefreshing(false); }, []);
  const filtered = search.trim() ? stations.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())) : stations;

  if (isLoading && stations.length === 0) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-5 pt-4 pb-2"><Text className="text-2xl font-bold text-heading">Stations</Text><Text className="text-sm text-secondary mt-0.5">{filtered.length} stations found</Text></View>
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-surface rounded-xl border border-border px-3 h-11 gap-2 shadow-sm shadow-black/5">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput className="flex-1 text-base text-body" value={search} onChangeText={setSearch} placeholder="Search by name or city..." placeholderTextColor="#94a3b8" returnKeyType="search" />
          {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="#94a3b8" /></TouchableOpacity>}
        </View>
      </View>
      <FlatList data={filtered} renderItem={({ item }) => <StationItem station={item} onPress={() => router.push(`/station/${item.id}`)} />} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#467EE5" />}
        ListEmptyComponent={<View className="items-center py-20"><View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-3 shadow-sm shadow-black/5"><Ionicons name="flash-off-outline" size={32} color="#94a3b8" /></View><Text className="text-lg font-semibold text-heading">No Stations Found</Text><Text className="text-sm text-secondary mt-1">{search ? 'Try a different search' : 'Pull to refresh'}</Text></View>}
      />
    </SafeAreaView>
  );
}
