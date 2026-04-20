import fs from 'fs';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateText(text) {
  if (!text || text.trim() === "") return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return text; 
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch (e) {
    return text;
  }
}

async function run() {
  const infoRes = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json");
  const info = await infoRes.json();
  
  const dict = {};
  const uniqueTerms = new Set();
  
  // Custom manual mappings for absolute precision on common Bukhari terms
  dict["Revelation"] = "بدء الوحي";
  dict["Belief"] = "الإيمان";
  dict["Knowledge"] = "العلم";
  dict["Ablution (Wudu')"] = "الوضوء";
  dict["Bathing (Ghusl)"] = "الغسل";
  dict["Menstrual Periods"] = "الحيض";
  dict["Rubbing hands and feet with dust (Tayammum)"] = "التيمم";
  dict["Prayers (Salat)"] = "الصلاة";
  dict["Times of the Prayers"] = "مواقيت الصلاة";
  dict["Call to Prayers (Adhaan)"] = "الأذان";
  dict["Characteristics of Prayer"] = "صفة الصلاة";
  dict["Friday Prayer"] = "الجمعة";

  for (const collection of Object.values(info)) {
    if (collection.metadata && collection.metadata.sections) {
      for (const [id, name] of Object.entries(collection.metadata.sections)) {
        if (name && typeof name === 'string' && name.trim() !== "") {
          uniqueTerms.add(name.trim());
        }
      }
    }
  }

  const termsArray = Array.from(uniqueTerms);
  console.log(`Found ${termsArray.length} unique English chapter names. Starting translation...`);

  let count = 0;
  for (const term of termsArray) {
    if (dict[term]) continue; // Skip if already mapped
    
    if (/^[\u0600-\u06FF\s0-9\.]+$/.test(term)) {
        dict[term] = term;
        continue;
    }

    const translated = await translateText(term);
    
    // Clean up typical translation artifacts
    let cleanTranslated = translated.replace(/^Book of /i, '').replace(/^The book of /i, '');
    
    dict[term] = cleanTranslated;
    count++;
    if (count % 20 === 0) console.log(`Translated ${count}/${termsArray.length}...`);
    await delay(150); // Be polite to the API
  }

  // Ensure output directory exists if not running from root
  fs.writeFileSync('./lib/data/hadith-dict.json', JSON.stringify(dict, null, 2));
  console.log("✅ Finished generating translation dictionary at lib/data/hadith-dict.json!");
}

run();
