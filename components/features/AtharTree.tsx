"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AtharTree() {
  // Use state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const khatmaProgress = useAppStore((state) => state.khatmaProgress);
  // Re-evaluate daily progress when habits change
  useAppStore((state) => state.completedHabits);
  const getDailyProgress = useAppStore((state) => state.getDailyProgress);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = mounted ? getDailyProgress() : 0;
  
  const treeStatus = useMemo(() => {
    if (progress === 0) return { message: "Start your day with a good deed", icon: "🌱", color: "bg-emerald-50" };
    if (progress < 50) return { message: "Your tree is taking root", icon: "🌿", color: "bg-emerald-100" };
    if (progress < 100) return { message: "Your tree is blooming", icon: "🌳", color: "bg-emerald-200" };
    return { message: "Mashallah, a fruitful day!", icon: "✨🌳✨", color: "bg-emerald-300" };
  }, [progress]);

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-3xl p-6 shadow-[0_4px_24px_rgba(16,185,129,0.06)] border border-emerald-100/50 aspect-square max-h-80 flex flex-col items-center justify-center transition-colors duration-700">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-32 h-32 rounded-full ${treeStatus.color} shadow-inner bg-opacity-40 backdrop-blur-md border border-white/60 flex items-center justify-center mb-6 relative transition-all duration-1000 ease-in-out`}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={treeStatus.icon}
            initial={{ y: 10, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-4xl filter drop-shadow-sm flex items-center justify-center"
          >
            {treeStatus.icon}
          </motion.div>
        </AnimatePresence>
        
        {/* Subtle decorative elements around the tree */}
        <div className="absolute top-[15%] right-2 w-2 h-2 rounded-full bg-emerald-300/60 animate-pulse delay-700" />
        <div className="absolute bottom-[20%] left-2 w-2 h-2 rounded-full bg-emerald-400/50 animate-pulse" />
      </motion.div>
      
      <h3 className="text-slate-800 font-bold text-xl text-center mb-1">
        Your Athar Tree
      </h3>
      
      <AnimatePresence mode="wait">
        <motion.p 
          key={treeStatus.message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-emerald-700/80 text-sm text-center font-medium px-4 h-5"
        >
          {treeStatus.message}
        </motion.p>
      </AnimatePresence>

      {/* Mini Progress stats indicator inside the tree view */}
      <div className="mt-8 flex items-center gap-4 bg-white/70 backdrop-blur-xl px-5 py-2.5 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-emerald-50/50">
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-black">Quran</span> 
          <span>{mounted ? khatmaProgress : 0}%</span>
        </div>
        <div className="w-1 h-1 bg-emerald-300/50 rounded-full" />
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-500 font-black">Habits</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
