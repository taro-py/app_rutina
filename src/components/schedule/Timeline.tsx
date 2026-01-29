import { ScrollView, Text, View } from "react-native";
import type { ScheduleBlock } from "@/types/schedule";
import { minutesToHM } from "@/utils/time";
import { BlockCard } from "@/components/schedule/BlockCard";

export function Timeline(props: {
  blocks: ScheduleBlock[];
  onPressBlock?: (block: ScheduleBlock) => void;
}) {
  const blocks = props.blocks.slice().sort((a, b) => a.startMinutes - b.startMinutes);

  return (
    <ScrollView contentContainerClassName="px-4 pb-24 pt-3">
      <View className="gap-3">
        {blocks.length === 0 ? (
          <View className="rounded-2xl border border-gray-100 bg-white p-4">
            <Text className="text-[13px] text-gray-600">
              Aún no hay rutina generada. Pulsa “Generar Rutina”.
            </Text>
          </View>
        ) : (
          blocks.map((b) => (
            <View key={b.id} className="flex-row gap-3">
              <View className="w-16 items-end pt-1">
                <Text className="text-[12px] font-semibold text-gray-600">{minutesToHM(b.startMinutes)}</Text>
              </View>
              <View className="flex-1">
                <BlockCard block={b} onPress={() => props.onPressBlock?.(b)} />
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

