"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { Verse } from "@/lib/api/quran";
import { useEffect, useState } from "react";

interface QuranVerseListProps {
  verses: Verse[];
  bismillahPre: boolean;
}

export function QuranVerseList({ verses, bismillahPre }: QuranVerseListProps) {
  const [mounted, setMounted] = useState(false);
  const quranFontSize = useAppStore((state) => state.quranFontSize);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to 24px if not mounted to prevent layout shift
  const fontSize = mounted ? quranFontSize : 24;

  return (
    <main className="flex-1 px-5 py-10 pb-32 max-w-3xl mx-auto w-full">
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

      <div className="flex flex-col gap-10">
        {verses.map((verse) => (
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
          </div>
        ))}
      </div>
    </main>
  );
}
