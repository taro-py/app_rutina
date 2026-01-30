import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const MENU_OPTIONS = [
  { key: "chat", label: "Chatbox", route: "/(tabs)" },
  { key: "schedule", label: "Horario", route: "/(tabs)/schedule" },
  { key: "settings", label: "Ajustes", route: "/(tabs)/settings" },
] as const;

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuVisible, setMenuVisible] = useState(false);

  const currentLabel =
    MENU_OPTIONS.find((o) => pathname === o.route || (o.route === "/(tabs)" && pathname === "/(tabs)"))?.label ??
    "LifeSync";

  const goTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as any);
  };

  return (
    <>
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <Text className="text-[18px] font-semibold text-black" numberOfLines={1}>
          {currentLabel}
        </Text>
        <Pressable
          onPress={() => setMenuVisible(true)}
          className="rounded-full p-2 active:bg-gray-100"
          hitSlop={12}
        >
          <Ionicons name="menu" size={24} color="#111" />
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setMenuVisible(false)}
        >
          <View className="absolute right-4 top-14 w-48 rounded-2xl border border-gray-200 bg-white shadow-lg">
            {MENU_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => goTo(opt.route)}
                className="flex-row items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0 active:bg-gray-50"
              >
                <Ionicons
                  name={
                    opt.key === "chat"
                      ? "chatbubbles"
                      : opt.key === "schedule"
                        ? "calendar"
                        : "settings"
                  }
                  size={20}
                  color="#374151"
                />
                <Text className="text-[15px] font-medium text-gray-800">
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
