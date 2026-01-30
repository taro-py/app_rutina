import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";

export default function LandingScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-2 rounded-3xl bg-black/5 px-6 py-3">
          <Text className="text-center text-[13px] font-medium uppercase tracking-widest text-gray-500">
            Tu día, organizado
          </Text>
        </View>
        <Text className="mb-3 max-w-[280px] text-center text-[32px] font-bold leading-tight text-black">
          LifeSync
        </Text>
        <Text className="mb-12 max-w-[260px] text-center text-[15px] leading-relaxed text-gray-600">
          Configura tu rutina con el asistente y genera tu horario del día en un solo paso.
        </Text>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          className="w-full max-w-[280px] rounded-2xl bg-black py-4 active:opacity-90"
        >
          <Text className="text-center text-[16px] font-semibold text-white">
            Iniciar rutina
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
