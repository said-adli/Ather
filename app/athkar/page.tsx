"use client";

import { useState } from "react";
import { ATHKAR_CATEGORIES } from "@/lib/data/athkar";
import Link from "next/link";
import { Search, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AthkarDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const categoriesList = Object.values(ATHKAR_CATEGORIES);
  const filteredCategories = categoriesList.filter(c => 
    c.title.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-full bg-[#FDFBF7]">
      <header className="px-6 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-amber-900/5 sticky top-0 z-10 shadow-sm safe-area-inset-top">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          الأذكار 
        </h1>
        <p className="text-slate-500 font-medium mt-1">حصن المسلم — أذكار من الكتاب والسنة</p>
        
        {/* Search Bar */}
        <div className="mt-5 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pr-10 pl-3 py-3.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-bold sm:text-sm shadow-inner"
            placeholder="ابحث في فصول حصن المسلم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {filteredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx > 15 ? 0 : idx * 0.03 }}
              >
                <Link
                  href={`/athkar/${cat.id}`}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98] group"
                  dir="rtl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="text-slate-800 font-bold text-sm leading-relaxed">{cat.title}</h3>
                  </div>
                  <ChevronLeft size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-10 text-slate-500 font-bold">
              لم يتم العثور على ما يطابق بحثك.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
