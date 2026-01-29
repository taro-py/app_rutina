import { PropsWithChildren } from "react";
import { View } from "react-native";

export function Card({ children }: PropsWithChildren) {
  return <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">{children}</View>;
}

