"use client";

import { useAppStore } from "@/lib/store/useAppStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Type, RotateCcw, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const userName = useAppStore((state) => state.userName);
  const quranFontSize = useAppStore((state) => state.quranFontSize);
  const khatmaProgress = useAppStore((state) => state.khatmaProgress);
  const readAyahs = useAppStore((state) => state.readAyahs);
  const getDailyProgress = useAppStore((state) => state.getDailyProgress);

  const setUserName = useAppStore((state) => state.setUserName);
  const setQuranFontSize = useAppStore((state) => state.setQuranFontSize);
  const resetAllProgress = useAppStore((state) => state.resetAllProgress);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
    setResetComplete(true);
    setTimeout(() => setResetComplete(false), 3000);
  };

  const dailyProgress = mounted ? getDailyProgress() : 0;

  return (
    <div className="flex flex-col min-h-full safe-area-inset-top bg-slate-50/50">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Profile</h1>
        <p className="text-slate-500 font-medium mt-1">Your settings &amp; preferences</p>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6">

        {/* ── User Info Card ────────────────────────────── */}
        <section className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
              <User size={22} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {mounted && userName ? userName : "Athar User"}
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Local Profile</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100/50">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Habits</span>
              <span className="text-lg font-black text-emerald-600">{dailyProgress}%</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100/50">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Khatma</span>
              <span className="text-lg font-black text-emerald-600">{mounted ? khatmaProgress : 0}%</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100/50">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Ayahs</span>
              <span className="text-lg font-black text-slate-700">{mounted ? readAyahs : 0}</span>
            </div>
          </div>
        </section>

        {/* ── Settings Card ────────────────────────────── */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="px-6 pt-5 pb-3">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">Settings</h2>
          </div>

          {/* Display Name */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <User size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Display Name</p>
                <p className="text-xs text-slate-400">Shown on the home screen</p>
              </div>
            </div>
            <input
              id="settings-user-name"
              type="text"
              value={mounted ? userName : ""}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-28 text-right text-sm font-medium text-slate-600 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0"
            />
          </div>

          {/* Quran Font Size */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Type size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Quran Font Size</p>
                <p className="text-xs text-slate-400">Adjust reader text</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="font-size-decrease"
                onClick={() => setQuranFontSize(Math.max(16, quranFontSize - 2))}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg hover:bg-slate-200 transition-colors active:scale-95"
              >
                −
              </button>
              <span className="text-sm font-black text-slate-700 w-8 text-center">
                {mounted ? quranFontSize : 24}
              </span>
              <button
                id="font-size-increase"
                onClick={() => setQuranFontSize(Math.min(48, quranFontSize + 2))}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg hover:bg-slate-200 transition-colors active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* ── About Card ───────────────────────────────── */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="px-6 pt-5 pb-3">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">About</h2>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Sparkles size={16} className="text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Athar</p>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">v0.1.0</span>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">All data is stored locally on your device. Nothing is sent to any server.</p>
          </div>
        </section>

        {/* ── Danger Zone ──────────────────────────────── */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-red-100/50">
          <div className="px-6 pt-5 pb-3">
            <h2 className="text-sm font-bold text-red-400 tracking-wider uppercase">Danger Zone</h2>
          </div>
          
          <div className="px-6 py-4">
            <button
              id="reset-all-progress"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-red-50/80 hover:bg-red-100/80 border border-red-100 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-red-500" />
                <div className="text-left">
                  <p className="text-sm font-bold text-red-700">Reset All Progress</p>
                  <p className="text-xs text-red-400">Clears Khatma, Habits, and all tracking data</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </div>
        </section>

        {/* Spacer for bottom nav */}
        <div className="h-8" />
      </div>

      {/* ── Reset Confirmation Modal ─────────────────── */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle size={28} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Reset All Progress?</h3>
                <p className="text-sm text-slate-500 max-w-[280px]">
                  This will permanently erase all your Khatma progress, habit history, and tracking data. This cannot be undone.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  id="confirm-reset"
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors active:scale-[0.98] shadow-lg shadow-red-500/20"
                >
                  Yes, Reset Everything
                </button>
                <button
                  id="cancel-reset"
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Toast ─────────────────────────────── */}
      <AnimatePresence>
        {resetComplete && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold"
          >
            ✓ Progress reset successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
