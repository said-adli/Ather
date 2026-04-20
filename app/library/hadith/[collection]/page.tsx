import { getCollectionInfo, COLLECTIONS } from "@/lib/api/hadith";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import fs from "fs";
import path from "path";

// Load the auto-translation dictionary statically on the server.
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
  params: Promise<{ collection: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  
  const info = await getCollectionInfo(collection);
  const meta = COLLECTIONS.find(c => c.id === collection);

  if (!info || !meta) {
    return (
      <div className="flex flex-col h-screen bg-[#FDFBF7] text-slate-800">
        <header className="px-4 py-6 border-b border-slate-100 flex items-center">
          <Link href="/library" className="p-2 -mr-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={24} />
          </Link>
          <span className="flex-1 text-center font-bold">خطأ في التحميل</span>
        </header>
      </div>
    );
  }

  // Safely filter out the zero-index or empty section
  const sectionIds = Object.keys(info.metadata.sections).filter(id => 
    (Number(id) > 0 || String(id) !== "0") && info.metadata.sections[id].trim() !== ""
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-slate-800 selection:bg-emerald-100">
      <header className="sticky top-0 z-30 px-4 pt-10 pb-4 bg-[#FDFBF7]/95 border-b border-slate-100 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href="/library" 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors active:bg-slate-200 text-slate-500 hover:text-slate-700"
        >
          <ChevronRight size={26} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pr-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight font-arabic leading-relaxed">{meta.nameAr}</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
            {meta.nameEn}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 pb-24 max-w-2xl mx-auto w-full">
        {/* Global Search CTA */}
        <Link 
          href="/library/hadith/search" 
          className="relative overflow-hidden group flex items-center justify-between p-5 mb-8 bg-white rounded-[24px] border border-emerald-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-emerald-50/50 group-hover:bg-emerald-50 transition-colors" />
          
          <Search size={24} className="text-emerald-500 relative z-10" />
          <div className="flex-1 text-right mr-5 relative z-10">
            <h2 className="text-[15px] font-bold text-emerald-800 font-arabic" dir="rtl">البحث في الموسوعة الحديثية</h2>
            <p className="text-[11px] text-emerald-600/70 font-bold mt-1.5 leading-relaxed">آلاف الأحاديث بين يديك بخاصية البحث السريع (الدرر السنية)</p>
          </div>
        </Link>
        
        <h2 className="text-right text-sm font-bold text-slate-500 mb-5 tracking-wide font-arabic flex items-center justify-end gap-2" dir="rtl">
          فهرس الكتب <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-400">{sectionIds.length} فصول</span>
        </h2>

        <div className="space-y-4">
          {sectionIds.map((sectionId) => {
            const rawEngName = info.metadata.sections[sectionId];
            if (!rawEngName) return null;
            
            const translatedName = hadithDict[rawEngName.trim()] || rawEngName;
            
            // Safely fetch details to fix the "Missing Hadith" illusion
            const details = info.metadata.section_details?.[sectionId];
            const count = details ? (details.hadithnumber_last - details.hadithnumber_first + 1) : 0;
            
            return (
              <Link
                key={sectionId}
                href={`/library/hadith/${collection}/${sectionId}`}
                className="group flex flex-col p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md transition-all active:scale-[0.98]"
                dir="rtl"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      كتاب {sectionId}
                    </span>
                    {count > 0 && (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-opacity">
                        {count.toLocaleString("ar-EG")} أحاديث
                      </span>
                    )}
                  </div>
                  <ChevronLeft size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors translate-x-1 group-hover:translate-x-0" />
                </div>
                
                <h3 className="text-slate-800 font-bold text-[17px] leading-relaxed text-right font-arabic group-hover:text-emerald-700 transition-colors">
                  {translatedName}
                </h3>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
