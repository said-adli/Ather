// Import attributed Wikisource snapshots. Run explicitly; never fetch during builds.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { extractSourcePage } from './reading-source.mjs';
import { createHash } from 'node:crypto';

const books = [
  ['daa', 'الجواب الكافي لمن سأل عن الدواء الشافي'],
  ['wasitiyyah', 'العقيدة الواسطية'],
  ['tawheed', 'كتاب التوحيد الذي هو حق الله على العبيد'],
  ['adab', 'الأدب المفرد'],
  ['broken-wings', 'الأجنحة المتكسرة'],
  ['hayy', 'حي بن يقظان'],
  ['kalila', 'كليلة ودمنة'],
  ['bukhala', 'البخلاء'],
];
const additions = JSON.parse(readFileSync(new URL('./reading-sources.json', import.meta.url), 'utf8'));
books.push(...additions.map(book => [book.id, book.sourceTitle]));
const expectedAuthors = { daa: 'ابن قيم الجوزية', wasitiyyah: 'ابن تيمية', tawheed: 'محمد بن عبد الوهاب', adab: 'البخاري', 'broken-wings': 'جبران خليل جبران', hayy: 'ابن طفيل', kalila: 'ابن المقفع', bukhala: 'الجاحظ' };
Object.assign(expectedAuthors, Object.fromEntries(additions.map(book => [book.id, book.author])));
const selected = process.argv.slice(2);
mkdirSync('lib/data/reading', { recursive: true });
const cache = process.env.READING_IMPORT_CACHE || '/tmp/ather-wikisource-cache';
mkdirSync(cache, { recursive: true });
function fetchPage(title) {
  const cached = `${cache}/${createHash('sha256').update(title).digest('hex')}.json`;
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'));
  // Pace requests and respect curl's Retry-After handling for provider limits.
  execFileSync('sleep', ['1.2']);
  const html = execFileSync('curl', ['--fail', '--silent', '--show-error', '--retry', '2', '--max-time', '45', `https://ar.wikisource.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`], { maxBuffer: 30 * 1024 * 1024 }).toString();
  const revision = html.match(/"wgRevisionId":(\d+)/)?.[1];
  const canonical = html.match(/"wgPageName":("(?:\\.|[^"\\])*")/)?.[1];
  if (!revision || !canonical || !html.includes('mw-parser-output')) throw new Error(`Missing source: ${title}`);
  const result = { parse: { title: JSON.parse(canonical).replaceAll('_', ' '), revid: Number(revision), text: { '*': html } } };
  writeFileSync(cached, JSON.stringify(result.parse));
  return result.parse;
}
for (const [id, title] of (selected.length ? selected.map(id => { const book = books.find(book => book[0] === id); if (!book) throw new Error(`Unknown book: ${id}`); return book; }) : books)) {
  if (selected.length && !selected.includes(id)) continue;
  if (!selected.length && existsSync(`lib/data/reading/${id}.json`)) continue;
  const seen = new Set();
  const chapters = [];
  const sourcePages = [];
  const revisions = new Map();
  async function visit(pageTitle) {
    if (seen.has(pageTitle)) return;
    if (seen.size >= 4000) throw new Error(`Too many pages: ${title}`);
    seen.add(pageTitle);
    const page = fetchPage(pageTitle);
    sourcePages.push({ title: pageTitle, revision: page.revid });
    if (seen.size % 20 === 0) console.log(id, seen.size, 'pages imported');
    const { author, translator, children, blocks } = extractSourcePage(page.text['*'], title);
    if (pageTitle === title) {
      const anonymous = additions.find(book => book.id === id)?.anonymous === true;
      if (anonymous ? author.trim() !== '' : !author.includes(expectedAuthors[id])) throw new Error(`Author mismatch: ${title} (${author})`);
      const expectedTranslator = additions.find(book => book.id === id)?.translator;
      if (expectedTranslator && !translator.includes(expectedTranslator)) throw new Error(`Translator mismatch: ${title} (${translator})`);
    }
    const fingerprint = createHash('sha256').update(JSON.stringify(blocks)).digest('hex');
    if (revisions.has(page.revid) && revisions.get(page.revid) !== fingerprint) throw new Error(`Conflicting source revision: ${pageTitle}`);
    const repeated = revisions.has(page.revid);
    revisions.set(page.revid, fingerprint);
    if (!repeated && blocks.length && (!children.length || blocks.some(b => b.text.length > 100))) chapters.push({ title: pageTitle === title ? 'النص' : (/^\d+$/.test(pageTitle.slice(title.length + 1)) ? `الجزء ${pageTitle.slice(title.length + 1)}` : pageTitle.slice(title.length + 1)), sourceUrl: `https://ar.wikisource.org/w/index.php?oldid=${page.revid}`, revision: page.revid, blocks });
    if (!blocks.length && !children.length) throw new Error(`Empty source chapter: ${pageTitle}`);
    for (const child of children) { if (!seen.has(child)) await visit(child); }
  }
  await visit(title);
  if (!chapters.length) throw new Error(`Empty book: ${title}`);
  const data = { source: 'ويكي مصدر', sourceTitle: title, sourceUrl: `https://ar.wikisource.org/wiki/${encodeURIComponent(title)}`, license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.ar', attribution: 'النص من ويكي مصدر ومساهميه؛ استُخرج النص من تنسيق الموقع للعرض في أثر. سجل المساهمين متاح من تاريخ الصفحة الأصلية.', importerVersion: 2, sourcePages, importedAt: new Date().toISOString().slice(0, 10), chapters };
  if (chapters.reduce((n, chapter) => n + chapter.blocks.reduce((s, b) => s + b.text.length, 0), 0) < 1000) throw new Error(`Suspiciously short source: ${title}`);
  writeFileSync(`lib/data/reading/${id}.json.tmp`, JSON.stringify(data, null, 2) + '\n');
  renameSync(`lib/data/reading/${id}.json.tmp`, `lib/data/reading/${id}.json`);
  console.log(id, chapters.length, 'chapters', seen.size, 'source pages', chapters.reduce((n,c)=>n+c.blocks.reduce((s,b)=>s+b.text.length,0),0), 'characters');
}
