import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/ui/Card";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDayStore } from "@/store/dayStore";
import type { Role } from "@/types/schedule";
import { hmToMinutes } from "@/utils/time";

const roles: Role[] = ["Estudiante", "Opositor", "Trabajador", "Freelance"];

export default function DaySetupScreen() {
  const router = useRouter();
  const {
    profile,
    setRole,
    setDayRange,
    setDesiredHours,
    setSleep,
    addFixed,
    removeFixed
  } = useDayStore();

  const [dayStart, setDayStart] = useState(profile.dayStart);
  const [dayEnd, setDayEnd] = useState(profile.dayEnd);
  const [desired, setDesired] = useState(String(profile.desiredProductiveHours));
  const [sleepStart, setSleepStart] = useState(profile.sleepStart ?? "");
  const [sleepEnd, setSleepEnd] = useState(profile.sleepEnd ?? "");

  const validDayRange = useMemo(() => {
    const s = hmToMinutes(dayStart as any);
    const e = hmToMinutes(dayEnd as any);
    return Number.isFinite(s) && Number.isFinite(e) && e > s;
  }, [dayStart, dayEnd]);

  const save = () => {
    const hours = Number(desired);
    if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
      Alert.alert("Horas inválidas", "Introduce un número entre 0 y 24.");
      return;
    }
    if (!validDayRange) {
      Alert.alert("Rango inválido", "La hora fin debe ser mayor que la de inicio (HH:MM).");
      return;
    }
    setDayRange(dayStart as any, dayEnd as any);
    setDesiredHours(hours);
    setSleep(sleepStart ? (sleepStart as any) : undefined, sleepEnd ? (sleepEnd as any) : undefined);
    router.push("/schedule");
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-24 pt-4">
        <View className="gap-4">
          <View>
            <Text className="text-[22px] font-semibold text-black">Configuración del Día</Text>
            <Text className="mt-1 text-[13px] text-gray-600">
              Define tu contexto. El Agente optimiza tu rutina en base a tus límites.
            </Text>
          </View>

          <Card>
            <Text className="text-[13px] font-semibold text-gray-700">Rol</Text>
            <View className="mt-3">
              <ChipRow>
                {roles.map((r) => (
                  <Chip key={r} label={r} selected={profile.role === r} onPress={() => setRole(r)} />
                ))}
              </ChipRow>
            </View>
          </Card>

          <Card>
            <Text className="text-[13px] font-semibold text-gray-700">Horario del día</Text>
            <View className="mt-3 gap-3">
              <Input label="Inicio (HH:MM)" value={dayStart} onChangeText={setDayStart} placeholder="07:00" />
              <Input label="Fin (HH:MM)" value={dayEnd} onChangeText={setDayEnd} placeholder="23:00" />
              {!validDayRange && (
                <Text className="text-[12px] font-semibold text-red-600">
                  Rango inválido. Asegúrate de que Fin &gt; Inicio.
                </Text>
              )}
            </View>
          </Card>

          <Card>
            <Text className="text-[13px] font-semibold text-gray-700">Productividad deseada</Text>
            <View className="mt-3 gap-3">
              <Input
                label="Horas totales (0–24)"
                value={desired}
                onChangeText={setDesired}
                placeholder="6"
                keyboardType="numeric"
              />
              <Text className="text-[12px] text-gray-600">
                El Agente ajustará la distribución, pero si pides más de lo que cabe, te avisará.
              </Text>
            </View>
          </Card>

          <Card>
            <Text className="text-[13px] font-semibold text-gray-700">Sueño (opcional)</Text>
            <View className="mt-3 gap-3">
              <Input label="Dormir desde (HH:MM)" value={sleepStart} onChangeText={setSleepStart} placeholder="00:00" />
              <Input label="Hasta (HH:MM)" value={sleepEnd} onChangeText={setSleepEnd} placeholder="07:00" />
              <Text className="text-[12px] text-gray-600">Si el sueño es &lt; 6h, el Agente mostrará un aviso.</Text>
            </View>
          </Card>

          <Card>
            <Text className="text-[13px] font-semibold text-gray-700">Tareas fijas inamovibles</Text>
            <Text className="mt-1 text-[12px] text-gray-600">
              Ej. clases 09:00–14:00. El Agente rellenará el resto.
            </Text>

            <View className="mt-3 gap-2">
              {profile.fixedBlocks.map((b) => (
                <View key={b.id} className="flex-row items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
                  <Text className="text-[13px] font-semibold text-black" numberOfLines={1}>
                    {b.title}{" "}
                    <Text className="text-[12px] font-normal text-gray-600">
                      ({b.start}–{b.end})
                    </Text>
                  </Text>
                  <Text className="text-[12px] font-semibold text-gray-500" onPress={() => removeFixed(b.id)}>
                    Quitar
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-3">
              <Button label="Añadir bloque fijo (demo)" variant="secondary" onPress={() => addFixed("Bloque fijo", "16:00" as any, "17:00" as any)} />
            </View>
          </Card>

          <View className="gap-2">
            <Button label="Guardar y ver horario" onPress={save} />
            <Link href="/schedule" asChild>
              <View className="rounded-2xl bg-transparent px-4 py-3">
                <Text className="text-center text-[13px] font-semibold text-gray-700">
                  Ir al horario sin guardar
                </Text>
              </View>
            </Link>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

