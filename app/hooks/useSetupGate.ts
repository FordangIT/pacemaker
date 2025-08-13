import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

const KEY = "setup_done";

export function useSetupGate() {
  const [isSetupDone, setDone] = useState(false);

  // 플랫폼별 저장소 함수
  const setItem = useCallback(async (key: string, value: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }, []);

  const getItem = useCallback(async (key: string) => {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }, []);

  // 기존 함수들 수정
  const load = useCallback(async () => {
    try {
      const v = await getItem(KEY);
      setDone(v === "1");
    } catch (error) {
      console.error("Failed to load setup status:", error);
      setDone(false);
    }
  }, [getItem]);

  const markDone = useCallback(async () => {
    try {
      await setItem(KEY, "1");
      setDone(true);
    } catch (error) {
      console.error("Failed to mark setup as done:", error);
    }
  }, [setItem]);

  const reset = useCallback(async () => {
    try {
      await deleteItem(KEY);
      setDone(false);
    } catch (error) {
      console.error("Failed to reset setup:", error);
    }
  }, [deleteItem]);

  useEffect(() => {
    load();
  }, [load]);

  return { isSetupDone, markDone, reset };
}
