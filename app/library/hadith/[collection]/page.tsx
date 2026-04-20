import { getCollectionInfo, COLLECTIONS } from "@/lib/api/hadith";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Search, Quote } from "lucide-react";
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
      <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
        <header className="px-4 py-6 border-b border-white/10 flex items-center">
          <Link href="/library" className="p-2 -mr-2 rounded-full hover:bg-white/10">
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      <header className="sticky top-0 z-30 px-4 pt-10 pb-4 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-900/30 safe-area-inset-top flex items-center shadow-lg shadow-black/50">
        <Link 
          href="/library" 
          className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors active:bg-white/20 text-slate-400 hover:text-emerald-400"
        >
          <ChevronRight size={26} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pr-4">
          <h1 className="text-xl font-bold text-white tracking-tight font-arabic leading-relaxed">{meta.nameAr}</h1>
          <p className="text-[10px] font-bold text-emerald-400/80 tracking-widest uppercase">
            {meta.nameEn}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 pb-24 max-w-2xl mx-auto w-full">
        {/* Global Search CTA */}
        <Link 
          href="/library/hadith/search" 
          className="relative overflow-hidden group flex items-center justify-between p-5 mb-8 bg-gradient-to-l from-slate-900 to-slate-800 rounded-[24px] border border-emerald-800/30 shadow-[0_4px_24px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all transform active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <Search size={24} className="text-emerald-400 relative z-10" />
          <div className="flex-1 text-right mr-5 relative z-10">
            <h2 className="text-[15px] font-bold text-emerald-50 font-arabic" dir="rtl">البحث في الموسوعة الحديثية</h2>
            <p className="text-[11px] text-emerald-400/70 font-medium mt-1 leading-relaxed">آلاف الأحاديث بين يديك بخاصية البحث السريع (الدرر السنية)</p>
          </div>
        </Link>
        
        <h2 className="text-right text-sm font-bold text-slate-400 mb-5 tracking-wide font-arabic flex items-center justify-end gap-2" dir="rtl">
          فهرس الكتب <span className="opacity-50 text-xs">({sectionIds.length} فصول)</span>
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
                className="group flex flex-col p-5 bg-slate-900/50 backdrop-blur-sm rounded-[24px] border border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all active:scale-[0.98]"
                dir="rtl"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                      كتاب {sectionId}
                    </span>
                    {count > 0 && (
                      <span className="bg-blue-950/40 text-blue-400 border border-blue-900/30 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {count.toLocaleString("ar-EG")} أحاديث
                      </span>
                    )}
                  </div>
                  <ChevronLeft size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors translate-x-1 group-hover:translate-x-0" />
                </div>
                
                <h3 className="text-slate-200 font-bold text-[17px] leading-relaxed text-right font-arabic group-hover:text-white transition-colors">
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
