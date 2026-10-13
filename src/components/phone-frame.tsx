import type { ReactNode } from "react";

const SIDE_BUTTON = { position: "absolute", width: 4, background: "#2C322D" } as const;

// Phone bezel + 394×842 screen. Overlays are positioned against `.screen`.
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="phone"
      style={{
        position: "relative",
        flexShrink: 0,
        width: 418,
        boxSizing: "border-box",
        padding: 12,
        background: "#161A17",
        borderRadius: 56,
        boxShadow: "0 0 0 2px #2C322D, 0 30px 60px rgba(20, 50, 30, 0.35)",
      }}
    >
      <div aria-hidden="true" style={{ ...SIDE_BUTTON, right: -4, top: 170, height: 70, borderRadius: "0 3px 3px 0" }} />
      <div aria-hidden="true" style={{ ...SIDE_BUTTON, left: -4, top: 130, height: 40, borderRadius: "3px 0 0 3px" }} />
      <div aria-hidden="true" style={{ ...SIDE_BUTTON, left: -4, top: 190, height: 70, borderRadius: "3px 0 0 3px" }} />

      <div
        className="screen"
        style={{
          position: "relative",
          width: 394,
          height: 842,
          overflow: "hidden",
          borderRadius: 44,
          display: "flex",
          flexDirection: "column",
          background: "var(--avo-page) url(/images/Home_Screen.png) top center / cover no-repeat",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 11,
            left: 191,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#0B0D0C",
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.08)",
            zIndex: 5,
          }}
        />
        {children}
      </div>
    </div>
  );
}
