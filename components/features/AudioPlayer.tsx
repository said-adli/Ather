"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  audioUrl: string;
  surahName: string;
  reciterName: string;
  isLoading?: boolean;
}

export function AudioPlayer({ audioUrl, surahName, reciterName, isLoading: urlLoading }: AudioPlayerProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
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
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setAudioReady(true);
      setAudioError(false);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Reset audio when URL changes (reciter change)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      setAudioError(false);
      setAudioReady(false);
    }
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !audioUrl || audioError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Play failed:", err);
        setAudioError(true);
      });
    }
  }, [isPlaying, audioUrl, audioError]);

  const restartAudio = useCallback(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [isPlaying, audioUrl]);

  // Background Audio & Lock Screen Controls
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surahName,
        artist: reciterName,
        album: "أثر - Athar PWA",
        artwork: [
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      });

      // Tie native lock-screen actions to our player state
      navigator.mediaSession.setActionHandler("play", () => {
        if (audioRef.current && !isPlaying) {
           audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (audioRef.current && isPlaying) {
           audioRef.current.pause();
           setIsPlaying(false);
        }
      });
    }

    // Cleanup
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      }
    };
  }, [surahName, reciterName, isPlaying]);

  const showLoading = urlLoading || (!audioReady && !audioError && audioUrl !== "");
  const isDisabled = !audioUrl || audioError;

  return (
    <>
      <audio ref={audioRef} preload="none" />
      
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
                  {audioError ? (
                    <>
                      <AlertCircle size={10} className="text-red-400" />
                      <span className="text-red-400">خطأ في التشغيل</span>
                    </>
                  ) : (
                    <>
                      <span className={`flex h-1.5 w-1.5 rounded-full ${showLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                      {reciterName}
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={restartAudio}
                  className="text-slate-300 hover:text-white transition-colors disabled:opacity-30"
                  disabled={isDisabled}
                >
                  <RotateCcw size={18} strokeWidth={2.5} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  disabled={isDisabled && !showLoading}
                >
                  {showLoading ? (
                    <Loader2 size={20} className="animate-spin text-slate-500" />
                  ) : isPlaying ? (
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
