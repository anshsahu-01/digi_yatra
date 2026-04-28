import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { getInitials } from '../../src/utils';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const favCount = useFavoritesStore((s) => s.favorites.length);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', vehicleModel: user?.vehicleModel || '', vehicleNumber: user?.vehicleNumber || '' });

  const handleLogout = () => { Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Logout', style: 'destructive', onPress: () => logout() }]); };
  const handleSave = async () => { try { await updateProfile(form); setEditing(false); } catch (err: any) { Alert.alert('Error', err.message); } };
  const update = (field: string) => (value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text className="text-2xl font-bold text-heading mb-5">Profile</Text>

        {/* Avatar */}
        <View className="bg-surface rounded-2xl p-6 items-center mb-4 shadow-sm shadow-black/5">
          <View className="w-16 h-16 rounded-full bg-primary-soft items-center justify-center mb-2">
            <Text className="text-xl font-bold text-primary">{getInitials(user?.name || 'U')}</Text>
          </View>
          <Text className="text-xl font-bold text-heading">{user?.name}</Text>
          <Text className="text-sm text-secondary mt-0.5">{user?.email}</Text>
          <TouchableOpacity className="flex-row items-center gap-1 mt-3 py-1.5 px-4 rounded-full bg-primary-soft" onPress={() => setEditing(!editing)}>
            <Ionicons name={editing ? 'close' : 'create-outline'} size={14} color="#467EE5" />
            <Text className="text-xs font-medium text-primary">{editing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Edit */}
        {editing && (
          <View className="bg-surface rounded-2xl p-4 mb-4 shadow-sm shadow-black/5">
            {[{ l: 'Name', k: 'name' }, { l: 'Phone', k: 'phone', kb: 'phone-pad' }, { l: 'City', k: 'city' }, { l: 'Vehicle Model', k: 'vehicleModel' }, { l: 'Vehicle Number', k: 'vehicleNumber', caps: 'characters' }].map((f) => (
              <View key={f.k} className="mb-3">
                <Text className="text-xs font-medium text-secondary mb-1.5">{f.l}</Text>
                <TextInput className="bg-bg border border-border rounded-xl text-base text-body py-2.5 px-3 min-h-[44px]" value={(form as any)[f.k]} onChangeText={update(f.k)} placeholderTextColor="#94a3b8" keyboardType={(f.kb as any) || 'default'} autoCapitalize={(f.caps as any) || 'sentences'} />
              </View>
            ))}
            <TouchableOpacity className={`w-full rounded-xl h-11 items-center justify-center ${isLoading ? 'bg-primary/60' : 'bg-primary'}`} onPress={handleSave} disabled={isLoading}>
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-base font-semibold text-white">Save Changes</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        {!editing && user && (
          <View className="bg-surface rounded-2xl p-4 mb-4 shadow-sm shadow-black/5">
            {[{ i: 'call-outline', l: 'Phone', v: user.phone || 'Not set' }, { i: 'location-outline', l: 'City', v: user.city || 'Not set' }, { i: 'car-outline', l: 'Vehicle', v: user.vehicleModel || 'Not set' }, { i: 'card-outline', l: 'Plate', v: user.vehicleNumber || 'Not set' }].map((item, idx) => (
              <View key={idx} className={`flex-row items-center gap-3 py-3 ${idx > 0 ? 'border-t border-divider' : ''}`}>
                <Ionicons name={item.i as any} size={18} color="#94a3b8" /><View className="flex-1"><Text className="text-xs text-hint">{item.l}</Text><Text className="text-sm font-medium text-body mt-0.5">{item.v}</Text></View>
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View className="bg-surface rounded-2xl mb-5 overflow-hidden shadow-sm shadow-black/5">
          {[{ i: 'heart', l: 'Favorites', v: `${favCount}`, p: () => router.push('/favorites') }, { i: 'settings-outline', l: 'Settings', p: () => router.push('/settings') }, { i: 'help-circle-outline', l: 'Help & Support' }].map((item, idx) => (
            <TouchableOpacity key={idx} className={`flex-row items-center gap-3 p-4 ${idx > 0 ? 'border-t border-divider' : ''}`} onPress={item.p}>
              <Ionicons name={item.i as any} size={18} color="#64748b" /><Text className="text-base font-medium text-body flex-1">{item.l}</Text>
              {item.v && <Text className="text-xs text-hint mr-1">{item.v}</Text>}<Ionicons name="chevron-forward" size={16} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="w-full rounded-xl h-12 items-center justify-center bg-danger-soft flex-row gap-2 mb-10" onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" /><Text className="text-base font-semibold text-danger">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
