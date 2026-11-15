import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOOKS, bookReaderHref } from '../lib/data/books.ts';
const ids = new Set();
let chapters = 0;
for (const book of BOOKS) {
  assert.ok(!ids.has(book.id), `Duplicate book: ${book.id}`); ids.add(book.id);
  if (!book.readingId) continue;
  const source = JSON.parse(readFileSync(`lib/data/reading/${book.readingId}.json`, 'utf8'));
  assert.equal(source.license, 'CC BY-SA 4.0');
  assert.ok(source.attribution && source.importedAt && source.sourceTitle);
  assert.equal(new URL(source.sourceUrl).hostname, 'ar.wikisource.org');
  assert.ok(source.chapters.length > 0);
  const revisions = new Set();
  let characters = 0;
  for (const chapter of source.chapters) {
    assert.ok(!revisions.has(chapter.revision), `Repeated source chapter: ${book.id}`); revisions.add(chapter.revision);
    assert.equal(new URL(chapter.sourceUrl).searchParams.get('oldid'), String(chapter.revision));
    assert.ok(chapter.title && chapter.blocks.length);
    for (const block of chapter.blocks) {
      assert.ok(['heading', 'paragraph'].includes(block.type));
      assert.ok(block.text.trim());
      assert.ok(!/<(?:script|style|iframe)\b/i.test(block.text));
      characters += block.text.length;
    }
  }
  assert.ok(characters > 1000, `Suspiciously short source: ${book.id}`);
  chapters += source.chapters.length;
  console.log(`${book.id}: ${source.chapters.length} chapters, ${characters} characters`);
}
console.log(`${BOOKS.length} catalog titles, ${BOOKS.filter(b => bookReaderHref(b)).length} internal titles, ${chapters} local chapters; integrity passed`);
