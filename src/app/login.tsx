import { loginUser } from "@/features/identity/identitySlice";
import type { AppDispatch, RootState } from "@/store/store";
import { staticColors } from "@/themes/config";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import colors from "tailwindcss/colors";

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.identity);
  const [isAttempting, setIsAttempting] = useState(false);

  const handleLogin = async () => {
    setIsAttempting(true);
    const resultAction = await dispatch(
      loginUser({ email: "demo@whether.io", password: "good-password" }),
    );
    if (loginUser.fulfilled.match(resultAction)) {
      router.replace("/");
    }
    setIsAttempting(false);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[staticColors.white, staticColors.slate]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View className="w-full max-w-md px-6">
          <LinearGradient
            colors={[staticColors.white, "#f8fafc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="rounded-[32px] px-10 py-14 border border-slate-100 overflow-hidden"
            style={{
              justifyContent: "center",
              shadowColor: "#94a3b8",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.15,
              shadowRadius: 40,
              elevation: 10,
            }}
          >
            <Animated.View
              entering={FadeInUp.duration(600).springify().damping(15)}
              className="items-center"
            >
              <Text className="text-red-500 font-bold text-[40px] tracking-tight mb-1 text-center">
                Whether.io
              </Text>
              <Text className="text-slate-500 text-center text-[15px] tracking-wide leading-relaxed px-2">
                Know what's coming. Plan accordingly.
              </Text>
            </Animated.View>

            <View className="h-14" />

            <Animated.View
              entering={FadeInUp.delay(100)
                .duration(600)
                .springify()
                .damping(15)}
            >
              <TouchableOpacity
                testID="login-button"
                onPress={handleLogin}
                disabled={status === "loading"}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.red[500], colors.red[400]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-2xl h-14 items-center justify-center shadow-lg shadow-red-500/25"
                >
                  {status === "loading" && isAttempting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold text-[17px] tracking-wide">
                      Continue
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {error && (
                <Animated.View entering={FadeInDown.duration(400)}>
                  <Text className="text-destructive text-center mt-5 font-medium">
                    {error}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}
