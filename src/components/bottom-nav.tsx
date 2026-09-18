"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, Clock, Info } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/measure", label: "Measure", icon: FlaskConical },
  { href: "/history", label: "History", icon: Clock },
  { href: "/about", label: "About", icon: Info },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                active ? "text-[#023c69]" : "text-gray-400"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
