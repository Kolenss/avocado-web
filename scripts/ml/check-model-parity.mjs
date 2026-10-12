// Checks the browser inference in src/lib/ml/forest.ts against sklearn's
// predict() outputs (scripts/ml/golden.json, written by export_cls_v2.py).
// Usage: node scripts/ml/check-model-parity.mjs   (Node >= 22.18, type stripping)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_PREDICTION,
  predictClass,
  predictRawHours,
  runForests,
} from "../../src/lib/ml/forest.ts";

const HOURS_TOLERANCE = 1e-6;

function readJson(relativePath) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8"));
}

const reg = readJson("../../public/model/reg_trees_compact.json");
const cls = readJson("../../public/model/cls_trees_v2.json");
const golden = readJson("./golden.json");

const failures = [];
let classMatches = 0;
let hoursMatches = 0;
let maxHoursDiff = 0;

for (const row of golden.rows) {
  const ripenessClass = predictClass(cls, row.features);
  const rawHours = predictRawHours(reg, row.features);
  const diff = Math.abs(rawHours - row.raw_hours);
  maxHoursDiff = Math.max(maxHoursDiff, diff);

  if (ripenessClass === row.ripeness_class) classMatches++;
  else failures.push(`${row.source}: class ${ripenessClass}, expected ${row.ripeness_class}`);

  if (diff <= HOURS_TOLERANCE) hoursMatches++;
  else failures.push(`${row.source}: raw hours ${rawHours}, expected ${row.raw_hours}`);
}

// Post-processing fixtures (clamp, rounding, note text), as in routes_prediction.ts.
const fixtures = [
  {
    values: { gas: 224.2, co2: 3232, temperature: 30.5, humidity: 68.3, pressure: 1003.1 },
    expected: {
      shelf_life_hours: 120.8,
      shelf_life_days: 5.03,
      ripeness_label: "Unripe",
      ripeness_class: 0,
      note: "Estimated 5.0 days until overripe (still sellable).",
    },
  },
  {
    values: { gas: 312.9, co2: 3733, temperature: 28.7, humidity: 82.1, pressure: 1005 },
    expected: {
      shelf_life_hours: 0,
      shelf_life_days: 0,
      ripeness_label: "Overripe",
      ripeness_class: 4,
      note: "Already overripe. Sell immediately or use for smoothies/cooking.",
    },
  },
];

let fixtureMatches = 0;
for (const { values, expected } of fixtures) {
  const actual = runForests(reg, cls, values);
  if (JSON.stringify(actual) === JSON.stringify(expected)) fixtureMatches++;
  else failures.push(`runForests(${JSON.stringify(values)}) = ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
}

if (DEFAULT_PREDICTION.ripeness_class !== -1 || DEFAULT_PREDICTION.ripeness_label !== "—") {
  failures.push(`DEFAULT_PREDICTION changed: ${JSON.stringify(DEFAULT_PREDICTION)}`);
}

const total = golden.rows.length;
console.log(`classes:   ${classMatches}/${total} match sklearn`);
console.log(`raw hours: ${hoursMatches}/${total} within ${HOURS_TOLERANCE} (max diff ${maxHoursDiff})`);
console.log(`fixtures:  ${fixtureMatches}/${fixtures.length} runForests outputs match`);

if (failures.length > 0) {
  console.error(`\n${failures.length} mismatch(es):`);
  for (const failure of failures.slice(0, 20)) console.error(`  ${failure}`);
  process.exit(1);
}
console.log("Model parity OK");
