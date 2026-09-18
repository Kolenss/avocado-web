import type { SensorInput, RipenessResult, RipenessLevel } from "./types";
import { COLORS } from "./constants";

function interpolate(value: number, ranges: [number, number, number, number]): number {
  const [low, midLow, midHigh, high] = ranges;
  if (value <= low) return 0;
  if (value <= midLow) return ((value - low) / (midLow - low)) * 33;
  if (value <= midHigh) return 33 + ((value - midLow) / (midHigh - midLow)) * 34;
  if (value <= high) return 67 + ((value - midHigh) / (high - midHigh)) * 33;
  return 100;
}

export function calculateRipeness(input: SensorInput): RipenessResult {
  const co2Score = interpolate(input.co2, [300, 600, 1200, 1800]);
  const vocScore = interpolate(input.voc, [10, 80, 300, 600]);
  const humidityScore = interpolate(input.humidity, [40, 60, 85, 95]);
  const tempScore = interpolate(input.temperature, [15, 20, 28, 35]);

  const score = Math.round(
    co2Score * 0.35 + vocScore * 0.3 + humidityScore * 0.2 + tempScore * 0.15
  );

  const clampedScore = Math.max(0, Math.min(100, score));

  let level: RipenessLevel;
  let color: string;
  let recommendation: string;

  if (clampedScore <= 25) {
    level = "Unripe";
    color = COLORS.unripe;
    recommendation = "This avocado needs more time to ripen. Store at room temperature for 2-4 days.";
  } else if (clampedScore <= 50) {
    level = "Nearly Ripe";
    color = COLORS.nearlyRipe;
    recommendation = "Almost ready! Will be ripe in 1-2 days. Keep at room temperature.";
  } else if (clampedScore <= 75) {
    level = "Ripe";
    color = COLORS.ripe;
    recommendation = "Perfect for eating! Use within 1-2 days or refrigerate to slow ripening.";
  } else {
    level = "Overripe";
    color = COLORS.overripe;
    recommendation = "Past peak freshness. Best used for guacamole or smoothies today.";
  }

  return { score: clampedScore, level, color, recommendation };
}

export function generateDemoValues(): SensorInput {
  return {
    co2: Math.round(300 + Math.random() * 1500),
    voc: Math.round(10 + Math.random() * 590),
    humidity: Math.round(40 + Math.random() * 55),
    temperature: Math.round((15 + Math.random() * 20) * 10) / 10,
  };
}
