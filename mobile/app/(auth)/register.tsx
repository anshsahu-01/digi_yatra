import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import Svg, { Path } from "react-native-svg";

export default function RegisterScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '', vehicleModel: '', vehicleNumber: '' });
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) { setError('Name, email, and password are required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    try { await signup(form); } catch (err: any) { setError(err.message || 'Signup failed'); }
  };

  const update = (key: string) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="px-6">
            {/* Back + Brand */}
            <View className="flex-row items-center gap-3 mt-4 mb-5">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-surface items-center justify-center" onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#1e293b" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
                  <Ionicons name="navigate" size={14} color="#fff" />
                </View>
                <View>
                  <Text className="text-[8px] font-semibold text-primary tracking-[2px] uppercase">Yatra</Text>
                  <Text className="text-sm font-bold text-heading -mt-0.5">MITRA</Text>
                </View>
              </View>
            </View>

            <Text className="text-[26px] font-semibold text-heading mb-1">Create Account</Text>
            <Text className="text-sm text-secondary mb-5">Join Yatra Mitra — start smart charging today</Text>

            {/* Form */}
            <View className="bg-surface rounded-3xl px-5 py-5 shadow-sm shadow-black/5">
              {[
                { k: 'name', l: 'Full Name *', p: 'Enter your name', ic: 'person-outline' },
                { k: 'email', l: 'Email *', p: 'Enter your email', ic: 'mail-outline', kb: 'email-address', cap: 'none' },
                { k: 'password', l: 'Password *', p: 'Min 8 characters', ic: 'lock-closed-outline', sec: true },
                { k: 'phone', l: 'Phone', p: 'Phone number', ic: 'call-outline', kb: 'phone-pad' },
                { k: 'city', l: 'City', p: 'Your city', ic: 'location-outline' },
                { k: 'vehicleModel', l: 'Vehicle Model', p: 'e.g. Tata Nexon EV', ic: 'car-outline' },
                { k: 'vehicleNumber', l: 'Vehicle Number', p: 'e.g. MP 09 AB 1234', ic: 'card-outline', cap: 'characters' },
              ].map((f) => (
                <View key={f.k} className="mb-3">
                  <Text className="text-sm font-medium text-body mb-1.5">{f.l}</Text>
                  <View className="flex-row items-center bg-bg border border-border rounded-xl px-3 h-12">
                    <Ionicons name={f.ic as any} size={16} color="#94a3b8" />
                    <TextInput className="flex-1 text-base text-body ml-2.5" placeholder={f.p} placeholderTextColor="#94a3b8" value={(form as any)[f.k]} onChangeText={update(f.k)} secureTextEntry={!!f.sec} keyboardType={(f.kb as any) || 'default'} autoCapitalize={(f.cap as any) || 'sentences'} />
                  </View>
                </View>
              ))}

              {error ? (
                <View className="bg-danger-soft rounded-xl px-4 py-2.5 mb-3">
                  <Text className="text-sm text-danger">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity className={`w-full rounded-xl h-12 items-center justify-center mt-1 ${isLoading ? 'bg-primary/60' : 'bg-primary'}`} onPress={handleSignup} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-base font-semibold text-white">Create Account</Text>}
              </TouchableOpacity>

              {/* OR */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-border" /><Text className="text-sm text-hint px-3">OR</Text><View className="flex-1 h-px bg-border" />
              </View>

              {/* Social */}
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

              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-sm text-secondary">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}><Text className="text-sm font-medium text-primary">Sign In</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
