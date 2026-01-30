import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="day-setup" options={{ title: "Configuración" }} />
      </Stack>
    </SafeAreaProvider>
  );
}

