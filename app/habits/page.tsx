"use client";

import { HABITS, HabitCategory } from "@/lib/data/habits";
import { useAppStore } from "@/lib/store/useAppStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function HabitsPage() {
  const [mounted, setMounted] = useState(false);
  const toggleHabit = useAppStore((state) => state.toggleHabit);
  const getDailyProgress = useAppStore((state) => state.getDailyProgress);
  const getCompletedHabitIds = useAppStore((state) => state.getCompletedHabitIds);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read completed habit IDs for today from the date-scoped store
  const completedHabitIds = mounted ? getCompletedHabitIds() : [];

  // Group habits by category
  const groupedHabits = HABITS.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<HabitCategory, typeof HABITS>);

  const progress = mounted ? getDailyProgress() : 0;

  return (
    <div className="flex flex-col min-h-full safe-area-inset-top bg-slate-50/50">
      
      {/* Header section anchored to top */}
      <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">عادات اليوم</h1>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-500 tracking-wider">التقدم اليومي</span>
            <span className="text-xl font-black text-emerald-600">{progress}%</span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* Scrollable List */}
      <div className="flex-1 px-4 py-6 space-y-8">
        {(Object.keys(groupedHabits) as HabitCategory[]).map((category) => (
          <section key={category} className="space-y-3">
            <h2 className="px-2 text-sm font-bold text-slate-400 tracking-wider">
              {category}
            </h2>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-2">
              {groupedHabits[category].map((habit) => {
                const isCompleted = mounted && completedHabitIds.includes(habit.id);
                
                return (
                  <button
                    key={habit.id}
                    id={`habit-${habit.id}`}
                    onClick={() => toggleHabit(habit.id)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-colors hover:bg-slate-50 active:bg-slate-100 focus:outline-none"
                  >
                    <span className={`font-semibold transition-colors duration-300 ${isCompleted ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
                      {habit.title}
                    </span>
                    
                    <div 
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors duration-300 ${
                        isCompleted ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200 bg-transparent'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ 
                          scale: isCompleted ? 1 : 0, 
                          opacity: isCompleted ? 1 : 0 
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25 
                        }}
                      >
                        <Check size={16} strokeWidth={3} className="text-white" />
                      </motion.div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      
    </div>
  );
}
