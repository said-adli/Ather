// Import attributed Wikisource snapshots. Run explicitly; never fetch during builds.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { load } from 'cheerio';
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
const expectedAuthors = { daa: 'ابن قيم الجوزية', wasitiyyah: 'ابن تيمية', tawheed: 'محمد بن عبد الوهاب', adab: 'البخاري', 'broken-wings': 'جبران خليل جبران', hayy: 'ابن طفيل', kalila: 'ابن المقفع', bukhala: 'الجاحظ' };
const selected = process.argv.slice(2);
mkdirSync('lib/data/reading', { recursive: true });
const cache = process.env.READING_IMPORT_CACHE || '/tmp/ather-wikisource-cache';
mkdirSync(cache, { recursive: true });
function fetchPage(title) {
  const cached = `${cache}/${createHash('sha256').update(title).digest('hex')}.json`;
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'));
  // Pace requests and respect curl's Retry-After handling for provider limits.
  execFileSync('sleep', ['1.2']);
  const raw = execFileSync('curl', ['--fail', '--silent', '--show-error', '--retry', '2', '--max-time', '45', '--get', 'https://ar.wikisource.org/w/api.php', '--data-urlencode', 'action=parse', '--data-urlencode', `page=${title}`, '--data-urlencode', 'prop=text|revid', '--data-urlencode', 'format=json'], { maxBuffer: 30 * 1024 * 1024 });
  const result = JSON.parse(raw);
  if (!result.parse) throw new Error(`Missing source: ${title}`);
  writeFileSync(cached, JSON.stringify(result.parse));
  return result.parse;
}
for (const [id, title] of (selected.length ? selected.map(id => { const book = books.find(book => book[0] === id); if (!book) throw new Error(`Unknown book: ${id}`); return book; }) : books)) {
  if (selected.length && !selected.includes(id)) continue;
  if (!selected.length && existsSync(`lib/data/reading/${id}.json`)) continue;
  const seen = new Set();
  const chapters = [];
  async function visit(pageTitle) {
    if (seen.has(pageTitle)) return;
    if (seen.size >= 600) throw new Error(`Too many pages: ${title}`);
    seen.add(pageTitle);
    const page = fetchPage(pageTitle);
    if (seen.size % 20 === 0) console.log(id, seen.size, 'pages imported');
    const $ = load(page.text['*']);
    if (pageTitle === title && !$('.ws-author').text().includes(expectedAuthors[id])) throw new Error(`Author mismatch: ${title}`);
    const root = $('.mw-parser-output');
    root.find('script, style, .noprint, .ws-noexport, .mw-editsection, .toc, #toc, .navbox, .ambox').remove();
    const children = [];
    root.find('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href.startsWith('/wiki/')) return;
      const target = decodeURIComponent(href.slice(6).split('#')[0]).replaceAll('_', ' ');
      if ((target.startsWith(`${title}/`) || (target.startsWith(`${title} `) && /^\d+$/.test(target.slice(title.length + 1)))) && !$(el).hasClass('new') && !children.includes(target)) children.push(target);
    });
    // A contents page is navigation. Its actual chapters are imported in source order.
    root.find('li').each((_, el) => {
      if ($(el).find('a').toArray().some(a => {
        const href = $(a).attr('href') || '';
        try { return children.includes(decodeURIComponent(href.slice(6).split('#')[0]).replaceAll('_', ' ')); } catch { return false; }
      })) $(el).remove();
    });
    const blocks = [];
    root.find('p, h2, h3, h4, h5, li, dd, dt, .poem').each((_, el) => {
      if ($(el).parents('p, li, dd, dt, .poem').length) return;
      const text = $(el).text().trim();
      if (!text || (children.length && text === 'الفهرس')) return;
      blocks.push({ type: /^h[2-5]$/.test(el.tagName) ? 'heading' : 'paragraph', text });
    });
    if (blocks.some(b => b.text.length > 100)) chapters.push({ title: pageTitle === title ? 'النص' : (/^\d+$/.test(pageTitle.slice(title.length + 1)) ? `الجزء ${pageTitle.slice(title.length + 1)}` : pageTitle.slice(title.length + 1)), sourceUrl: `https://ar.wikisource.org/w/index.php?oldid=${page.revid}`, revision: page.revid, blocks });
    for (const child of children) { if (!seen.has(child)) await visit(child); }
  }
  await visit(title);
  if (!chapters.length) throw new Error(`Empty book: ${title}`);
  const data = { source: 'ويكي مصدر', sourceTitle: title, sourceUrl: `https://ar.wikisource.org/wiki/${encodeURIComponent(title)}`, license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.ar', attribution: 'النص من ويكي مصدر ومساهميه؛ استُخرج النص من تنسيق الموقع للعرض في أثر. سجل المساهمين متاح من تاريخ الصفحة الأصلية.', importedAt: new Date().toISOString().slice(0, 10), chapters };
  writeFileSync(`lib/data/reading/${id}.json`, JSON.stringify(data, null, 2) + '\n');
  console.log(id, chapters.length, 'chapters', seen.size, 'source pages', chapters.reduce((n,c)=>n+c.blocks.reduce((s,b)=>s+b.text.length,0),0), 'characters');
}
