import { notFound } from 'next/navigation';
import { getReadingBook } from '@/lib/reading';
import { BOOKS } from '@/lib/data/books';
import { BookReader } from '@/components/features/BookReader';

export default async function ChapterPage({ params }: { params: Promise<{ id: string; chapter: string }> }) {
  const { id, chapter } = await params;
  if (!/^[1-9]\d*$/.test(chapter)) notFound();
  const book = await getReadingBook(id);
  const meta = BOOKS.find(item => item.readingId === id);
  const content = book?.chapters[Number(chapter) - 1];
  if (!book || !meta || !content) notFound();
  return <BookReader key={`${id}/${chapter}`} id={id} title={meta.title} chapter={Number(chapter)} count={book.chapters.length} content={content} />;
}
