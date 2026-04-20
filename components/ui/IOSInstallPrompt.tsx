"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, PlusSquare } from "lucide-react";

export function IOSInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // Default to true to prevent flicker, hide until checked

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem("iosInstallDismissed");
    if (dismissed === "true") {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    // iOS Safari exposes standalone mode via navigator.standalone (non-standard but supported by Apple)
    const isStandaloneMode = ('standalone' in window.navigator) && !!(window.navigator as any).standalone;

    setIsIOS(isIosDevice);
    setIsStandalone(isStandaloneMode);
    
    // Only show if it's an iOS device AND NOT in standalone mode
    if (isIosDevice && !isStandaloneMode) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("iosInstallDismissed", "true");
  };

  if (isDismissed || !isIOS || isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-24 left-0 right-0 z-50 px-4 pointer-events-none max-w-md mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-slate-100 pointer-events-auto shadow-emerald-500/10" dir="rtl">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 left-4 p-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col items-center text-center gap-3 mt-1">
            <h3 className="text-slate-800 font-bold text-sm">أضف التطبيق للشاشة الرئيسية</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[250px] mb-2 font-medium">
              لتجربة أسرع وبدون إنترنت، أضف أثر إلى هاتفك!
            </p>
            
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl w-full text-xs font-bold text-slate-600 justify-center">
              <span>اضغط على</span>
              <Share size={16} className="text-blue-500 mx-1" strokeWidth={2.5} />
              <span>ثم اختر</span>
              <PlusSquare size={16} className="text-slate-700 mx-1" />
              <span>إضافة</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
