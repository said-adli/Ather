"use client";

import { useAppStore, RECITERS } from "@/lib/store/useAppStore";
import { Verse, getTafsir } from "@/lib/api/quran";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Check, ChevronDown } from "lucide-react";

interface QuranVerseListProps {
  verses: Verse[];
  bismillahPre: boolean;
  chapterId: string;
}

export function QuranVerseList({ verses, bismillahPre, chapterId }: QuranVerseListProps) {
  const [mounted, setMounted] = useState(false);
  const [markedRead, setMarkedRead] = useState(false);
  const [expandedVerse, setExpandedVerse] = useState<string | null>(null);
  const [tafsirCache, setTafsirCache] = useState<Record<string, string>>({});
  const [loadingTafsir, setLoadingTafsir] = useState<string | null>(null);
  
  const quranFontSize = useAppStore((state) => state.quranFontSize);
  const selectedTafsirId = useAppStore((state) => state.selectedTafsirId);
  const addReadAyahs = useAppStore((state) => state.addReadAyahs);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to 24px if not mounted to prevent layout shift
  const fontSize = mounted ? quranFontSize : 24;

  const handleMarkRead = useCallback(() => {
    addReadAyahs(verses.length);
    setMarkedRead(true);
    setTimeout(() => setMarkedRead(false), 2500);
  }, [addReadAyahs, verses.length]);

  const handleTafsirToggle = useCallback(async (verseKey: string) => {
    if (expandedVerse === verseKey) {
      setExpandedVerse(null);
      return;
    }

    setExpandedVerse(verseKey);

    // If we already cached this tafsir, no need to fetch
    const cacheKey = `${selectedTafsirId}:${verseKey}`;
    if (tafsirCache[cacheKey]) return;

    setLoadingTafsir(verseKey);
    const text = await getTafsir(selectedTafsirId, verseKey);
    setTafsirCache((prev) => ({ ...prev, [cacheKey]: text }));
    setLoadingTafsir(null);
  }, [expandedVerse, selectedTafsirId, tafsirCache]);

  return (
    <>
      <main className="flex-1 px-5 py-10 pb-40 max-w-3xl mx-auto w-full">
        {bismillahPre && (
          <div className="text-center mb-12">
            <h2 
              className="font-arabic text-slate-800/90 leading-loose transition-all duration-300"
              style={{ fontSize: `${Math.max(20, fontSize - 4)}px` }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
          </div>
        )}

        <div className="flex flex-col gap-8">
          {verses.map((verse) => {
            const isExpanded = expandedVerse === verse.verse_key;
            const cacheKey = `${selectedTafsirId}:${verse.verse_key}`;
            const cachedTafsir = tafsirCache[cacheKey];
            const isLoading = loadingTafsir === verse.verse_key;

            return (
              <div key={verse.id} className="relative group">
                <div 
                  className="font-arabic text-slate-800 leading-[2.5] transition-all duration-300" 
                  dir="rtl"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {verse.text_uthmani}
                  <span className="inline-flex items-center justify-center w-auto min-w-[2.25rem] h-9 px-2 mx-2 text-sm text-emerald-700/80 bg-amber-500/10 border border-emerald-900/10 rounded-full font-sans font-medium align-middle">
                    {verse.verse_key.split(':')[1]}
                  </span>
                </div>

                {/* Tafsir toggle button */}
                <button
                  onClick={() => handleTafsirToggle(verse.verse_key)}
                  className={`mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    isExpanded
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  <BookOpen size={13} />
                  التفسير
                  <motion.div
                    initial={false}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={13} />
                  </motion.div>
                </button>

                {/* Expandable Tafsir Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                          </div>
                        ) : (
                          <p className="font-arabic text-sm text-slate-700 leading-[2.2]" dir="rtl">
                            {cachedTafsir || "..."}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Mark as Read Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          {markedRead ? (
            <motion.div
              key="done"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold text-center pointer-events-auto"
            >
              <Check size={16} className="inline ml-2" />
              تم تسجيل {verses.length} آية في تقدم الختمة ✓
            </motion.div>
          ) : (
            <motion.button
              key="button"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={handleMarkRead}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-colors active:scale-[0.98] pointer-events-auto text-sm"
            >
              تم القراءة — تسجيل {verses.length} آية
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
