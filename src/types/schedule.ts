export type Role = "Estudiante" | "Opositor" | "Trabajador" | "Freelance";

export type BlockCategory = "focus" | "light" | "rest" | "health" | "fixed";

export type PastelColorKey = "coral" | "sky" | "mint" | "lilac" | "beige";

export type TimeHM = `${number}:${number}`; // "07:30"

export interface FixedBlockInput {
  id: string;
  title: string;
  start: TimeHM;
  end: TimeHM;
}

export interface DayProfile {
  role: Role;
  dayStart: TimeHM;
  dayEnd: TimeHM;
  desiredProductiveHours: number; // horas totales de productividad deseadas
  fixedBlocks: FixedBlockInput[];
  sleepStart?: TimeHM;
  sleepEnd?: TimeHM;
  /** Qué quieres hacer hoy (texto libre del asistente) */
  dailyGoal?: string;
}

export interface TaskRequest {
  id: string;
  title: string;
  category: Exclude<BlockCategory, "fixed">;
  durationMinutes: number;
  intensity?: "low" | "medium" | "high";
  // Si true, el agente puede fragmentar esta tarea (pomodoro/90min)
  splittable?: boolean;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  category: BlockCategory;
  color: PastelColorKey;
  startMinutes: number; // minutos desde 00:00
  endMinutes: number;
  locked?: boolean; // true para bloques inamovibles (fijos/auto-insertados opcionalmente)
  notes?: string;
}

export interface AgentWarning {
  code:
    | "SLEEP_LOW"
    | "DAY_RANGE_INVALID"
    | "OVERBOOKED"
    | "WORK_OVERLOAD"
    | "TASK_TRUNCATED"
    | "FIXED_OVERLAP"
    | "AUTOFILL_INSERTED";
  message: string;
}

export interface GenerateResult {
  blocks: ScheduleBlock[];
  warnings: AgentWarning[];
}

