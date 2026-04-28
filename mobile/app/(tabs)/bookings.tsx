import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../../src/store/bookingStore';
import { Booking } from '../../src/api/bookings';
import { formatCurrency, formatDate } from '../../src/utils';

const TABS = ['All', 'Upcoming', 'Confirmed', 'Completed', 'Cancelled'];

function BookingItem({ booking, onCancel }: { booking: Booking; onCancel: () => void }) {
  const canCancel = booking.status !== 'Cancelled' && booking.status !== 'Completed';
  const sc = booking.status === 'Confirmed' || booking.status === 'Completed' ? 'success' : booking.status === 'Cancelled' ? 'danger' : 'warning';
  return (
    <View className="bg-surface rounded-2xl p-4 mb-3 shadow-sm shadow-black/5">
      <View className="flex-row items-center gap-3">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${booking.status === 'Cancelled' ? 'bg-danger-soft' : 'bg-primary-soft'}`}>
          <Ionicons name={booking.status === 'Cancelled' ? 'close-circle' : 'calendar'} size={18} color={booking.status === 'Cancelled' ? '#EF4444' : '#467EE5'} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-heading" numberOfLines={1}>{booking.stationName || 'Station'}</Text>
          <Text className="text-xs text-secondary mt-0.5">{formatDate(booking.date)} • {booking.slot}</Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full bg-${sc}-soft`}>
          <Text className={`text-xs font-semibold text-${sc}`}>{booking.status}</Text>
        </View>
      </View>
      <View className="flex-row gap-4 mt-3 pt-3 border-t border-divider flex-wrap">
        <View className="flex-row items-center gap-1"><Ionicons name="flash-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">{booking.chargerType || booking.charger_type}</Text></View>
        <View className="flex-row items-center gap-1"><Ionicons name="battery-charging-outline" size={13} color="#94a3b8" /><Text className="text-xs text-secondary">{booking.energyNeeded || booking.energy_needed} kWh</Text></View>
      </View>
      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-lg font-bold text-primary">{formatCurrency(booking.amount)}</Text>
        {canCancel && (
          <TouchableOpacity className="flex-row items-center gap-1 py-1.5 px-3 rounded-full bg-danger-soft" onPress={onCancel}>
            <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
            <Text className="text-xs font-medium text-danger">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function BookingsScreen() {
  const { bookings, fetchBookings, cancelBooking, isLoading } = useBookingStore();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => { fetchBookings(); }, []);
  const onRefresh = useCallback(async () => { setRefreshing(true); await fetchBookings(); setRefreshing(false); }, []);
  const filtered = activeTab === 'All' ? bookings : bookings.filter((b) => b.status === activeTab);

  if (isLoading && bookings.length === 0) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#467EE5" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-5 pt-4 pb-2"><Text className="text-2xl font-bold text-heading">My Bookings</Text><Text className="text-sm text-secondary mt-0.5">{bookings.length} total</Text></View>
      <ScrollableRow>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} className={`py-1.5 px-4 rounded-full border ${activeTab === tab ? 'bg-primary border-primary' : 'bg-surface border-border'}`} onPress={() => setActiveTab(tab)}>
            <Text className={`text-xs font-medium ${activeTab === tab ? 'text-white' : 'text-secondary'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollableRow>
      <FlatList data={filtered} renderItem={({ item }) => <BookingItem booking={item} onCancel={() => cancelBooking(item.id)} />} keyExtractor={(item) => String(item.id)} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#467EE5" />}
        ListEmptyComponent={<View className="items-center py-20"><View className="w-16 h-16 rounded-full bg-surface items-center justify-center mb-3"><Ionicons name="calendar-outline" size={32} color="#94a3b8" /></View><Text className="text-lg font-semibold text-heading">No Bookings</Text><Text className="text-sm text-secondary mt-1">Your booking history will appear here</Text></View>}
      />
    </SafeAreaView>
  );
}

function ScrollableRow({ children }: { children: React.ReactNode }) {
  const { ScrollView } = require('react-native');
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}>{children}</ScrollView>;
}
