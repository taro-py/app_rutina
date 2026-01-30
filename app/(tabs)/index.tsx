import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useDayStore } from "@/store/dayStore";
import { useSettingsStore } from "@/store/settingsStore";
import Ionicons from "@expo/vector-icons/Ionicons";

const PAUTAS =
  "Para generar tu horario necesito que me digas:\n\n• Tu rol (estudiante, trabajador, etc.)\n• Qué quieres hacer hoy\n• Cuántas horas quieres dormir (si son menos de 6 te avisaré)\n• Si tienes citas o eventos y a qué hora\n\nEscribe aquí tus respuestas y pulsa el botón de enviar cuando quieras que genere tu horario.";

type Message = { id: string; role: "user" | "bot"; text: string };

const BOT_BUBBLE =
  "rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 max-w-[85%]";
const USER_BUBBLE =
  "rounded-2xl rounded-tr-sm bg-black px-4 py-3 max-w-[85%] self-end";

export default function ChatScreen() {
  const router = useRouter();
  const { profile, generate, setDailyGoal, setSleepHours } = useDayStore();
  const { username } = useSettingsStore();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "bot", text: PAUTAS },
  ]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText("");

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Respuesta simple del agente: si parece una petición de horario, generar
    const lower = text.toLowerCase();
    const wantsSchedule =
      lower.includes("genera") ||
      lower.includes("horario") ||
      lower.includes("rutina") ||
      lower.includes("ya") ||
      lower.includes("listo") ||
      messages.length >= 2;

    if (wantsSchedule) {
      setDailyGoal(text);
      setSleepHours(profile.sleepStart && profile.sleepEnd ? 7 : 7);
      generate();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "He generado tu horario. Abre el menú (arriba a la derecha) y elige «Horario» para verlo.",
        },
      ]);
      setTimeout(() => router.push("/(tabs)/schedule"), 800);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "bot",
          text: "Gracias. Cuando quieras que genere tu horario, escribe algo como «genera mi horario» o «ya» y lo creo.",
        },
      ]);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {username ? (
            <Text className="mb-2 text-[12px] text-gray-500">Hola, {username}</Text>
          ) : null}
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 flex-row ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <View className={msg.role === "bot" ? BOT_BUBBLE : USER_BUBBLE}>
                <Text
                  className={`text-[14px] ${msg.role === "user" ? "text-white" : "text-gray-800"}`}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Barra de escritura: placeholder "Escribe aquí..." + botón avión */}
        <View className="absolute bottom-14 left-0 right-0 border-t border-gray-100 bg-white px-4 py-3">
          <View className="flex-row items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
            <TextInput
              className="flex-1 py-2 text-[15px] text-black"
              placeholder="Escribe aquí..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              style={{ maxHeight: 100 }}
            />
            <Pressable
              onPress={sendMessage}
              className="rounded-full bg-black p-2.5 active:opacity-80"
              hitSlop={8}
            >
              <Ionicons name="paper-plane" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
