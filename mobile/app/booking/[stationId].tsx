import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { stationsApi, Station, TimeSlot } from '../../src/api/stations';
import { useBookingStore } from '../../src/store/bookingStore';
import { useAuthStore } from '../../src/store/authStore';
import { CHARGER_TYPES } from '../../src/constants';
import { formatCurrency } from '../../src/utils';

export default function BookingScreen() {
  const { stationId } = useLocalSearchParams<{ stationId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { createBooking, isLoading } = useBookingStore();
  const [station, setStation] = useState<Station | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], slot: '', chargerType: '', energyNeeded: '20', vehicleNumber: user?.vehicleNumber || '', notes: '' });

  useEffect(() => {
    if (!stationId) return;
    (async () => {
      try {
        const [s, sl] = await Promise.all([stationsApi.getStationById(stationId), stationsApi.getAvailableSlots(stationId).catch(() => [])]);
        setStation(s); setSlots(sl);
        if (s.charger_types?.length) setForm((f) => ({ ...f, chargerType: s.charger_types[0] }));
      } catch {} finally { setLoading(false); }
    })();
  }, [stationId]);

  const cost = station ? Number(form.energyNeeded || 0) * station.price_per_unit : 0;

  const handleBook = async () => {
    if (!form.slot) { Alert.alert('Error', 'Select a time slot.'); return; }
    if (!form.chargerType) { Alert.alert('Error', 'Select a charger type.'); return; }
    if (!form.vehicleNumber.trim()) { Alert.alert('Error', 'Enter vehicle number.'); return; }
    try {
      let bid = Number(stationId);
      if (station && isNaN(bid)) { const imp = await stationsApi.importStation(station as any); bid = imp.id; }
      await createBooking({ station: bid, date: form.date, slot: form.slot, charger_type: form.chargerType, energy_needed: Number(form.energyNeeded), vehicle_number: form.vehicleNumber, notes: form.notes });
      Alert.alert('Booking Confirmed! ⚡', `Slot booked at ${station?.name}.`, [{ text: 'View Bookings', onPress: () => { router.back(); router.push('/(tabs)/bookings'); } }, { text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) { Alert.alert('Failed', err.message); }
  };

  if (loading) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /></View>;
  const chargerOpts = station?.charger_types?.length ? station.charger_types : [...CHARGER_TYPES];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center shadow-sm shadow-black/5" onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color="#1e293b" /></TouchableOpacity>
        <Text className="text-lg font-semibold text-heading">Book Slot</Text>
        <View className="w-10" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {station && (
          <View className="bg-surface rounded-2xl p-4 mb-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center"><Ionicons name="flash" size={18} color="#467EE5" /></View>
              <View className="flex-1"><Text className="text-base font-medium text-heading" numberOfLines={1}>{station.name}</Text><Text className="text-xs text-secondary mt-0.5">{station.city} • ₹{station.price_per_unit}/kWh</Text></View>
            </View>
          </View>
        )}

        <Text className="text-sm font-medium text-body mb-1.5">Date</Text>
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 h-12 mb-4">
          <Ionicons name="calendar-outline" size={18} color="#94a3b8" />
          <TextInput className="flex-1 text-base text-body ml-2.5" value={form.date} onChangeText={(t) => setForm((f) => ({ ...f, date: t }))} placeholder="YYYY-MM-DD" placeholderTextColor="#94a3b8" />
        </View>

        <Text className="text-sm font-medium text-body mb-1.5">Time Slot</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {slots.map((s) => (
              <TouchableOpacity key={s.id} className={`px-4 py-2 rounded-full border ${form.slot === s.label ? 'bg-primary border-primary' : 'bg-surface border-border'} ${!s.available ? 'opacity-40' : ''}`} onPress={() => s.available && setForm((f) => ({ ...f, slot: s.label }))} disabled={!s.available}>
                <Text className={`text-xs font-medium ${form.slot === s.label ? 'text-white' : 'text-secondary'}`}>{s.label}</Text>
              </TouchableOpacity>
            ))}
            {slots.length === 0 && <Text className="text-xs text-hint py-2">Enter slot manually below</Text>}
          </View>
        </ScrollView>
        {slots.length === 0 && (
          <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 h-12 mb-4">
            <Ionicons name="time-outline" size={18} color="#94a3b8" />
            <TextInput className="flex-1 text-base text-body ml-2.5" value={form.slot} onChangeText={(t) => setForm((f) => ({ ...f, slot: t }))} placeholder="e.g. 10:00-11:00" placeholderTextColor="#94a3b8" />
          </View>
        )}

        <Text className="text-sm font-medium text-body mb-1.5">Charger Type</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {chargerOpts.map((t) => (
            <TouchableOpacity key={t} className={`flex-row items-center gap-1 px-4 py-2 rounded-full ${form.chargerType === t ? 'bg-primary' : 'bg-primary-soft'}`} onPress={() => setForm((f) => ({ ...f, chargerType: t }))}>
              <Ionicons name="flash" size={12} color={form.chargerType === t ? '#fff' : '#467EE5'} />
              <Text className={`text-xs font-medium ${form.chargerType === t ? 'text-white' : 'text-primary'}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-medium text-body mb-1.5">Energy (kWh)</Text>
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 h-12 mb-4">
          <Ionicons name="battery-charging" size={18} color="#94a3b8" />
          <TextInput className="flex-1 text-base text-body ml-2.5" value={form.energyNeeded} onChangeText={(t) => setForm((f) => ({ ...f, energyNeeded: t }))} keyboardType="numeric" placeholder="20" placeholderTextColor="#94a3b8" />
        </View>

        <Text className="text-sm font-medium text-body mb-1.5">Vehicle Number</Text>
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3 h-12 mb-4">
          <Ionicons name="car" size={18} color="#94a3b8" />
          <TextInput className="flex-1 text-base text-body ml-2.5" value={form.vehicleNumber} onChangeText={(t) => setForm((f) => ({ ...f, vehicleNumber: t }))} autoCapitalize="characters" placeholder="MP 09 AB 1234" placeholderTextColor="#94a3b8" />
        </View>

        {/* Cost */}
        <View className="bg-card-alt rounded-2xl items-center p-5 mb-5">
          <Text className="text-xs font-semibold text-primary uppercase tracking-wider">Estimated Cost</Text>
          <Text className="text-3xl font-bold text-heading mt-1">{formatCurrency(cost)}</Text>
          <Text className="text-xs text-secondary mt-1">{form.energyNeeded} kWh × ₹{station?.price_per_unit || 0}/kWh</Text>
        </View>

        <TouchableOpacity className={`w-full rounded-xl h-12 items-center justify-center flex-row gap-2 ${isLoading ? 'bg-primary/60' : 'bg-primary'}`} onPress={handleBook} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <><Ionicons name="checkmark-circle" size={18} color="#fff" /><Text className="text-base font-semibold text-white">Confirm Booking</Text></>}
        </TouchableOpacity>
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
