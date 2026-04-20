"use client";

import { useState, useEffect, useCallback, use } from "react";
import { ATHKAR, ATHKAR_CATEGORIES } from "@/lib/data/athkar";
import { useAppStore } from "@/lib/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params);
  const [mounted, setMounted] = useState(false);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  
  const markHabitComplete = useAppStore((state) => state.markHabitComplete);
  const categoryMeta = ATHKAR_CATEGORIES[chapterId];
  const categoryAthkar = ATHKAR.filter((d) => d.category === chapterId);

  useEffect(() => {
    if (!categoryMeta) {
      notFound();
    }
    setMounted(true);
  }, [categoryMeta]);

  // Initialize counters when component loads
  useEffect(() => {
    if (categoryAthkar.length === 0) return;
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
  }, [completedIds, categoryAthkar.length]);

  const handleTap = useCallback((id: string) => {
    setCounters((prev) => {
      const current = prev[id];
      if (current === undefined || current <= 0) return prev;

      const newVal = current - 1;
      if (newVal === 0) {
        setCompletedIds((prevSet) => new Set(prevSet).add(id));
      }
      return { ...prev, [id]: newVal };
    });
  }, []);

  const resetCategory = useCallback(() => {
    const newCompleted = new Set(completedIds);
    categoryAthkar.forEach((d) => newCompleted.delete(d.id));
    setCompletedIds(newCompleted);

    const initial: Record<string, number> = {};
    categoryAthkar.forEach((d) => {
      initial[d.id] = d.count;
    });
    setCounters((prev) => ({ ...prev, ...initial }));
  }, [completedIds, categoryAthkar]);

  // Check if all athkar in current category are completed
  const allCompleted = mounted && categoryAthkar.length > 0 && categoryAthkar.every((d) => completedIds.has(d.id));
  const completedCount = categoryAthkar.filter((d) => completedIds.has(d.id)).length;

  // Auto-mark the corresponding habit when specific ones are completed
  useEffect(() => {
    if (!mounted || !allCompleted) return;
    
    // Attempt auto-completion for common habits matching Dorar/Hisn categories
    if (categoryMeta?.title.includes("الصباح")) {
      markHabitComplete("morning_azkar");
    } else if (categoryMeta?.title.includes("المساء")) {
      markHabitComplete("evening_azkar");
    } else if (categoryMeta?.title.includes("النوم")) {
      markHabitComplete("sleep_azkar");
    }
  }, [allCompleted, categoryMeta, markHabitComplete, mounted]);

  if (!categoryMeta) return null;

  return (
    <div className="flex flex-col min-h-full safe-area-inset-top bg-[#FDFBF7]">
      {/* Header */}
      <header className="px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-amber-900/5 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <Link 
          href="/athkar" 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </Link>
        <div className="flex flex-col flex-1 text-center pr-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight line-clamp-1" dir="rtl">{categoryMeta.title}</h1>
        </div>
      </header>

      {/* Progress + Reset */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-[72px] z-10 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500 font-sans">
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
            className="mx-4 mt-6 overflow-hidden"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shadow-sm">
              <span className="text-3xl mb-2 block animate-bounce">✨</span>
              <p className="text-emerald-800 font-bold text-sm">
                ماشاء الله — لقد أتممت هذا الفصل!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Athkar Cards */}
      <div className="flex-1 px-4 py-6 pb-24 space-y-4">
        {categoryAthkar.map((dhikr, index) => {
          const remaining = counters[dhikr.id] ?? dhikr.count;
          const isComplete = completedIds.has(dhikr.id);

          return (
            <motion.div
              key={dhikr.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 > 0.4 ? 0 : index * 0.05 }}
            >
              <button
                onClick={() => handleTap(dhikr.id)}
                disabled={isComplete}
                className={`w-full text-right rounded-[20px] p-6 border transition-all active:scale-[0.98] ${
                  isComplete
                    ? "bg-emerald-50/80 border-emerald-200 opacity-60 grayscale-[50%]"
                    : "bg-white border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200"
                }`}
              >
                {/* Arabic text */}
                <p
                  className={`font-arabic text-xl leading-[2.2] mb-6 transition-colors text-justify ${
                    isComplete ? "text-emerald-700/60" : "text-slate-800 font-bold"
                  }`}
                  dir="rtl"
                >
                  {dhikr.text}
                </p>

                {/* Footer: reference + counter */}
                <div className="flex items-end justify-between border-t border-slate-50 pt-4" dir="rtl">
                  <div className="flex flex-col gap-1 text-right max-w-[70%]">
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">المصدر:</span>
                    <span className="text-xs text-slate-500 font-medium leading-relaxed">
                      {dhikr.reference || "حصن المسلم"}
                    </span>
                  </div>

                  {isComplete ? (
                    <div className="flex flex-col items-center gap-1 text-emerald-600">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Check size={20} strokeWidth={3.5} />
                      </div>
                      <span className="text-[10px] font-black">أُنجِزَ</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        key={remaining}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/30"
                      >
                        {remaining}
                      </motion.div>
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">التكرار</span>
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
