import { Pressable, Text, View } from "react-native";

export function Chip(props: { label: string; selected?: boolean; onPress?: () => void }) {
  const selected = !!props.selected;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      className={`rounded-full px-3 py-2 ${selected ? "bg-black" : "bg-gray-100"}`}
    >
      <Text className={`text-[13px] font-semibold ${selected ? "text-white" : "text-black"}`}>{props.label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View className="flex-row flex-wrap gap-2">{children}</View>;
}

