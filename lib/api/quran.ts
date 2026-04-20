export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
}

export interface TafsirResponse {
  tafsir: {
    resource_name: string;
    text: string;
  };
}

const API_BASE = "https://api.quran.com/api/v4";

// Fetches the list of all 114 Surahs
export async function getChapters(): Promise<Chapter[]> {
  try {
    const res = await fetch(`${API_BASE}/chapters?language=ar`);
    if (!res.ok) throw new Error("Failed to fetch chapters");
    const data = await res.json();
    return data.chapters;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
}

// Fetches all verses for a specific Surah handling pagination seamlessly
export async function getChapterVerses(chapterId: string | number): Promise<Verse[]> {
  try {
    const verses: Verse[] = [];
    let page = 1;
    let totalPages = 1;

    // The Quran.com API limits verses per page. Let's fetch all sequentially.
    while (page <= totalPages) {
      const res = await fetch(
        `${API_BASE}/verses/by_chapter/${chapterId}?fields=text_uthmani&per_page=50&page=${page}`
      );
      if (!res.ok) throw new Error("Failed to fetch verses");
      const data = await res.json();
      
      verses.push(...data.verses);
      totalPages = data.pagination.total_pages;
      page++;
    }

    return verses;
  } catch (error) {
    console.error(`Error fetching verses for chapter ${chapterId}:`, error);
    return [];
  }
}

/**
 * Fetches Tafsir for a specific verse from the Quran.com API.
 * @param tafsirId - The tafsir resource ID (e.g. 16 = Muyassar, 14 = Ibn Kathir)
 * @param verseKey - The verse key in "chapter:verse" format (e.g. "1:1")
 */
export async function getTafsir(tafsirId: number, verseKey: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
    if (!res.ok) throw new Error("Failed to fetch tafsir");
    const data: TafsirResponse = await res.json();
    // Strip HTML tags from the response text
    return data.tafsir.text.replace(/<[^>]*>/g, "");
  } catch (error) {
    console.error(`Error fetching tafsir for ${verseKey}:`, error);
    return "عذراً، لم نتمكن من تحميل التفسير. حاول مرة أخرى.";
  }
}

/**
 * Returns the audio URL for a surah from a specific reciter.
 * @param reciterSubfolder - The quranicaudio.com CDN subfolder for the reciter
 * @param chapterId - The chapter number
 */
export function getChapterAudioUrl(reciterSubfolder: string, chapterId: string | number): string {
  const formattedId = String(chapterId).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/${reciterSubfolder}/${formattedId}.mp3`;
}
