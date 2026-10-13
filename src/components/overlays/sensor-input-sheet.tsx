"use client";

import { useId, useState, type FormEvent } from "react";
import type { SensorValues } from "@/lib/ml/predict";
import { INPUT_ORDER, SENSORS } from "@/lib/constants";
import type { SensorKey, SensorMeta } from "@/lib/types";
import { dialogPanelStyle, dialogTitleStyle, dimBackdropStyle, primaryButtonStyle } from "./freshness-report";

type Fields = Record<SensorKey, string>;
type Errors = Partial<Record<SensorKey, string>>;

const ERROR_COLOR = "var(--avo-down)";

function toFields(values: SensorValues): Fields {
  return {
    gas: String(values.gas),
    co2: String(values.co2),
    temperature: String(values.temperature),
    humidity: String(values.humidity),
    pressure: String(values.pressure),
  };
}

function validate(raw: string, meta: SensorMeta): string | null {
  const text = raw.trim();
  if (text === "") return "Enter a value.";
  const n = Number(text);
  if (!Number.isFinite(n)) return "Enter a number.";
  if (n < meta.min || n > meta.max) return `Enter a value from ${meta.min} to ${meta.max}.`;
  return null;
}

interface SensorInputSheetProps {
  initial: SensorValues;
  nextSample: () => SensorValues;
  onSave: (values: SensorValues) => void;
  onClose: () => void;
}

// Typed stand-in for the absent sensors. Saving appends a reading.
export default function SensorInputSheet({ initial, nextSample, onSave, onClose }: SensorInputSheetProps) {
  const idPrefix = useId();
  const [fields, setFields] = useState<Fields>(() => toFields(initial));
  const [errors, setErrors] = useState<Errors>({});

  function handleChange(key: SensorKey, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSample() {
    setFields(toFields(nextSample()));
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Errors = {};
    for (const key of INPUT_ORDER) {
      const error = validate(fields[key], SENSORS[key]);
      if (error) nextErrors[key] = error;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      gas: Number(fields.gas),
      co2: Number(fields.co2),
      temperature: Number(fields.temperature),
      humidity: Number(fields.humidity),
      pressure: Number(fields.pressure),
    });
  }

  return (
    <>
      <div aria-hidden="true" style={dimBackdropStyle} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idPrefix}-title`}
        className="screen-scroll"
        style={{
          position: "absolute",
          zIndex: 11,
          left: 20,
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          maxHeight: "calc(100% - 40px)",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: 20,
          background: "var(--avo-mint)",
          borderRadius: 20,
        }}
      >
        <h2 id={`${idPrefix}-title`} style={dialogTitleStyle}>🥑 Sensor Input</h2>
        <form noValidate onSubmit={handleSubmit}>
          <div style={{ ...dialogPanelStyle, display: "flex", flexDirection: "column", gap: 10 }}>
            {INPUT_ORDER.map((key) => {
              const meta = SENSORS[key];
              const error = errors[key];
              const inputId = `${idPrefix}-${key}`;
              return (
                <div key={key}>
                  <label htmlFor={inputId} style={{ display: "block", marginBottom: 4, fontSize: 14, lineHeight: "16.4px", color: "#28351E" }}>
                    {meta.inputLabel}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id={inputId}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={fields[key]}
                      placeholder={meta.placeholder}
                      onChange={(e) => handleChange(key, e.target.value)}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${inputId}-error` : undefined}
                      style={{
                        display: "block",
                        width: "100%",
                        height: 40,
                        boxSizing: "border-box",
                        padding: "0 52px 0 12px",
                        border: `1px solid ${error ? ERROR_COLOR : "var(--avo-ink)"}`,
                        borderRadius: 10,
                        background: "#FFFFFF",
                        fontSize: 16,
                        color: "#000000",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      style={{ position: "absolute", right: 12, top: 0, bottom: 0, display: "flex", alignItems: "center", fontSize: 14, color: "var(--avo-ink-muted)", pointerEvents: "none" }}
                    >
                      {meta.unit}
                    </span>
                  </div>
                  {error && (
                    <p id={`${inputId}-error`} style={{ margin: "4px 0 0", fontSize: 12, lineHeight: "14px", color: ERROR_COLOR }}>
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleSample}
            style={{ marginTop: 16, width: "100%", height: 44, boxSizing: "border-box", padding: 0, border: "1px solid var(--avo-ink)", borderRadius: 12, background: "#FFFFFF", fontSize: 16, color: "var(--avo-brand)", cursor: "pointer" }}
          >
            Use sample values
          </button>
          <button type="submit" style={{ ...primaryButtonStyle, marginTop: 10 }}>
            Save readings
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ display: "block", margin: "8px auto 0", padding: "8px 16px", border: 0, background: "transparent", fontSize: 15, color: "#2B3B22", cursor: "pointer" }}
          >
            Cancel
          </button>
        </form>
      </section>
    </>
  );
}
