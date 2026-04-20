"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useState } from "react";
import { ATHKAR } from "@/lib/data/athkar";

const RANDOM_DUAS = ATHKAR.map(a => a.text).filter(t => t.length < 120 && t.length > 20);

export function TranquilityButton() {
  const [showDua, setShowDua] = useState(false);
  const [currentDua, setCurrentDua] = useState("");

  const handlePress = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_DUAS.length);
    setCurrentDua(RANDOM_DUAS[randomIndex]);
    setShowDua(true);
  };

  return (
    <>
      <div className="flex flex-col items-center mt-6 mb-8">
        <motion.button
          onClick={handlePress}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0px 0px 0px 0px rgba(16, 185, 129, 0.2)",
              "0px 0px 20px 10px rgba(16, 185, 129, 0.1)",
              "0px 0px 0px 0px rgba(16, 185, 129, 0.2)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 shadow-inner group overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          <Heart 
            size={36} 
            className="text-emerald-500 drop-shadow-sm z-10" 
            strokeWidth={1.5}
          />
        </motion.button>
        <span className="text-sm text-emerald-600/80 font-medium mt-4 tracking-wide text-xs">
          اضغط للسكينة
        </span>
      </div>

      {/* Dua Modal Overlay */}
      <AnimatePresence>
        {showDua && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
            onClick={() => setShowDua(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-l from-emerald-400 to-teal-500" />
              
              <button
                onClick={() => setShowDua(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              <div className="text-center mt-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🤲</span>
                </div>
                <p className="font-arabic text-xl text-slate-800 leading-[2.2] mb-6" dir="rtl">
                  {currentDua}
                </p>
                <button
                  onClick={handlePress}
                  className="text-sm font-bold text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  دعاء آخر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
