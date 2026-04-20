import fs from 'fs';

const data = JSON.parse(fs.readFileSync('hisn_almuslim_raw.json', 'utf8'));

let tsOutput = `export type AthkarCategory = string;\n\n`;
tsOutput += `export interface AthkarCategoryMeta {\n  id: AthkarCategory;\n  title: string;\n  icon: string;\n}\n\n`;
tsOutput += `export interface AthkarItem {\n  id: string;\n  category: AthkarCategory;\n  text: string;\n  count: number;\n  reference: string;\n}\n\n`;

const categoriesObj = {};
const athkarArray = [];

let catIndex = 1;
// Rn0x JSON structure: { "Chapter Title": { "text": ["..."], "footnote": ["..."] } }
for (const [title, details] of Object.entries(data)) {
  const catId = `cat_${catIndex}`;
  
  // Try to determine a default icon based on title keywords
  let icon = '🤲';
  if (title.includes('صباح')) icon = '🌅';
  else if (title.includes('مساء')) icon = '🌇';
  else if (title.includes('نوم')) icon = '🌙';
  else if (title.includes('استيقاظ')) icon = '☀️';
  else if (title.includes('صلاة') || title.includes('مسجد') || title.includes('أذان')) icon = '🕌';
  else if (title.includes('وضوء') || title.includes('خلاء')) icon = '💧';
  else if (title.includes('طعام') || title.includes('أكل')) icon = '🍽️';
  else if (title.includes('سفر') || title.includes('ركوب')) icon = '✈️';
  else if (title.includes('مرض') || title.includes('مريض')) icon = '❤️‍🩹';
  else if (title.includes('بيت') || title.includes('منزل')) icon = '🏠';
  else if (title.includes('لبس') || title.includes('ثوب')) icon = '👕';
  else if (title.includes('ريح') || title.includes('مطر') || title.includes('رعد')) icon = '🌧️';
  
  categoriesObj[catId] = { id: catId, title, icon };

  if (details.text && Array.isArray(details.text)) {
    details.text.forEach((text, i) => {
      // Find numbers inside the text to extract the count
      let count = 1;
      if (text.includes("ثلاث مرات") || text.includes("ثلاثاً") || text.includes("ثلاثا")) count = 3;
      if (text.includes("عشر مرات")) count = 10;
      if (text.includes("مائة مرة") || text.includes("مئة مرة")) count = 100;
      if (text.includes("سبع مرات")) count = 7;
      if (text.includes("أربع مرات")) count = 4;
      
      const reference = details.footnote && details.footnote[i] ? details.footnote[i] : "";

      athkarArray.push({
        id: `${catId}_${i + 1}`,
        category: catId,
        text: text.trim(),
        count: count,
        reference: reference.trim().replace(/\n/g, " ")
      });
    });
  }

  catIndex++;
}

tsOutput += `export const ATHKAR_CATEGORIES: Record<AthkarCategory, AthkarCategoryMeta> = ${JSON.stringify(categoriesObj, null, 2)};\n\n`;
tsOutput += `export const ATHKAR: AthkarItem[] = ${JSON.stringify(athkarArray, null, 2)};\n`;

fs.writeFileSync('lib/data/athkar.ts', tsOutput);
console.log('Successfully generated lib/data/athkar.ts');
