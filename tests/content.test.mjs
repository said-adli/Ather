import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArabic } from '../lib/arabic.ts';
import { COLLECTIONS, getCollectionInfo, getHadithSection } from '../lib/api/hadith.ts';

test('Arabic search matches hamza, diacritics, tatweel and whitespace without modifying source', () => {
  assert.equal(normalizeArabic('  الأَرْبَعُون النَّوَوِيَّة  '), normalizeArabic('الاربعون النووية'));
  assert.equal(normalizeArabic('حَـيّ بن يَقظان'), normalizeArabic('حي بن يقظان'));
});
test('Arabic library discovery folds numeric scripts and repeated spaces', () => {
  assert.equal(normalizeArabic('حول  العالم في ٨٠ يوماً'), normalizeArabic('حول العالم في 80 يوما'));
  assert.equal(normalizeArabic('١٧ رمضان'), normalizeArabic('17 رمضان'));
  assert.equal(normalizeArabic('۸۰'), '80');
});

test('Unsupported collection and malformed section never reach the provider', async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = () => { requests++; throw new Error('Unexpected network request'); };
  try {
    assert.equal(await getCollectionInfo('ahmad'), null);
    assert.equal(await getHadithSection('darimi', '1'), null);
    for (const section of ['0', '-1', '../1', '1?foo=bar', '1.5']) assert.equal(await getHadithSection('bukhari', section), null);
    assert.equal(requests, 0);
  } finally { globalThis.fetch = original; }
});
test('New Arabic collection uses its own edition and retains exact source text and grading', async () => {
  const original = globalThis.fetch;
  const source = { metadata: { section: { 1: 'Forty Hadith Qudsi' } }, hadiths: [{ hadithnumber: 1, text: 'نصُّ المصدر', grades: [{ name: 'المحدث', grade: 'حكم المصدر' }] }] };
  globalThis.fetch = async url => {
    assert.equal(url, 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-qudsi/sections/1.json');
    return Response.json(source);
  };
  try {
    assert.deepEqual(await getHadithSection('qudsi', '1'), source);
    assert.ok(COLLECTIONS.some(item => item.id === 'nawawi'));
    assert.ok(COLLECTIONS.some(item => item.id === 'dehlawi'));
  } finally { globalThis.fetch = original; }
});

test('Compound dhikr instructions never collapse 33/34 or different times into a false count of 3', async () => {
  const { dhikrCounter } = await import('../lib/data/dhikr-counter.mjs');
  for (const text of ['سبحان الله ثلاثاً وثلاثين والحمد لله ثلاثاً وثلاثين والله أكبر أربعاً وثلاثين', 'بعد كل صلاة مرة واحدة وبعد المغرب ثلاث مرات', 'قل بسم الله ثلاثاً ثم قل سبع مرات']) assert.deepEqual(dhikrCounter(text), { count: 1, counterMode: 'reading' });
  assert.deepEqual(dhikrCounter('سبحان الله وبحمده مائة مرة'), { count: 100 });
});

test('Quran pagination retains every verse in order and does not return a partial chapter on failure', async () => {
  const { getChapterVerses } = await import('../lib/api/quran.ts');
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async url => {
    requests++;
    const page = new URL(url).searchParams.get('page');
    return Response.json({ verses: [{ id: Number(page), verse_key: `1:${page}`, text_uthmani: `آية ${page}` }], pagination: { total_pages: 2 } });
  };
  try {
    assert.deepEqual((await getChapterVerses(1)).map(verse => verse.verse_key), ['1:1', '1:2']);
    assert.equal(requests, 2);
    globalThis.fetch = async url => new URL(url).searchParams.get('page') === '2' ? new Response('', { status: 503 }) : Response.json({ verses: [{ id: 1 }], pagination: { total_pages: 2 } });
    assert.deepEqual(await getChapterVerses(1), []);
  } finally { globalThis.fetch = original; }
});
