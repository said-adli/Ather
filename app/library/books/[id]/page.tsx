import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BOOKS } from '@/lib/data/books';
import { getReadingBook } from '@/lib/reading';
import { BookContents } from '@/components/features/BookContents';
import { ContinueReading } from '@/components/features/ContinueReading';

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = BOOKS.find(book => book.readingId === id);
  const book = await getReadingBook(id);
  if (!meta || !book) notFound();
  return <div className="min-h-full bg-[#FDFBF7] p-5 pb-12" dir="rtl">
    <Link href="/library" className="text-emerald-700 text-sm">← المكتبة</Link>
    <p className="text-xs text-amber-800 mt-8">{meta.category} · قراءة داخل التطبيق</p>
    <h1 className="font-arabic text-3xl font-bold mt-3 leading-relaxed">{meta.title}</h1>
    <p className="text-emerald-700 mt-2">{meta.author}</p>
    <p className="my-5 text-sm leading-7 text-slate-600">{meta.description}</p>
    <ContinueReading id={id} count={book.chapters.length} />
    <details className="my-6 rounded-2xl border border-slate-200 p-4 bg-white text-xs leading-7">
      <summary className="cursor-pointer font-bold">عن النسخة والمصدر وحقوق النص</summary>
      <p>{book.attribution}</p>
      <p>نسخة رقمية من {book.source} بتاريخ {book.importedAt}؛ لم تُقابل هذه النسخة على طبعة محققة.</p>
      <a className="underline text-emerald-800" href={book.sourceUrl} target="_blank" rel="noreferrer">النسخة الأصلية وسجل المساهمين</a>{' · '}
      <a className="underline text-emerald-800" href={book.licenseUrl} target="_blank" rel="noreferrer">{book.license}</a>
    </details>
    <BookContents id={id} chapters={book.chapters.map(chapter => chapter.title)} />
  </div>;
}
