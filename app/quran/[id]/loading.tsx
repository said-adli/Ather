export default function QuranLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex-1 flex flex-col items-center pr-6 gap-2">
          <div className="w-32 h-5 rounded-lg bg-slate-200 animate-pulse" />
          <div className="w-20 h-3 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="flex-1 px-5 py-10 max-w-3xl mx-auto w-full">
        {/* Bismillah skeleton */}
        <div className="flex justify-center mb-12">
          <div className="w-64 h-8 rounded-lg bg-slate-200 animate-pulse" />
        </div>

        {/* Verses skeleton */}
        <div className="flex flex-col gap-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full h-6 rounded bg-slate-200 animate-pulse" />
              <div className="w-3/4 h-6 rounded bg-slate-200 animate-pulse" />
              <div className="w-1/2 h-6 rounded bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
