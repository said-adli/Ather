import 'server-only';
import catalog from './data/pdf-catalog.json';
export const PDF_BOOKS = catalog;
export function getPdfBook(id: string) { return PDF_BOOKS.find(book => book.id === id) ?? null; }
