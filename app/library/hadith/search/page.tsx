"use client";

import { useState } from "react";
import { searchDorar, type DorarHadith } from "@/app/actions/dorarSearch";
import { Search, ChevronRight, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HadithSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DorarHadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await searchDorar(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("صحيح")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (grade.includes("حسن")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (grade.includes("ضعيف") || grade.includes("موضوع") || grade.includes("باطل")) return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Link 
            href="/library" 
            className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex-1 line-clamp-1" dir="rtl">
            البحث في الأحاديث
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors hover:text-emerald-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin text-emerald-500" /> : <Search size={18} className="text-slate-400" />}
          </button>
          <input
            type="text"
            className="block w-full pr-10 pl-3 py-3.5 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-bold text-sm shadow-inner"
            placeholder="ابحث بكلمات من الحديث..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            dir="rtl"
          />
        </form>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 max-w-3xl mx-auto w-full">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center opacity-40 mt-20">
            <Search size={48} className="mb-4" />
            <p className="font-bold">ابحث في موسوعة الدرر السنية</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {results.map((hadith, idx) => (
                <motion.div 
                  key={hadith.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden relative"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-50" />

                  {/* Grading Tag */}
                  <div className="flex justify-between items-start mb-5" dir="rtl">
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border ${getGradeColor(hadith.grade)} shadow-sm`}>
                      {hadith.grade}
                    </span>
                  </div>
                  
                  {/* Matn / Text */}
                  <p className="font-arabic text-xl font-bold text-slate-800 leading-[2.2] text-justify mb-6" dir="rtl">
                    {hadith.text}
                  </p>

                  {/* Metadata Separator */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-5" />

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" dir="rtl">
                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-bold mb-0.5">الراوي</span>
                      <span className="text-slate-700 font-semibold">{hadith.narrator}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-bold mb-0.5">المحدث</span>
                      <span className="text-slate-700 font-semibold">{hadith.mohdith}</span>
                    </div>

                    <div className="flex flex-col gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                      <span className="text-slate-400 font-bold flex items-center gap-1.5 mb-0.5">
                        <BookOpen size={12} /> المصدر
                      </span>
                      <span className="text-slate-700 font-semibold leading-relaxed">
                        {hadith.source} <span className="text-slate-400 font-normal">({hadith.numberOrPage})</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {results.length === 0 && !loading && (
              <div className="text-center py-10">
                <span className="text-3xl mb-3 block">🧐</span>
                <p className="text-slate-500 font-bold">لم يتم العثور على أحاديث تطابق بحثك.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
