import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useDayStore } from "@/store/dayStore";
import type { Role } from "@/types/schedule";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { hmToMinutes, durationMinutesOvernight } from "@/utils/time";
import { Button } from "@/components/ui/Button";

const ROLES: Role[] = ["Estudiante", "Opositor", "Trabajador", "Freelance"];

type Step = "role" | "goal" | "sleep" | "events" | "summary";

const BOT_BUBBLE = "rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 max-w-[85%]";
const USER_BUBBLE = "rounded-2xl rounded-tr-sm bg-black px-4 py-3 max-w-[85%] self-end";

export default function AsistenteScreen() {
  const router = useRouter();
  const {
    profile,
    tasks,
    setRole,
    setDailyGoal,
    setSleepHours,
    addFixed,
    removeFixed,
    generate,
  } = useDayStore();

  const [step, setStep] = useState<Step>("role");
  const [goalText, setGoalText] = useState(profile.dailyGoal ?? "");
  const defaultSleepHours =
    profile.sleepStart && profile.sleepEnd
      ? Math.round(
          durationMinutesOvernight(
            hmToMinutes(profile.sleepStart),
            hmToMinutes(profile.sleepEnd)
          ) / 60
        )
      : 7;
  const [sleepHoursInput, setSleepHoursInput] = useState(String(defaultSleepHours));
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);

  const sleepHours = useMemo(() => {
    const n = Number(sleepHoursInput);
    return Number.isFinite(n) && n >= 0 && n <= 24 ? n : 7;
  }, [sleepHoursInput]);

  const totalTaskMinutes = useMemo(
    () => tasks.reduce((sum, t) => sum + t.durationMinutes, 0),
    [tasks]
  );
  const workOverload = totalTaskMinutes > 8 * 60;
  const sleepWarning = sleepHours < 6;

  const canAdvanceRole = !!profile.role;
  const canAdvanceGoal = goalText.trim().length > 0;
  const canAdvanceSleep = sleepHoursInput.trim().length > 0;
  const addEventAndNext = () => {
    if (eventTitle.trim() && eventStart.trim() && eventEnd.trim()) {
      addFixed(eventTitle.trim(), eventStart.trim() as any, eventEnd.trim() as any);
      setEventTitle("");
      setEventStart("");
      setEventEnd("");
      setShowEventForm(false);
      setStep("summary");
    }
  };
  const skipEvents = () => {
    setStep("summary");
  };

  const handleGenerate = () => {
    setDailyGoal(goalText.trim());
    setSleepHours(sleepHours);
    generate();
    router.push("/(tabs)/schedule");
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 px-4 pt-4">
          <Text className="text-[22px] font-semibold text-black">Asistente LifeSync</Text>
          <Text className="mt-1 text-[13px] text-gray-600">
            Responde a las preguntas y genera tu horario del día.
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 240 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Mensaje bienvenida */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] text-gray-800">
                Hola. Para generar tu horario necesito que me digas tu rol, qué quieres hacer hoy, cuántas horas
                quieres dormir y si tienes citas o eventos importantes.
              </Text>
            </View>
          </View>

          {/* Paso: Rol */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] font-semibold text-gray-800">1. ¿Cuál es tu rol?</Text>
            </View>
          </View>
          <View className="mb-3">
            <ChipRow>
              {ROLES.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  selected={profile.role === r}
                  onPress={() => setRole(r)}
                />
              ))}
            </ChipRow>
          </View>
          {profile.role && (
            <View className="mb-4 flex-row justify-end">
              <View className={USER_BUBBLE}>
                <Text className="text-[14px] text-white">Rol: {profile.role}</Text>
              </View>
            </View>
          )}

          {/* Paso: Qué hacer hoy */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] font-semibold text-gray-800">2. ¿Qué quieres hacer en el día de hoy?</Text>
            </View>
          </View>
          {step !== "role" && (
            <View className="mb-4 flex-row justify-end">
              <View className={USER_BUBBLE}>
                <Text className="text-[14px] text-white">{goalText || "—"}</Text>
              </View>
            </View>
          )}
          <View className="mb-4">
            <TextInput
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-black"
              placeholder="Ej: estudiar, trabajar, deporte, descanso..."
              placeholderTextColor="#9ca3af"
              value={goalText}
              onChangeText={setGoalText}
              multiline
            />
            <Pressable
              onPress={() => setStep("sleep")}
              className="mt-2 self-end rounded-xl bg-black px-4 py-2"
            >
              <Text className="text-[13px] font-semibold text-white">Siguiente</Text>
            </Pressable>
          </View>

          {/* Paso: Horas de sueño */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] font-semibold text-gray-800">3. ¿Cuántas horas quieres dormir?</Text>
            </View>
          </View>
          <View className="mb-2 flex-row justify-end">
            <View className={USER_BUBBLE}>
              <Text className="text-[14px] text-white">{sleepHoursInput}h</Text>
            </View>
          </View>
          <View className="mb-2">
            <TextInput
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-black"
              placeholder="Ej: 7"
              placeholderTextColor="#9ca3af"
              value={sleepHoursInput}
              onChangeText={setSleepHoursInput}
              keyboardType="numeric"
            />
          </View>
          {sleepWarning && (
            <View className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <Text className="text-[13px] font-semibold text-amber-800">
                ⚠️ Advertencia: menos de 6 horas de sueño puede generar desgaste y afectar tu rendimiento.
              </Text>
            </View>
          )}
          {!sleepWarning && sleepHoursInput.trim() && (
            <Pressable
              onPress={() => setStep("events")}
              className="mb-4 self-end rounded-xl bg-black px-4 py-2"
            >
              <Text className="text-[13px] font-semibold text-white">Siguiente</Text>
            </Pressable>
          )}

          {/* Paso: Citas / eventos */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] font-semibold text-gray-800">
                4. ¿Tienes alguna cita o evento importante hoy? ¿Cuándo?
              </Text>
            </View>
          </View>
          {profile.fixedBlocks.length > 0 && (
            <View className="mb-2 flex-row justify-end">
              <View className={USER_BUBBLE}>
                <Text className="text-[14px] text-white">
                  {profile.fixedBlocks.map((b) => `${b.title} ${b.start}-${b.end}`).join(", ")}
                </Text>
              </View>
            </View>
          )}
          {showEventForm ? (
            <View className="mb-4 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <TextInput
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[14px] text-black"
                placeholder="Nombre del evento (ej: Cita médico)"
                placeholderTextColor="#9ca3af"
                value={eventTitle}
                onChangeText={setEventTitle}
              />
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[14px] text-black"
                  placeholder="Inicio (10:00)"
                  placeholderTextColor="#9ca3af"
                  value={eventStart}
                  onChangeText={setEventStart}
                />
                <TextInput
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[14px] text-black"
                  placeholder="Fin (11:00)"
                  placeholderTextColor="#9ca3af"
                  value={eventEnd}
                  onChangeText={setEventEnd}
                />
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={addEventAndNext}
                  className="flex-1 rounded-xl bg-black py-2"
                >
                  <Text className="text-center text-[13px] font-semibold text-white">Añadir</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowEventForm(false)}
                  className="flex-1 rounded-xl bg-gray-200 py-2"
                >
                  <Text className="text-center text-[13px] font-semibold text-gray-700">Cancelar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View className="mb-4 flex-row gap-2">
              <Pressable
                onPress={() => setShowEventForm(true)}
                className="rounded-xl bg-gray-100 px-4 py-2"
              >
                <Text className="text-[13px] font-semibold text-black">Sí, añadir evento</Text>
              </Pressable>
              <Pressable onPress={skipEvents} className="rounded-xl bg-black px-4 py-2">
                <Text className="text-[13px] font-semibold text-white">No, continuar</Text>
              </Pressable>
            </View>
          )}

          {/* Resumen y advertencia exceso de trabajo */}
          {workOverload && (
            <View className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-3">
              <Text className="text-[13px] font-semibold text-orange-800">
                ⚠️ Advertencia: las tareas que has definido suman más de 8 horas en un mismo día. Considera reducir
                la carga para evitar exceso de trabajo.
              </Text>
            </View>
          )}

          {/* Resumen y botón Generar */}
          <View className="mb-3 flex-row justify-start">
            <View className={BOT_BUBBLE}>
              <Text className="text-[14px] text-gray-800">
                Con estos datos puedo generar tu horario. Pulsa el botón para verlo en la pestaña "Mi horario".
              </Text>
            </View>
          </View>
          <View className="mt-2">
            <Button label="Generar mi horario" onPress={handleGenerate} />
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/schedule")}
            className="mt-3 self-center"
          >
            <Text className="text-[13px] font-semibold text-gray-500">
              Ver horario generado →
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
