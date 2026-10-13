"use client";

import { create } from "zustand";
import { DEFAULT_PREDICTION, predict } from "@/lib/ml/predict";
import type { PredictionResult, SensorValues } from "@/lib/ml/predict";
import type { InfoTopic, SensorKey } from "./types";
import { GREETINGS, MODEL_ERROR_NOTE, SAMPLE_PRESETS, TRIVIA, ZERO_VALUES } from "./constants";

export type Overlay =
  | { kind: "sensor"; sensor: SensorKey }
  | { kind: "info"; topic: InfoTopic }
  | { kind: "input" }
  | { kind: "report"; prediction: PredictionResult; values: SensorValues };

interface UiState {
  overlay: Overlay | null;
  analyzing: boolean;
  sampleIndex: number;
  // Picked once per page load; only rendered after mount.
  greetingIndex: number;
  triviaIndex: number;
  openOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
  // Tab change: close every overlay and drop a pending Read Now.
  closeAll: () => void;
  // null = disconnected (or nothing to read): report shows DEFAULT_PREDICTION.
  readNow: (values: SensorValues | null) => Promise<void>;
  nextSample: () => SensorValues;
}

let readRun = 0;

export const useUiStore = create<UiState>()((set, get) => ({
  overlay: null,
  analyzing: false,
  sampleIndex: 0,
  greetingIndex: Math.floor(Math.random() * GREETINGS.length),
  triviaIndex: Math.floor(Math.random() * TRIVIA.length),
  openOverlay: (overlay) => set({ overlay }),
  closeOverlay: () => set({ overlay: null }),
  closeAll: () => {
    readRun++;
    set({ overlay: null, analyzing: false });
  },
  readNow: async (values) => {
    if (get().analyzing) return;
    if (!values) {
      set({ overlay: { kind: "report", prediction: DEFAULT_PREDICTION, values: ZERO_VALUES } });
      return;
    }
    const run = ++readRun;
    set({ analyzing: true });
    let prediction: PredictionResult;
    try {
      prediction = await predict(values);
    } catch {
      prediction = { ...DEFAULT_PREDICTION, note: MODEL_ERROR_NOTE };
    }
    if (run !== readRun) return;
    set({ analyzing: false, overlay: { kind: "report", prediction, values } });
  },
  nextSample: () => {
    const index = get().sampleIndex;
    set({ sampleIndex: (index + 1) % SAMPLE_PRESETS.length });
    return SAMPLE_PRESETS[index];
  },
}));
