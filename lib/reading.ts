import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { BOOKS } from './data/books';

export interface ReadingChapter {
  title: string;
  sourceUrl: string;
  revision: number;
  blocks: { type: string; text: string }[];
}
export interface ReadingBook {
  source: string;
  sourceTitle: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  importedAt: string;
  chapters: ReadingChapter[];
}
export async function getReadingBook(id: string): Promise<ReadingBook | null> {
  if (!BOOKS.some(book => book.readingId === id)) return null;
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), 'lib/data/reading', `${id}.json`), 'utf8')) as ReadingBook;
  } catch {
    return null;
  }
}
