import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { HABITS } from "@/lib/data/habits";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns today's date as 'YYYY-MM-DD' in the user's local timezone. */
function getLocalDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppState {
  // Khatma
  khatmaGoalDays: number | null;
  readAyahs: number;
  khatmaProgress: number;

  // Habits — keyed by local date string 'YYYY-MM-DD'
  completedHabits: Record<string, string[]>;

  // User settings
  userName: string;
  quranFontSize: number;

  // Actions — Khatma
  setKhatmaGoalDays: (days: number | null) => void;
  setReadAyahs: (ayahs: number) => void;
  setKhatmaProgress: (progress: number) => void;

  // Actions — Habits
  toggleHabit: (id: string) => void;
  getDailyProgress: () => number;
  getCompletedHabitIds: () => string[];

  // Actions — Settings
  setUserName: (name: string) => void;
  setQuranFontSize: (size: number) => void;

  // Actions — Reset
  resetAllProgress: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Khatma ──────────────────────────────────────────────────────────
      khatmaGoalDays: 30,
      readAyahs: 0,
      khatmaProgress: 0,

      // ── Habits (date-scoped) ────────────────────────────────────────────
      completedHabits: {},

      // ── User settings ──────────────────────────────────────────────────
      userName: "",
      quranFontSize: 24,

      // ── Khatma actions ─────────────────────────────────────────────────
      setKhatmaGoalDays: (days) => set({ khatmaGoalDays: days }),

      setReadAyahs: (ayahs) => {
        const progress = Math.min(100, Math.round((ayahs / 6236) * 100));
        set({ readAyahs: ayahs, khatmaProgress: progress });
      },

      setKhatmaProgress: (progress) => set({ khatmaProgress: progress }),

      // ── Habit actions (date-scoped) ────────────────────────────────────
      toggleHabit: (id) =>
        set((state) => {
          const dateKey = getLocalDateKey();
          const todayList = state.completedHabits[dateKey] ?? [];
          const isCompleted = todayList.includes(id);

          const updatedList = isCompleted
            ? todayList.filter((hId) => hId !== id)
            : [...todayList, id];

          return {
            completedHabits: {
              ...state.completedHabits,
              [dateKey]: updatedList,
            },
          };
        }),

      getCompletedHabitIds: () => {
        const state = get();
        const dateKey = getLocalDateKey();
        return state.completedHabits[dateKey] ?? [];
      },

      getDailyProgress: () => {
        const state = get();
        const dateKey = getLocalDateKey();
        const todayList = state.completedHabits[dateKey] ?? [];
        const dailyHabits = HABITS.filter((h) => h.isDaily);
        if (dailyHabits.length === 0) return 0;

        const completedDaily = dailyHabits.filter((h) =>
          todayList.includes(h.id),
        );
        return Math.round((completedDaily.length / dailyHabits.length) * 100);
      },

      // ── Settings actions ───────────────────────────────────────────────
      setUserName: (name) => set({ userName: name }),
      setQuranFontSize: (size) => set({ quranFontSize: size }),

      // ── Reset action ───────────────────────────────────────────────────
      resetAllProgress: () =>
        set({
          completedHabits: {},
          readAyahs: 0,
          khatmaProgress: 0,
          khatmaGoalDays: 30,
        }),
    }),
    {
      name: "athar-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;

        if (version === 0 || !version) {
          // ── Migration from v0 → v1 ──────────────────────────────────
          // Old schema had `completedHabitIds: string[]`
          // New schema uses  `completedHabits: Record<string, string[]>`
          if (Array.isArray(state.completedHabitIds)) {
            const dateKey = getLocalDateKey();
            state.completedHabits = { [dateKey]: state.completedHabitIds };
            delete state.completedHabitIds;
          }

          // Ensure new fields exist
          if (state.userName === undefined) state.userName = "";
          if (state.quranFontSize === undefined) state.quranFontSize = 24;
        }

        return state as AppState;
      },
      // Only persist data properties, not action functions
      partialize: (state) => ({
        khatmaGoalDays: state.khatmaGoalDays,
        readAyahs: state.readAyahs,
        khatmaProgress: state.khatmaProgress,
        completedHabits: state.completedHabits,
        userName: state.userName,
        quranFontSize: state.quranFontSize,
      }),
    },
  ),
);
