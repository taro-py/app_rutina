import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DayProfile, GenerateResult, TaskRequest } from "@/types/schedule";
import { generateSchedule } from "@/agent/scheduler";
import { hmToMinutes, minutesToHM } from "@/utils/time";

type DayState = {
  profile: DayProfile;
  tasks: TaskRequest[];
  lastResult?: GenerateResult;
  lastSeed: number;
  error?: string;

  setRole: (role: DayProfile["role"]) => void;
  setDayRange: (start: DayProfile["dayStart"], end: DayProfile["dayEnd"]) => void;
  setDesiredHours: (hours: number) => void;
  setSleep: (start?: DayProfile["sleepStart"], end?: DayProfile["sleepEnd"]) => void;
  setSleepHours: (hours: number) => void;
  setDailyGoal: (goal: string) => void;
  addFixed: (title: string, start: DayProfile["dayStart"], end: DayProfile["dayEnd"]) => void;
  removeFixed: (id: string) => void;

  generate: () => void;
  reoptimize: () => void;
  updateBlockTime: (blockId: string, startMinutes: number, endMinutes: number) => void;
};

const STORAGE_KEY = "lifesync_agent_day_v1";

const defaultProfile: DayProfile = {
  role: "Estudiante",
  dayStart: "07:00",
  dayEnd: "23:00",
  desiredProductiveHours: 6,
  fixedBlocks: [
    { id: "fixed_class", title: "Clases", start: "09:00", end: "14:00" }
  ],
  sleepStart: "00:00",
  sleepEnd: "07:00"
};

const defaultTasks: TaskRequest[] = [
  { id: "t_focus_1", title: "Estudio intenso", category: "focus", durationMinutes: 240, intensity: "high", splittable: true },
  { id: "t_light_1", title: "Admin / correo", category: "light", durationMinutes: 45, intensity: "low" },
  { id: "t_health_1", title: "Deporte", category: "health", durationMinutes: 45, intensity: "medium" }
];

export const useDayStore = create<DayState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      tasks: defaultTasks,
      lastSeed: 0,
      error: undefined,

      setRole: (role) => set((s) => ({ profile: { ...s.profile, role } })),
      setDayRange: (start, end) => set((s) => ({ profile: { ...s.profile, dayStart: start, dayEnd: end } })),
      setDesiredHours: (hours) =>
        set((s) => ({ profile: { ...s.profile, desiredProductiveHours: Math.max(0, Math.min(24, hours)) } })),
      setSleep: (start, end) => set((s) => ({ profile: { ...s.profile, sleepStart: start, sleepEnd: end } })),
      setSleepHours: (hours) =>
        set((s) => {
          const dayStartM = hmToMinutes(s.profile.dayStart);
          const sleepEndM = dayStartM;
          const sleepStartM = (dayStartM - hours * 60 + 24 * 60) % (24 * 60);
          return {
            profile: {
              ...s.profile,
              sleepStart: minutesToHM(sleepStartM),
              sleepEnd: minutesToHM(sleepEndM),
            },
          };
        }),
      setDailyGoal: (goal) => set((s) => ({ profile: { ...s.profile, dailyGoal: goal } })),

      addFixed: (title, start, end) =>
        set((s) => ({
          profile: {
            ...s.profile,
            fixedBlocks: [
              ...s.profile.fixedBlocks,
              { id: `fixed_${Date.now()}`, title: title.trim() || "Tarea fija", start, end }
            ]
          }
        })),
      removeFixed: (id) =>
        set((s) => ({ profile: { ...s.profile, fixedBlocks: s.profile.fixedBlocks.filter((b) => b.id !== id) } })),

      generate: () => {
        try {
          const { profile, tasks } = get();
          const result = generateSchedule(profile, tasks, 0);
          set({ lastResult: result, lastSeed: 0, error: undefined });
        } catch (e: any) {
          set({ error: e?.message ?? "Error generando la rutina" });
        }
      },

      reoptimize: () => {
        try {
          const { profile, tasks, lastSeed } = get();
          const seed = (lastSeed + 1) % Math.max(1, tasks.length);
          const result = generateSchedule(profile, tasks, seed);
          set({ lastResult: result, lastSeed: seed, error: undefined });
        } catch (e: any) {
          set({ error: e?.message ?? "Error re-optimizando la rutina" });
        }
      },

      updateBlockTime: (blockId, startMinutes, endMinutes) => {
        // Edición manual: se aplica sobre el resultado actual (sin re-generar).
        // Producción: aquí podrías almacenar overrides del usuario y re-inyectarlos en el agente.
        const res = get().lastResult;
        if (!res) return;
        const nextBlocks = res.blocks.map((b) => (b.id === blockId ? { ...b, startMinutes, endMinutes } : b));
        set({ lastResult: { ...res, blocks: nextBlocks } });
      }
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1
    }
  )
);

