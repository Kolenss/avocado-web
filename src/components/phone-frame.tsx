"use client";

import { useEffect, useState, type ReactNode } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default function PhoneFrame({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-screen bg-[#f8f9fa] flex flex-col">
        {children}
      </div>
    );
  }

  if (!isDesktop) {
    return <div className="h-screen bg-[#f8f9fa] flex flex-col">{children}</div>;
  }

  const aspectRatio = 405 / 868;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div
        className="relative"
        style={{
          height: "min(calc(100vh - 48px), 868px)",
          width: `calc(min(calc(100vh - 48px), 868px) * ${aspectRatio})`,
        }}
      >
        {/* Phone bezel */}
        <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl w-full h-full">
          {/* Dynamic island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

          {/* Screen */}
          <div className="relative w-full h-full bg-[#f8f9fa] rounded-[2.4rem] overflow-hidden flex flex-col">
            {/* Status bar spacer */}
            <div className="h-12 shrink-0" />

            {/* Content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>

        {/* Side buttons - scaled with the phone */}
        <div className="absolute top-[12%] -left-1 w-1 h-[3%] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute top-[18%] -left-1 w-1 h-[5%] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute top-[25%] -left-1 w-1 h-[5%] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute top-[18%] -right-1 w-1 h-[7%] bg-[#2a2a2a] rounded-r-sm" />
      </div>
    </div>
  );
}
