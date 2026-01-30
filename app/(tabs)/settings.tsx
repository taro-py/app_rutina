import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { useSettingsStore } from "@/store/settingsStore";
import { useDayStore } from "@/store/dayStore";
import { Button } from "@/components/ui/Button";

export default function SettingsScreen() {
  const { username, setUsername } = useSettingsStore();
  const { profile, lastResult } = useDayStore();
  const [nameInput, setNameInput] = useState(username);

  const saveName = () => {
    setUsername(nameInput);
  };

  const hasSchedule = lastResult && lastResult.blocks.length > 0;

  return (
    <Screen>
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-gray-500">
          Perfil
        </Text>
        <Text className="mb-4 text-[20px] font-semibold text-black">
          Ajustes
        </Text>

        <View className="mb-8">
          <Text className="mb-2 text-[14px] font-medium text-gray-800">
            Nombre de usuario
          </Text>
          <TextInput
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-[15px] text-black"
            placeholder="Ej: María, Alex..."
            placeholderTextColor="#9ca3af"
            value={nameInput}
            onChangeText={setNameInput}
            onBlur={saveName}
          />
          <Text className="mt-2 text-[12px] text-gray-500">
            Este nombre aparecerá en el chat al saludarte.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-[14px] font-medium text-gray-800">
            Gestionar horarios
          </Text>
          <View className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            {hasSchedule ? (
              <>
                <Text className="mb-2 text-[14px] text-gray-700">
                  Tienes un horario generado para hoy ({profile.dayStart}–{profile.dayEnd}).
                </Text>
                <Text className="text-[13px] text-gray-600">
                  Abre «Horario» desde el menú (arriba a la derecha) para verlo o editarlo. Desde la pantalla de horario puedes regenerar o re-optimizar la rutina.
                </Text>
              </>
            ) : (
              <>
                <Text className="mb-2 text-[14px] text-gray-700">
                  Aún no has generado un horario.
                </Text>
                <Text className="text-[13px] text-gray-600">
                  Ve al Chatbox, escribe tus preferencias (rol, qué hacer hoy, horas de sueño, citas) y pide que genere tu horario. Luego podrás verlo en «Horario».
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
