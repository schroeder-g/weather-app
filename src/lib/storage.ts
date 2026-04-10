import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const memoryStore = new Map<string, string>();

export const storage = {
	async setItem(key: string, value: string) {
		if (Platform.OS === "web") {
			// Disable persistent storage on web to enforce cookie constraints
			memoryStore.set(key, value);
			return;
		}
		try {
			await SecureStore.setItemAsync(key, value);
		} catch (e: any) {
			console.warn("SecureStore failed, falling back to memory.", e);
			memoryStore.set(key, value);
		}
	},
	async getItem(key: string) {
		if (Platform.OS === "web") {
			return memoryStore.get(key) || null;
		}
		try {
			return await SecureStore.getItemAsync(key);
		} catch (e: any) {
			return memoryStore.get(key) || null;
		}
	},
	async removeItem(key: string) {
		if (Platform.OS === "web") {
			memoryStore.delete(key);
			return;
		}
		try {
			await SecureStore.deleteItemAsync(key);
		} catch (e: any) {
			memoryStore.delete(key);
		}
	},
	async clear() {
		if (Platform.OS === "web") {
			memoryStore.clear();
			return;
		}
		try {
			await SecureStore.deleteItemAsync("auth_token");
			await SecureStore.deleteItemAsync("auth_user");
		} catch (e: any) {
			// Ignore
		}
		memoryStore.clear();
	},
};
