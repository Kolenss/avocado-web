export const COLORS = {
  primary: "#023c69",
  primaryLight: "#0a5a9e",
  unripe: "#4CAF50",
  nearlyRipe: "#8BC34A",
  ripe: "#FF9800",
  overripe: "#F44336",
  background: "#f8f9fa",
  surface: "#ffffff",
  textPrimary: "#1a1a2e",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
} as const;

export const SENSOR_CONFIG = {
  co2: { label: "CO₂", unit: "ppm", icon: "cloud", min: 200, max: 2000 },
  voc: { label: "VOC", unit: "ppb", icon: "wind", min: 0, max: 800 },
  humidity: { label: "Humidity", unit: "%", icon: "droplets", min: 20, max: 100 },
  temperature: { label: "Temperature", unit: "°C", icon: "thermometer", min: 10, max: 45 },
} as const;

export const DEMO_PRESETS = {
  unripe: { co2: 380, voc: 30, humidity: 52, temperature: 18 },
  nearlyRipe: { co2: 700, voc: 120, humidity: 68, temperature: 23 },
  ripe: { co2: 1050, voc: 250, humidity: 78, temperature: 26 },
  overripe: { co2: 1600, voc: 550, humidity: 93, temperature: 32 },
} as const;
