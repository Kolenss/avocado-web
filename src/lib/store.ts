"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reading } from "./types";

interface ReadingsState {
  readings: Reading[];
  addReading: (reading: Reading) => void;
  clearReadings: () => void;
}

export const useReadingsStore = create<ReadingsState>()(
  persist(
    (set) => ({
      readings: [],
      addReading: (reading) =>
        set((state) => ({ readings: [reading, ...state.readings] })),
      clearReadings: () => set({ readings: [] }),
    }),
    { name: "avocado-readings" }
  )
);
