"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { useReadingsStore } from "@/lib/store";
import RipenessGauge from "@/components/ripeness-gauge";
import SensorCard from "@/components/sensor-card";
import { SENSOR_CONFIG } from "@/lib/constants";

export default function Dashboard() {
  const readings = useReadingsStore((s) => s.readings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="pt-6" />;

  const latest = readings[0];

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🥑</span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">No readings yet</h2>
        <p className="text-sm text-gray-500 mb-6 px-8">
          Take your first measurement to check avocado freshness
        </p>
        <Link
          href="/measure"
          className="flex items-center gap-2 px-6 py-3 bg-[#023c69] text-white rounded-full text-sm font-semibold hover:bg-[#034d85] transition-colors"
        >
          <FlaskConical size={16} />
          Take Reading
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">Latest reading</p>
        </div>
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
          <span className="text-xl">🥑</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <RipenessGauge result={latest.result} size={220} />
        <p className="text-xs text-gray-500 text-center mt-2 px-4">
          {latest.result.recommendation}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {(Object.keys(SENSOR_CONFIG) as (keyof typeof SENSOR_CONFIG)[]).map((key) => {
          const config = SENSOR_CONFIG[key];
          return (
            <SensorCard
              key={key}
              label={config.label}
              value={latest.sensors[key]}
              unit={config.unit}
              icon={config.icon}
            />
          );
        })}
      </div>

      <Link
        href="/measure"
        className="block w-full text-center py-3 bg-[#023c69] text-white rounded-2xl text-sm font-semibold hover:bg-[#034d85] transition-colors"
      >
        New Reading
      </Link>
    </div>
  );
}
