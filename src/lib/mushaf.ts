// Madinah Mushaf (Hafs) page math + text loading.
// Text: public/quran/N.json (QuranEnc, unchanged). Pages/juz/hizb: public/quran/meta.json (Tanzil metadata).

export interface SurahMeta {
  n: number;
  name: string;
  ayahs: number;
  type: string;
  /** First mushaf page of the surah */
  page: number;
}

export interface MushafMeta {
  surahs: SurahMeta[];
  /** pages[i] = [surah, ayah] where page i+1 starts */
  pages: [number, number][];
  juz: [number, number][];
  hizbQuarters: [number, number][];
  sajda: [number, number][];
  basmala: string;
}

export interface PageAyah {
  surah: number;
  ayah: number;
  text: string;
  /** 1..6236, used for audio */
  global: number;
}

export const TOTAL_PAGES = 604;

let metaPromise: Promise<MushafMeta> | null = null;
const surahCache = new Map<number, Promise<string[]>>();

export function loadMeta(): Promise<MushafMeta> {
  if (!metaPromise) {
    metaPromise = fetch('/quran/meta.json').then((r) => {
      if (!r.ok) throw new Error('meta');
      return r.json();
    });
    metaPromise.catch(() => (metaPromise = null));
  }
  return metaPromise;
}

export function loadSurah(n: number): Promise<string[]> {
  let p = surahCache.get(n);
  if (!p) {
    p = fetch(`/quran/${n}.json`).then((r) => {
      if (!r.ok) throw new Error(`surah ${n}`);
      return r.json();
    });
    p.catch(() => surahCache.delete(n));
    surahCache.set(n, p);
  }
  return p;
}

const cmp = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];

/** Index of the last entry in a sorted [surah, ayah] list that is <= pos (0-based), or -1. */
function lastAtOrBefore(list: [number, number][], pos: [number, number]) {
  let lo = 0;
  let hi = list.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cmp(list[mid], pos) <= 0) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

export const pageOf = (meta: MushafMeta, surah: number, ayah: number) => lastAtOrBefore(meta.pages, [surah, ayah]) + 1;
export const juzOf = (meta: MushafMeta, surah: number, ayah: number) => lastAtOrBefore(meta.juz, [surah, ayah]) + 1;
/** Hizb number 1..60 */
export const hizbOf = (meta: MushafMeta, surah: number, ayah: number) =>
  Math.floor(lastAtOrBefore(meta.hizbQuarters, [surah, ayah]) / 4) + 1;
export const isSajda = (meta: MushafMeta, surah: number, ayah: number) =>
  meta.sajda.some(([s, a]) => s === surah && a === ayah);

function globalOf(meta: MushafMeta, surah: number, ayah: number) {
  let g = 0;
  for (let i = 0; i < surah - 1; i++) g += meta.surahs[i].ayahs;
  return g + ayah;
}

/** All ayahs on a page, in order (may span surahs). */
export async function loadPage(meta: MushafMeta, page: number): Promise<PageAyah[]> {
  const [startS, startA] = meta.pages[page - 1];
  const end: [number, number] = page < TOTAL_PAGES ? meta.pages[page] : [115, 1];
  const out: PageAyah[] = [];
  let s = startS;
  let a = startA;
  let g = globalOf(meta, s, a);
  while (cmp([s, a], end) < 0) {
    const texts = await loadSurah(s);
    out.push({ surah: s, ayah: a, text: texts[a - 1], global: g });
    g++;
    if (a < meta.surahs[s - 1].ayahs) a++;
    else {
      s++;
      a = 1;
    }
  }
  return out;
}

/** Global ayah number -> [surah, ayah] */
export function fromGlobal(meta: MushafMeta, global: number): [number, number] {
  let rest = global;
  for (const s of meta.surahs) {
    if (rest <= s.ayahs) return [s.n, rest];
    rest -= s.ayahs;
  }
  return [114, 6];
}

export const audioUrl = (global: number) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`;

export const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/** Strip tashkeel/Uthmani marks so "النساء" matches "ٱلنِّسَآء". */
export const normalizeArabic = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[ً-ٰٟۖ-ࣰۭ-ࣲـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
