// Generated data lives in hadith.json — rebuild it with scripts/build-hadith-data.py.
// Source: HadeethEnc.com (موسوعة الأحاديث النبوية). Text is shown exactly as published:
// the source's terms forbid editing, adding to or deleting from the content.
import raw from './hadith.json';

export interface HadithWord {
  word: string;
  meaning: string;
}

export interface Hadith {
  id: string;
  category: string;
  title: string;
  /** Full hadith with the companion's opening, as published by HadeethEnc */
  text: string;
  /** متفق عليه / رواه البخاري / رواه مسلم */
  attribution: string;
  grade: string;
  explanation: string;
  benefits: string[];
  words: HadithWord[];
  link: string;
}

export const hadithSource = raw.source;
export const hadithCategories: string[] = raw.categories;
export const hadiths: Hadith[] = raw.hadiths;
