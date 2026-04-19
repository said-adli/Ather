export default function QuranReaderLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] animate-pulse">
      {/* Skeleton Header */}
      <header className="sticky top-0 z-20 px-4 pt-10 pb-4 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-amber-900/5 safe-area-inset-top flex items-center shadow-sm">
        {/* Back button skeleton */}
        <div className="w-10 h-10 rounded-full bg-amber-900/5" />
        {/* Title area skeleton */}
        <div className="flex-1 flex flex-col items-center pr-6 gap-2">
          <div className="h-5 w-32 bg-amber-900/8 rounded-lg" />
          <div className="h-3 w-16 bg-amber-900/5 rounded-md" />
        </div>
      </header>

      {/* Skeleton Content */}
      <main className="flex-1 px-5 py-10 pb-32 max-w-3xl mx-auto w-full">
        {/* Bismillah skeleton */}
        <div className="flex justify-center mb-12">
          <div className="h-10 w-64 bg-amber-900/5 rounded-xl" />
        </div>

        {/* Verse skeletons */}
        <div className="flex flex-col gap-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="relative" dir="rtl">
              <div className="space-y-3">
                {/* Simulate multi-line verse text */}
                <div className="flex items-center gap-3 justify-end">
                  <div 
                    className="h-8 bg-amber-900/5 rounded-lg" 
                    style={{ width: `${75 + Math.sin(i) * 20}%` }} 
                  />
                  <div className="w-9 h-9 rounded-full bg-amber-900/5 shrink-0" />
                </div>
                {i % 2 === 0 && (
                  <div 
                    className="h-8 bg-amber-900/4 rounded-lg" 
                    style={{ width: `${50 + Math.cos(i) * 15}%` }} 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Audio player skeleton */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md">
        <div className="h-14 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-lg" />
      </div>
    </div>
  );
}
