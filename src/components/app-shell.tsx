"use client";

import type { ReactNode } from "react";
import TopTabs from "@/components/top-tabs";
import OverlayHost from "@/components/overlays/overlay-host";
import { GREETINGS } from "@/lib/constants";
import { useIsMounted } from "@/lib/store";
import { useUiStore } from "@/lib/ui-store";

// Everything inside the phone screen: header, tabs, the scrolling tab
// content and the overlays that cover the whole screen.
export default function AppShell({ children }: { children: ReactNode }) {
  const mounted = useIsMounted();
  const greetingIndex = useUiStore((s) => s.greetingIndex);

  return (
    <>
      <header style={{ padding: "20px 20px 0" }}>
        <div style={{ fontSize: 39.6, lineHeight: "46px", color: "#FFFFFF" }}>Hello</div>
        <p style={{ margin: "4px 0 0", minHeight: 18, fontSize: 15.4, lineHeight: "18px", color: "#FFFFFF" }}>
          {mounted ? GREETINGS[greetingIndex] : ""}
        </p>
      </header>
      <TopTabs />
      <main className="screen-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {children}
      </main>
      <OverlayHost />
    </>
  );
}
