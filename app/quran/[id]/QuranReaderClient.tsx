"use client";

import { useHydrated } from "@/lib/hooks/useHydrated";

import { useAppStore, RECITERS, TAFSIR_OPTIONS } from "@/lib/store/useAppStore";
import { getChapterAudioUrl, type Verse } from "@/lib/api/quran";
import { AudioPlayer } from "@/components/features/AudioPlayer";
import { QuranVerseList } from "@/components/features/QuranVerseList";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Mic, BookOpen, ChevronDown } from "lucide-react";

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
}: QuranReaderClientProps) {
  const mounted = useHydrated();
  const [audio, setAudio] = useState({ key: "", url: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioAttempt, setAudioAttempt] = useState(0);

  const selectedReciterId = useAppStore((state) => state.selectedReciterId);
  const selectedTafsirId = useAppStore((state) => state.selectedTafsirId);
  const setSelectedReciterId = useAppStore((state) => state.setSelectedReciterId);
  const setSelectedTafsirId = useAppStore((state) => state.setSelectedTafsirId);


  const requestKey = `${selectedReciterId}/${chapterId}/${audioAttempt}`;
  const audioUrl = audio.key === requestKey ? audio.url : "";
  const audioLoading = mounted && audio.key !== requestKey;

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    getChapterAudioUrl(selectedReciterId, chapterId).then(url => {
      if (!cancelled) setAudio({ key: requestKey, url });

    });
    return () => { cancelled = true; };
  }, [mounted, selectedReciterId, chapterId, requestKey]);

  const reciter = RECITERS.find((r) => r.id === selectedReciterId) ?? RECITERS[0];

  return (
    <>
      {/* ── Settings Bar ─────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-10 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-900/5">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={14} className={`transition-transform duration-300 ${settingsOpen ? "rotate-90 text-emerald-600" : ""}`} />
            <span>إعدادات القراءة</span>
          </div>
          <motion.div
            initial={false}
            animate={{ rotate: settingsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-3">
                {/* Reciter Selector */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Mic size={14} className="text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 mb-1">القارئ</p>
                    <select
                      value={mounted ? selectedReciterId : 6}
                      onChange={(e) => setSelectedReciterId(Number(e.target.value))}
                      className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      dir="rtl"
                    >
                      {RECITERS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tafsir Selector */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={14} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 mb-1">التفسير</p>
                    <select
                      value={mounted ? selectedTafsirId : 16}
                      onChange={(e) => setSelectedTafsirId(Number(e.target.value))}
                      className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      dir="rtl"
                    >
                      {TAFSIR_OPTIONS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reader Content */}
      <QuranVerseList verses={verses} bismillahPre={bismillahPre} chapterId={chapterId} />

      {/* Interactive Floating Audio Player */}
      {mounted && (
        <AudioPlayer
          key={requestKey}
          audioUrl={audioUrl}
          onRetry={() => setAudioAttempt(value => value + 1)}
          surahName={chapterNameArabic}
          reciterName={reciter.nameAr}
          isLoading={audioLoading}
        />
      )}
    </>
  );
}
