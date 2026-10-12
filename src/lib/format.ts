import type { PredictionResult } from "@/lib/ml/predict";

export function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function formatShelfLife(p: PredictionResult): string {
  return p.shelf_life_days > 0
    ? `${p.shelf_life_days.toFixed(1)} days (${p.shelf_life_hours.toFixed(0)} hrs)`
    : "0 days";
}

export interface ChangeCell {
  change: string;
  pct: string;
  cls: "c-up" | "c-down" | "c-flat";
}

// Change of a Statistics row vs. the reading right before it.
export function formatChange(value: number, prev: number | undefined, decimals: number): ChangeCell {
  if (prev === undefined) return { change: "—", pct: "—", cls: "c-flat" };
  const diff = value - prev;
  const abs = Math.abs(diff).toFixed(decimals);
  const pct = prev !== 0 ? Math.abs((diff / prev) * 100).toFixed(1) : null;
  if (abs === (0).toFixed(decimals)) {
    return { change: abs, pct: pct === null ? "—" : "0.0%", cls: "c-flat" };
  }
  const up = diff > 0;
  return {
    change: `${up ? "▲" : "▼"} ${abs}`,
    pct: pct === null ? "—" : `${up ? "+" : "-"}${pct}%`,
    cls: up ? "c-up" : "c-down",
  };
}
