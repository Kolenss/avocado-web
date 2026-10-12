import { INFO } from "@/lib/constants";
import type { InfoTopic } from "@/lib/types";
import { blurBackdropStyle } from "./sensor-popup";

// Terms / Privacy / About from Settings. Tap anywhere to close.
export default function InfoPopup({ topic, onClose }: { topic: InfoTopic; onClose: () => void }) {
  const info = INFO[topic];

  return (
    <button type="button" onClick={onClose} style={blurBackdropStyle}>
      <span style={{ display: "flex", flexDirection: "column", gap: 16, width: 314, boxSizing: "border-box", padding: "24px 20px", border: "1px solid var(--avo-ink)", borderRadius: 14, background: "var(--avo-panel)", textAlign: "left" }}>
        <span style={{ display: "block", fontSize: 20, lineHeight: "23.4px", color: "var(--avo-ink)" }}>{info.title}</span>
        <span style={{ display: "block", fontSize: 17, lineHeight: 1.3, color: "var(--avo-ink)" }}>{info.content}</span>
        <span style={{ display: "block", fontSize: 12, textAlign: "center", color: "var(--avo-ink-muted)" }}>Tap anywhere to close</span>
      </span>
    </button>
  );
}
