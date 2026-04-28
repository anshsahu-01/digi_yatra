import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { stationsApi, Station } from '../../src/api/stations';
import { useFavoritesStore } from '../../src/store/favoritesStore';

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const fav = isFavorite(id || '');

  useEffect(() => { if (!id) return; stationsApi.getStationById(id).then(setStation).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /></View>;
  if (error || !station) return (
    <SafeAreaView className="flex-1 bg-bg">
      <TouchableOpacity className="m-5 w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#1e293b" /></TouchableOpacity>
      <View className="flex-1 items-center justify-center p-6"><Text className="text-base text-danger">{error || 'Station not found'}</Text></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-5 py-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#1e293b" /></TouchableOpacity>
          <Text className="text-lg font-semibold text-heading flex-1 text-center mx-2" numberOfLines={1}>Station Details</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => toggleFavorite(String(station.id))}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#EF4444' : '#64748b'} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View className="items-center px-5 py-6">
          <View className="w-20 h-20 rounded-3xl bg-primary-soft items-center justify-center mb-4"><Ionicons name="flash" size={40} color="#467EE5" /></View>
          <Text className="text-2xl font-bold text-heading text-center">{station.name}</Text>
          <View className="flex-row items-center gap-1 mt-2"><Ionicons name="location" size={14} color="#467EE5" /><Text className="text-sm text-secondary">{station.address || station.city}</Text></View>
          <View className={`flex-row items-center gap-1 mt-3 px-3 py-1 rounded-full ${station.available_slots > 2 ? 'bg-success-soft' : station.available_slots > 0 ? 'bg-warning-soft' : 'bg-danger-soft'}`}>
            <View className={`w-1.5 h-1.5 rounded-full ${station.available_slots > 2 ? 'bg-success' : station.available_slots > 0 ? 'bg-warning' : 'bg-danger'}`} />
            <Text className={`text-sm font-semibold ${station.available_slots > 2 ? 'text-success' : station.available_slots > 0 ? 'text-warning' : 'text-danger'}`}>
              {station.available_slots > 2 ? 'Available' : station.available_slots > 0 ? 'Limited' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap px-5 gap-3 mb-5">
          {[{ i: 'battery-charging', l: 'Slots', v: `${station.available_slots}/${station.total_slots}`, c: '#22C55E' }, { i: 'wallet-outline', l: 'Price', v: `₹${station.price_per_unit}/kWh`, c: '#467EE5' }, { i: 'speedometer-outline', l: 'Power', v: station.powerOutput || '60 kW', c: '#F59E0B' }, { i: 'star', l: 'Rating', v: String(station.rating || '4.5'), c: '#F59E0B' }].map((s, i) => (
            <View key={i} className="w-[47%] bg-surface rounded-2xl p-4 items-center gap-1 shadow-sm shadow-black/5">
              <Ionicons name={s.i as any} size={20} color={s.c} /><Text className="text-lg font-semibold text-heading">{s.v}</Text><Text className="text-xs text-secondary">{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Chargers */}
        <View className="mx-5 bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5">
          <Text className="text-sm font-medium text-secondary mb-3">Charger Types</Text>
          <View className="flex-row flex-wrap gap-2">
            {(station.charger_types || []).map((t, i) => (
              <View key={i} className="flex-row items-center gap-1 bg-primary-soft px-3 py-1.5 rounded-full"><Ionicons name="flash" size={12} color="#467EE5" /><Text className="text-xs font-medium text-primary">{t}</Text></View>
            ))}
          </View>
        </View>

        {/* Amenities */}
        <View className="mx-5 bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5">
          <Text className="text-sm font-medium text-secondary mb-3">Amenities</Text>
          <View className="flex-row flex-wrap gap-2">
            {(station.amenities || ['Parking', 'Restroom']).map((a, i) => (
              <View key={i} className="flex-row items-center gap-1 bg-bg border border-border px-3 py-1.5 rounded-full">
                <Ionicons name={a === 'Parking' ? 'car' : a === 'Restroom' ? 'water' : 'cafe'} size={12} color="#64748b" /><Text className="text-xs text-secondary">{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View className="mx-5 bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5">
          <Text className="text-sm font-medium text-secondary mb-3">Information</Text>
          {[{ i: 'time-outline', l: 'Hours', v: station.openHours || '24x7' }, { i: 'location-outline', l: 'City', v: station.city }, { i: 'globe-outline', l: 'Coordinates', v: `${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}` }].map((item, i) => (
            <View key={i} className={`flex-row items-center gap-3 py-3 ${i > 0 ? 'border-t border-divider' : ''}`}>
              <Ionicons name={item.i as any} size={16} color="#94a3b8" /><Text className="text-sm text-secondary flex-1">{item.l}</Text><Text className="text-sm font-medium text-body">{item.v}</Text>
            </View>
          ))}
        </View>
        <View className="h-[100px]" />
      </ScrollView>

      {/* CTA */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-surface border-t border-border px-5 py-4 pb-8 shadow-lg shadow-black/10">
        <View><Text className="text-lg font-bold text-primary">₹{station.price_per_unit}/kWh</Text><Text className="text-xs text-secondary mt-0.5">{station.available_slots} slots available</Text></View>
        <TouchableOpacity className="bg-primary rounded-xl py-3 px-6 flex-row items-center gap-2" onPress={() => router.push(`/booking/${station.id}`)}>
          <Ionicons name="flash" size={16} color="#fff" /><Text className="text-base font-semibold text-white">Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
