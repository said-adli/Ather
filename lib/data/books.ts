export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  readUrl: string;
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
    title: "العقيدة الواسطية",
    author: "ابن تيمية",
    category: "عقيدة",
    description: "رسالة مختصرة ومهمة في بيان عقيدة أهل السنة والجماعة.",
    readUrl: "https://shamela.ws/book/7422"
  },
  {
    id: "tawheed",
    title: "كتاب التوحيد",
    author: "محمد بن عبد الوهاب",
    category: "عقيدة",
    description: "كتاب يعنى ببيان حق الله على العبيد وتفصيل أنواع الشرك.",
    readUrl: "https://shamela.ws/book/11993"
  },
  {
    id: "arbaeen",
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

export const BOOK_CATEGORIES = Array.from(new Set(ISLAMIC_BOOKS.map(b => b.category)));
