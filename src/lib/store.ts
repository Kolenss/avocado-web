"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SensorValues } from "@/lib/ml/predict";
import type { Reading, SensorKey } from "./types";
import { DEFAULT_VALUES, MAX_READINGS } from "./constants";

interface ReadingsState {
  readings: Reading[]; // oldest first
  connected: boolean;
  enabledSensors: Record<SensorKey, boolean>;
  addReading: (values: SensorValues) => void;
  setConnected: (connected: boolean) => void;
  toggleSensor: (key: SensorKey) => void;
}

export const useReadingsStore = create<ReadingsState>()(
  persist(
    (set) => ({
      readings: [],
      connected: true,
      enabledSensors: { gas: true, humidity: true, temperature: true, pressure: true, co2: true },
      addReading: (values) =>
        set((state) => {
          const seq = (state.readings[state.readings.length - 1]?.seq ?? 0) + 1;
          const timestamp = Date.now();
          const reading: Reading = { id: `r${seq}-${timestamp}`, seq, timestamp, values: { ...values } };
          return { readings: [...state.readings, reading].slice(-MAX_READINGS) };
        }),
      setConnected: (connected) => set({ connected }),
      toggleSensor: (key) =>
        set((state) => ({
          enabledSensors: { ...state.enabledSensors, [key]: !state.enabledSensors[key] },
        })),
    }),
    {
      name: "avocado-web-v2",
      // Runs in the browser once localStorage has been read (never on the
      // server), so a first visit starts with one default reading.
      onRehydrateStorage: () => (state) => {
        if (state && state.readings.length === 0) state.addReading(DEFAULT_VALUES);
      },
    }
  )
);

// Persisted state only exists in the browser. Read the store behind this
// guard so the server render and the hydration render match.
const subscribe = () => () => {};
export function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
