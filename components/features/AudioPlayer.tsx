"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  audioUrl: string;
  surahName: string;
  reciterName: string;
}

export function AudioPlayer({ audioUrl, surahName, reciterName }: AudioPlayerProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gently hide the player on downward scroll, reveal on upward scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true); 
    } else {
      setHidden(false); 
    }
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Reset audio when URL changes (reciter change)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="none" />
      
      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-40 pointer-events-none"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-3 px-5 flex items-center justify-between pointer-events-auto" dir="rtl">
              
              <div className="flex flex-col ml-auto">
                <span className="text-white font-bold text-sm">{surahName}</span>
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {reciterName}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={restartAudio}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw size={18} strokeWidth={2.5} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={20} className="fill-slate-900" />
                  ) : (
                    <Play size={20} className="fill-slate-900 mr-1" />
                  )}
                </button>
              </div>

              {/* Progress visualizer at bottom inner edge */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-3xl overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 ease-linear"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
