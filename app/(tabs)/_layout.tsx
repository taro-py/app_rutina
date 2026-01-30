import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const emoji = name === "Asistente" ? "💬" : "📅";
  return (
    <View className="items-center justify-center gap-0.5">
      <Text className="text-[18px]">{emoji}</Text>
      <Text className={`text-[10px] font-medium ${focused ? "text-black" : "text-gray-500"}`} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#f3f4f6", paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Asistente",
          tabBarIcon: ({ focused }) => <TabIcon name="Asistente" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Mi horario",
          tabBarIcon: ({ focused }) => <TabIcon name="Mi horario" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
