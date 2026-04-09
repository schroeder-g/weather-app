import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { Outfit_400Regular, Outfit_700Bold } from "@expo-google-fonts/outfit";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { AuthGuard } from "@/components/AuthGuard";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/store/store";

if (__DEV__) {
	const { nativeServer } = require("@/mocks/native");
	nativeServer.listen();
}

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
		Inter_400Regular,
		Inter_700Bold,
		Outfit_400Regular,
		Outfit_700Bold,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	if (!loaded) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-primary font-black text-xl tracking-widest uppercase">
					Whether.io
				</Text>
			</View>
		);
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Provider store={store}>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
				>
					<AuthGuard>
						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen
								name="login"
								options={{ headerShown: false, animation: "fade" }}
							/>
						</Stack>
					</AuthGuard>
					{Platform.OS !== "web" && <PortalHost />}
				</ThemeProvider>
			</Provider>
		</GestureHandlerRootView>
	);
}
