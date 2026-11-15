import { load } from 'cheerio';

export function wikiTarget(href) {
  try {
    const url = new URL(href, 'https://ar.wikisource.org');
    if (url.hostname !== 'ar.wikisource.org') return null;
    const title = url.pathname.startsWith('/wiki/') ? decodeURIComponent(url.pathname.slice(6))
      : url.pathname === '/w/index.php' ? url.searchParams.get('title') : null;
    return title?.replaceAll('_', ' ') || null;
  } catch { return null; }
}

export function extractSourcePage(html, title) {
  const $ = load(html);
  if (/هذا العمل غير مكتمل|هذا الكتاب غير مكتمل/.test($('.mw-parser-output').text())) throw new Error(`Incomplete source: ${title}`);
  const author = $('.ws-author').text();
  const translator = $('.ws-translator').text();
  const root = $('.mw-parser-output');
  // Inspect the original contents before removing navigation, including red edit links.
  const children = [];
  root.find('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const target = wikiTarget(href);
    if (!target || !(target.startsWith(`${title}/`) || (target.startsWith(`${title} `) && /^\d+$/.test(target.slice(title.length + 1))))) return;
    if ($(el).hasClass('new') || new URL(href, 'https://ar.wikisource.org').searchParams.has('redlink')) throw new Error(`Missing chapter: ${target}`);
    if (!children.includes(target)) children.push(target);
  });
  root.find('script, style, .noprint, .ws-noexport, .mw-editsection, .toc, #toc, .navbox, .ambox, .imbox, .licenseContainer, .ws-header').remove();
  root.find('li, tr').each((_, el) => {
    if ($(el).find('a').toArray().some(a => children.includes(wikiTarget($(a).attr('href'))))) $(el).remove();
  });
  root.find('p').each((_, el) => {
    if (!$(el).find('a').toArray().some(a => children.includes(wikiTarget($(a).attr('href'))))) return;
    const copy = $(el).clone(); copy.find('a').remove();
    if (!copy.text().replace(/[\s|·←→»«<>]+/g, '')) $(el).remove();
  });
  const blocks = [];
  const selector = 'p, h2, h3, h4, h5, h6, li, dd, dt, .poem';
  root.find(selector).each((_, el) => {
    if ($(el).parents('p, li, dd, dt, .poem').length) return;
    const text = $(el).text().trim();
    if (!text || (children.length && text === 'الفهرس')) return;
    blocks.push({ type: /^h[2-6]$/.test(el.tagName) ? 'heading' : 'paragraph', text });
  });
  return { author, translator, children, blocks };
}
