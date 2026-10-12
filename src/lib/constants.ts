import type { SensorValues } from "@/lib/ml/predict";
import type { InfoTopic, SensorKey, SensorMeta } from "./types";
import greetingsJson from "@/content/greetings.json";
import triviaJson from "@/content/trivia.json";
import informationalJson from "@/content/informational.json";

export const SENSORS: Record<SensorKey, SensorMeta> = {
  gas: {
    label: "Gas",
    name: "Gas",
    readingName: "Gas Resistance",
    inputLabel: "Gas resistance",
    unit: "KΩ",
    model: "BME680",
    logo: "/images/Gas_Logo.png",
    barMax: 500,
    min: 0,
    max: 2000,
    placeholder: "110–490",
    decimals: 2,
  },
  humidity: {
    label: "Humidity",
    name: "Humidity",
    readingName: "Humidity",
    inputLabel: "Humidity",
    unit: "%",
    model: "SHT31",
    logo: "/images/Humidity_Logo.png",
    barMax: 100,
    min: 0,
    max: 100,
    placeholder: "65–88",
    decimals: 2,
  },
  temperature: {
    label: "Temperature",
    name: "Temperature",
    readingName: "Temperature",
    inputLabel: "Temperature",
    unit: "°C",
    model: "SHT31",
    logo: "/images/Temp_Logo.png",
    barMax: 100,
    min: -40,
    max: 85,
    placeholder: "27–33",
    decimals: 2,
  },
  pressure: {
    label: "Pressure",
    name: "Pressure",
    readingName: "Pressure",
    inputLabel: "Pressure",
    unit: "hPa",
    model: "BME680",
    logo: "/images/Gas_Logo.png",
    barMax: 1100,
    min: 300,
    max: 1100,
    placeholder: "1003–1010",
    decimals: 2,
  },
  co2: {
    label: "CarbonDioxide",
    name: "Carbon Dioxide",
    readingName: "Carbon Dioxide",
    inputLabel: "CO₂",
    unit: "ppm",
    model: "NDIR CO₂",
    logo: "/images/Carbon_Logo.png",
    barMax: 5000,
    min: 0,
    max: 10000,
    placeholder: "2400–5100",
    decimals: 0,
  },
};

// Statistics and Settings order.
export const SENSOR_ORDER: SensorKey[] = ["gas", "humidity", "temperature", "pressure", "co2"];
// Home "Standard Readings" order.
export const HOME_ORDER: SensorKey[] = ["temperature", "humidity", "pressure", "gas", "co2"];
// Sensor Input sheet order (the model's feature order).
export const INPUT_ORDER: SensorKey[] = ["gas", "co2", "temperature", "humidity", "pressure"];

export const DEFAULT_VALUES: SensorValues = {
  gas: 224.2,
  co2: 3232,
  temperature: 30.5,
  humidity: 68.3,
  pressure: 1003.1,
};

export const ZERO_VALUES: SensorValues = { gas: 0, co2: 0, temperature: 0, humidity: 0, pressure: 0 };

export const MAX_READINGS = 50;

function preset([gas, co2, temperature, humidity, pressure]: number[]): SensorValues {
  return { gas, co2, temperature, humidity, pressure };
}

// "Use sample values" cycles through these. Expected model output in comments.
export const SAMPLE_PRESETS: SensorValues[] = [
  preset([314.6, 5000, 28.6, 75.3, 1008.5]), // Unripe
  preset([315.3, 2520, 28.1, 76.5, 1007.2]), // Near Ripe
  preset([332.4, 3900, 29.4, 79.7, 1005.2]), // Ripe
  preset([335.9, 3720, 30, 80.8, 1004.6]), // Very Ripe
  preset([312.9, 3733, 28.7, 82.1, 1005]), // Overripe
  preset([334.1, 3614, 27.3, 84.7, 1007.2]), // Rotten
];

export const MODEL_ERROR_NOTE = "Couldn't load the prediction model. Check your connection and try again.";

export const GREETINGS: string[] = greetingsJson.map((g) => g.greeting);

export const TRIVIA: string[] = triviaJson.map((t) => t.trivia);

const INFO_TEXT = Object.assign({}, ...informationalJson) as Record<InfoTopic, string>;

export const INFO: Record<InfoTopic, { row: string; title: string; content: string }> = {
  terms: { row: "Terms and Conditions", title: "Terms & Conditions", content: INFO_TEXT.terms },
  privacy: { row: "Privacy and Policy", title: "Privacy & Policy", content: INFO_TEXT.privacy },
  about: { row: "About App", title: "About App", content: INFO_TEXT.about },
};
