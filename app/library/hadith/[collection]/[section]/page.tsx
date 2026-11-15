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
      <div className="flex flex-col h-screen bg-[#FDFBF7] text-slate-800">
        <header className="px-4 py-6 border-b border-slate-100 flex items-center">
          <Link href={`/library/hadith/${collection}`} className="p-2 -mr-2 rounded-full hover:bg-slate-100">
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
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-slate-800 selection:bg-emerald-100">
      <header className="sticky top-0 z-30 px-4 pt-10 pb-4 bg-[#FDFBF7]/95 border-b border-slate-100 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href={`/library/hadith/${collection}`} 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors active:bg-slate-200 text-slate-500 hover:text-slate-700"
        >
          <ChevronRight size={26} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pl-6 pr-2">
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight line-clamp-1 font-arabic" dir="rtl">{sectionName}</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1 uppercase">
            كتاب {section} • {meta.nameAr}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 pb-24 max-w-3xl mx-auto w-full">
        <p className="mb-5 text-xs leading-7 text-slate-500">المصدر الرقمي: Hadith API، النسخة العربية. النص والتخريج كما وردا في المصدر؛ تُعرض أحكام المحدثين بأسمائهم عند توفرها، دون استنتاج حكم آلي.</p>
        <div className="space-y-6">
          {data.hadiths.map((hadith) => {

            return (
              <div key={hadith.hadithnumber} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 transition-colors">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4" dir="rtl">
                  <span className="flex items-center justify-center min-w-[2.5rem] px-3 h-8 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold font-sans">
                    {hadith.hadithnumber}
                  </span>
                  
                  <span className="text-xs text-slate-500">{meta.nameAr}</span>
                </div>
                
                <div className="space-y-4 text-justify" dir="rtl">
                  <p className="font-arabic text-[23px] font-bold text-slate-900 leading-[2.4] tracking-wide">
                    {hadith.text}
                  </p>
                </div>

                {(!hadith.grades || hadith.grades.length === 0) && <p className="mt-4 text-xs text-slate-500">لا يتوفر حكم مفصل في هذه النسخة.</p>}
                {/* Scholar grades are quoted verbatim with attribution. */}
                {hadith.grades && hadith.grades.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap gap-2" dir="rtl">
                    {hadith.grades.map((g, idx) => (
                      <div key={idx} className="bg-slate-50 text-slate-500 text-[10px] px-3 py-1.5 rounded-lg font-medium border border-slate-100">
                        {g.name}: <span className="font-bold text-slate-700 ml-1">{g.grade}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
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
