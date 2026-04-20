export type HabitCategory = 'الصلوات' | 'السنن والنوافل' | 'الأذكار' | 'أسبوعية';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  isDaily: boolean; // used to calculate daily progress percentage
}

export const HABITS: Habit[] = [
  { id: 'fajr', title: 'صلاة الفجر', category: 'الصلوات', isDaily: true },
  { id: 'dhuhr', title: 'صلاة الظهر', category: 'الصلوات', isDaily: true },
  { id: 'asr', title: 'صلاة العصر', category: 'الصلوات', isDaily: true },
  { id: 'maghrib', title: 'صلاة المغرب', category: 'الصلوات', isDaily: true },
  { id: 'isha', title: 'صلاة العشاء', category: 'الصلوات', isDaily: true },
  
  { id: 'witr', title: 'صلاة الوتر', category: 'السنن والنوافل', isDaily: true },
  { id: 'duha', title: 'صلاة الضحى', category: 'السنن والنوافل', isDaily: true },
  
  { id: 'morning_azkar', title: 'أذكار الصباح', category: 'الأذكار', isDaily: true },
  { id: 'evening_azkar', title: 'أذكار المساء', category: 'الأذكار', isDaily: true },
  
  { id: 'fasting_mon_thu', title: 'صيام الإثنين/الخميس', category: 'أسبوعية', isDaily: false },
  { id: 'kahf_friday', title: 'سورة الكهف (الجمعة)', category: 'أسبوعية', isDaily: false },
];
