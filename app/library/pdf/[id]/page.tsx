import { notFound } from 'next/navigation';
import { getPdfBook } from '@/lib/pdf';
import { PdfBookReader } from '@/components/features/PdfBookReader';
export default async function PdfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getPdfBook(id);
  if (!book) notFound();
  return <PdfBookReader key={id} book={book} />;
}
