"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function QuranError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Quran reader error:", error);
  }, [error]);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#FDFBF7] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h2>
      <p className="text-sm text-slate-500 max-w-[300px] mb-6 leading-relaxed">
        لم نتمكن من تحميل السورة. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-colors active:scale-[0.98]"
      >
        <RotateCcw size={16} />
        إعادة المحاولة
      </button>
    </div>
  );
}
