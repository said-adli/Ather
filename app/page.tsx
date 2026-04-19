"use client";

import { AtharTree } from "@/components/features/AtharTree";
import { TranquilityButton } from "@/components/ui/TranquilityButton";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { useState, useEffect } from "react";

export default function Home() {
  // A helper to get a dynamic greeting based on the time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const khatmaProgress = useAppStore((state) => state.khatmaProgress);
  const userName = useAppStore((state) => state.userName);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-full px-6 pt-10 pb-8 safe-area-inset-top">
      {/* Header section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {getGreeting()}{mounted && userName ? `, ${userName}` : ""},
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Welcome back to Athar.
        </p>
      </header>

      {/* Daily Progress Card */}
      <section className="mb-8 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Today&apos;s Progress</h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Active
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/habits" className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center items-start border border-slate-100/50 hover:bg-emerald-50/50 transition-colors">
            <span className="text-xs text-slate-500 font-medium mb-1">Daily Habit</span>
            <span className="text-slate-700 font-semibold text-sm">View Status</span>
          </Link>
          <Link href="/khatma" className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center items-start border border-slate-100/50 hover:bg-emerald-50/50 transition-colors">
            <span className="text-xs text-slate-500 font-medium mb-1">Quran Target</span>
            <span className="text-emerald-600 font-bold text-sm tracking-wide">{mounted ? khatmaProgress : 0}% Complete</span>
          </Link>
        </div>
      </section>

      {/* Athar Tree Section */}
      <section className="mb-10 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <AtharTree />
        </div>
      </section>

      {/* Tranquility Button Section */}
      <section className="mt-auto flex justify-center pb-4">
        <TranquilityButton />
      </section>
    </div>
  );
}
