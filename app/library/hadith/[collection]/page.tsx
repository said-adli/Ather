import { getCollectionInfo, COLLECTIONS } from "@/lib/api/hadith";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ collection: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  
  const info = await getCollectionInfo(collection);
  const meta = COLLECTIONS.find(c => c.id === collection);

  if (!info || !meta) {
    return (
      <div className="flex flex-col h-screen bg-[#FDFBF7]">
        <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
          <Link 
            href="/library" 
            className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 font-bold">حدث خطأ أثناء تحميل المجموعة.</p>
        </div>
      </div>
    );
  }

  // Filter out any invalid sections (like empty strings or id 0)
  const sectionIds = Object.keys(info.metadata.sections).filter(id => Number(id) > 0 || String(id) !== "0");

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        <Link 
          href="/library" 
          className="p-2 -mr-2 rounded-full hover:bg-slate-100/50 transition-colors active:bg-slate-200/50 text-slate-700"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 text-center pl-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight font-arabic">{meta.nameAr}</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            {meta.nameEn}
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="space-y-3">
          {sectionIds.map((sectionId) => {
            const sectionName = info.metadata.sections[sectionId];
            if (!sectionName) return null;
            
            return (
              <Link
                key={sectionId}
                href={`/library/hadith/${collection}/${sectionId}`}
                className="group flex flex-col p-4 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-emerald-200 transition-colors"
                dir="rtl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    كتاب {sectionId}
                  </span>
                  <ChevronLeft size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors translate-x-1 group-hover:translate-x-0" />
                </div>
                <h3 className="text-slate-700 font-semibold text-sm leading-relaxed text-right">
                  {sectionName}
                </h3>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
