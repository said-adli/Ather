import { getPdfBook } from '@/lib/pdf';
import { fetchPdfChunk, validChunk } from '@/lib/pdf-source.mjs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getPdfBook(id);
  const fail = (status: number) => new Response('تعذر تحميل صفحات الكتاب. حاول مجددًا.', { status, headers: { 'Cache-Control': 'no-store' } });
  if (!book) return fail(404);
  const query = new URL(request.url).searchParams;
  if (query.get('version') !== book.sha256) return fail(409);
  const start = query.get('begin') ?? '';
  const finish = query.get('end') ?? '';
  if (!/^\d{1,10}$/.test(start) || !/^\d{1,10}$/.test(finish)) return fail(400);
  const begin = Number(start), end = Number(finish);
  if (!validChunk(begin, end, book.byteLength)) return fail(400);
  try {
    const bytes = await fetchPdfChunk(book, begin, end, AbortSignal.any([request.signal, AbortSignal.timeout(20000)]));
    return new Response(bytes, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes.length), 'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return fail(502); }
}
