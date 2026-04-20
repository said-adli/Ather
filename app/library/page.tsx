"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, LibraryBig, ExternalLink, Quote } from "lucide-react";
import { COLLECTIONS } from "@/lib/api/hadith";
import { ISLAMIC_BOOKS, BOOK_CATEGORIES } from "@/lib/data/books";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"hadith" | "books">("hadith");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const filteredCollections = COLLECTIONS.filter((c) =>
    c.nameAr.includes(searchQuery) || c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBooks = ISLAMIC_BOOKS.filter((b) => {
    const matchesSearch = b.title.includes(searchQuery) || b.author.includes(searchQuery);
    const matchesCat = selectedCategory === "الكل" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      
      <header className="px-6 pt-10 pb-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10 shadow-sm safe-area-inset-top">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          المكتبة <LibraryBig className="text-emerald-500" size={28} />
        </h1>
        
        {/* Global Search Button for Dorar */}
        <AnimatePresence>
          {activeTab === "hadith" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Link href="/library/hadith/search" className="mt-5 mb-3 flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors rounded-2xl group active:scale-[0.98]">
                <Search size={18} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800" dir="rtl">البحث الشامل في الأحاديث (الدرر السنية)</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Bar */}
        <div className={`relative ${activeTab === "hadith" ? "" : "mt-5"}`}>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pr-10 pl-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all sm:text-sm shadow-inner"
            placeholder={activeTab === "hadith" ? "تصفية مجموعات الحديث..." : "ابحث عن كتاب أو مؤلف..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
          />
        </div>

        {/* Tabs */}
        <div className="flex p-1 mt-4 space-x-1 space-x-reverse bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab("hadith")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === "hadith"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            الحديث الشريف
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              activeTab === "books"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            المكتبة الإسلامية
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "hadith" ? (
            <motion.div
              key="hadith"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pb-24"
            >
              {filteredCollections.map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/library/hadith/${collection.id}`}
                  className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    <Quote size={20} className="text-emerald-600" />
                  </div>
                  
                  <div className="mr-4 flex-1 text-right">
                    <h3 className="text-slate-800 font-bold text-lg font-arabic">{collection.nameAr}</h3>
                    <p className="text-slate-500 text-xs font-medium tracking-wider mt-1 uppercase">
                      {collection.nameEn} • {collection.bookCount} كتاب
                    </p>
                  </div>
                </Link>
              ))}

              {filteredCollections.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  لم يتم العثور على مجموعة تطابق بحثك.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="books"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="pb-24"
            >
              {/* Category Filter */}
              <div className="flex overflow-x-auto pb-4 mb-2 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" dir="rtl">
                <button
                  onClick={() => setSelectedCategory("الكل")}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    selectedCategory === "الكل" ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  الكل
                </button>
                {BOOK_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      selectedCategory === cat ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-start mb-2" dir="rtl">
                      <h3 className="font-arabic font-bold text-xl text-slate-800 leading-tight">
                        {book.title}
                      </h3>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap mr-2">
                        {book.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1.5" dir="rtl">
                      <BookOpen size={14} />
                      {book.author}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 text-right" dir="rtl">
                      {book.description}
                    </p>
                    <a 
                      href={book.readUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm py-2.5 rounded-xl transition-colors border border-slate-200"
                      dir="rtl"
                    >
                      تصفح الكتاب <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  لا توجد كتب تطابق بحثك حالياً.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
