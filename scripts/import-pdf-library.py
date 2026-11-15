"""Verify complete publisher PDFs and build the internal reader catalogue.
Run with Python 3 and scripts/requirements-reading.txt installed.
Downloads stay in READING_PDF_CACHE (default /tmp/ather-pdf-cache).
"""
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import unicodedata
from datetime import date
from pypdf import PdfReader


def normalized(text):
    return ''.join(c for c in unicodedata.normalize('NFKC', text) if not c.isspace() and not unicodedata.combining(c))


def verify_license(text, text_rights):
    value = normalized(text)
    if 'المشاعالإبداعي' not in value or 'نسبالمصنف' not in value or not re.search(r'[٤4][٫.][٠0]|[٠0][٫.][٤4]', value):
        raise ValueError('No explicit supported Creative Commons 4.0 grant')
    # Publish only unrestricted BY editions. Other grants need separate consideration.
    if any(word in value for word in ['غيرتجاري', 'غيرالتجاري', 'منعالاشتقاق', 'منعاشتقاق', 'دونمشتقات']):
        raise ValueError('Restricted edition is not in this catalogue')
    if 'للملكيةالعامة' not in value and 'بهذاالكتاب' not in value and 'بهذاالعمل' not in value:
        raise ValueError('Text redistribution rights are unclear')
    if text_rights == 'licensed-translation':
        if 'الترجمةالعربيةلنصهذاالكتابمرخصةبموجبرخصةالمشاعالإبداعي' not in value:
            raise ValueError('Arabic translation grant is unclear')
    elif text_rights == 'arabic-public-domain':
        if 'ترجمة' in value or 'نصالعملالأصليخاضعةللملكيةالعامة' not in value:
            raise ValueError('Arabic original text rights are unclear')
    else:
        raise ValueError('Text rights classification is required')
    return 'CC BY 4.0'


def import_book(book):
    cache = Path(os.environ.get('READING_PDF_CACHE', '/tmp/ather-pdf-cache'))
    cache.mkdir(parents=True, exist_ok=True)
    pdf = cache / (book['publisherId'] + '.pdf')
    headers = cache / (book['publisherId'] + '.headers')
    if not pdf.exists() or not headers.exists():
        subprocess.run(['curl', '--fail', '--silent', '--show-error', '--retry', '2', '--max-time', '90', '--dump-header', str(headers), book['sourceUrl'], '-o', str(pdf) + '.tmp'], check=True)
        Path(str(pdf) + '.tmp').replace(pdf)
    size = pdf.stat().st_size
    if not 1000 < size < 40 * 1024 * 1024 or pdf.read_bytes()[:5] != b'%PDF-':
        raise ValueError('Invalid publisher document')
    reader = PdfReader(pdf)
    frontmatter = ''.join(page.extract_text() or '' for page in reader.pages[:8])
    def key(text):
        text = normalized(text).translate(str.maketrans({'أ':'ا','إ':'ا','آ':'ا','ى':'ي','ـ':''}))
        return ''.join(c for c in text if c.isalnum()).translate(str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789'))
    title_key = key(book['title'])
    # PDFs can encode RTL digit runs in visual order; verify both exact orders.
    visual_title = re.sub(r'\d+', lambda match: match[0][::-1], title_key)
    if title_key not in key(frontmatter) and visual_title not in key(frontmatter):
        raise ValueError('Publisher title does not match catalogue')
    if key(book['author']) not in key(frontmatter):
        raise ValueError('Publisher author does not match catalogue')
    rights = None
    rights_page = None
    for index, page in enumerate(reader.pages[:8]):
        text = page.extract_text() or ''
        if 'المشاعالإبداعي' in normalized(text):
            verify_license(text, book.get('textRights'))
            rights = unicodedata.normalize('NFKC', text).strip()
            rights_page = index + 1
            break
    if rights is None:
        raise ValueError('No verifiable rights page')
    if len(reader.pages) < 5:
        raise ValueError('Incomplete publisher document')
    reader.pages[-1].get_contents()
    etags = re.findall(r'^etag:\s*("[\w-]+")\s*$', headers.read_text(), re.I | re.M)
    if not etags:
        raise ValueError('Missing stable publisher ETag')
    return dict(book, pageCount=len(reader.pages), byteLength=size, etag=etags[-1], sha256=hashlib.sha256(pdf.read_bytes()).hexdigest(), license='CC BY 4.0', licenseUrl='https://creativecommons.org/licenses/by/4.0/deed.ar', rightsPage=rights_page, rightsStatement=rights, verifiedAt=date.today().isoformat())


def main():
    sources = json.loads(Path('scripts/pdf-sources.json').read_text())
    results = []
    failures = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        jobs = {pool.submit(import_book, book): book for book in sources}
        for job in concurrent.futures.as_completed(jobs):
            book = jobs[job]
            try:
                result = job.result()
                results.append(result)
                print(result['id'], result['pageCount'], 'pages', result['license'], flush=True)
            except Exception as error:
                failures.append(dict(id=book['id'], error=str(error)))
                print('REJECTED', book['id'], str(error), flush=True)
    Path('/tmp/ather-pdf-import-failures.json').write_text(json.dumps(failures, ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit('Import failed; existing catalogues were preserved')
    results.sort(key=lambda book: book['id'])
    Path('lib/data/pdf-catalog.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
    library = [{key: book[key] for key in ['id', 'title', 'author', 'category', 'description', 'pageCount']} | {'readUrl': book['sourceUrl'], 'readerHref': '/library/pdf/' + book['id']} for book in results]
    Path('lib/data/pdf-library.json').write_text(json.dumps(library, ensure_ascii=False, indent=2) + '\n')
    Path('/tmp/ather-pdf-import-failures.json').write_text(json.dumps(failures, ensure_ascii=False, indent=2))
    print(len(results), 'verified publisher PDFs;', len(failures), 'rejected', flush=True)


if __name__ == '__main__':
    main()
