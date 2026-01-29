import { PropsWithChildren } from "react";
import { View } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  return <View className="flex-1 bg-white">{children}</View>;
}

