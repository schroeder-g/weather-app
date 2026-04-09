import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { hydrateAuth } from '@/features/identity/identitySlice';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.identity);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (status === 'idle' || status === 'loading') return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, status, router, rootNavigationState?.key]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {(status === 'idle' || status === 'loading') && (
        <View className="absolute inset-0 z-50 flex-1 justify-center items-center bg-background">
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      )}
    </View>
  );
}
