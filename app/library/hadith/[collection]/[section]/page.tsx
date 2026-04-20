import { getHadithSection, COLLECTIONS } from "@/lib/api/hadith";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ collection: string; section: string }>;
}

export default async function HadithSectionPage({ params }: PageProps) {
  const { collection, section } = await params;
  
  const data = await getHadithSection(collection, section);
  const meta = COLLECTIONS.find(c => c.id === collection);

  if (!data || !meta) {
    return (
      <div className="flex flex-col h-screen bg-[#FDFBF7]">
        <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
          <Link 
            href={`/library/hadith/${collection}`} 
            className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 font-bold">حدث خطأ أثناء تحميل الأحاديث.</p>
        </div>
      </div>
    );
  }

  const sectionName = data.metadata.section[section];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href={`/library/hadith/${collection}`} 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pl-6 pr-2">
          <h1 className="text-sm font-bold text-slate-800 tracking-tight line-clamp-1" dir="rtl">{sectionName}</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">
            كتاب {section} • {meta.nameAr}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {data.hadiths.map((hadith) => (
            <div key={hadith.hadithnumber} className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100">
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3" dir="rtl">
                <span className="flex items-center justify-center min-w-[2rem] px-2 h-8 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-sans">
                  {hadith.hadithnumber}
                </span>
                {/* Find a prominent grade if any, else omit the tag */}
                {hadith.grades && hadith.grades.some(g => g.grade.includes("Sahih")) && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-md">
                    صحيح
                  </span>
                )}
              </div>
              
              <p className="font-arabic text-lg text-slate-800 leading-[2.2] text-justify" dir="rtl">
                {hadith.text}
              </p>

              {/* Grades Display if available */}
              {hadith.grades && hadith.grades.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2" dir="rtl">
                  {hadith.grades.map((g, idx) => (
                    <div key={idx} className="bg-slate-50 text-slate-500 text-[10px] px-2.5 py-1.5 rounded-md font-medium">
                      {g.name}: <span className="font-bold text-slate-700 ml-1">{g.grade}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {data.hadiths.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              لا توجد أحاديث في هذا القسم.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
