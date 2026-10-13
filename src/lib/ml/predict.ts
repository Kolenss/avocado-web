// Browser entry point for the shelf-life model. The forests are fetched from
// public/model/ on first use (never bundled) and shared by every caller.

import { runForests, toFeatures } from "./forest";
import type { ClsForest, PredictionResult, RegForest, SensorValues } from "./forest";

export type { SensorValues, PredictionResult } from "./forest";
export { DEFAULT_PREDICTION, RIPENESS_LABELS, FEATURE_ORDER } from "./forest";

export const MODEL_URLS = {
  reg: "/model/reg_trees_compact.json",
  cls: "/model/cls_trees_v2.json",
} as const;

let forests: Promise<{ reg: RegForest; cls: ClsForest }> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function loadForests(): Promise<{ reg: RegForest; cls: ClsForest }> {
  if (!forests) {
    forests = Promise.all([
      fetchJson<RegForest>(MODEL_URLS.reg),
      fetchJson<ClsForest>(MODEL_URLS.cls),
    ]).then(
      ([reg, cls]) => ({ reg, cls }),
      () => {
        // Let the next call retry instead of caching the failure.
        forests = null;
        throw new Error("Failed to load prediction model");
      }
    );
  }
  return forests;
}

export function prefetchModels(): void {
  loadForests().catch(() => {});
}

export async function predict(values: SensorValues): Promise<PredictionResult> {
  if (!toFeatures(values).every(Number.isFinite)) {
    throw new RangeError("Sensor values must be finite numbers");
  }
  const { reg, cls } = await loadForests();
  return runForests(reg, cls, values);
}
