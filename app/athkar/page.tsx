"use client";

import { useState, useEffect, useCallback } from "react";
import { ATHKAR, ATHKAR_CATEGORIES, type AthkarCategory } from "@/lib/data/athkar";
import { useAppStore } from "@/lib/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

export default function AthkarPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AthkarCategory>("morning");
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const markHabitComplete = useAppStore((state) => state.markHabitComplete);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize counters when category changes
  useEffect(() => {
    const categoryAthkar = ATHKAR.filter((d) => d.category === activeCategory);
    const initial: Record<string, number> = {};
    categoryAthkar.forEach((d) => {
      // Preserve already-completed state
      if (!completedIds.has(d.id)) {
        initial[d.id] = d.count;
      } else {
        initial[d.id] = 0;
      }
    });
    setCounters(initial);
  }, [activeCategory, completedIds]);

  const handleTap = useCallback((id: string) => {
    setCounters((prev) => {
      const current = prev[id];
      if (current === undefined || current <= 0) return prev;

      const newVal = current - 1;
      if (newVal === 0) {
        // Mark as completed
        setCompletedIds((prevSet) => new Set(prevSet).add(id));
      }
      return { ...prev, [id]: newVal };
    });
  }, []);

  const resetCategory = useCallback(() => {
    const categoryAthkar = ATHKAR.filter((d) => d.category === activeCategory);
    const newCompleted = new Set(completedIds);
    categoryAthkar.forEach((d) => newCompleted.delete(d.id));
    setCompletedIds(newCompleted);

    const initial: Record<string, number> = {};
    categoryAthkar.forEach((d) => {
      initial[d.id] = d.count;
    });
    setCounters((prev) => ({ ...prev, ...initial }));
  }, [activeCategory, completedIds]);

  // Check if all athkar in current category are completed
  const categoryAthkar = ATHKAR.filter((d) => d.category === activeCategory);
  const allCompleted = mounted && categoryAthkar.every((d) => completedIds.has(d.id));
  const completedCount = categoryAthkar.filter((d) => completedIds.has(d.id)).length;

  // Auto-mark the corresponding habit when all morning/evening athkar are completed
  useEffect(() => {
    if (!mounted) return;
    if (allCompleted && activeCategory === "morning") {
      markHabitComplete("morning_azkar");
    } else if (allCompleted && activeCategory === "evening") {
      markHabitComplete("evening_azkar");
    }
  }, [allCompleted, activeCategory, markHabitComplete, mounted]);

  const categories = Object.entries(ATHKAR_CATEGORIES) as [AthkarCategory, { title: string; icon: string }][];

  return (
    <div className="flex flex-col min-h-full safe-area-inset-top bg-slate-50/50">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">الأذكار</h1>
        <p className="text-slate-500 font-medium mt-1">حصن المسلم — أذكار من الكتاب والسنة</p>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map(([key, { title, icon }]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span>{icon}</span>
                {title}
              </button>
            );
          })}
        </div>
      </header>

      {/* Progress + Reset */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">
            {completedCount} / {categoryAthkar.length}
          </span>
          <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${categoryAthkar.length > 0 ? (completedCount / categoryAthkar.length) * 100 : 0}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
        <button
          onClick={resetCategory}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <RotateCcw size={13} />
          إعادة
        </button>
      </div>

      {/* All-Complete Banner */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mx-4 mb-4 overflow-hidden"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <span className="text-2xl mb-2 block">✨</span>
              <p className="text-emerald-800 font-bold text-sm">
                ماشاء الله — أكملت {ATHKAR_CATEGORIES[activeCategory].title}
              </p>
              {(activeCategory === "morning" || activeCategory === "evening") && (
                <p className="text-emerald-600 text-xs mt-1">
                  تم تسجيل &quot;{activeCategory === "morning" ? "أذكار الصباح" : "أذكار المساء"}&quot; في عاداتك اليومية تلقائياً ✓
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Athkar Cards */}
      <div className="flex-1 px-4 pb-8 space-y-3">
        {categoryAthkar.map((dhikr, index) => {
          const remaining = counters[dhikr.id] ?? dhikr.count;
          const isComplete = completedIds.has(dhikr.id);

          return (
            <motion.div
              key={dhikr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 > 0.3 ? 0 : index * 0.03 }}
            >
              <button
                onClick={() => handleTap(dhikr.id)}
                disabled={isComplete}
                className={`w-full text-right rounded-3xl p-5 border transition-all active:scale-[0.98] ${
                  isComplete
                    ? "bg-emerald-50/80 border-emerald-200 opacity-70"
                    : "bg-white border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md"
                }`}
              >
                {/* Arabic text */}
                <p
                  className={`font-arabic text-lg leading-[2.3] mb-4 transition-colors ${
                    isComplete ? "text-emerald-700/60" : "text-slate-800"
                  }`}
                  dir="rtl"
                >
                  {dhikr.text}
                </p>

                {/* Footer: reference + counter */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium max-w-[60%] truncate">
                    {dhikr.reference}
                  </span>

                  {isComplete ? (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Check size={16} strokeWidth={3} />
                      <span className="text-xs font-bold">تم</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.div
                        key={remaining}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20"
                      >
                        {remaining}
                      </motion.div>
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
