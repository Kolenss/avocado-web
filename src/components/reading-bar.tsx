import Image from "next/image";
import { SENSORS } from "@/lib/constants";
import type { SensorKey } from "@/lib/types";

interface ReadingBarProps {
  sensor: SensorKey;
  value: number;
  onOpen: () => void;
}

// One "Standard Readings" row on Home; opens the sensor pop-up.
export default function ReadingBar({ sensor, value, onOpen }: ReadingBarProps) {
  const meta = SENSORS[sensor];
  const fill = Math.min(Math.max(value / meta.barMax, 0), 1);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ width: "100%", height: 48, display: "flex", alignItems: "center", gap: 12, padding: 0, border: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}
    >
      <Image src={meta.logo} alt="" width={40} height={40} style={{ display: "block", width: 40, height: 40 }} />
      <span style={{ position: "relative", display: "block", flex: 1, height: 27, borderRadius: 999, background: "#E5E7EB", overflow: "hidden" }}>
        <span style={{ display: "block", width: `${fill * 100}%`, height: "100%", background: "#64A12D" }} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
          <span style={{ fontSize: 12, color: "#000000" }}>{meta.name}</span>
          <span style={{ fontSize: 17, color: "#000000" }}>{value.toFixed(1)}</span>
        </span>
      </span>
    </button>
  );
}
