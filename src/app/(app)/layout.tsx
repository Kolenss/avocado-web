import Landing from "@/components/landing";
import PhoneFrame from "@/components/phone-frame";
import AppShell from "@/components/app-shell";

// Persists across tab navigations: only the phone's tab content changes.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Landing>
      <PhoneFrame>
        <AppShell>{children}</AppShell>
      </PhoneFrame>
    </Landing>
  );
}
