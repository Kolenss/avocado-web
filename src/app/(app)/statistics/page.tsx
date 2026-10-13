"use client";

import { useIsMounted, useReadingsStore } from "@/lib/store";
import { SENSORS, SENSOR_ORDER } from "@/lib/constants";
import { formatChange, formatTime } from "@/lib/format";
import type { Reading, SensorKey } from "@/lib/types";

const ROWS_SHOWN = 3;

const messageStyle = { margin: "24px 12px 0", fontSize: 15, lineHeight: 1.45, textAlign: "center", color: "#FFFFFF" } as const;

function SensorHistory({ sensor, readings }: { sensor: SensorKey; readings: Reading[] }) {
  const meta = SENSORS[sensor];
  const start = Math.max(readings.length - ROWS_SHOWN, 0);

  return (
    <section>
      <div className="sec-h">
        <h2>{meta.label}</h2>
        <span>Reading History · {meta.unit}</span>
      </div>
      <div className="card">
        <div className="th">
          <span>#</span>
          <span>Time</span>
          <span>Value</span>
          <span>Change</span>
          <span>%</span>
        </div>
        {readings.slice(start).map((r, i) => {
          const value = r.values[sensor];
          const prev = readings[start + i - 1]?.values[sensor];
          const cell = formatChange(value, prev, meta.decimals);
          return (
            <div key={r.id} className="tr">
              <span className="c-idx">{r.seq}</span>
              <span className="c-time">{formatTime(r.timestamp)}</span>
              <span className="c-val">{value.toFixed(meta.decimals)}</span>
              <span className={cell.cls}>{cell.change}</span>
              <span className={cell.cls}>{cell.pct}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function StatisticsPage() {
  const mounted = useIsMounted();
  const readings = useReadingsStore((s) => s.readings);
  const enabledSensors = useReadingsStore((s) => s.enabledSensors);

  if (!mounted) return null;

  const sensors = SENSOR_ORDER.filter((key) => enabledSensors[key]);

  return (
    <div className="stats" style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
      {sensors.length === 0 ? (
        <p style={messageStyle}>All sensors are turned off. Turn one on in Settings to see its reading history.</p>
      ) : readings.length === 0 ? (
        <p style={messageStyle}>No readings yet. Tap Edit values on Home to add one.</p>
      ) : (
        sensors.map((key) => <SensorHistory key={key} sensor={key} readings={readings} />)
      )}
    </div>
  );
}
