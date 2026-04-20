"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ListChecks, User, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "القرآن", href: "/quran", icon: BookOpen },
  { name: "الأذكار", href: "/athkar", icon: Moon },
  { name: "العادات", href: "/habits", icon: ListChecks },
  { name: "الملف", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe z-50 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-16 sm:h-20 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-full transition-all duration-300 ease-out",
                isActive ? "text-emerald-600 scale-110" : "text-gray-400 hover:text-emerald-500 scale-100"
              )}
            >
              <Icon
                size={22}
                className={cn(
                  "transition-all duration-300",
                  isActive && "fill-emerald-600/20"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={cn(
                  "text-[9px] mt-1 font-semibold transition-colors duration-300",
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
