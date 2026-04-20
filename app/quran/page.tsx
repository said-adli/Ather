"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getChapters, type Chapter } from "@/lib/api/quran";
import { motion } from "framer-motion";

export default function QuranIndexPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      const data = await getChapters();
      setChapters(data);
      setIsLoading(false);
    };
    fetchChapters();
  }, []);

  const filteredChapters = chapters.filter((chapter) =>
    chapter.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.name_arabic.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      
      <div className="px-6 pt-10 pb-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10 shadow-sm safe-area-inset-top">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">القرآن الكريم</h1>
        
        {/* Sticky Search Bar */}
        <div className="mt-5 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pr-10 pl-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all sm:text-sm shadow-inner"
            placeholder="ابحث عن سورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
          />
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-3 pb-24">
            {filteredChapters.map((chapter, index) => (
              <motion.div 
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 > 0.4 ? 0 : index * 0.02 }}
              >
                <Link 
                  href={`/quran/${chapter.id}`}
                  className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-600">{chapter.id}</span>
                  </div>
                  
                  <div className="mr-4 flex-1">
                    <h3 className="text-slate-800 font-semibold">{chapter.name_simple}</h3>
                    <p className="text-slate-500 text-xs font-medium tracking-wider mt-0.5">
                      {chapter.translated_name.name} • {chapter.verses_count} آية
                    </p>
                  </div>

                  <div className="mr-4 text-left">
                    <span className="font-arabic text-xl text-emerald-800 font-bold">{chapter.name_arabic}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {filteredChapters.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                لم يتم العثور على سورة تطابق &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
