import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BOOKS, bookReaderHref } from '../lib/data/books.ts';
const ids = new Set();
let chapters = 0;
for (const book of BOOKS) {
  assert.ok(!ids.has(book.id), `Duplicate book: ${book.id}`); ids.add(book.id);
  assert.ok(bookReaderHref(book)?.startsWith('/library/'), `Missing internal reader: ${book.id}`);
  if (!book.readingId) continue;
  const source = JSON.parse(readFileSync(`lib/data/reading/${book.readingId}.json`, 'utf8'));
  assert.equal(source.license, 'CC BY-SA 4.0');
  assert.ok(source.attribution && source.importedAt && source.sourceTitle);
  assert.equal(new URL(source.sourceUrl).hostname, 'ar.wikisource.org');
  assert.ok(source.chapters.length > 0);
  if (book.chapterCount) assert.equal(book.chapterCount, source.chapters.length);
  if (source.importerVersion === 2) {
    assert.ok(source.sourcePages.length >= source.chapters.length);
    const inventory = new Set(source.sourcePages.map(page => page.revision));
    for (const chapter of source.chapters) assert.ok(inventory.has(chapter.revision));
  }
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

const pdfs = JSON.parse(readFileSync('lib/data/pdf-catalog.json', 'utf8'));
const pdfLibrary = JSON.parse(readFileSync('lib/data/pdf-library.json', 'utf8'));
assert.equal(pdfs.length, pdfLibrary.length);
const hashes = new Set();
let pages = 0;
for (const pdf of pdfs) {
  assert.equal(pdf.sourceUrl, `https://downloads.hindawi.org/books/${pdf.publisherId}.pdf`);
  assert.match(pdf.publisherId, /^\d{8}$/);
  assert.equal(pdf.license, 'CC BY 4.0');
  assert.equal(pdf.licenseUrl, 'https://creativecommons.org/licenses/by/4.0/deed.ar');
  assert.ok(pdf.rightsStatement && pdf.verifiedAt && pdf.author && pdf.title);
  const rights = pdf.rightsStatement.normalize('NFKC').replace(/[\s\u064B-\u065F\u0670]/g, '');
  if (pdf.textRights === 'licensed-translation') {
    assert.ok(rights.includes('الترجمةالعربيةلنصهذاالكتابمرخصةبموجبرخصةالمشاعالإبداعي'), `Unclear translation grant: ${pdf.id}`);
  } else {
    assert.equal(pdf.textRights, 'arabic-public-domain', `Unknown text rights: ${pdf.id}`);
    assert.ok(!rights.includes('ترجمة') && rights.includes('نصالعملالأصليخاضعةللملكيةالعامة'), `Unclear original text rights: ${pdf.id}`);
  }
  assert.ok(Number.isInteger(pdf.pageCount) && pdf.pageCount >= 5);
  assert.ok(Number.isInteger(pdf.byteLength) && pdf.byteLength > 1000 && pdf.byteLength < 40 * 1024 * 1024);
  assert.ok(pdf.rightsPage > 0 && pdf.rightsPage <= pdf.pageCount);
  assert.match(pdf.sha256, /^[a-f0-9]{64}$/);
  assert.match(pdf.etag, /^"[\w-]+"$/);
  assert.ok(!hashes.has(pdf.sha256), `Duplicate PDF: ${pdf.id}`); hashes.add(pdf.sha256);
  const meta = BOOKS.find(book => book.id === pdf.id);
  assert.ok(meta, `Unlisted PDF: ${pdf.id}`);
  assert.equal(meta.title, pdf.title);
  assert.equal(meta.author, pdf.author);
  assert.equal(meta.translator, pdf.translator, `Translator mismatch: ${pdf.id}`);
  assert.equal(meta.pageCount, pdf.pageCount);
  assert.equal(bookReaderHref(meta), `/library/pdf/${pdf.id}`);
  pages += pdf.pageCount;
}
console.log(`${pdfs.length} attributed publisher PDFs, ${pages} pages; integrity passed`);
