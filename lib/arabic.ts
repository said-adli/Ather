/** Fold spelling variants for discovery only. Never alter displayed source text. */
export function normalizeArabic(value: string): string {
  return value.normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) - (digit <= '٩' ? 0x660 : 0x6f0))).replace(/ى/g, 'ي').replace(/\s+/g, ' ').toLowerCase().trim();
}
