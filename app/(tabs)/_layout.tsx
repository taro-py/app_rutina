import { Stack } from "expo-router";
import { View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { AppHeader } from "@/components/AppHeader";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <AppHeader />
      <View className="flex-1" style={{ paddingBottom: 0 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="schedule" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
      {/* Tuerca abajo para Ajustes */}
      <View className="border-t border-gray-100 bg-white px-4 py-3">
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          className="flex-row items-center justify-center gap-2 rounded-xl py-2 active:bg-gray-50"
        >
          <Ionicons name="settings-outline" size={22} color="#6b7280" />
          <Text className="text-[14px] font-medium text-gray-600">Ajustes</Text>
        </Pressable>
      </View>
    </View>
  );
}
