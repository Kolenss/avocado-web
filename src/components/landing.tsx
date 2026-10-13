import type { ReactNode } from "react";

const THINGS_TO_TRY = [
  "Tap Edit values and type in sensor readings (or use sample values).",
  "Press Read Now for the freshness report.",
  "Tap a reading on Home to see which sensor measured it.",
  "Open Statistics to see every reading you’ve entered.",
  "Turn sensors off in Settings and watch Statistics change.",
];

// Landing page around the phone (Web.dc.html). `children` is the phone.
export default function Landing({ children }: { children: ReactNode }) {
  return (
    <div
      className="landing-page"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "64px 32px",
        background: "var(--avo-page)",
        color: "#1E2B18",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", top: -160, right: -140, width: 520, height: 520, borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -150, left: -120, width: 400, height: 400, borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "42%", left: -48, width: 120, height: 170, borderRadius: 40, background: "rgba(150, 240, 165, 0.45)" }} />

      <div
        style={{
          position: "relative",
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "56px 88px",
        }}
      >
        <div style={{ flex: "1 1 360px", maxWidth: 460, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ padding: "8px 14px", borderRadius: 999, background: "#FFFFFF", fontSize: 13, lineHeight: "16px", fontWeight: 500, color: "#4F5E0F" }}>
            Live demo · no download needed
          </span>
          <h1 className="hero-title" style={{ margin: "20px 0 0", fontSize: 52, lineHeight: 1.05, fontWeight: 700, letterSpacing: -1, color: "#1E2B18" }}>
            Try Avocado right in your browser
          </h1>
          <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.55, color: "#22331B" }}>
            The Avocado sensors aren’t attached here, so you type in the readings yourself. The app’s
            machine-learning model then predicts the avocado’s freshness right in your browser.
          </p>

          <div style={{ marginTop: 32, width: "100%", boxSizing: "border-box", padding: 24, background: "#FFFFFF", border: "1.5px solid #1F1F1F", borderRadius: 20 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 17, lineHeight: "20px", fontWeight: 400, color: "#1C8048" }}>Things to try</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {THINGS_TO_TRY.map((text, i) => (
                <li
                  key={text}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--avo-panel)", borderRadius: 10, fontSize: 15.5, lineHeight: 1.4, color: "#22301C" }}
                >
                  <span
                    style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "#08793A", color: "#FFFFFF", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {i + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <p
            role="note"
            style={{ margin: "20px 0 0", width: "100%", boxSizing: "border-box", padding: "12px 14px", background: "#C3E5CB", borderRadius: 10, fontSize: 14, lineHeight: 1.5, color: "#22301C" }}
          >
            <strong>Disclaimer:</strong> Predictions are not guaranteed to be accurate. Our dataset is small for machine
            learning, with only about 8,000 rows of sensor readings, so treat the results as estimates.
          </p>
          <p style={{ margin: "16px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "#22331B" }}>
            Readings you enter are kept in this browser only. The phone app shows live data once it’s paired with
            the Avocado sensor over Bluetooth.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
