import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map<string, string>();
let useMemoryFallback = false;

export const storage = {
  async setItem(key: string, value: string) {
    if (useMemoryFallback) {
      memoryStore.set(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e: any) {
      if (e?.message?.includes('Native module is null') || e?.message?.includes('legacy storage')) {
        useMemoryFallback = true;
        memoryStore.set(key, value);
      } else {
        throw e;
      }
    }
  },
  async getItem(key: string) {
    if (useMemoryFallback) {
      return memoryStore.get(key) || null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e: any) {
      if (e?.message?.includes('Native module is null') || e?.message?.includes('legacy storage')) {
        useMemoryFallback = true;
        return memoryStore.get(key) || null;
      }
      throw e;
    }
  },
  async removeItem(key: string) {
    if (useMemoryFallback) {
      memoryStore.delete(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e: any) {
      if (e?.message?.includes('Native module is null') || e?.message?.includes('legacy storage')) {
        useMemoryFallback = true;
        memoryStore.delete(key);
      } else {
        throw e;
      }
    }
  },
  async clear() {
    if (useMemoryFallback) {
      memoryStore.clear();
      return;
    }
    try {
      await AsyncStorage.clear();
    } catch (e: any) {
      if (e?.message?.includes('Native module is null') || e?.message?.includes('legacy storage')) {
        useMemoryFallback = true;
        memoryStore.clear();
      } else {
        throw e;
      }
    }
  }
};
