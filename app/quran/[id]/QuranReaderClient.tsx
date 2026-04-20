"use client";

import { useAppStore, RECITERS } from "@/lib/store/useAppStore";
import { getChapterAudioUrl, type Verse } from "@/lib/api/quran";
import { AudioPlayer } from "@/components/features/AudioPlayer";
import { QuranVerseList } from "@/components/features/QuranVerseList";
import { useState, useEffect } from "react";

interface QuranReaderClientProps {
  verses: Verse[];
  bismillahPre: boolean;
  chapterId: string;
  chapterNameArabic: string;
  chapterNameSimple: string;
}

export function QuranReaderClient({
  verses,
  bismillahPre,
  chapterId,
  chapterNameArabic,
  chapterNameSimple,
}: QuranReaderClientProps) {
  const [mounted, setMounted] = useState(false);
  const selectedReciterId = useAppStore((state) => state.selectedReciterId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reciter = RECITERS.find((r) => r.id === selectedReciterId) ?? RECITERS[0];
  const audioUrl = getChapterAudioUrl(reciter.subfolder, chapterId);

  return (
    <>
      {/* Reader Content */}
      <QuranVerseList verses={verses} bismillahPre={bismillahPre} chapterId={chapterId} />

      {/* Interactive Floating Audio Player */}
      {mounted && (
        <AudioPlayer
          audioUrl={audioUrl}
          surahName={chapterNameArabic}
          reciterName={reciter.nameAr}
        />
      )}
    </>
  );
}
