"use client";

import { useEffect } from "react";
import type { SensorValues } from "@/lib/ml/predict";
import { DEFAULT_VALUES } from "@/lib/constants";
import { useReadingsStore } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";
import SensorPopup from "./sensor-popup";
import InfoPopup from "./info-popup";
import FreshnessReport from "./freshness-report";
import SensorInputSheet from "./sensor-input-sheet";

// Renders the open overlay over the whole phone screen (header and tabs too).
export default function OverlayHost() {
  const overlay = useUiStore((s) => s.overlay);
  const closeOverlay = useUiStore((s) => s.closeOverlay);
  const nextSample = useUiStore((s) => s.nextSample);
  const latest = useReadingsStore((s) => s.readings[s.readings.length - 1]);
  const connected = useReadingsStore((s) => s.connected);
  const addReading = useReadingsStore((s) => s.addReading);
  const setConnected = useReadingsStore((s) => s.setConnected);

  const isOpen = overlay !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOverlay]);

  // Overlays only open from user input, i.e. after mount, so reading the
  // persisted store here cannot cause a hydration mismatch.
  if (!overlay) return null;

  switch (overlay.kind) {
    case "sensor": {
      const value = connected && latest ? latest.values[overlay.sensor] : 0;
      return <SensorPopup sensor={overlay.sensor} value={value} onClose={closeOverlay} />;
    }
    case "info":
      return <InfoPopup topic={overlay.topic} onClose={closeOverlay} />;
    case "report":
      return <FreshnessReport prediction={overlay.prediction} values={overlay.values} onClose={closeOverlay} />;
    case "input": {
      const save = (values: SensorValues) => {
        addReading(values);
        setConnected(true);
        closeOverlay();
      };
      return (
        <SensorInputSheet
          initial={latest?.values ?? DEFAULT_VALUES}
          nextSample={nextSample}
          onSave={save}
          onClose={closeOverlay}
        />
      );
    }
  }
}
