import test from 'node:test';
import assert from 'node:assert/strict';
import { wikiTarget, extractSourcePage } from '../scripts/reading-source.mjs';
test('source traversal recognizes both page and edit links, excludes other hosts', () => {
  assert.equal(wikiTarget('/wiki/كتاب/باب_أول#x'), 'كتاب/باب أول');
  assert.equal(wikiTarget('/w/index.php?title=%D9%83%D8%AA%D8%A7%D8%A8%2F8&action=edit&redlink=1'), 'كتاب/8');
  assert.equal(wikiTarget('https://example.org/wiki/كتاب/1'), null);
  assert.equal(wikiTarget('/wiki/%zz'), null);
});
test('incomplete contents cannot be published as a complete book', () => {
  assert.throws(() => extractSourcePage('<div class="mw-parser-output"><a class="new" href="/w/index.php?title=كتاب/8&redlink=1">٨</a></div>', 'كتاب'), /Missing chapter/);
});
test('import retains text and poetry while removing navigation and licensing boxes', () => {
  const result = extractSourcePage('<div class="ws-author">المؤلف</div><div class="mw-parser-output"><table><tr><td><a href="/wiki/كتاب/1">الأول</a></td></tr></table><p><a href="/wiki/كتاب/1">الأول</a> | <a href="/wiki/كتاب/1">الأول</a></p><p>النص الصحيح</p><div class="poem"><p>شعر كامل</p></div><div class="imbox"><p>ترخيص</p></div></div>', 'كتاب');
  assert.equal(result.author, 'المؤلف');
  assert.deepEqual(result.children, ['كتاب/1']);
  assert.deepEqual(result.blocks.map(b=>b.text), ['النص الصحيح','شعر كامل']);
});
