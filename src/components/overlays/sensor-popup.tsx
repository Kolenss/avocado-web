import { SENSORS } from "@/lib/constants";
import type { SensorKey } from "@/lib/types";

export const blurBackdropStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 10,
  padding: 0,
  border: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  cursor: "pointer",
} as const;

interface SensorPopupProps {
  sensor: SensorKey;
  value: number;
  onClose: () => void;
}

// Tap a Home reading: which sensor measured it. Tap anywhere to close.
export default function SensorPopup({ sensor, value, onClose }: SensorPopupProps) {
  const meta = SENSORS[sensor];

  return (
    <button type="button" onClick={onClose} style={blurBackdropStyle}>
      <span style={{ display: "flex", flexDirection: "column", gap: 10, width: 300, boxSizing: "border-box", padding: 20, border: "1px solid var(--avo-ink)", borderRadius: 14, background: "var(--avo-panel)", textAlign: "left" }}>
        <span style={{ display: "block", fontSize: 20, lineHeight: "23.4px", textAlign: "center", color: "var(--avo-ink)" }}>{meta.name} Sensor</span>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--avo-ink)" }}>Model: {meta.model}</span>
        <span style={{ display: "block", fontSize: 14, lineHeight: 1.4, color: "#000000" }}>
          Current Reading:
          <br />
          {meta.readingName}: {value.toFixed(1)} {meta.unit}
        </span>
        <span style={{ display: "block", marginTop: 6, fontSize: 12, textAlign: "center", color: "var(--avo-ink-muted)" }}>Tap anywhere to close</span>
      </span>
    </button>
  );
}
