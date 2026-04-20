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
// Reciter catalogue — official Quran.com API v4 numeric IDs
// Endpoint: https://api.quran.com/api/v4/resources/recitations
// ---------------------------------------------------------------------------

export interface Reciter {
  id: number;       // Quran.com API reciter ID
  nameAr: string;
  nameEn: string;
}

export const RECITERS: Reciter[] = [
  { id: 6,  nameAr: "محمود خليل الحصري",            nameEn: "Al-Husary" },
  { id: 7,  nameAr: "مشاري راشد العفاسي",            nameEn: "Mishari Alafasy" },
  { id: 3,  nameAr: "عبدالرحمن السديس",              nameEn: "As-Sudais" },
  { id: 9,  nameAr: "محمد صديق المنشاوي (مرتّل)",     nameEn: "Al-Minshawi (Murattal)" },
  { id: 2,  nameAr: "عبدالباسط عبدالصمد (مرتّل)",     nameEn: "Abdul Basit (Murattal)" },
  { id: 1,  nameAr: "عبدالباسط عبدالصمد (مجوّد)",     nameEn: "Abdul Basit (Mujawwad)" },
  { id: 10, nameAr: "سعود الشريم",                   nameEn: "Ash-Shuraym" },
  { id: 4,  nameAr: "أبو بكر الشاطري",               nameEn: "Abu Bakr al-Shatri" },
  { id: 5,  nameAr: "هاني الرفاعي",                  nameEn: "Hani ar-Rifai" },
  { id: 11, nameAr: "محمد الطبلاوي",                  nameEn: "Al-Tablawi" },
  { id: 12, nameAr: "الحصري (معلّم)",                 nameEn: "Al-Husary (Muallim)" },
  { id: 8,  nameAr: "المنشاوي (مجوّد)",               nameEn: "Al-Minshawi (Mujawwad)" },
];

// ---------------------------------------------------------------------------
// Available Tafsirs — official Quran.com API v4 IDs
// Endpoint: https://api.quran.com/api/v4/resources/tafsirs
// ---------------------------------------------------------------------------

export interface TafsirOption {
  id: number;
  nameAr: string;
  nameEn: string;
  language: string;
}

export const TAFSIR_OPTIONS: TafsirOption[] = [
  { id: 16,  nameAr: "التفسير الميسر",               nameEn: "Tafsir Muyassar",           language: "ar" },
  { id: 14,  nameAr: "تفسير ابن كثير",               nameEn: "Tafsir Ibn Kathir",         language: "ar" },
  { id: 91,  nameAr: "تفسير السعدي",                 nameEn: "Tafsir As-Sa'di",           language: "ar" },
  { id: 15,  nameAr: "تفسير الطبري",                 nameEn: "Tafsir al-Tabari",          language: "ar" },
  { id: 90,  nameAr: "تفسير القرطبي",                nameEn: "Al-Qurtubi",                language: "ar" },
  { id: 93,  nameAr: "التفسير الوسيط (طنطاوي)",       nameEn: "Al-Wasit (Tantawi)",        language: "ar" },
  { id: 94,  nameAr: "تفسير البغوي",                 nameEn: "Tafsir Al-Baghawi",         language: "ar" },
  { id: 157, nameAr: "في ظلال القرآن",               nameEn: "Fi Zilal al-Quran",         language: "ar" },
  { id: 169, nameAr: "ابن كثير (مختصر إنجليزي)",      nameEn: "Ibn Kathir (Abridged EN)",  language: "en" },
  { id: 168, nameAr: "معارف القرآن (إنجليزي)",        nameEn: "Ma'arif al-Qur'an (EN)",    language: "en" },
];

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

  // Tafsir & Reciter preferences
  selectedTafsirId: number;
  selectedReciterId: number;

  // Actions — Khatma
  setKhatmaGoalDays: (days: number | null) => void;
  setReadAyahs: (ayahs: number) => void;
  addReadAyahs: (count: number) => void;
  setKhatmaProgress: (progress: number) => void;

  // Actions — Habits
  toggleHabit: (id: string) => void;
  markHabitComplete: (id: string) => void;
  getDailyProgress: () => number;
  getCompletedHabitIds: () => string[];

  // Actions — Settings
  setUserName: (name: string) => void;
  setQuranFontSize: (size: number) => void;
  setSelectedTafsirId: (id: number) => void;
  setSelectedReciterId: (id: number) => void;

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

      // ── Tafsir & Reciter preferences ─────────────────────────────────
      selectedTafsirId: 16,  // Tafsir Muyassar (Arabic)
      selectedReciterId: 6,  // Al-Husary

      // ── Khatma actions ─────────────────────────────────────────────────
      setKhatmaGoalDays: (days) => set({ khatmaGoalDays: days }),

      setReadAyahs: (ayahs) => {
        const progress = Math.min(100, Math.round((ayahs / 6236) * 100));
        set({ readAyahs: ayahs, khatmaProgress: progress });
      },

      addReadAyahs: (count) => {
        const state = get();
        const newTotal = Math.min(6236, state.readAyahs + count);
        const progress = Math.min(100, Math.round((newTotal / 6236) * 100));
        set({ readAyahs: newTotal, khatmaProgress: progress });
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

      /** Marks a habit as complete without toggling — used by Athkar auto-complete */
      markHabitComplete: (id) =>
        set((state) => {
          const dateKey = getLocalDateKey();
          const todayList = state.completedHabits[dateKey] ?? [];
          if (todayList.includes(id)) return state; // already done

          return {
            completedHabits: {
              ...state.completedHabits,
              [dateKey]: [...todayList, id],
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
      setSelectedTafsirId: (id) => set({ selectedTafsirId: id }),
      setSelectedReciterId: (id) => set({ selectedReciterId: id }),

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
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;

        if (version < 1) {
          // ── Migration from v0 → v1 ──────────────────────────────────
          if (Array.isArray(state.completedHabitIds)) {
            const dateKey = getLocalDateKey();
            state.completedHabits = { [dateKey]: state.completedHabitIds };
            delete state.completedHabitIds;
          }
          if (state.userName === undefined) state.userName = "";
          if (state.quranFontSize === undefined) state.quranFontSize = 24;
        }

        if (version < 2) {
          // ── Migration from v1 → v2 ──────────────────────────────────
          if (state.selectedTafsirId === undefined) state.selectedTafsirId = 16;
          if (state.selectedReciterId === undefined) state.selectedReciterId = "husary";
        }

        if (version < 3) {
          // ── Migration from v2 → v3 ──────────────────────────────────
          // selectedReciterId changed from string to numeric API ID
          const OLD_TO_NEW: Record<string, number> = {
            husary: 6, mishary: 7, sudais: 3, minshawi: 9, basit: 2,
          };
          const old = state.selectedReciterId;
          if (typeof old === "string") {
            state.selectedReciterId = OLD_TO_NEW[old] ?? 6;
          }
        }

        return state as unknown as AppState;
      },
      // Only persist data properties, not action functions
      partialize: (state) => ({
        khatmaGoalDays: state.khatmaGoalDays,
        readAyahs: state.readAyahs,
        khatmaProgress: state.khatmaProgress,
        completedHabits: state.completedHabits,
        userName: state.userName,
        quranFontSize: state.quranFontSize,
        selectedTafsirId: state.selectedTafsirId,
        selectedReciterId: state.selectedReciterId,
      }),
    },
  ),
);
