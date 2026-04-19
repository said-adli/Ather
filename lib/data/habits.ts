export type HabitCategory = 'Daily Prayers' | 'Sunnah & Nawafil' | 'Azkar' | 'Weekly/Occasional';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  isDaily: boolean; // used to calculate daily progress percentage
}

export const HABITS: Habit[] = [
  { id: 'fajr', title: 'Fajr', category: 'Daily Prayers', isDaily: true },
  { id: 'dhuhr', title: 'Dhuhr', category: 'Daily Prayers', isDaily: true },
  { id: 'asr', title: 'Asr', category: 'Daily Prayers', isDaily: true },
  { id: 'maghrib', title: 'Maghrib', category: 'Daily Prayers', isDaily: true },
  { id: 'isha', title: 'Isha', category: 'Daily Prayers', isDaily: true },
  
  { id: 'witr', title: 'Witr', category: 'Sunnah & Nawafil', isDaily: true },
  { id: 'duha', title: 'Duha', category: 'Sunnah & Nawafil', isDaily: true },
  
  { id: 'morning_azkar', title: 'Morning Azkar', category: 'Azkar', isDaily: true },
  { id: 'evening_azkar', title: 'Evening Azkar', category: 'Azkar', isDaily: true },
  
  { id: 'fasting_mon_thu', title: 'Monday/Thursday Fasting', category: 'Weekly/Occasional', isDaily: false },
  { id: 'kahf_friday', title: 'Surat Al-Kahf (Friday)', category: 'Weekly/Occasional', isDaily: false },
];
