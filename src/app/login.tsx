import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUser } from '@/features/identity/identitySlice';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.identity);
  const [isAttempting, setIsAttempting] = useState(false);

  const handleLogin = async () => {
    setIsAttempting(true);
    const resultAction = await dispatch(loginUser({ email: 'demo@whether.io', password: 'good-password' }));
    if (loginUser.fulfilled.match(resultAction)) {
      router.replace('/');
    }
    setIsAttempting(false);
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <Animated.View entering={FadeInUp.duration(500)} className="items-center mb-12">
        <Text className="text-red-500 font-black text-4xl tracking-widest uppercase mb-4">
          Whether.io
        </Text>
        <Text className="text-muted-foreground text-center text-lg">
          Know what's coming. Plan accordingly.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={status === 'loading'}
          className="bg-red-500 rounded-full h-14 items-center justify-center shadow-lg shadow-red-500/30"
          activeOpacity={0.8}
        >
          {status === 'loading' && isAttempting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Log in</Text>
          )}
        </TouchableOpacity>
        
        {error && (
          <Text className="text-destructive text-center mt-4">
            {error}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
