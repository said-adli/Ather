"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function QuranReaderError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for debugging (in production, send to error tracking)
    console.error("[QuranReader] Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href="/quran" 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pr-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Surah</h1>
        </div>
      </header>

      {/* Error Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-sm"
        >
          {/* Error icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mb-6"
          >
            <AlertCircle size={36} className="text-red-400" />
          </motion.div>

          {/* Error message */}
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 mb-2 leading-relaxed">
            We couldn&apos;t load this Surah. This might be a network issue —
            please check your connection and try again.
          </p>

          {/* Technical detail (collapsed) */}
          {error?.message && (
            <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-xl mb-8 font-mono max-w-full truncate border border-slate-100">
              {error.message}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              id="error-retry-button"
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <Link
              href="/quran"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors active:scale-[0.98]"
            >
              <ChevronLeft size={16} />
              Back to Surah List
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
