import { Pressable, Text, View } from "react-native";

type Variant = "primary" | "secondary" | "ghost";

export function Button(props: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  rightSlot?: React.ReactNode;
}) {
  const variant = props.variant ?? "primary";
  const base = "rounded-2xl px-4 py-3";
  const styles =
    variant === "primary"
      ? "bg-black"
      : variant === "secondary"
        ? "bg-gray-100"
        : "bg-transparent";
  const text =
    variant === "primary" ? "text-white" : variant === "secondary" ? "text-black" : "text-black";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      disabled={props.disabled}
      className={`${base} ${styles} ${props.disabled ? "opacity-50" : ""}`}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Text className={`text-[15px] font-semibold ${text}`}>{props.label}</Text>
        {props.rightSlot}
      </View>
    </Pressable>
  );
}

