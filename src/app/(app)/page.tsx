"use client";

import { useEffect } from "react";
import TriviaCard from "@/components/trivia-card";
import ReadingBar from "@/components/reading-bar";
import { prefetchModels } from "@/lib/ml/predict";
import { HOME_ORDER } from "@/lib/constants";
import { useIsMounted, useReadingsStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";

export default function HomePage() {
  const mounted = useIsMounted();
  const readings = useReadingsStore((s) => s.readings);
  const storedConnected = useReadingsStore((s) => s.connected);
  const setConnected = useReadingsStore((s) => s.setConnected);
  const openOverlay = useUiStore((s) => s.openOverlay);
  const readNow = useUiStore((s) => s.readNow);
  const analyzing = useUiStore((s) => s.analyzing);

  useEffect(() => {
    prefetchModels();
  }, []);

  const connected = mounted ? storedConnected : true;
  const latest = mounted ? readings[readings.length - 1] : undefined;
  const values = connected && latest ? latest.values : null;

  return (
    <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column" }}>
      <TriviaCard />

      <section
        aria-label="Standard Readings"
        style={{ marginTop: 16, padding: 16, background: "#FFFFFF", border: "1.5px solid #1F1F1F", borderRadius: 20 }}
      >
        <div style={{ margin: "0 0 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 17, lineHeight: "20px", fontWeight: 400, color: "var(--avo-mint)" }}>
            Standard Readings
          </h2>
          {/* 44px tall hit area; the negative margin keeps the visible 20px pill in the 20px heading row. */}
          <button
            type="button"
            onClick={() => openOverlay({ kind: "input" })}
            style={{ margin: "-12px -4px", padding: "12px 4px", border: 0, background: "transparent", cursor: "pointer" }}
          >
            <span
              style={{
                display: "block",
                boxSizing: "border-box",
                height: 20,
                padding: "0 10px",
                border: "1px solid var(--avo-ink)",
                borderRadius: 999,
                background: "#FFFFFF",
                fontSize: 12,
                lineHeight: "18px",
                color: "var(--avo-brand)",
              }}
            >
              Edit values
            </span>
          </button>
        </div>
        {HOME_ORDER.map((key) => (
          <ReadingBar
            key={key}
            sensor={key}
            value={values ? values[key] : 0}
            onOpen={() => openOverlay({ kind: "sensor", sensor: key })}
          />
        ))}
      </section>

      <p aria-live="polite" style={{ margin: "16px 0 0", fontSize: 14, lineHeight: "16.4px", textAlign: "center", color: "#FFFFFF" }}>
        {analyzing ? "Analyzing..." : "Check full freshness report!"}
      </p>
      <button
        type="button"
        onClick={() => readNow(values)}
        aria-busy={analyzing}
        style={{ marginTop: 8, width: "100%", height: 44, padding: 0, border: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", borderRadius: 12, fontSize: 22, color: "var(--avo-brand)", cursor: analyzing ? "progress" : "pointer" }}
      >
        Read Now
      </button>
      <button
        type="button"
        onClick={() => (connected ? setConnected(false) : openOverlay({ kind: "input" }))}
        style={{ marginTop: 12, alignSelf: "center", width: 160, height: 44, boxSizing: "border-box", padding: 0, border: "1px solid var(--avo-ink)", borderRadius: 12, background: "#FFFFFF", fontSize: 14, color: "var(--avo-brand)", cursor: "pointer" }}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
