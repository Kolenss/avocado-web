"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useReadingsStore } from "@/lib/store";
import ReadingCard from "@/components/reading-card";

export default function HistoryPage() {
  const readings = useReadingsStore((s) => s.readings);
  const clearReadings = useReadingsStore((s) => s.clearReadings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="pt-6" />;

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">History</h1>
          <p className="text-xs text-gray-400">
            {readings.length} reading{readings.length !== 1 ? "s" : ""}
          </p>
        </div>
        {readings.length > 0 && (
          <button
            onClick={clearReadings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-full text-xs font-semibold transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>

      {readings.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-1">No history</h2>
          <p className="text-sm text-gray-500">Your readings will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {readings.map((reading) => (
            <ReadingCard key={reading.id} reading={reading} />
          ))}
        </div>
      )}
    </div>
  );
}
