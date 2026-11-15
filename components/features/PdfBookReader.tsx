"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { useLocalValue, parseLocalValue } from '@/lib/hooks/useLocalValue';

type PdfMeta = { id: string; title: string; author: string; translator?: string; pageCount: number; byteLength: number; sha256: string; sourceUrl: string; license: string; licenseUrl: string; rightsPage: number; textRights: string };
export function PdfBookReader({ book }: { book: PdfMeta }) {
  const [raw, writeProgress] = useLocalValue(`ather:pdf-reading:${book.id}`);
  const saved = parseLocalValue(raw).page;
  const [chosenPage, setChosenPage] = useState<number | null>(null);
  const pageNumber = chosenPage ?? (typeof saved === 'number' && Number.isInteger(saved) && saved >= 1 && saved <= book.pageCount ? saved : 1);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [zoom, setZoom] = useState(1);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [rendered, setRendered] = useState(0);
  const [text, setText] = useState('');
  const [width, setWidth] = useState(320);
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let active = true;
    let task: { destroy: () => Promise<void> } | undefined;
    const controller = new AbortController();
    async function load() {
      const engine = await import('pdfjs-dist/legacy/build/pdf.mjs');
      if (!active) return;
      engine.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
      const transport = new engine.PDFDataRangeTransport(book.byteLength, new Uint8Array(), true);
      transport.abort = () => controller.abort();
      transport.requestDataRange = (begin: number, end: number) => {
        async function receive() {
          const result = new Uint8Array(end - begin);
          for (let offset = begin; offset < end; offset += 1048576) {
            const finish = Math.min(end, offset + 1048576);
            const query = new URLSearchParams({ begin: String(offset), end: String(finish), version: book.sha256 });
            const response = await fetch(`/api/library/pdf/${book.id}?${query}`, { signal: controller.signal });
            if (!response.ok) throw new Error('Unavailable source');
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (bytes.length !== finish - offset) throw new Error('Truncated source');
            result.set(bytes, offset - begin);
          }
          if (active) transport.onDataRange(begin, result);
        }
        receive().catch(() => { if (active && !controller.signal.aborted) { setError('تعذر تحميل نسخة الناشر. تحقق من الاتصال وحاول مجددًا.'); void task?.destroy(); } });
      };
      const loading = engine.getDocument({ range: transport, rangeChunkSize: 262144, disableAutoFetch: true, disableStream: true, stopAtErrors: true });
      task = loading;
      const document = await loading.promise;
      if (document.numPages !== book.pageCount) { await loading.destroy(); throw new Error('Publisher edition changed'); }
      if (active) setPdf(document);
    }
    load().catch(() => { if (active && !controller.signal.aborted) setError('تعذر فتح الكتاب. تحقق من الاتصال وحاول مجددًا.'); });
    return () => { active = false; controller.abort(); void task?.destroy(); };
  }, [book.id, book.byteLength, book.pageCount, book.sha256, retry]);
  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let active = true;
    let rendering: RenderTask | undefined;
    async function draw() {
      const page = await pdf!.getPage(pageNumber);
      if (!active || !canvas.current) return;
      setRendered(0);
      const unscaled = page.getViewport({ scale: 1 });
      const scale = Math.max(1, width - 16) / unscaled.width * zoom;
      const viewport = page.getViewport({ scale });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const target = canvas.current;
      target.width = Math.ceil(viewport.width * ratio);
      target.height = Math.ceil(viewport.height * ratio);
      target.style.width = `${viewport.width}px`;
      target.style.height = `${viewport.height}px`;
      rendering = page.render({ canvas: target, viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
      const words = await page.getTextContent();
      await rendering.promise;
      if (active) { setRendered(pageNumber); setText(words.items.map(item => 'str' in item ? item.str : '').join(' ')); }
    }
    draw().catch(reason => { if (active && reason?.name !== 'RenderingCancelledException') setError('تعذر عرض هذه الصفحة. حاول تحميل الكتاب مجددًا.'); });
    return () => { active = false; rendering?.cancel(); };
  }, [pdf, pageNumber, width, zoom]);
  function goTo(page: number) {
    if (!Number.isInteger(page) || page < 1 || page > book.pageCount) return;
    setChosenPage(page); setRendered(0); setText('');
    try { writeProgress(JSON.stringify({ page })); } catch { setStorageError(true); }
    container.current?.scrollTo({ left: 0 });
    document.getElementById('app-scroll')?.scrollTo({ top: 0, behavior: 'instant' });
  }
  return <div dir="rtl" className="min-h-full bg-[#FDFBF7] pb-8">
    <header className="sticky top-0 bg-[#FDFBF7] z-10 border-b border-slate-200 p-4">
      <Link href="/library" className="text-sm text-emerald-800">← المكتبة</Link>
      <h1 className="font-arabic text-xl font-bold mt-3">{book.title}</h1>
      <p className="text-xs text-slate-500 mt-1">{book.author} · نسخة الناشر · {book.pageCount.toLocaleString('ar')} صفحة</p>
      {book.translator && <p className="text-xs text-slate-500 mt-1">ترجمة: {book.translator}</p>}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-sm">
        <button onClick={() => goTo(pageNumber - 1)} disabled={pageNumber === 1} className="border rounded-lg px-3 py-2 disabled:opacity-30">السابقة</button>
        <form onSubmit={event => { event.preventDefault(); goTo(Number(new FormData(event.currentTarget).get('page'))); }} className="flex items-center gap-1">
          <input key={pageNumber} name="page" aria-label="رقم الصفحة" type="number" min={1} max={book.pageCount} defaultValue={pageNumber} className="w-16 border rounded-lg p-2 text-center bg-white" />
          <button className="border rounded-lg p-2">انتقل</button>
        </form>
        <button onClick={() => goTo(pageNumber + 1)} disabled={pageNumber === book.pageCount} className="border rounded-lg px-3 py-2 disabled:opacity-30">التالية</button>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
        <span role="status">الصفحة {pageNumber} من {book.pageCount}</span>
        <div className="flex gap-2"><button aria-label="تصغير الصفحة" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - .25))} className="border rounded-lg p-2 disabled:opacity-30">−</button><button aria-label="تكبير الصفحة" disabled={zoom >= 3} onClick={() => setZoom(Math.min(3, zoom + .25))} className="border rounded-lg p-2 disabled:opacity-30">+</button></div>
      </div>
    </header>
    {error && <div role="alert" className="p-6 text-center leading-8"><p>{error}</p><button className="mt-3 rounded-xl bg-emerald-800 text-white px-5 py-2" onClick={() => { setError(''); setPdf(null); setRendered(0); setRetry(retry + 1); }}>إعادة المحاولة</button></div>}
    <>
      {!error && rendered !== pageNumber && <p role="status" className="p-4 text-center text-sm text-slate-500">جارٍ تحميل الصفحة…</p>}
      <div ref={container} hidden={!!error} className="overflow-x-auto p-2" dir="ltr" aria-busy={rendered !== pageNumber}>
        <canvas ref={canvas} aria-hidden="true" className={rendered !== pageNumber ? 'invisible' : 'bg-white shadow-sm mx-auto'} />
        <p className="sr-only" dir="rtl">{text || (rendered === pageNumber ? 'صفحة غلاف مصورة' : '')}</p>
      </div>
    </>
    <div className="p-4 text-xs text-slate-600 leading-7">
      <p>{storageError ? 'تعذر حفظ الصفحة على هذا الجهاز.' : 'موضع القراءة محفوظ تلقائيًا على هذا الجهاز.'}</p>
      <p>الكتاب يُقرأ داخل أثر؛ تحميل صفحاته يحتاج إلى اتصال بالإنترنت.</p>
      <details className="border border-slate-200 rounded-xl p-3 mt-3 bg-white"><summary className="font-bold cursor-pointer">المصدر وحقوق النسخة</summary><p>نسخة مؤسسة هنداوي الأصلية؛ {book.textRights === 'licensed-translation' ? 'الترجمة العربية وتصميم الكتاب مرخّصان برخصة المشاع الإبداعي.' : 'النص العربي الأصلي في الملكية العامة وفق الناشر، وتصميم الكتاب مرخّص برخصة المشاع الإبداعي.'} بيانات التأليف والحقوق داخل صفحات الكتاب.</p><button onClick={() => goTo(book.rightsPage)} className="text-emerald-800 underline">اقرأ صفحة الحقوق</button>{' · '}<a href={book.licenseUrl} target="_blank" rel="noreferrer" className="underline">{book.license}</a>{' · '}<a href={book.sourceUrl} target="_blank" rel="noreferrer" className="underline">ملف الناشر الأصلي</a></details>
    </div>
  </div>;
}
