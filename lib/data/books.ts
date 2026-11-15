import pdfLibrary from './pdf-library.json' with { type: 'json' };
import expandedReading from './reading-catalog.json' with { type: 'json' };

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  readUrl: string;
  readingId?: string;
  readerHref?: string;
  chapterCount?: number;
  pageCount?: number;
}

export const ISLAMIC_BOOKS: Book[] = [
  {
    id: "bidayah",
    title: "البداية والنهاية",
    author: "ابن كثير",
    category: "تاريخ",
    description: "موسوعة تاريخية ضخمة تبدأ من بدء الخلق وتنتهي بأحداث النهاية.",
    readUrl: "https://shamela.ws/book/71"
  },
  {
    id: "daa",
    readingId: "daa",
    title: "الداء والدواء",
    author: "ابن قيم الجوزية",
    category: "تزكية",
    description: "كتاب نفيس في أمراض القلوب وعلاجها، والرد على من اتبع الهوى.",
    readUrl: "https://shamela.ws/book/12211"
  },
  {
    id: "riyadh",
    title: "رياض الصالحين",
    author: "النووي",
    category: "حديث",
    description: "من أهم كتب الحديث الجامعة للأحاديث الصحاح الموجهة للسلوك والأخلاق.",
    readUrl: "https://shamela.ws/book/2115"
  },
  {
    id: "zad",
    title: "زاد المعاد في هدي خير العباد",
    author: "ابن قيم الجوزية",
    category: "سيرة",
    description: "يتناول سيرة النبي وأحكامه في مختلف العبادات والمعاملات.",
    readUrl: "https://shamela.ws/book/12339"
  },
  {
    id: "wasitiyyah",
    readingId: "wasitiyyah",
    title: "العقيدة الواسطية",
    author: "ابن تيمية",
    category: "عقيدة",
    description: "رسالة مختصرة ومهمة في بيان عقيدة أهل السنة والجماعة.",
    readUrl: "https://shamela.ws/book/7422"
  },
  {
    id: "tawheed",
    readingId: "tawheed",
    title: "كتاب التوحيد",
    author: "محمد بن عبد الوهاب",
    category: "عقيدة",
    description: "كتاب يعنى ببيان حق الله على العبيد وتفصيل أنواع الشرك.",
    readUrl: "https://shamela.ws/book/11993"
  },
  {
    id: "arbaeen",
    readerHref: "/library/hadith/nawawi/1",
    title: "الأربعون النووية",
    author: "النووي",
    category: "حديث",
    description: "متن يضم 42 حديثاً تعتبر جوامع الكلم ومن أصول الإسلام.",
    readUrl: "https://shamela.ws/book/11795"
  },
  {
    id: "raheeq",
    title: "الرحيق المختوم",
    author: "صفي الرحمن المباركفوري",
    category: "سيرة",
    description: "من أشهر كتب السيرة النبوية المعاصرة الجامعة والمفصلة.",
    readUrl: "https://shamela.ws/book/11832"
  },
  {
    id: "fath",
    title: "فتح الباري بشرح صحيح البخاري",
    author: "ابن حجر العسقلاني",
    category: "حديث",
    description: "أعظم شروح صحيح البخاري وأجمعها، لا يستغني عنه طالب علم.",
    readUrl: "https://shamela.ws/book/1673"
  },
  {
    id: "umm",
    title: "الأم",
    author: "الإمام الشافعي",
    category: "فقه",
    description: "كتاب الإمام الشافعي في الفقه والأصول وهو من أهم مراجع المذهب الشافعي.",
    readUrl: "https://shamela.ws/book/5610"
  },
  {
    id: "mughni",
    title: "المغني",
    author: "ابن قدامة المقدسي",
    category: "فقه",
    description: "كتاب ضخم في الفقه المقارن، ويعتبر من أهم كتب الفقه الحنبلي.",
    readUrl: "https://shamela.ws/book/11643"
  },
  {
    id: "seerah",
    title: "سيرة ابن هشام",
    author: "ابن هشام",
    category: "سيرة",
    description: "من أهم وأقدم المراجع في السيرة النبوية والتاريخ الإسلامي المبكر.",
    readUrl: "https://shamela.ws/book/23833"
  }
];

export const READING_ADDITIONS: Book[] = [
  { id: "adab", readingId: "adab", title: "الأدب المفرد", author: "الإمام البخاري", category: "حديث", description: "كتاب في الآداب وصلة الرحم؛ أحاديثه تحتاج إلى النظر في تخريج كل حديث.", readUrl: "https://ar.wikisource.org/wiki/الأدب_المفرد" },
  { id: "broken-wings", readingId: "broken-wings", title: "الأجنحة المتكسرة", author: "جبران خليل جبران", category: "روايات", description: "رواية أدبية عن الحب والحرية والمجتمع، نشرت سنة 1912.", readUrl: "https://ar.wikisource.org/wiki/الأجنحة_المتكسرة" },
  { id: "hayy", readingId: "hayy", title: "حي بن يقظان", author: "ابن طفيل", category: "روايات", description: "قصة فلسفية تراثية تتأمل المعرفة والإنسان والطبيعة.", readUrl: "https://ar.wikisource.org/wiki/حي_بن_يقظان" },
  { id: "kalila", readingId: "kalila", title: "كليلة ودمنة", author: "عبد الله بن المقفع", category: "قصص", description: "حكايات تراثية على ألسنة الحيوان، في الحكمة والأخلاق والسياسة.", readUrl: "https://ar.wikisource.org/wiki/كليلة_ودمنة" },
  { id: "bukhala", readingId: "bukhala", title: "البخلاء", author: "الجاحظ", category: "قصص", description: "قصص وأخبار أدبية تصور البخل وأحوال الناس بأسلوب ساخر.", readUrl: "https://ar.wikisource.org/wiki/البخلاء" },
];

const expandedBooks: Book[] = expandedReading;
const expandedById = new Map<string, Book>(expandedBooks.map(book => [book.id, book]));
const HADITH_BOOKS: Book[] = [
  { id: 'hadith-bukhari', title: 'صحيح البخاري', author: 'محمد بن إسماعيل البخاري', category: 'حديث', description: 'كتب الصحيح وأبوابه، بالنص العربي والترقيم من المصدر الرقمي.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/bukhari' },
  { id: 'hadith-muslim', title: 'صحيح مسلم', author: 'مسلم بن الحجاج', category: 'حديث', description: 'قراءة مجموعات الصحيح وأقسامه من داخل التطبيق.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/muslim' },
  { id: 'hadith-malik', title: 'موطأ مالك', author: 'مالك بن أنس', category: 'حديث', description: 'أحاديث وآثار وفقه؛ تنقل بيانات النص والحكم كما يوردها المصدر.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/malik' },
  { id: 'hadith-abudawud', title: 'سنن أبي داود', author: 'أبو داود السجستاني', category: 'حديث', description: 'أبواب السنن بالنص العربي، مع أحكام المصدر حين تتوفر.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/abudawud' },
  { id: 'hadith-tirmidhi', title: 'جامع الترمذي', author: 'محمد بن عيسى الترمذي', category: 'حديث', description: 'أقسام الجامع بنصوصها وأحكام الحديث المنقولة من المصدر.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/tirmidhi' },
  { id: 'hadith-nasai', title: 'سنن النسائي', author: 'أحمد بن شعيب النسائي', category: 'حديث', description: 'قراءة أبواب السنن وأحاديثها بالنص العربي.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/nasai' },
  { id: 'hadith-ibnmajah', title: 'سنن ابن ماجه', author: 'ابن ماجه القزويني', category: 'حديث', description: 'كتب السنن وأبوابها؛ أحكام الأحاديث منسوبة إلى مصدرها عند توفرها.', readUrl: 'https://github.com/fawazahmed0/hadith-api', readerHref: '/library/hadith/ibnmajah' },
];

export const BOOKS: Book[] = [...ISLAMIC_BOOKS, ...READING_ADDITIONS]
  .map(book => expandedById.get(book.id) ?? book)
  .concat(expandedBooks.filter(book => ![...ISLAMIC_BOOKS, ...READING_ADDITIONS].some(existing => existing.id === book.id)))
  .concat(HADITH_BOOKS, pdfLibrary)
  .filter(book => book.readingId || book.readerHref);
export function bookReaderHref(book: Book): string | null {
  return book.readerHref ?? (book.readingId ? `/library/books/${book.readingId}` : null);
}

export const BOOK_CATEGORIES = Array.from(new Set(BOOKS.map(b => b.category)));
