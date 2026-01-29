import type { TimeHM } from "@/types/schedule";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function hmToMinutes(hm: TimeHM): number {
  const [hStr, mStr] = hm.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
  return h * 60 + m;
}

export function minutesToHM(total: number): TimeHM {
  const mins = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}` as TimeHM;
}

export function durationMinutes(start: number, end: number): number {
  return Math.max(0, end - start);
}

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

