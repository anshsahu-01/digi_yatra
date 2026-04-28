import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const [notif, setNotif] = React.useState(true);

  const sections = [
    { title: 'PREFERENCES', items: [
      { icon: 'notifications-outline', label: 'Notifications', toggle: true, value: notif, onToggle: setNotif },
      { icon: 'language-outline', label: 'Language', sub: 'English' },
    ]},
    { title: 'SUPPORT', items: [
      { icon: 'help-circle-outline', label: 'Help Center', nav: true },
      { icon: 'chatbox-outline', label: 'Contact Us', nav: true },
      { icon: 'document-text-outline', label: 'Terms', nav: true },
      { icon: 'shield-checkmark-outline', label: 'Privacy', nav: true },
    ]},
    { title: 'ABOUT', items: [
      { icon: 'information-circle-outline', label: 'Version', sub: '1.0.0' },
      { icon: 'flash-outline', label: 'ChargEV', sub: 'Smart EV Charging' },
    ]},
  ];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-heading">Settings</Text>
        <View className="w-10" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {sections.map((sec, si) => (
          <View key={si} className="mb-5">
            <Text className="text-xs font-semibold text-hint tracking-wider mb-2">{sec.title}</Text>
            <View className="bg-surface rounded-2xl overflow-hidden">
              {sec.items.map((item, ii) => (
                <TouchableOpacity key={ii} className={`flex-row items-center gap-3 p-4 ${ii > 0 ? 'border-t border-divider' : ''}`} disabled={!item.nav}>
                  <Ionicons name={item.icon as any} size={18} color="#64748b" />
                  <View className="flex-1">
                    <Text className="text-base font-medium text-body">{item.label}</Text>
                    {item.sub && <Text className="text-xs text-hint mt-0.5">{item.sub}</Text>}
                  </View>
                  {item.toggle ? <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: '#e2e8f0', true: 'rgba(70,126,229,0.3)' }} thumbColor={item.value ? '#467EE5' : '#94a3b8'} /> : item.nav ? <Ionicons name="chevron-forward" size={16} color="#94a3b8" /> : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
