"use client";
import { useState } from 'react';
import Link from 'next/link';
import { normalizeArabic } from '@/lib/arabic';

export function BookContents({ id, chapters }: { id: string; chapters: string[] }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(50);
  const filtered = chapters.map((title, index) => ({ title, number: index + 1 }))
    .filter(item => normalizeArabic(`${item.number} ${item.title}`).includes(normalizeArabic(query)));
  return <section aria-label="فهرس القراءة">
    <h2 className="font-bold text-xl mb-4">فهرس القراءة <span className="text-sm text-slate-500">({chapters.length})</span></h2>
    {chapters.length > 10 && <input aria-label="البحث في فهرس الكتاب" placeholder="ابحث عن فصل أو باب…" value={query} onChange={e => { setQuery(e.target.value); setLimit(50); }} className="w-full p-3 mb-4 border border-slate-200 rounded-xl bg-white text-sm" />}
    <ol className="space-y-2">{filtered.slice(0, limit).map(chapter => <li key={chapter.number}><Link prefetch={false} href={`/library/books/${id}/${chapter.number}`} className="block p-4 bg-white rounded-xl border border-slate-100 text-sm leading-7">{chapter.number}. {chapter.title}</Link></li>)}</ol>
    {!filtered.length && <p role="status" className="py-6 text-sm text-slate-500">لا يوجد فصل يطابق بحثك.</p>}
    {filtered.length > limit && <button onClick={() => setLimit(limit + 50)} className="w-full p-4 mt-4 rounded-xl border border-emerald-200 text-emerald-800 text-sm font-bold">عرض المزيد من الفصول ({filtered.length - limit})</button>}
  </section>;
}
