import { Text, TextInput, View } from "react-native";

export function Input(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold text-gray-600">{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType ?? "default"}
        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[15px]"
      />
    </View>
  );
}

