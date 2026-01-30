import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SettingsState = {
  username: string;
  setUsername: (name: string) => void;
};

const STORAGE_KEY = "lifesync_settings_v1";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      username: "",
      setUsername: (name) => set({ username: name.trim() }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
