import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStationStore } from '../src/store/stationStore';
import { Station } from '../src/api/stations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../src/constants';

export default function SearchScreen() {
  const router = useRouter();
  const { stations, fetchStations } = useStationStore();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (stations.length === 0) fetchStations();
    AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES).then((r) => { if (r) setRecent(JSON.parse(r)); });
  }, []);

  const filtered = query.trim()
    ? stations.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.city.toLowerCase().includes(query.toLowerCase()))
    : [];

  const saveSearch = async (term: string) => {
    const u = [term, ...recent.filter((s) => s !== term)].slice(0, 8);
    setRecent(u);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(u));
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 py-3">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center bg-surface rounded-xl border border-border px-3 h-11 gap-2">
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput className="flex-1 text-base text-body" value={query} onChangeText={setQuery} placeholder="Search stations..." placeholderTextColor="#94a3b8" autoFocus returnKeyType="search" />
          {query.length > 0 && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={16} color="#94a3b8" /></TouchableOpacity>}
        </View>
      </View>

      {!query.trim() && recent.length > 0 && (
        <View className="px-5 mt-2">
          <Text className="text-sm font-medium text-secondary mb-2">Recent</Text>
          {recent.map((t, i) => (
            <TouchableOpacity key={i} className="flex-row items-center gap-3 py-3 border-b border-divider" onPress={() => setQuery(t)}>
              <Ionicons name="time-outline" size={16} color="#94a3b8" />
              <Text className="text-base text-body">{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {query.trim() && (
        <FlatList
          data={filtered}
          renderItem={({ item }: { item: Station }) => (
            <TouchableOpacity className="bg-surface rounded-2xl p-4 mb-3" onPress={() => { saveSearch(query); router.push(`/station/${item.id}`); }}>
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center">
                  <Ionicons name="flash" size={18} color="#467EE5" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-heading" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-xs text-secondary mt-0.5">{item.city}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Ionicons name="search-outline" size={40} color="#94a3b8" />
              <Text className="text-lg font-semibold text-heading mt-3">No Results</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
