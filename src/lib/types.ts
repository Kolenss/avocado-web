import type { SensorValues } from "@/lib/ml/predict";

export type SensorKey = "gas" | "humidity" | "temperature" | "pressure" | "co2";

export type InfoTopic = "terms" | "privacy" | "about";

export interface Reading {
  id: string;
  seq: number; // starts at 1, only ever increases
  timestamp: number;
  values: SensorValues;
}

export interface SensorMeta {
  label: string; // Statistics / Settings
  name: string; // Home bar and sensor pop-up
  readingName: string; // "Current Reading" line in the pop-up
  inputLabel: string; // Sensor Input sheet
  unit: string;
  model: string;
  logo: string;
  barMax: number;
  min: number;
  max: number;
  placeholder: string;
  decimals: number; // Statistics value / change
}
