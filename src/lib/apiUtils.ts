import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Resolves the base URL for internal Expo API Routes.
 * - Web: returns an empty string, allowing for relative requests.
 * - Native (Dev): Uses Expo Constants to securely grab the Metro Dev Server hostUri.
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
		// Use Expo's official Dev Client manifest to dynamically extract the packager IP/Domain
		const hostUri = Constants.expoConfig?.hostUri;
		
		if (hostUri) {
			const protocol = (hostUri.includes("ngrok") || hostUri.includes("exp.direct")) ? "https://" : "http://";
			const resolvedUrl = protocol + hostUri;
			console.log("[API ROUTE RESOLVED TO]:", resolvedUrl);
			return resolvedUrl;
		}
		
		return "http://localhost:8081";
	}

	console.warn(
		"EXPO_PUBLIC_API_URL environment variable is missing for the native production build",
	);
	return "http://localhost:8081";
}
