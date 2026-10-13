"use client";

import type { ReactNode } from "react";
import { useIsMounted, useReadingsStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import { INFO, SENSORS, SENSOR_ORDER } from "@/lib/constants";
import type { InfoTopic } from "@/lib/types";

const headingStyle = { margin: "0 0 8px", padding: "0 4px", fontSize: 16.5, lineHeight: "19.3px", fontWeight: 400, color: "var(--avo-ink)" } as const;
const rowStyle = { width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", border: 0, borderRadius: 12, background: "var(--avo-panel)", fontSize: 15.4, color: "#000000", textAlign: "left", cursor: "pointer" } as const;

const INFO_ICONS: Record<InfoTopic, ReactNode> = {
  terms: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <rect x="7.2" y="11" width="9.6" height="8.6" rx="1.2" />
      <path d="M9.2 11V8.4a2.8 2.8 0 0 1 5.6 0V11" />
      <path d="M12 14.2v2.2" />
    </svg>
  ),
  privacy: (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#000000" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm1 16h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  about: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.6" />
      <path d="M10.6 10.9h1.6v5.8" />
      <path d="M10.1 16.7h4.2" />
      <circle cx="12" cy="7.8" r="0.6" fill="#000000" />
    </svg>
  ),
};

const INFO_ORDER: InfoTopic[] = ["terms", "privacy", "about"];

export default function SettingsPage() {
  const mounted = useIsMounted();
  const storedEnabled = useReadingsStore((s) => s.enabledSensors);
  const toggleSensor = useReadingsStore((s) => s.toggleSensor);
  const openOverlay = useUiStore((s) => s.openOverlay);

  return (
    <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 24 }}>
      <section>
        <h2 style={headingStyle}>Statistics</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SENSOR_ORDER.map((key) => {
            const on = mounted ? storedEnabled[key] : true;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSensor(key)}
                style={{ ...rowStyle, height: 48, padding: "0 14px", gap: 12 }}
              >
                <span style={{ width: 24, height: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{ width: 20, height: 20, boxSizing: "border-box", border: `2px solid ${on ? "#6750A4" : "#49454F"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {on && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#6750A4" }} />}
                  </span>
                </span>
                <span>{SENSORS[key].label}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section>
        <h2 style={headingStyle}>Privacy</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INFO_ORDER.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => openOverlay({ kind: "info", topic })}
              style={{ ...rowStyle, height: 52, padding: "0 16px", gap: 14 }}
            >
              {INFO_ICONS[topic]}
              <span>{INFO[topic].row}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
