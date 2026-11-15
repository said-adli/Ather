import assert from 'node:assert/strict';
import test from 'node:test';
import { validChunk, fetchPdfChunk } from '../lib/pdf-source.mjs';
const book = { byteLength: 10, etag: '"test-edition"', sourceUrl: 'https://downloads.hindawi.org/books/74280904.pdf' };
function response(bytes, extra = {}) { return new Response(new Uint8Array(bytes), { status: 206, headers: { 'content-range': 'bytes 0-3/10', etag: book.etag, ...extra } }); }
test('bounded PDF chunks reject malformed and oversized ranges', () => {
  for (const [a,b] of [[-1,4],[0,0],[5,4],[0,11],[.5,4],[0,Infinity]]) assert.equal(validChunk(a,b,10),false);
  assert.equal(validChunk(0,1048577,2000000),false);
  assert.equal(validChunk(6,10,10),true);
});
test('publisher range retains exact bytes and pins the source edition', async () => {
  const bytes = await fetchPdfChunk(book,0,4,undefined,async(url,options)=>{
    assert.equal(url,book.sourceUrl);assert.equal(options.headers.Range,'bytes=0-3');assert.equal(options.headers['If-Match'],book.etag);return response([37,80,68,70]);
  });
  assert.deepEqual([...bytes],[37,80,68,70]);
});
test('changed, truncated, oversized or ignored publisher ranges fail closed', async () => {
  for(const mock of [new Response(new Uint8Array(10)),response([1,2]),response([1,2,3,4,5]),response([1,2,3,4],{etag:'"changed"'}),response([1,2,3,4],{'content-range':'bytes 0-3/11'})]) {
    await assert.rejects(fetchPdfChunk(book,0,4,undefined,async()=>mock));
  }
  await assert.rejects(fetchPdfChunk({...book,sourceUrl:'https://example.com/secret'},0,4,undefined,()=>{throw new Error('Must not fetch');}),/Invalid publisher/);
});
