"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, LibraryBig, ArrowUpLeft, Quote } from 'lucide-react';
import { COLLECTIONS } from '@/lib/api/hadith';
import { BOOKS, BOOK_CATEGORIES, bookReaderHref } from '@/lib/data/books';
import { normalizeArabic } from '@/lib/arabic';

type Tab = 'books' | 'novels' | 'hadith';
export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>('books');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [internalOnly, setInternalOnly] = useState(true);
  const normalized = normalizeArabic(query);
  const books = BOOKS.filter(book =>
    normalizeArabic(`${book.title} ${book.author} ${book.description}`).includes(normalized)
    && (tab === 'novels' ? book.category === 'روايات' : book.category !== 'روايات')
    && (tab === 'novels' || category === 'الكل' || book.category === category)
    && (!internalOnly || bookReaderHref(book)));
  const collections = COLLECTIONS.filter(item => normalizeArabic(`${item.nameAr} ${item.nameEn}`).includes(normalized));
  function changeTab(next: Tab) { setTab(next); setQuery(''); setCategory('الكل'); }
  return <div className="min-h-full bg-[#FDFBF7]" dir="rtl">
    <header className="px-5 pt-8 pb-5 border-b border-amber-900/5 bg-[#FDFBF7]">
      <div className="flex items-center gap-3 text-emerald-800"><LibraryBig size={30} /><h1 className="text-3xl font-bold">المكتبة</h1></div>
      <p className="text-sm text-slate-500 mt-3 leading-7">رفّك للقراءة؛ كتب وأحاديث وروايات، وموضعك محفوظ.</p>
      <div role="tablist" aria-label="أقسام المكتبة" className="flex gap-1 bg-slate-100 p-1 rounded-2xl mt-5">
        {([['books', 'الكتب'], ['novels', 'الروايات'], ['hadith', 'الأحاديث']] as const).map(([key, label]) => <button key={key} role="tab" id={`tab-${key}`} aria-selected={tab === key} aria-controls="library-panel" onClick={() => changeTab(key)} className={`flex-1 py-3 text-sm font-bold rounded-xl ${tab === key ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'}`}>{label}</button>)}
      </div>
      <div className="relative mt-4">
        <Search className="absolute right-3 top-3.5 text-slate-400" size={18} />
        <input aria-label="البحث في المكتبة" value={query} onChange={e => setQuery(e.target.value)} placeholder={tab === 'hadith' ? 'ابحث عن مجموعة حديث...' : 'ابحث بالعنوان أو المؤلف...'} className="w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm focus:outline-emerald-600" />
      </div>
    </header>
    <section id="library-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="p-4 pb-10">
      {tab === 'hadith' ? <>
        <Link href="/library/hadith/search" className="block p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold mb-4">البحث في الأحاديث وتخريجها · الدرر السنية ←</Link>
        <p className="text-xs text-slate-500 mb-4 leading-6">المصدر الرقمي: Hadith API. الحكم على الحديث يُنقل من المصدر مع اسم المحدث عند توفره.</p>
        <div className="space-y-3">{collections.map(item => <Link key={item.id} href={`/library/hadith/${item.id}`} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl"><Quote className="text-emerald-700 shrink-0" size={23} /><div><h2 className="font-arabic text-xl font-bold">{item.nameAr}</h2><p className="text-xs text-slate-500 mt-1">{item.bookCount} من كتب وأقسام المجموعة</p></div></Link>)}</div>
        {!collections.length && <p className="text-center p-8 text-slate-500">لا توجد مجموعة تطابق بحثك.</p>}
      </> : <>
        {tab === 'books' && <div className="flex gap-2 overflow-x-auto pb-4" aria-label="تصنيف الكتب">{['الكل', ...BOOK_CATEGORIES.filter(cat => cat !== 'روايات')].map(cat => <button key={cat} aria-pressed={cat === category} onClick={() => setCategory(cat)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border ${cat === category ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>{cat}</button>)}</div>}
        <label className="flex items-center gap-2 text-sm text-slate-600 mb-4"><input type="checkbox" checked={internalOnly} onChange={e => setInternalOnly(e.target.checked)} className="accent-emerald-700" /> المتاح للقراءة داخل التطبيق فقط</label>
        <p className="text-xs text-slate-500 mb-4" role="status">{books.length} عنواناً {tab === 'novels' && '· أعمال أدبية، وليست مراجع دينية'}</p>
        <div className="space-y-4">{books.map(book => {
          const href = bookReaderHref(book);
          return <article key={book.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="flex justify-between gap-3 items-start"><BookOpen className="text-emerald-700 shrink-0" size={24} /><span className="text-[11px] text-amber-800 bg-amber-50 rounded-full px-3 py-1">{book.category}</span></div>
            <h2 className="font-arabic font-bold text-2xl mt-4 leading-relaxed">{book.title}</h2>
            <p className="text-sm text-emerald-700 mt-1">{book.author}</p>
            <p className="text-xs text-slate-500 leading-7 mt-3 mb-4">{book.description}</p>
            {href ? <Link href={href} className="block p-3 text-center text-sm font-bold rounded-xl bg-emerald-50 text-emerald-800">اقرأ داخل التطبيق ←</Link> : <><p className="text-xs text-slate-500 mb-3">مرجع خارجي؛ لم تُضف نسخة نصية داخل التطبيق بعد.</p><a href={book.readUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 text-sm rounded-xl bg-slate-50 text-slate-700">المصدر الخارجي <ArrowUpLeft size={16} /></a></>}
          </article>;
        })}</div>
        {!books.length && <p className="text-center p-8 text-slate-500 leading-8">لا توجد عناوين تطابق بحثك. جرّب تصنيفاً آخر أو امسح البحث.</p>}
      </>}
    </section>
  </div>;
}
