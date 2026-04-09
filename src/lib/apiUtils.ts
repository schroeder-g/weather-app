import { Platform } from "react-native";

/**
 * Resolves the base URL for internal Expo API Routes.
 * - Web: returns an empty string, allowing for relative requests.
 * - Native (Dev): returns http://localhost:8081 for simulator testing.
 * - Native (Prod): pulls from EXPO_PUBLIC_API_URL, which should be configured in Vercel/EAS.
 */
export function getBaseApiUrl(): string {
	if (Platform.OS === "web") {
		return "";
	}

	if (process.env.EXPO_PUBLIC_API_URL) {
		return process.env.EXPO_PUBLIC_API_URL;
	}

	if (__DEV__) {
		return "http://localhost:8081";
	}

	console.warn(
		"EXPO_PUBLIC_API_URL environment variable is missing for the native production build",
	);
	return "http://localhost:8081";
}
