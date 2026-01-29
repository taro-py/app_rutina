import type { DayProfile, GenerateResult, ScheduleBlock, TaskRequest } from "@/types/schedule";
import { durationMinutes, hmToMinutes, overlaps } from "@/utils/time";

/**
 * MOTOR AGENTE (LifeSync Agent)
 *
 * Este módulo contiene la lógica “no-UI”:
 * - validación de límites del día (p.ej. 26h, rangos inválidos, solapamientos)
 * - inserción automática de bloques “Comida”/“Descanso” si el usuario no los definió
 * - sugerencias de división para estudio intenso (Pomodoro o bloques de 90min)
 * - avisos si el sueño es insuficiente (< 6h)
 *
 * La UI consume `generateSchedule()` y muestra `warnings`.
 */

function colorFor(category: ScheduleBlock["category"]): ScheduleBlock["color"] {
  switch (category) {
    case "focus":
      return "coral";
    case "light":
      return "sky";
    case "rest":
      return "mint";
    case "health":
      return "lilac";
    case "fixed":
    default:
      return "beige";
  }
}

function normalizeFixed(profile: DayProfile) {
  const dayStart = hmToMinutes(profile.dayStart);
  const dayEnd = hmToMinutes(profile.dayEnd);
  const fixed: ScheduleBlock[] = profile.fixedBlocks
    .map((b) => {
      const s = hmToMinutes(b.start);
      const e = hmToMinutes(b.end);
      return {
        id: b.id,
        title: b.title,
        category: "fixed",
        color: colorFor("fixed"),
        startMinutes: s,
        endMinutes: e,
        locked: true,
      } satisfies ScheduleBlock;
    })
    .filter((b) => Number.isFinite(b.startMinutes) && Number.isFinite(b.endMinutes));

  fixed.sort((a, b) => a.startMinutes - b.startMinutes);
  return { dayStart, dayEnd, fixed };
}

function detectOverlaps(blocks: ScheduleBlock[]) {
  const overlapsPairs: Array<[ScheduleBlock, ScheduleBlock]> = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (overlaps(blocks[i]!.startMinutes, blocks[i]!.endMinutes, blocks[j]!.startMinutes, blocks[j]!.endMinutes)) {
        overlapsPairs.push([blocks[i]!, blocks[j]!]);
      }
    }
  }
  return overlapsPairs;
}

function hasBlockTitle(blocks: ScheduleBlock[], title: string) {
  const t = title.trim().toLowerCase();
  return blocks.some((b) => b.title.trim().toLowerCase() === t);
}

function insertAutoBlocks(profile: DayProfile, fixed: ScheduleBlock[], warnings: GenerateResult["warnings"]) {
  // Insertamos 2 comidas (aprox) y 2 descansos cortos si el usuario no los puso.
  // Regla: solo inserta si hay hueco; si no, lo omite.
  const inserted: ScheduleBlock[] = [];
  const want = [
    { title: "Comida", category: "rest" as const, start: "14:00", end: "14:45" },
    { title: "Cena", category: "rest" as const, start: "21:00", end: "21:30" },
    { title: "Descanso", category: "rest" as const, start: "11:00", end: "11:15" },
    { title: "Descanso", category: "rest" as const, start: "17:30", end: "17:45" },
  ];

  const occupied = [...fixed];
  for (const w of want) {
    if (hasBlockTitle(occupied, w.title)) continue;
    const s = hmToMinutes(w.start as any);
    const e = hmToMinutes(w.end as any);
    if (!Number.isFinite(s) || !Number.isFinite(e)) continue;
    if (e <= s) continue;

    const candidate: ScheduleBlock = {
      id: `auto_${w.title.toLowerCase()}_${s}`,
      title: w.title,
      category: w.category,
      color: colorFor(w.category),
      startMinutes: s,
      endMinutes: e,
      locked: true,
      notes: "Auto-insertado por el Agente",
    };

    const clashes = occupied.some((b) => overlaps(b.startMinutes, b.endMinutes, candidate.startMinutes, candidate.endMinutes));
    if (!clashes) {
      occupied.push(candidate);
      inserted.push(candidate);
    }
  }

  if (inserted.length > 0) {
    warnings.push({
      code: "AUTOFILL_INSERTED",
      message: "El Agente insertó bloques automáticos (comida/descanso) porque no estaban definidos.",
    });
  }

  occupied.sort((a, b) => a.startMinutes - b.startMinutes);
  return occupied;
}

function buildFreeSlots(dayStart: number, dayEnd: number, occupied: ScheduleBlock[]) {
  const slots: Array<{ start: number; end: number }> = [];
  let cursor = dayStart;
  for (const b of occupied) {
    const s = b.startMinutes;
    const e = b.endMinutes;
    if (e <= dayStart || s >= dayEnd) continue;
    const clampedS = Math.max(dayStart, s);
    const clampedE = Math.min(dayEnd, e);
    if (clampedS > cursor) slots.push({ start: cursor, end: clampedS });
    cursor = Math.max(cursor, clampedE);
  }
  if (cursor < dayEnd) slots.push({ start: cursor, end: dayEnd });
  return slots.filter((s) => s.end > s.start);
}

function splitIfNeeded(task: TaskRequest): TaskRequest[] {
  // Regla: si es “alto” (estudio intenso) y >= 120min, sugerimos dividir.
  if (task.category !== "focus") return [task];
  if (!task.splittable) return [task];
  if (task.durationMinutes < 120) return [task];

  // Opción simple: bloques de 90min + descansos implícitos (la UI puede mostrar sugerencia).
  const chunks: TaskRequest[] = [];
  let remaining = task.durationMinutes;
  let idx = 1;
  while (remaining > 0) {
    const chunk = Math.min(90, remaining);
    chunks.push({
      ...task,
      id: `${task.id}_chunk_${idx}`,
      title: `${task.title} (${idx})`,
      durationMinutes: chunk,
      intensity: "high",
      splittable: false,
    });
    remaining -= chunk;
    idx++;
  }
  return chunks;
}

function fillTasksIntoSlots(tasks: TaskRequest[], slots: Array<{ start: number; end: number }>) {
  const blocks: ScheduleBlock[] = [];
  const remaining = [...tasks];

  for (const slot of slots) {
    let cursor = slot.start;
    while (remaining.length > 0) {
      const t = remaining[0]!;
      if (cursor >= slot.end) break;
      const available = slot.end - cursor;
      if (available <= 0) break;

      if (t.durationMinutes <= available) {
        blocks.push({
          id: t.id,
          title: t.title,
          category: t.category,
          color: colorFor(t.category),
          startMinutes: cursor,
          endMinutes: cursor + t.durationMinutes,
          locked: false,
          notes: t.category === "focus" ? "Sugerencia: bloques 90min o Pomodoro si te cuesta mantener foco." : undefined,
        });
        cursor += t.durationMinutes;
        remaining.shift();
      } else {
        // no cabe; pasamos al siguiente hueco (no truncamos automáticamente para evitar “micro-bloques” raros)
        break;
      }
    }
  }

  return { blocks, leftoverTasks: remaining };
}

export function generateSchedule(profile: DayProfile, tasks: TaskRequest[], seedJitter = 0): GenerateResult {
  const warnings: GenerateResult["warnings"] = [];
  const { dayStart, dayEnd, fixed: rawFixed } = normalizeFixed(profile);

  // Validaciones base del día
  if (!Number.isFinite(dayStart) || !Number.isFinite(dayEnd) || dayEnd <= dayStart) {
    return {
      blocks: [],
      warnings: [{ code: "DAY_RANGE_INVALID", message: "Rango del día inválido. Revisa hora de inicio/fin." }],
    };
  }

  const dayTotal = durationMinutes(dayStart, dayEnd);
  if (dayTotal > 24 * 60) {
    // Esto cubre el caso “26 horas” si el usuario intentara extender más de un día.
    warnings.push({
      code: "OVERBOOKED",
      message: "Intentas definir más de 24h en un día. Ajusta inicio/fin para un solo día.",
    });
  }

  // Solapamientos de tareas fijas
  const fixedOverlaps = detectOverlaps(rawFixed);
  if (fixedOverlaps.length > 0) {
    warnings.push({
      code: "FIXED_OVERLAP",
      message: "Hay tareas fijas que se solapan. El Agente no puede optimizar con solapamientos.",
    });
    return { blocks: rawFixed, warnings };
  }

  // Sueño: si el usuario lo proporcionó, validamos < 6h (simplificado: mismo día)
  if (profile.sleepStart && profile.sleepEnd) {
    const s = hmToMinutes(profile.sleepStart);
    const e = hmToMinutes(profile.sleepEnd);
    if (Number.isFinite(s) && Number.isFinite(e)) {
      const sleep = e >= s ? e - s : 1440 - s + e; // permite cruzar medianoche
      if (sleep < 6 * 60) {
        warnings.push({ code: "SLEEP_LOW", message: "Aviso: tu sueño estimado es < 6h. Considera ajustar tu rutina." });
      }
    }
  }

  // Auto-insertar comida/descanso si faltan
  const occupied = insertAutoBlocks(profile, rawFixed, warnings);

  // Construimos huecos libres
  const slots = buildFreeSlots(dayStart, dayEnd, occupied);

  // Expandimos (si aplica) estudio intenso en chunks (Pomodoro/90min)
  const expandedTasks = tasks.flatMap((t) => splitIfNeeded(t));

  // Pequeña variación para “re-optimizar”: rotamos tareas según seedJitter
  const jitter = Math.max(0, Math.min(expandedTasks.length, seedJitter));
  const jittered = jitter > 0 ? [...expandedTasks.slice(jitter), ...expandedTasks.slice(0, jitter)] : expandedTasks;

  const { blocks: planned, leftoverTasks } = fillTasksIntoSlots(jittered, slots);
  if (leftoverTasks.length > 0) {
    warnings.push({
      code: "OVERBOOKED",
      message: "No caben todas las tareas en los huecos libres. Reduce carga o amplía el día.",
    });
  }

  const all = [...occupied, ...planned].sort((a, b) => a.startMinutes - b.startMinutes);
  return { blocks: all, warnings };
}

