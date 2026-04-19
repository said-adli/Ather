"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ListChecks, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Quran", href: "/quran", icon: BookOpen },
  { name: "Habits", href: "/habits", icon: ListChecks },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 sm:h-20 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ease-out",
                isActive ? "text-emerald-600 scale-110" : "text-gray-400 hover:text-emerald-500 scale-100"
              )}
            >
              <Icon
                size={24}
                className={cn(
                  "transition-all duration-300",
                  isActive && "fill-emerald-600/20"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={cn(
                  "text-[10px] mt-1 font-medium transition-colors duration-300",
                  isActive ? "text-emerald-700" : "text-gray-400"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
