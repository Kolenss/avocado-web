export type RipenessLevel = "Unripe" | "Nearly Ripe" | "Ripe" | "Overripe";

export interface SensorInput {
  co2: number;
  voc: number;
  humidity: number;
  temperature: number;
}

export interface RipenessResult {
  score: number;
  level: RipenessLevel;
  color: string;
  recommendation: string;
}

export interface Reading {
  id: string;
  timestamp: number;
  sensors: SensorInput;
  result: RipenessResult;
}
