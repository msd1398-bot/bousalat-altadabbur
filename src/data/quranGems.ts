import raw from './quranGems.json';

export interface GemVerse {
  surahName: string;
  ayahFrom: number;
  ayahTo: number;
  /** Uthmani text from QuranEnc (via quran-json) — never typed by hand */
  text: string;
}

export interface GemPoint {
  label: string;
  text: string;
}

export interface QuranGem {
  id: string;
  title: string;
  category: string;
  highlight: string;
  summary: string;
  points: GemPoint[];
  notes: string[];
  verses: GemVerse[];
}

export const gemCategories: string[] = raw.categories;
export const quranGems: QuranGem[] = raw.cards;

export const GEMS_SOURCE = {
  name: 'فرائد وفوائد من القرآن الكريم',
  url: 'https://t.me/quranfaa',
};
