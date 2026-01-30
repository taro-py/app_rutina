import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { Screen } from "@/components/Screen";
import { Timeline } from "@/components/schedule/Timeline";
import { WarnBanner } from "@/components/schedule/WarnBanner";
import { EditBlockModal } from "@/components/schedule/EditBlockModal";
import { useDayStore } from "@/store/dayStore";
import type { ScheduleBlock } from "@/types/schedule";

export default function ScheduleTabScreen() {
  const { profile, lastResult, error, generate, reoptimize, updateBlockTime } = useDayStore();
  const [editing, setEditing] = useState<ScheduleBlock | undefined>(undefined);

  const blocks = useMemo(() => lastResult?.blocks ?? [], [lastResult]);
  const warnings = useMemo(() => lastResult?.warnings ?? [], [lastResult]);

  return (
    <Screen>
      <View className="px-4 pt-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-[22px] font-semibold text-black">Mi horario</Text>
            <Text className="mt-1 text-[13px] text-gray-600" numberOfLines={2}>
              {profile.dayStart}–{profile.dayEnd} · Rol: {profile.role}
            </Text>
          </View>
          <Link href="/day-setup" asChild>
            <Pressable className="rounded-full bg-gray-100 px-3 py-2">
              <Text className="text-[12px] font-semibold text-black">Editar</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {!!error && (
        <View className="mx-4 mt-3 rounded-2xl border border-red-100 bg-red-50 p-3">
          <Text className="text-[12px] font-semibold text-red-700">{error}</Text>
        </View>
      )}

      <WarnBanner warnings={warnings} />

      <Timeline blocks={blocks} onPressBlock={(b) => (!b.locked ? setEditing(b) : undefined)} />

      <View className="absolute bottom-6 left-0 right-0 items-center px-4">
        <View className="w-full max-w-[520px] flex-row gap-2 rounded-3xl border border-gray-100 bg-white p-2 shadow-sm">
          <Pressable
            accessibilityRole="button"
            onPress={generate}
            className="flex-1 rounded-2xl bg-black px-4 py-3"
          >
            <Text className="text-center text-[14px] font-semibold text-white">Generar Rutina</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={reoptimize}
            className="flex-1 rounded-2xl bg-gray-100 px-4 py-3"
          >
            <Text className="text-center text-[14px] font-semibold text-black">Re-optimizar</Text>
          </Pressable>
        </View>
      </View>

      <EditBlockModal
        open={!!editing}
        block={editing}
        onClose={() => setEditing(undefined)}
        onSave={(s, e) => {
          if (!editing) return;
          updateBlockTime(editing.id, s, e);
        }}
      />
    </Screen>
  );
}
