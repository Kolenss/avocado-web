import type { PredictionResult, SensorValues } from "@/lib/ml/predict";
import { formatShelfLife } from "@/lib/format";

export const dimBackdropStyle = { position: "absolute", inset: 0, zIndex: 10, background: "rgba(0, 0, 0, 0.7)" } as const;
export const dialogTitleStyle = { margin: 0, fontSize: 22, lineHeight: "25.8px", fontWeight: 700, textAlign: "center", color: "#2B3B22" } as const;
export const dialogPanelStyle = { marginTop: 16, padding: 16, background: "var(--avo-panel)", borderRadius: 14, fontSize: 16, lineHeight: "18.75px", color: "#28351E" } as const;
export const primaryButtonStyle = { width: "100%", height: 44, padding: 0, border: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--avo-brand-strong)", borderRadius: 12, fontSize: 18, fontWeight: 700, color: "#FFFFFF", cursor: "pointer" } as const;

const h3Style = { margin: 0, fontSize: 18, lineHeight: "21px", fontWeight: 700, color: "#0A8A42" } as const;
const lineStyle = { margin: "8px 0 0" } as const;
const strongStyle = { color: "#243118" } as const;

interface FreshnessReportProps {
  prediction: PredictionResult;
  values: SensorValues;
  onClose: () => void;
}

export default function FreshnessReport({ prediction, values, onClose }: FreshnessReportProps) {
  return (
    <>
      <div aria-hidden="true" style={dimBackdropStyle} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="freshness-report-title"
        style={{ position: "absolute", zIndex: 11, left: 20, right: 20, top: 183, boxSizing: "border-box", padding: 20, background: "var(--avo-mint)", borderRadius: 20 }}
      >
        <h2 id="freshness-report-title" style={dialogTitleStyle}>🥑 Freshness Report</h2>
        <div style={dialogPanelStyle}>
          <h3 style={h3Style}>Prediction Results</h3>
          <p style={lineStyle}>
            Freshness Status: <strong style={strongStyle}>{prediction.ripeness_label}</strong>
          </p>
          <p style={lineStyle}>Shelf Life:</p>
          <p style={{ margin: "6px 0 0", paddingLeft: 10, fontSize: 18, lineHeight: "21px", fontWeight: 700, color: "#243118" }}>
            {formatShelfLife(prediction)}
          </p>
          <h3 style={{ ...h3Style, marginTop: 16 }}>Sensor Readings</h3>
          <p style={lineStyle}>
            CO<sub style={{ fontSize: 11, lineHeight: 0 }}>2</sub> Level: <strong style={strongStyle}>{values.co2.toFixed(0)} ppm</strong>
          </p>
          <p style={lineStyle}>
            VOC (Gas): <strong style={strongStyle}>{values.gas.toFixed(1)} KΩ</strong>
          </p>
          <p style={lineStyle}>
            Temperature: <strong style={strongStyle}>{values.temperature.toFixed(1)}°C</strong>
          </p>
          <p style={lineStyle}>
            Humidity: <strong style={strongStyle}>{values.humidity.toFixed(1)}%</strong>
          </p>
          <p style={lineStyle}>
            Pressure: <strong style={strongStyle}>{values.pressure.toFixed(1)} hPa</strong>
          </p>
          <p style={{ margin: "16px 0 0", minHeight: 40, boxSizing: "border-box", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, background: "#C3E5CB", borderRadius: 10, fontSize: 15 }}>
            <span aria-hidden="true">💡</span>
            <span>
              <strong style={strongStyle}>Note:</strong> {prediction.note}
            </span>
          </p>
        </div>
        <button type="button" onClick={onClose} style={{ ...primaryButtonStyle, marginTop: 16 }}>
          Close
        </button>
      </section>
    </>
  );
}
