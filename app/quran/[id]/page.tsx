import { getChapters, getChapterVerses, getChapterAudioUrl } from "@/lib/api/quran";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AudioPlayer } from "@/components/features/AudioPlayer";
import { QuranVerseList } from "@/components/features/QuranVerseList";
import { QuranReaderClient } from "./QuranReaderClient";

// Allow Next.js 15 to await the promised params
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuranReaderPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch required data in parallel
  const [chapters, verses] = await Promise.all([
    getChapters(),
    getChapterVerses(id)
  ]);
  
  const chapter = chapters.find(c => String(c.id) === id);

  if (!chapter || verses.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[#FDFBF7]">
        <p className="text-slate-500">لم يتم العثور على السورة.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href="/quran" 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pl-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">{chapter.name_arabic}</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest">
            {chapter.name_simple} • {chapter.revelation_place === "makkah" ? "مكية" : "مدنية"}
          </p>
        </div>
      </header>

      {/* Client-side wrapper for store-dependent audio + reader */}
      <QuranReaderClient
        verses={verses}
        bismillahPre={chapter.bismillah_pre}
        chapterId={id}
        chapterNameArabic={chapter.name_arabic}
        chapterNameSimple={chapter.name_simple}
      />
    </div>
  );
}
