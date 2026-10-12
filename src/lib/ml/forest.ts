// Pure random-forest inference over the JSON trees exported from the app's
// shelf_life_regressor.joblib (origin/revision, April 16 model). Ported from
// the app's routes/prediction.ts (same note text), matching sklearn's predict():
//   1. Trees are exported post-order, so the root is the LAST node.
//   2. sklearn compares float32(x) <= threshold, hence Math.fround.
//   3. The classifier soft-votes leaf class probabilities (cls_trees_v2.json);
//      on this model it agrees with the app's majority vote on every training row.
// No imports and erasable TypeScript only: scripts/ml/check-model-parity.mjs
// runs this file directly with Node's type stripping.

export interface SensorValues {
  gas: number; // gas resistance, KΩ
  co2: number; // ppm
  temperature: number; // °C
  humidity: number; // %RH
  pressure: number; // hPa
}

// Model feature order.
export const FEATURE_ORDER = ["gas", "co2", "temperature", "humidity", "pressure"] as const;

export interface PredictionResult {
  shelf_life_hours: number;
  shelf_life_days: number;
  ripeness_label: string;
  ripeness_class: number;
  note: string;
}

export const RIPENESS_LABELS: readonly string[] = [
  "Unripe",
  "Near Ripe",
  "Ripe",
  "Very Ripe",
  "Overripe",
  "Molds",
  "Rotten",
];

export const DEFAULT_PREDICTION: PredictionResult = {
  shelf_life_hours: 0,
  shelf_life_days: 0,
  ripeness_label: "—",
  ripeness_class: -1,
  note: "Connect sensor to get prediction.",
};

export type InternalNode = [feature: number, threshold: number, left: number, right: number];
// reg_trees_compact.json: leaves are [hours].
export type RegForest = Array<Array<InternalNode | [number]>>;
// cls_trees_v2.json: leaves are [classIndex] (pure) or one probability per class.
export interface ClsForest {
  t: Array<Array<InternalNode | number[]>>;
  c: number[];
}

export function toFeatures(v: SensorValues): number[] {
  return FEATURE_ORDER.map((key) => v[key]);
}

function findLeaf(tree: Array<InternalNode | number[]>, features: number[]): number[] {
  let node = tree[tree.length - 1];
  while (node.length === 4) {
    const [feature, threshold, left, right] = node;
    node = tree[Math.fround(features[feature]) <= threshold ? left : right];
  }
  return node;
}

export function predictRawHours(reg: RegForest, features: number[]): number {
  let sum = 0;
  for (const tree of reg) sum += findLeaf(tree, features)[0];
  return sum / reg.length;
}

export function predictClass(cls: ClsForest, features: number[]): number {
  const probs = new Array<number>(cls.c.length).fill(0);
  for (const tree of cls.t) {
    const leaf = findLeaf(tree, features);
    if (leaf.length === 1) {
      probs[leaf[0]] += 1;
    } else {
      for (let i = 0; i < probs.length; i++) probs[i] += leaf[i];
    }
  }
  let best = 0;
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > probs[best]) best = i;
  }
  return cls.c[best];
}

export function runForests(reg: RegForest, cls: ClsForest, values: SensorValues): PredictionResult {
  const features = toFeatures(values);
  const ripeness_class = predictClass(cls, features);
  const ripeness_label = RIPENESS_LABELS[ripeness_class] ?? "Unknown";

  // Overripe, Molds and Rotten have no shelf life left.
  const rawHours = predictRawHours(reg, features);
  const hours = ripeness_class >= 4 ? 0 : Math.max(0, rawHours);
  const days = hours / 24;

  let note: string;
  if (days <= 0) {
    note = "Consume immediately or discard.";
  } else if (days < 1) {
    note = `Will last about ${Math.round(hours)} more hours.`;
  } else if (days < 2) {
    note = "Will be at peak ripeness within 1 day.";
  } else {
    note = `Estimated ${days.toFixed(1)} days of shelf life remaining.`;
  }

  return {
    shelf_life_hours: Math.round(hours * 10) / 10,
    shelf_life_days: Math.round(days * 100) / 100,
    ripeness_label,
    ripeness_class,
    note,
  };
}
