import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStationStore } from '../src/store/stationStore';
import { useFavoritesStore } from '../src/store/favoritesStore';

export default function FavoritesScreen() {
  const router = useRouter();
  const { stations, fetchStations } = useStationStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  useEffect(() => { if (stations.length === 0) fetchStations(); }, []);
  const favStations = stations.filter((s) => favorites.includes(String(s.id)));

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-4">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-heading">Favorites</Text>
        <View className="w-10" />
      </View>
      <Text className="text-sm text-secondary px-5 mt-1 mb-3">{favStations.length} saved</Text>
      <FlatList data={favStations} renderItem={({ item }) => (
        <TouchableOpacity className="bg-surface rounded-2xl p-4 mb-3" onPress={() => router.push(`/station/${item.id}`)}>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center">
              <Ionicons name="flash" size={18} color="#467EE5" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-heading" numberOfLines={1}>{item.name}</Text>
              <Text className="text-xs text-secondary mt-0.5">{item.city}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(String(item.id))}>
              <Ionicons name="heart" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )} keyExtractor={(i) => String(i.id)} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Ionicons name="heart-outline" size={40} color="#94a3b8" />
            <Text className="text-lg font-semibold text-heading mt-3">No Favorites</Text>
            <Text className="text-sm text-secondary mt-1">Tap the heart icon to save stations</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
