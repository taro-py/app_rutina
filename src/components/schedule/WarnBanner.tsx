import { Text, View } from "react-native";
import type { AgentWarning } from "@/types/schedule";

export function WarnBanner({ warnings }: { warnings: AgentWarning[] }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <View className="mx-4 mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
      <Text className="text-[12px] font-semibold text-gray-700">Avisos del Agente</Text>
      <View className="mt-2 gap-1">
        {warnings.slice(0, 3).map((w, idx) => (
          <Text key={`${w.code}_${idx}`} className="text-[12px] text-gray-700">
            - {w.message}
          </Text>
        ))}
        {warnings.length > 3 && <Text className="text-[12px] text-gray-600">- …</Text>}
      </View>
    </View>
  );
}

