import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import type { ScheduleBlock } from "@/types/schedule";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { hmToMinutes, minutesToHM } from "@/utils/time";

export function EditBlockModal(props: {
  open: boolean;
  block?: ScheduleBlock;
  onClose: () => void;
  onSave: (startMinutes: number, endMinutes: number) => void;
}) {
  const initial = useMemo(() => {
    if (!props.block) return { start: "09:00", end: "10:00" };
    return { start: minutesToHM(props.block.startMinutes), end: minutesToHM(props.block.endMinutes) };
  }, [props.block]);

  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [err, setErr] = useState<string | undefined>(undefined);

  // Reset cuando cambie el bloque o se abra el modal
  useEffect(() => {
    if (!props.open) return;
    setStart(initial.start);
    setEnd(initial.end);
    setErr(undefined);
  }, [props.open, initial.start, initial.end]);

  const save = () => {
    const s = hmToMinutes(start as any);
    const e = hmToMinutes(end as any);
    if (!Number.isFinite(s) || !Number.isFinite(e)) {
      setErr("Formato inválido. Usa HH:MM (ej. 09:30).");
      return;
    }
    if (e <= s) {
      setErr("La hora de fin debe ser mayor que la de inicio.");
      return;
    }
    if (e - s > 24 * 60) {
      setErr("No puedes asignar más de 24h a un bloque.");
      return;
    }
    setErr(undefined);
    props.onSave(s, e);
    props.onClose();
  };

  return (
    <Modal visible={props.open} transparent animationType="fade" onRequestClose={props.onClose}>
      <Pressable className="flex-1 bg-black/30 px-4" onPress={props.onClose}>
        <Pressable className="mt-24 rounded-3xl bg-white p-5" onPress={() => {}}>
          <Text className="text-[16px] font-semibold text-black">Editar bloque</Text>
          <Text className="mt-1 text-[12px] text-gray-600" numberOfLines={2}>
            {props.block?.title ?? ""}
          </Text>

          <View className="mt-4 gap-3">
            <Input label="Inicio (HH:MM)" value={start} onChangeText={setStart} placeholder="09:00" />
            <Input label="Fin (HH:MM)" value={end} onChangeText={setEnd} placeholder="10:30" />
            {!!err && <Text className="text-[12px] font-semibold text-red-600">{err}</Text>}
          </View>

          <View className="mt-4 flex-row gap-2">
            <View className="flex-1">
              <Button label="Cancelar" variant="secondary" onPress={props.onClose} />
            </View>
            <View className="flex-1">
              <Button label="Guardar" onPress={save} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

