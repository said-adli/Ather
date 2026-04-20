"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, ChevronUp } from "lucide-react";
import Link from "next/link";

const TOTAL_AYAHS = 6236;

export default function KhatmaPage() {
  const [mounted, setMounted] = useState(false);
  const khatmaGoalDays = useAppStore((state) => state.khatmaGoalDays);
  const readAyahs = useAppStore((state) => state.readAyahs);
  const setKhatmaGoalDays = useAppStore((state) => state.setKhatmaGoalDays);
  const addReadAyahs = useAppStore((state) => state.addReadAyahs);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = mounted ? Math.min(100, Math.round((readAyahs / TOTAL_AYAHS) * 100)) : 0;
  const ayahsPerDay = mounted && khatmaGoalDays ? Math.ceil(TOTAL_AYAHS / khatmaGoalDays) : 0;

  // SVG calculations for smooth progress ring
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleGoalChange = (val: string) => {
    const days = parseInt(val, 10);
    setKhatmaGoalDays(isNaN(days) || days <= 0 ? null : days);
  };

  const handleAddAyahs = (amount: number) => {
    addReadAyahs(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] px-6 pt-12 pb-24 safe-area-inset-top">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">خطة الختمة</h1>
        <p className="text-slate-500 font-medium mt-1">حدد هدفك وتابع قراءتك</p>
      </header>

      {/* Goal Setter Card */}
      <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none">
          <Target size={120} />
        </div>
        <h2 className="text-emerald-900 font-bold mb-4 flex items-center gap-2">
          <CalendarIcon width={18} height={18} className="text-emerald-500" /> تحديد الهدف
        </h2>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 tracking-wider">
            عدد الأيام المستهدف للإنهاء
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="number"
              value={mounted && khatmaGoalDays !== null ? khatmaGoalDays : ""}
              onChange={(e) => handleGoalChange(e.target.value)}
              placeholder="مثلاً 30"
              className="w-24 text-center text-xl font-black text-slate-700 bg-slate-50 border border-slate-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <span className="text-slate-500 font-medium">يوم</span>
          </div>
        </div>

        {khatmaGoalDays && (
          <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-medium text-sm">المعدل المطلوب</span>
            <span className="text-emerald-700 font-black px-3 py-1 bg-emerald-50 rounded-lg">
              {ayahsPerDay} <span className="text-emerald-600/70 text-xs tracking-widest font-bold">آية / يوم</span>
            </span>
          </div>
        )}
      </section>

      {/* Tracker Card */}
      <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center">
        <h2 className="text-slate-800 font-bold mb-6 w-full text-right">التقدم الحالي</h2>
        
        <div className="relative flex items-center justify-center w-48 h-48 mb-6">
          <svg className="transform rotate-90 w-full h-full filter drop-shadow-sm">
            <circle 
              cx="96" cy="96" r={circleRadius} 
              stroke="#f1f5f9" strokeWidth="16" fill="none" 
            />
            <motion.circle 
              cx="96" cy="96" r={circleRadius} 
              stroke="#10b981" strokeWidth="16" fill="none" 
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: mounted ? strokeDashoffset : circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-800">{progress}%</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">مُكتمل</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
          <div className="flex flex-col">
            <span className="text-xs tracking-widest font-bold text-slate-400 mb-1">الآيات المقروءة</span>
            <span className="text-xl font-black text-slate-700">{mounted ? readAyahs : 0} <span className="text-sm font-medium text-slate-400">/ {TOTAL_AYAHS}</span></span>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => handleAddAyahs(10)}
              className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors active:scale-95"
            >
              <ChevronUp size={16} /> ١٠
            </button>
            <button 
              onClick={() => handleAddAyahs(50)}
              className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors active:scale-95"
            >
              <ChevronUp size={16} /> ٥٠
            </button>
          </div>
        </div>

        {/* Link to Quran Reader */}
        <Link 
          href="/quran"
          className="w-full text-center py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm transition-colors border border-emerald-100"
        >
          📖 افتح القرآن وابدأ القراءة
        </Link>

      </section>

    </div>
  );
}

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
