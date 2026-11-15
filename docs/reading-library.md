<!-- coderabbit-ai-generated:v1 -->

# Reading library maintenance

Use Node 22.13+ (Node 24 recommended) and `npm ci`. Normal builds use committed metadata and text snapshots; they do not download books.

## Content checks

```sh
npm test
npm run check:content
npm run lint
npm run build
```

The library includes Wikisource text snapshots, original publisher PDFs, and the existing Hadith API readers. Active catalogue entries always point to an internal reader. External reference metadata in `lib/data/books.ts` is retained for future imports and is excluded from the active catalogue.

## Wikisource texts

Definitions: `scripts/reading-sources.json`; snapshots: `lib/data/reading/`; generated metadata: `lib/data/reading-catalog.json`.

```sh
node scripts/import-reading.mjs BOOK_ID
node scripts/build-reading-catalog.mjs
npm run check:content
```

The importer verifies the author, follows the source contents, rejects missing or empty chapters and explicit incomplete-source notices, and deduplicates identical source revisions. It preserves old snapshots if an import fails. A completed digital source edition does not establish equivalence to a scholarly print edition; source links and attribution remain visible in the reader.

## Publisher PDFs

Definitions: `scripts/pdf-sources.json`; verified source metadata: `lib/data/pdf-catalog.json`; lightweight UI metadata: `lib/data/pdf-library.json`.

```sh
python3 -m venv /tmp/ather-pdf-tools
/tmp/ather-pdf-tools/bin/pip install -r scripts/requirements-reading.txt
/tmp/ather-pdf-tools/bin/python scripts/import-pdf-library.py
npm run check:content
```

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:cdde7eaba4c6ffd3207cc4afd04025fb8d7fdbeab9b0951139241a5ef00172d0 -->

The importer checks the publisher document, author, title, page count and rights page, then records the ETag, length and SHA-256. `textRights` must identify either an explicitly CC BY 4.0 licensed Arabic translation or an original Arabic text identified by the publisher as public domain; a CC license for the layout alone does not license a translation. Failed verification preserves the existing catalogues. Check the publisher’s full edition and its rights before selecting a title. Downloads are maintenance fixtures in `/tmp/ather-pdf-cache`; override with `READING_PDF_CACHE`. They are not committed or downloaded during deployment. Run `/tmp/ather-pdf-tools/bin/python -m unittest discover -s tests -p 'test_pdf_rights.py'` to verify these rights rules.

<!-- /coderabbit-ai-generated:v1 -->

The PDF.js legacy browser build renders the original document inside the application. `/api/library/pdf/[id]` serves pinned publisher bytes in chunks of at most 1 MiB. Requests require an allowlisted ID, valid bounds and the current source version. ETag changes or truncated responses fail visibly. Original publisher credits and license links remain accessible. PDFs and Hadith API collections require connectivity; full offline reading is not promised.

## Production

The connected Vercel project publishes production from `main` at https://ather-six.vercel.app. Pushing the task branch creates a preview; it does not update the production domain. Verify the production deployment status and an actual internal reader after publishing.
