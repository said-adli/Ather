// Combined instructions need to be read as a whole; a single inferred number
// cannot describe their different phrases, times and repetition counts.
export function dhikrCounter(text) {
  const plain = text.normalize('NFC').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا');
  if (/ثلاثا? وثلاثين|اربعا? وثلاثين|مرة واحدة.*ثلاث مرات|ثلاثا.*سبع مرات/.test(plain)) {
    return { count: 1, counterMode: 'reading' };
  }
  let count = 1;
  if (/ثلاث مرات|ثلاثا/.test(plain)) count = 3;
  if (plain.includes('عشر مرات')) count = 10;
  if (/مائة مرة|مئة مرة/.test(plain)) count = 100;
  if (plain.includes('سبع مرات')) count = 7;
  if (plain.includes('اربع مرات')) count = 4;
  return { count };
}
