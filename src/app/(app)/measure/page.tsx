"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { calculateRipeness, generateDemoValues } from "@/lib/ripeness";
import { useReadingsStore } from "@/lib/store";
import { SENSOR_CONFIG } from "@/lib/constants";
import RipenessGauge from "@/components/ripeness-gauge";
import type { SensorInput, RipenessResult } from "@/lib/types";

export default function MeasurePage() {
  const addReading = useReadingsStore((s) => s.addReading);
  const [values, setValues] = useState<SensorInput>({
    co2: 0,
    voc: 0,
    humidity: 0,
    temperature: 0,
  });
  const [result, setResult] = useState<RipenessResult | null>(null);

  const handleChange = (key: keyof SensorInput, raw: string) => {
    const num = parseFloat(raw);
    setValues((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
    setResult(null);
  };

  const handleDemo = () => {
    const demo = generateDemoValues();
    setValues(demo);
    setResult(null);
  };

  const handleCalculate = () => {
    const r = calculateRipeness(values);
    setResult(r);
    addReading({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      sensors: { ...values },
      result: r,
    });
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Measure</h1>
          <p className="text-xs text-gray-400">Enter sensor values</p>
        </div>
        <button
          onClick={handleDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold hover:bg-amber-100 transition-colors"
        >
          <Sparkles size={12} />
          Demo Values
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {(Object.keys(SENSOR_CONFIG) as (keyof typeof SENSOR_CONFIG)[]).map((key) => {
          const config = SENSOR_CONFIG[key];
          return (
            <div key={key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{config.label}</span>
                <span className="text-xs text-gray-400">{config.unit}</span>
              </label>
              <input
                type="number"
                value={values[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`${config.min} - ${config.max}`}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023c69]/30 focus:border-[#023c69] transition-all"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full py-3.5 bg-[#023c69] text-white rounded-2xl text-sm font-bold hover:bg-[#034d85] active:scale-[0.98] transition-all"
      >
        Calculate Ripeness
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <RipenessGauge result={result} size={180} />
            <p className="text-sm text-gray-600 text-center mt-3 leading-relaxed">
              {result.recommendation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
