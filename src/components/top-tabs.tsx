"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/lib/ui-store";

const TABS = [
  { label: "Statistics", href: "/statistics" },
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings" },
];

export default function TopTabs() {
  const pathname = usePathname();
  const closeAll = useUiStore((s) => s.closeAll);

  return (
    <nav
      aria-label="App sections"
      style={{ margin: "16px 20px 0", padding: 4, display: "flex", gap: 4, background: "#FFFFFF", borderRadius: 50 }}
    >
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={closeAll}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 50,
              fontSize: 13.2,
              lineHeight: "15.5px",
              textAlign: "center",
              textDecoration: "none",
              color: isActive ? "#FFFFFF" : "#899B21",
              background: isActive ? "var(--avo-mint)" : "transparent",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
