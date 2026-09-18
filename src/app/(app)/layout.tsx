"use client";

import PhoneFrame from "@/components/phone-frame";
import BottomNav from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="flex flex-col h-full">
        <main className="flex-1 overflow-y-auto px-4 pb-4">{children}</main>
        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
