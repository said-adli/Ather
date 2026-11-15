/** Fold spelling variants for discovery only. Never alter displayed source text. */
export function normalizeArabic(value: string): string {
  return value.normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').toLowerCase().trim();
}
