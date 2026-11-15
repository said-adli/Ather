import Link from 'next/link';
export default function OfflinePage() {
  return <div className="p-8 text-center leading-8" dir="rtl"><h1 className="text-2xl font-bold mb-4">أنت غير متصل بالإنترنت</h1><p className="text-slate-600 mb-6">هذه الصفحة غير متاحة في الذاكرة المؤقتة. أعد الاتصال لتحميلها. الصوت والبحث وبعض النصوص تحتاج إلى اتصال.</p><Link className="text-emerald-700 underline" href="/library">العودة إلى المكتبة</Link></div>;
}
