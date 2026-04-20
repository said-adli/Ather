"use server";

import * as cheerio from "cheerio";

export interface DorarHadith {
  id: string;
  text: string;
  narrator: string;
  mohdith: string;
  source: string;
  numberOrPage: string;
  grade: string;
}

export async function searchDorar(query: string): Promise<DorarHadith[]> {
  try {
    const response = await fetch(`https://dorar.net/dorar/api?skey=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      next: { revalidate: 3600 }, // cache results for an hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Dorar: ${response.statusText}`);
    }

    const data = await response.json();
    const html = data.ahadith || "";

    const $ = cheerio.load(html);
    const results: DorarHadith[] = [];

    $(".hadith-info").each((index, element) => {
      const $info = $(element);
      const $hadith = $info.prev(".hadith");

      // Extract text and remove the initial numbering (e.g., "1 - ")
      let text = $hadith.text().trim();
      text = text.replace(/^\d+\s*-\s*/, "");

      // Extract info pieces using resilient selectors
      const getInfo = (label: string) => {
        return $info
          .find(`.info-subtitle:contains("${label}")`)
          .next()
          .text()
          .trim() || 
          // fallback if next() isn't an element but a text node (cheerio handles this differently, but just in case)
          $info.text().split(label)[1]?.split("|")[0]?.trim()?.replace(/^:/, "")?.trim() || "";
      };

      const narrator = getInfo("الراوي");
      const mohdith = getInfo("المحدث");
      const source = getInfo("المصدر");
      const numberOrPage = getInfo("الصفحة أو الرقم");
      const grade = getInfo("خلاصة حكم المحدث") || getInfo("حكم المحدث");

      // Only add valid matches
      if (text && grade) {
        results.push({
          id: `dorar_${index}_${Date.now()}`,
          text,
          narrator,
          mohdith,
          source,
          numberOrPage,
          grade,
        });
      }
    });

    return results;
  } catch (error) {
    console.error("Dorar Search Error:", error);
    return [];
  }
}
