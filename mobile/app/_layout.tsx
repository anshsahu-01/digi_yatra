import React, { useEffect } from 'react';
import {
  Stack,
  useRouter,
  useSegments,
  useRootNavigationState,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import { useAuthStore } from '../src/store/authStore';
import { useFavoritesStore } from '../src/store/favoritesStore';

import 'react-native-reanimated';
import '../global.css';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  const segments = useSegments();
  const router = useRouter();

  // IMPORTANT
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait until navigator mounts
    if (!navigationState?.key) return;

    // Wait until auth loads
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, navigationState]);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#467EE5" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const loadSession = useAuthStore((s) => s.loadSession);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);

  useEffect(() => {
    loadSession();
    loadFavorites();
  }, []);

  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f1f5f9' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="station/[id]"
          options={{ animation: 'slide_from_bottom' }}
        />

        <Stack.Screen
          name="booking/[stationId]"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="search"
          options={{ animation: 'fade' }}
        />

        <Stack.Screen name="favorites" />
        <Stack.Screen name="settings" />
      </Stack>

      <StatusBar style="dark" />
    </AuthGuard>
  );
}