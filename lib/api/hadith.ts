const HADITH_API_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

export interface HadithCollectionMeta {
  id: string; // e.g. "bukhari"
  nameEn: string;
  nameAr: string; 
  hasSections: boolean;
  bookCount: number;
}

export const COLLECTIONS: HadithCollectionMeta[] = [
  { id: "bukhari", nameEn: "Sahih al Bukhari", nameAr: "صحيح البخاري", hasSections: true, bookCount: 97 },
  { id: "muslim", nameEn: "Sahih Muslim", nameAr: "صحيح مسلم", hasSections: true, bookCount: 56 },
  { id: "abudawud", nameEn: "Sunan Abu Dawud", nameAr: "سنن أبي داود", hasSections: true, bookCount: 43 },
  { id: "tirmidhi", nameEn: "Jami At Tirmidhi", nameAr: "جامع الترمذي", hasSections: true, bookCount: 49 },
  { id: "nasai", nameEn: "Sunan an Nasai", nameAr: "سنن النسائي", hasSections: true, bookCount: 51 },
  { id: "ibnmajah", nameEn: "Sunan Ibn Majah", nameAr: "سنن ابن ماجه", hasSections: true, bookCount: 37 },
  { id: "malik", nameEn: "Muwatta Malik", nameAr: "موطأ مالك", hasSections: true, bookCount: 61 },
  { id: "nawawi", nameEn: "Forty Hadith of an-Nawawi", nameAr: "الأربعون النووية", hasSections: true, bookCount: 1 },
  { id: "qudsi", nameEn: "Forty Hadith Qudsi", nameAr: "الأربعون القدسية", hasSections: true, bookCount: 1 },
  { id: "dehlawi", nameEn: "Forty Hadith of Shah Waliullah Dehlawi", nameAr: "أربعون حديثاً للدهلوي", hasSections: true, bookCount: 1 },
];

export interface SectionDetail {
  hadithnumber_first: number;
  hadithnumber_last: number;
  arabicnumber_first: number;
  arabicnumber_last: number;
}

export interface CollectionInfo {
  metadata: {
    name: string;
    sections: Record<string, string>;
    last_hadithnumber: number;
    section_details: Record<string, SectionDetail>;
  };
}

export interface Hadith {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: { name: string; grade: string }[];
  reference: { book: number; hadith: number };
}

export interface SectionResponse {
  metadata: {
    name: string;
    section: Record<string, string>;
    section_detail: Record<string, SectionDetail>;
  };
  hadiths: Hadith[];
}

export async function getCollectionInfo(collectionId: string): Promise<CollectionInfo | null> {
  if (!COLLECTIONS.some(c => c.id === collectionId)) return null;
  try {
    const res = await fetch(`${HADITH_API_BASE}/info.json`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error("Failed to fetch hadith info");
    const data = await res.json();
    return data[collectionId]?.metadata ? data[collectionId] as CollectionInfo : null;
  } catch (error) {
    console.error("Error fetching collection info:", error);
    return null;
  }
}

export async function getHadithSection(collectionId: string, sectionId: string): Promise<SectionResponse | null> {
  if (!COLLECTIONS.some(c => c.id === collectionId) || !/^[1-9]\d*$/.test(sectionId)) return null;
  try {
    // We request the arabic edition explicitly against the /sections/ route
    const res = await fetch(`${HADITH_API_BASE}/editions/ara-${collectionId}/sections/${sectionId}.json`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`Failed to fetch section ${sectionId} for ${collectionId}`);
    const data = await res.json();
    return Array.isArray(data.hadiths) && data.metadata?.section ? data as SectionResponse : null;
  } catch (error) {
    console.error("Error fetching hadith section:", error);
    return null;
  }
}
