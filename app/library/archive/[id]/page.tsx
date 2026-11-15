import Link from 'next/link';
import { notFound } from 'next/navigation';
import archiveBooks from '@/lib/data/archive-books.json';

export default async function ArchiveBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = archiveBooks.find(item => item.id === id);
  if (!book) notFound();

  return <div dir="rtl" className="min-h-full bg-[#FDFBF7] p-4 pb-8">
    <Link href="/library" className="text-sm text-emerald-800">← المكتبة</Link>
    <h1 className="font-arabic text-xl font-bold mt-3">{book.title}</h1>
    <p className="text-sm text-slate-600 mt-1">{book.author}</p>
    {'translator' in book && <p className="text-sm text-slate-600 mt-1">ترجمة: {book.translator}</p>}
    <p className="text-xs text-slate-600 leading-6 my-3">القراءة عبر الإنترنت أرشيف وتحتاج إلى اتصال. تتوفر أدوات التنقل داخل القارئ.</p>
    <iframe title={`قراءة ${book.title}`} src={`https://archive.org/embed/${book.archiveId}`} className="w-full rounded-xl border border-slate-200 bg-white" style={{ height: '75vh', minHeight: 480 }} allowFullScreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" />
    <a href={`https://archive.org/details/${book.archiveId}`} target="_blank" rel="noreferrer" className="inline-block text-sm text-emerald-800 underline mt-4">افتح الكتاب في الإنترنت أرشيف</a>
  </div>;
}
