import { Pressable, Text, View } from "react-native";
import type { ScheduleBlock } from "@/types/schedule";
import { minutesToHM } from "@/utils/time";

function bgFor(color: ScheduleBlock["color"]) {
  switch (color) {
    case "coral":
      return "bg-coral-100";
    case "sky":
      return "bg-sky-100";
    case "mint":
      return "bg-mint-100";
    case "lilac":
      return "bg-lilac-100";
    case "beige":
    default:
      return "bg-beige-100";
  }
}

export function BlockCard(props: { block: ScheduleBlock; onPress?: () => void }) {
  const { block } = props;
  return (
    <Pressable
      onPress={props.onPress}
      className={`rounded-2xl border border-gray-100 p-3 ${bgFor(block.color)} ${block.locked ? "opacity-90" : ""}`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-black" numberOfLines={1}>
            {block.title}
          </Text>
          {!!block.notes && (
            <Text className="mt-1 text-[12px] text-gray-700" numberOfLines={2}>
              {block.notes}
            </Text>
          )}
        </View>
        <Text className="text-[12px] font-semibold text-gray-800">
          {minutesToHM(block.startMinutes)}–{minutesToHM(block.endMinutes)}
        </Text>
      </View>
    </Pressable>
  );
}

