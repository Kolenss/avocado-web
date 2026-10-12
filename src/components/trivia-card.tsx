"use client";

import Image from "next/image";
import { TRIVIA } from "@/lib/constants";
import { useIsMounted } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";

export default function TriviaCard() {
  const mounted = useIsMounted();
  const triviaIndex = useUiStore((s) => s.triviaIndex);
  const trivia = mounted ? TRIVIA[triviaIndex] : "";
  const long = trivia.length > 60;

  return (
    <section
      aria-label="Trivia"
      style={{
        height: 191,
        display: "flex",
        borderRadius: 40,
        background: "url(/images/Trivia_Background.png) center / 100% 100% no-repeat",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, boxSizing: "border-box", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 17, lineHeight: "20px", color: "#FFFFFF" }}>Trivia</div>
        <p
          style={{
            margin: 0,
            flex: 1,
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            color: "#FFFFFF",
            fontSize: long ? 15.5 : 17,
            lineHeight: long ? "19.5px" : "21.3px",
          }}
        >
          {trivia}
        </p>
        <div style={{ fontSize: 12, lineHeight: "14px", color: "#FFFFFF" }}>Did you know?</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Image
          src="/images/high5.gif"
          alt="Cartoon avocado and pit high-fiving"
          width={140}
          height={120}
          unoptimized
          preload
          style={{ display: "block", width: 140, height: 120, objectFit: "cover", borderRadius: 24 }}
        />
      </div>
    </section>
  );
}
