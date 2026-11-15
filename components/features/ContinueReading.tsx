"use client";
import Link from 'next/link';
import { useLocalValue, parseLocalValue } from '@/lib/hooks/useLocalValue';

export function ContinueReading({ id, count }: { id: string; count: number }) {
  const [raw] = useLocalValue(`ather:reading:${id}`);
  const progress = parseLocalValue(raw);
  const saved = typeof progress.chapter === 'number' && Number.isInteger(progress.chapter) && progress.chapter > 0 && progress.chapter <= count;
  const chapter = saved ? progress.chapter as number : 1;
  return <Link className="block rounded-2xl bg-emerald-700 text-white font-bold text-center p-4" href={`/library/books/${id}/${chapter}`}>{saved ? `متابعة القراءة · الفصل ${chapter}` : 'ابدأ القراءة'}</Link>;
}
