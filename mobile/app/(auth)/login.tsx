import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import Svg, { Path } from "react-native-svg";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) { setError('Please fill in all fields.'); return; }
    setError('');
    try { await login(form); } catch (err: any) { setError(err.message || 'Login failed'); }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="px-6">

            {/* Brand header */}
            <View className="bg-card-alt rounded-3xl px-6 py-8 mb-6">
              <View className="flex-row items-center gap-2 mb-6">
                <View className="w-9 h-9 rounded-xl bg-primary items-center justify-center">
                  <Ionicons name="navigate" size={18} color="#fff" />
                </View>
                <View>
                  <Text className="text-[10px] font-semibold text-primary tracking-[3px] uppercase">Yatra</Text>
                  <Text className="text-base font-bold text-heading -mt-0.5">MITRA</Text>
                </View>
              </View>
              <Text className="text-[32px] font-light text-heading leading-[40px]">
                Welcome Back{'\n'}Rider
              </Text>
              <Text className="text-sm text-secondary mt-5 leading-5">
                Locate, compare, and book EV charging stations with real-time availability — no more uncertainty or long waits.
              </Text>
            </View>

            {/* Form */}
            <View className="bg-surface rounded-3xl px-5 py-6 shadow-sm shadow-black/5">
              <Text className="text-2xl font-semibold text-heading text-center mb-5">Sign In</Text>

              <TextInput
                className="bg-bg border border-border rounded-xl text-base text-body px-4 h-12 mb-3"
                placeholder="Enter Your Email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
              />
              <TextInput
                className="bg-bg border border-border rounded-xl text-base text-body px-4 h-12 mb-4"
                placeholder="Enter Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={form.password}
                onChangeText={(t) => setForm((f) => ({ ...f, password: t }))}
              />

              {error ? (
                <View className="bg-danger-soft rounded-xl px-4 py-2.5 mb-3">
                  <Text className="text-sm text-danger">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                className={`w-full rounded-xl h-12 items-center justify-center ${isLoading ? 'bg-primary/60' : 'bg-primary'}`}
                onPress={handleLogin} disabled={isLoading} activeOpacity={0.8}
              >
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-base font-semibold text-white">Log In</Text>}
              </TouchableOpacity>

              {/* OR divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-border" />
                <Text className="text-sm text-hint px-3">OR</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              {/* Social buttons */}
              <TouchableOpacity
  className="flex-row items-center justify-center gap-3 w-full h-11 rounded-xl border border-border bg-surface mb-2.5"
  activeOpacity={0.7}
>
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.02 1.54 7.4 2.82l5.45-5.45C33.14 3.6 28.94 1.5 24 1.5 14.95 1.5 7.26 6.98 3.96 14.92l6.7 5.2C12.3 14.2 17.7 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.5 24.5c0-1.64-.14-2.82-.44-4H24v7.6h12.9c-.26 2.1-1.66 5.26-4.8 7.4l7.38 5.7c4.3-3.96 7.02-9.8 7.02-16.7z"
    />
    <Path
      fill="#FBBC05"
      d="M10.66 28.12a14.9 14.9 0 010-8.24l-6.7-5.2a24.01 24.01 0 000 18.64l6.7-5.2z"
    />
    <Path
      fill="#34A853"
      d="M24 46.5c6.5 0 11.94-2.14 15.92-5.82l-7.38-5.7c-1.98 1.38-4.64 2.32-8.54 2.32-6.3 0-11.7-4.7-13.34-10.62l-6.7 5.2C7.26 41.02 14.95 46.5 24 46.5z"
    />
  </Svg>
  <Text className="text-sm font-medium text-body">Continue with Google</Text>
</TouchableOpacity>

              

              {/* Sign up link */}
              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-sm text-secondary">New to the platform? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text className="text-sm font-medium text-primary">Create an account</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-6" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
