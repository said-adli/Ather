"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ReadingChapter } from '@/lib/reading';
import { useLocalValue, parseLocalValue } from '@/lib/hooks/useLocalValue';

export function BookReader({ id, title, chapter, count, content }: { id: string; title: string; chapter: number; count: number; content: ReadingChapter }) {
  const [rawPrefs, writePrefs] = useLocalValue('ather:reader-settings');
  const prefs = parseLocalValue(rawPrefs);
  const fontSize = typeof prefs.fontSize === 'number' && Number.isFinite(prefs.fontSize) ? Math.min(36, Math.max(18, prefs.fontSize)) : 24;
  const night = prefs.night === true;
  const [storageError, setStorageError] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const key = `ather:reading:${id}`;
    let block = 0;
    let offset = 0;
    let active = true;
    let restored = false;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved?.chapter === chapter && Number.isInteger(saved.block) && saved.block >= 0 && saved.block < content.blocks.length) block = saved.block;
      if (saved?.chapter === chapter && Number.isFinite(saved.offset) && saved.offset >= 0) offset = saved.offset;
      localStorage.setItem(key, JSON.stringify({ chapter, block, offset }));
    } catch { /* Scroll/action writes report unavailable storage. */ }
    const scrollRoot = document.getElementById('app-scroll');
    const readingTop = () => (articleRef.current?.previousElementSibling?.getBoundingClientRect().bottom ?? 120) + 16;
    let timer = 0;
    document.fonts.ready.then(() => {
      if (!active) return;
      timer = requestAnimationFrame(() => {
        const target = document.getElementById(`block-${block}`);
        if (block === 0 && offset === 0 && scrollRoot) scrollRoot.scrollTo({ top: 0, behavior: "instant" });
        else if (target && scrollRoot) scrollRoot.scrollTo({ top: scrollRoot.scrollTop + target.getBoundingClientRect().top - readingTop() + Math.min(offset, target.getBoundingClientRect().height - 1), behavior: 'instant' });
        restored = true;
      });
    });
    // Save the visible paragraph plus its offset after scrolling settles.
    let debounce: ReturnType<typeof setTimeout>;
    const save = () => {
      if (!restored) return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const top = readingTop();
        const elements = Array.from(articleRef.current?.querySelectorAll('[data-block]') ?? []);
        const first = elements.find(el => el.getBoundingClientRect().bottom > top) ?? elements.at(-1);
        const index = Number(first?.getAttribute('data-block') ?? 0);
        try { localStorage.setItem(key, JSON.stringify({ chapter, block: index, offset: Math.max(0, top - (first?.getBoundingClientRect().top ?? top)) })); } catch { setStorageError(true); }
      }, 150);
    };
    scrollRoot?.addEventListener('scroll', save, { passive: true });
    return () => { active = false; cancelAnimationFrame(timer); clearTimeout(debounce); scrollRoot?.removeEventListener('scroll', save); };
  }, [id, chapter, content.blocks.length]);
  function preferences(size: number, dark: boolean) {
    try { writePrefs(JSON.stringify({ fontSize: size, night: dark })); } catch { setStorageError(true); }
  }
  return <div dir="rtl" className={`min-h-full pb-10 ${night ? 'bg-slate-900 text-slate-100' : 'bg-[#FDFBF7] text-slate-900'}`}>
    <header className={`sticky top-0 z-20 p-4 border-b ${night ? 'bg-slate-900 border-slate-700' : 'bg-[#FDFBF7] border-amber-900/10'}`}>
      <Link href={`/library/books/${id}`} className="text-sm underline">← فهرس {title}</Link>
      <div className="flex items-center justify-between gap-2 mt-4 text-sm">
        <span dir="ltr">{chapter} / {count}</span>
        <div className="flex gap-2">
          <button aria-label="تصغير الخط" disabled={fontSize <= 18} onClick={() => preferences(fontSize - 2, night)} className="border rounded-lg px-3 py-1 disabled:opacity-30">أ−</button>
          <button aria-label="تكبير الخط" disabled={fontSize >= 36} onClick={() => preferences(fontSize + 2, night)} className="border rounded-lg px-3 py-1 disabled:opacity-30">أ+</button>
          <button aria-pressed={night} onClick={() => preferences(fontSize, !night)} className="border rounded-lg px-3 py-1">{night ? 'نهاري' : 'ليلي'}</button>
        </div>
      </div>
    </header>
    <article ref={articleRef} className="px-6 py-8 font-arabic break-words" style={{ fontSize, lineHeight: 2.2 }}>
      <h1 className="font-bold text-[1.2em] mb-8">{content.title === "النص" ? title : content.title}</h1>
      {content.blocks.map((block, index) => block.type === 'heading'
        ? <h2 id={`block-${index}`} data-block={index} key={index} className="font-bold my-8 scroll-mt-36">{block.text}</h2>
        : <p id={`block-${index}`} data-block={index} key={index} className="mb-6 whitespace-pre-line scroll-mt-36">{block.text}</p>)}
    </article>
    <footer className="px-5 text-xs leading-7">
      <p>{storageError ? 'تعذر حفظ موضع القراءة على هذا الجهاز.' : 'يُحفظ موضع القراءة تلقائياً على هذا الجهاز.'}</p>
      <a href={content.sourceUrl} target="_blank" rel="noreferrer" className="underline">مصدر نص الفصل وسجل نسخته</a>
      <nav aria-label="التنقل بين الفصول" className="flex justify-between gap-3 mt-6 text-sm font-bold">
        {chapter > 1 ? <Link className="border rounded-xl p-3" href={`/library/books/${id}/${chapter - 1}`}>الفصل السابق</Link> : <span />}
        {chapter < count ? <Link className="border rounded-xl p-3" href={`/library/books/${id}/${chapter + 1}`}>الفصل التالي</Link> : <Link href={`/library/books/${id}`} className="border rounded-xl p-3">العودة للفهرس</Link>}
      </nav>
    </footer>
  </div>;
}
