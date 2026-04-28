import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useStationStore } from '../../src/store/stationStore';
import { Station } from '../../src/api/stations';
import { DEFAULT_LOCATION } from '../../src/constants';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const router = useRouter();
  const { stations, fetchStations, isLoading } = useStationStore();
  const [selected, setSelected] = useState<Station | null>(null);
  const mapRef = useRef<MapView>(null);
  useEffect(() => { if (stations.length === 0) fetchStations(); }, []);
  const getColor = (s: Station) => s.available_slots > 2 ? '#22C55E' : s.available_slots > 0 ? '#F59E0B' : '#EF4444';

  if (isLoading && stations.length === 0) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /></View>;

  return (
    <View className="flex-1">
      <MapView ref={mapRef} style={{ width, height }} provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{ latitude: stations[0]?.lat || DEFAULT_LOCATION.lat, longitude: stations[0]?.lng || DEFAULT_LOCATION.lng, latitudeDelta: 0.5, longitudeDelta: 0.5 }}
        showsUserLocation showsMyLocationButton={false}>
        {stations.map((s) => <Marker key={String(s.id)} coordinate={{ latitude: s.lat, longitude: s.lng }} pinColor={getColor(s)} onPress={() => setSelected(s)} />)}
      </MapView>

      <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
        <View className="mx-5 mt-2 bg-white/95 rounded-2xl p-4 shadow-sm shadow-black/10">
          <Text className="text-lg font-semibold text-heading">Station Map</Text>
          <Text className="text-xs text-secondary mt-0.5">{stations.length} stations</Text>
        </View>
      </SafeAreaView>

      {selected && (
        <View className={`absolute left-5 right-5 ${Platform.OS === 'ios' ? 'bottom-[100px]' : 'bottom-[80px]'}`}>
          <TouchableOpacity className="bg-surface rounded-2xl p-4 shadow-lg shadow-black/10" onPress={() => router.push(`/station/${selected.id}`)} activeOpacity={0.9}>
            <View className="w-9 h-1 rounded-full bg-border self-center mb-3" />
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center"><Ionicons name="flash" size={18} color="#467EE5" /></View>
              <View className="flex-1"><Text className="text-base font-medium text-heading" numberOfLines={1}>{selected.name}</Text><Text className="text-xs text-secondary mt-0.5">{selected.city}</Text></View>
              <View className={`px-2 py-0.5 rounded-full ${selected.available_slots > 2 ? 'bg-success-soft' : 'bg-warning-soft'}`}>
                <Text className={`text-xs font-semibold ${selected.available_slots > 2 ? 'text-success' : 'text-warning'}`}>{selected.available_slots} slots</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-primary rounded-xl py-3 items-center flex-row justify-center gap-2 mt-3" onPress={() => router.push(`/booking/${selected.id}`)}>
              <Text className="text-base font-semibold text-white">Book Now</Text><Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
