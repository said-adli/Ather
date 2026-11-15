// Publish metadata only for completed snapshots; book text stays on the server.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const sources = JSON.parse(readFileSync('scripts/reading-sources.json', 'utf8'));
const catalog = [];
for (const source of sources) {
  const filename = `lib/data/reading/${source.id}.json`;
  if (!existsSync(filename)) throw new Error(`Import the full source before publishing: ${source.id}`);
  const book = JSON.parse(readFileSync(filename, 'utf8'));
  if (book.importerVersion !== 2 || book.sourceTitle !== source.sourceTitle || !book.chapters.length) throw new Error(`Unverified snapshot: ${source.id}`);
  catalog.push({ id: source.id, readingId: source.id, title: source.title, author: source.author, ...(source.translator ? { translator: source.translator } : {}), category: source.category, description: source.description, readUrl: book.sourceUrl, chapterCount: book.chapters.length });
}
writeFileSync('lib/data/reading-catalog.json', JSON.stringify(catalog, null, 2) + '\n');
console.log(`${catalog.length} complete sources published`);
