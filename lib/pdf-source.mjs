export function validChunk(begin, end, length) {
  return Number.isSafeInteger(begin) && Number.isSafeInteger(end) && begin >= 0 && end > begin && end <= length && end - begin <= 1024 * 1024;
}
export async function fetchPdfChunk(book, begin, end, signal, fetcher = fetch) {
  if (!validChunk(begin, end, book.byteLength)) throw new Error('Invalid byte range');
  const url = new URL(book.sourceUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'downloads.hindawi.org' || !/^\/books\/\d{8}\.pdf$/.test(url.pathname)) throw new Error('Invalid publisher');
  const response = await fetcher(url.href, { headers: { Range: `bytes=${begin}-${end - 1}`, 'If-Match': book.etag, 'Accept-Encoding': 'identity' }, cache: 'no-store', signal });
  if (response.status !== 206 || response.headers.get('content-range') !== `bytes ${begin}-${end - 1}/${book.byteLength}` || response.headers.get('etag') !== book.etag) throw new Error('Publisher edition unavailable or changed');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty publisher response');
  const bytes = new Uint8Array(end - begin);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.length > bytes.length) throw new Error('Oversized publisher response');
      bytes.set(value, length); length += value.length;
    }
    if (length !== bytes.length) throw new Error('Truncated publisher response');
  } finally { await reader.cancel(); }
  return bytes;
}
