import { getHadithSection, COLLECTIONS } from "@/lib/api/hadith";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import fs from "fs";
import path from "path";

// Load the auto-translation dictionary statically
const dictPath = path.join(process.cwd(), "lib/data/hadith-dict.json");
let hadithDict: Record<string, string> = {};
try {
  if (fs.existsSync(dictPath)) {
    hadithDict = JSON.parse(fs.readFileSync(dictPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load hadith-dict.json", e);
}

interface PageProps {
  params: Promise<{ collection: string; section: string }>;
}

export default async function HadithSectionPage({ params }: PageProps) {
  const { collection, section } = await params;
  
  const data = await getHadithSection(collection, section);
  const meta = COLLECTIONS.find(c => c.id === collection);

  if (!data || !meta) {
    return (
      <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
        <header className="px-4 py-6 border-b border-white/10 flex items-center">
          <Link href={`/library/hadith/${collection}`} className="p-2 -mr-2 rounded-full hover:bg-white/10">
            <ChevronRight size={24} />
          </Link>
          <span className="flex-1 text-center font-bold">خطأ في تحميل الأحاديث</span>
        </header>
      </div>
    );
  }

  const rawSectionName = data.metadata.section[section];
  const sectionName = hadithDict[rawSectionName?.trim()] || rawSectionName || `كتاب ${section}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      <header className="sticky top-0 z-30 px-4 pt-10 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-900/30 safe-area-inset-top flex items-center shadow-lg shadow-black/50">
        <Link 
          href={`/library/hadith/${collection}`} 
          className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors active:bg-white/20 text-slate-400 hover:text-emerald-400"
        >
          <ChevronRight size={26} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pl-6 pr-2">
          <h1 className="text-[17px] font-bold text-white tracking-tight line-clamp-1 font-arabic" dir="rtl">{sectionName}</h1>
          <p className="text-[10px] font-bold text-emerald-400/80 tracking-widest mt-1 uppercase">
            كتاب {section} • {meta.nameAr}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 pb-24 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {data.hadiths.map((hadith) => (
            <div key={hadith.hadithnumber} className="bg-slate-900/50 backdrop-blur-sm rounded-[24px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.3)] border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4" dir="rtl">
                <span className="flex items-center justify-center min-w-[2.5rem] px-3 h-8 rounded-full bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 text-xs font-bold font-sans">
                  {hadith.hadithnumber}
                </span>
                
                <div className="flex gap-2">
                  {hadith.grades && hadith.grades.some(g => g.grade.toLowerCase().includes("sahih")) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-lg shadow-sm shadow-emerald-900/20">
                      صحيح
                    </span>
                  )}
                  {hadith.grades && hadith.grades.some(g => g.grade.toLowerCase().includes("hasan")) && (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-900/50 px-3 py-1.5 rounded-lg shadow-sm shadow-blue-900/20">
                      حسن
                    </span>
                  )}
                  {hadith.grades && hadith.grades.some(g => g.grade.toLowerCase().includes("da'if") || g.grade.toLowerCase().includes("weak")) && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-900/50 px-3 py-1.5 rounded-lg shadow-sm shadow-red-900/20">
                      ضعيف
                    </span>
                  )}
                </div>
              </div>
              
              <p className="font-arabic text-[22px] text-slate-100 leading-[2.4] text-justify tracking-wide" dir="rtl">
                {hadith.text}
              </p>

              {/* Scholar Grades Display if available */}
              {hadith.grades && hadith.grades.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-2" dir="rtl">
                  {hadith.grades.map((g, idx) => (
                    <div key={idx} className="bg-slate-800/50 text-slate-400 text-[10px] px-3 py-1.5 rounded-lg font-medium border border-slate-800">
                      {g.name}: <span className="font-bold text-slate-200 ml-1">{g.grade}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {data.hadiths.length === 0 && (
            <div className="text-center py-10 text-slate-500 font-bold">
              لا توجد أحاديث في هذا القسم.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
