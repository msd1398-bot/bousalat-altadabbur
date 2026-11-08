import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Copy, Check, Minus, Play, Plus, Search, Square, X,
} from 'lucide-react';
import Footer from '../components/Footer';
import {
  TOTAL_PAGES, audioUrl, fromGlobal, hizbOf, isSajda, juzOf, loadMeta, loadPage, normalizeArabic, pageOf, toArabicDigits,
  type MushafMeta, type PageAyah,
} from '../lib/mushaf';

const UI_FONT = { fontFamily: 'Traditional Arabic, Arial' };
const QURAN_FONT = '"KFGQPC Hafs", serif';
const LAST_PAGE_KEY = 'mushaf-last-page';
const BOOKMARKS_KEY = 'mushaf-bookmarks';
const SCALE_KEY = 'mushaf-font-scale';

function readStore<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — keep in memory only */
  }
}

const WIDE_QUERY = '(min-width: 720px)';

/** Two facing pages when the screen is wide (unfolded Fold, tablet, desktop). */
function useWideScreen() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/** Pages visible together: odd page on the right, even on the left (printed Madinah Mushaf). */
function spreadOf(page: number, wide: boolean): number[] {
  if (!wide) return [page];
  const right = page % 2 === 1 ? page : page - 1;
  return right + 1 <= TOTAL_PAGES ? [right, right + 1] : [right];
}

type AyahRef = Pick<PageAyah, 'surah' | 'ayah' | 'global' | 'text'>;

function SurahBanner({ name }: { name: string }) {
  return (
    <span className="block my-3 mx-auto w-full max-w-md">
      <span className="relative block rounded-xl border-[3px] border-double border-[var(--mushaf-gold)] bg-[var(--mushaf-banner)] px-6 py-1.5 text-center">
        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-2 border-[var(--mushaf-gold)]" />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border-2 border-[var(--mushaf-gold)]" />
        <span className="text-xl font-bold text-[var(--mushaf-ink)]" style={UI_FONT}>
          سورة {name}
        </span>
      </span>
    </span>
  );
}

function MushafPage({
  meta, page, fontScale, selected, playing, onAyahTap,
}: {
  meta: MushafMeta;
  page: number;
  fontScale: number;
  selected: number | null;
  playing: number | null;
  onAyahTap: (a: AyahRef) => void;
}) {
  const [ayahs, setAyahs] = useState<PageAyah[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setAyahs(null);
    setFailed(false);
    loadPage(meta, page)
      .then((a) => live && setAyahs(a))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [meta, page]);

  const first = ayahs?.[0];

  return (
    <article
      className="flex flex-col rounded-2xl border border-[var(--mushaf-line-strong)] bg-[var(--mushaf-paper)] shadow-xl p-1.5 md:p-2.5 min-w-0"
      aria-label={`صفحة ${page}`}
    >
      <div className="flex flex-col flex-1 rounded-xl border-[3px] border-double border-[var(--mushaf-gold)] px-3 md:px-5 py-2">
        <header
          className="flex justify-between items-center gap-2 text-sm text-[var(--mushaf-muted)] border-b border-[var(--mushaf-line)] pb-1 mb-1"
          style={UI_FONT}
        >
          <span className="truncate">{first && `سورة ${meta.surahs[first.surah - 1].name}`}</span>
          {first && (
            <span className="shrink-0">
              الجزء {toArabicDigits(juzOf(meta, first.surah, first.ayah))} · الحزب {toArabicDigits(hizbOf(meta, first.surah, first.ayah))}
            </span>
          )}
        </header>

        <div className="flex-1 py-2">
          {failed && (
            <p className="text-center py-16 text-[var(--mushaf-muted)]" style={UI_FONT}>
              تعذّر تحميل الصفحة. تأكد من الاتصال وحاول مرة ثانية.
            </p>
          )}
          {!ayahs && !failed && <div className="h-[60vh] animate-pulse rounded-lg bg-[var(--mushaf-skeleton)]" />}
          {ayahs && (
            <p
              className="text-[var(--mushaf-ink)]"
              style={{
                fontFamily: QURAN_FONT,
                fontSize: `calc(clamp(1.35rem, 1.05rem + 1.1vw, 1.85rem) * ${fontScale})`,
                lineHeight: 2.15,
                textAlign: 'justify',
                textAlignLast: 'center',
              }}
            >
              {ayahs.map((a) => (
                <Fragment key={a.global}>
                  {a.ayah === 1 && (
                    <span className="block" style={{ textAlignLast: 'auto' }}>
                      <SurahBanner name={meta.surahs[a.surah - 1].name} />
                      {a.surah !== 1 && a.surah !== 9 && <span className="block text-center my-1">{meta.basmala}</span>}
                    </span>
                  )}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => onAyahTap(a)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onAyahTap(a)}
                    className={`cursor-pointer rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--mushaf-gold)] ${
                      playing === a.global
                        ? 'bg-[var(--mushaf-active)]'
                        : selected === a.global
                          ? 'bg-[var(--mushaf-select)]'
                          : 'hover:bg-[var(--mushaf-select)]'
                    }`}
                  >
                    {a.text}
                    {isSajda(meta, a.surah, a.ayah) ? ' ۩' : ''} {toArabicDigits(a.ayah)}{' '}
                  </span>
                </Fragment>
              ))}
            </p>
          )}
        </div>

        <footer className="text-center text-[var(--mushaf-muted)] border-t border-[var(--mushaf-line)] pt-1" style={UI_FONT}>
          {toArabicDigits(page)}
        </footer>
      </div>
    </article>
  );
}

function AyahSheet({
  meta, ayah, onClose, onPlayFrom,
}: {
  meta: MushafMeta;
  ayah: AyahRef;
  onClose: () => void;
  onPlayFrom: (global: number) => void;
}) {
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [tafsirState, setTafsirState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const name = meta.surahs[ayah.surah - 1].name;

  useEffect(() => {
    setTafsir(null);
    setTafsirState('idle');
  }, [ayah.global]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const loadTafsir = async () => {
    setTafsirState('loading');
    try {
      const r = await fetch(`https://api.alquran.cloud/v1/ayah/${ayah.surah}:${ayah.ayah}/ar.muyassar`);
      const d = await r.json();
      if (d?.code !== 200) throw new Error('tafsir');
      setTafsir(d.data.text);
      setTafsirState('idle');
    } catch {
      setTafsirState('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`﴿${ayah.text}﴾ [${name}: ${ayah.ayah}]`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-900 p-5 shadow-2xl"
        style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`سورة ${name} الآية ${ayah.ayah}`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-lg text-green-800 dark:text-green-400" style={UI_FONT}>
            سورة {name} · الآية {toArabicDigits(ayah.ayah)}
          </p>
          <button onClick={onClose} aria-label="إغلاق" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <p className="text-2xl text-gray-800 dark:text-gray-100 mb-4" style={{ fontFamily: QURAN_FONT, lineHeight: 2.1 }}>
          {ayah.text} {toArabicDigits(ayah.ayah)}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4" style={UI_FONT}>
          <button onClick={() => onPlayFrom(ayah.global)} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-green-700 text-white font-bold">
            <Play size={20} /> استمع من هنا
          </button>
          <button
            onClick={loadTafsir}
            className="flex flex-col items-center gap-1 py-3 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-bold"
          >
            <BookOpen size={20} /> التفسير الميسر
          </button>
          <button onClick={copy} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold">
            {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? 'تم النسخ' : 'نسخ'}
          </button>
        </div>
        {tafsirState === 'loading' && <p className="text-gray-500" style={UI_FONT}>جاري تحميل التفسير...</p>}
        {tafsirState === 'error' && (
          <p className="text-red-600 dark:text-red-400" style={UI_FONT}>
            تعذّر تحميل التفسير، يحتاج اتصال بالإنترنت.
          </p>
        )}
        {tafsir && (
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
            <p className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1" style={UI_FONT}>
              التفسير الميسر
            </p>
            <p className="text-lg leading-loose text-gray-800 dark:text-gray-200" style={UI_FONT}>
              {tafsir}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Quran() {
  const navigate = useNavigate();
  const wide = useWideScreen();
  const [meta, setMeta] = useState<MushafMeta | null>(null);
  const [metaError, setMetaError] = useState(false);
  const [view, setView] = useState<'index' | 'reader'>('index');
  const [page, setPage] = useState<number>(() => readStore(LAST_PAGE_KEY, 1));
  const [bookmarks, setBookmarks] = useState<number[]>(() => readStore(BOOKMARKS_KEY, []));
  const [fontScale, setFontScale] = useState<number>(() => readStore(SCALE_KEY, 1));
  const [tab, setTab] = useState<'surahs' | 'juz'>('surahs');
  const [search, setSearch] = useState('');
  const [goTo, setGoTo] = useState('');
  const [selected, setSelected] = useState<AyahRef | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    loadMeta().then(setMeta).catch(() => setMetaError(true));
  }, []);

  useEffect(() => writeStore(LAST_PAGE_KEY, page), [page]);
  useEffect(() => writeStore(BOOKMARKS_KEY, bookmarks), [bookmarks]);
  useEffect(() => writeStore(SCALE_KEY, fontScale), [fontScale]);

  const spread = useMemo(() => spreadOf(page, wide), [page, wide]);
  const step = wide ? 2 : 1;

  const goPage = useCallback((p: number) => {
    setPage(Math.min(TOTAL_PAGES, Math.max(1, p)));
    setSelected(null);
    window.scrollTo({ top: 0 });
  }, []);
  const next = useCallback(() => goPage(spread[spread.length - 1] + 1), [goPage, spread]);
  const prev = useCallback(() => goPage(spread[0] - step), [goPage, spread, step]);

  const openAt = (p: number) => {
    goPage(p);
    setView('reader');
  };

  // Keyboard: ← next page, → previous page (Arabic book direction)
  useEffect(() => {
    if (view !== 'reader') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') next();
      if (e.key === 'ArrowRight') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, next, prev]);

  // ---- Audio: continuous recitation, turning pages as it goes ----
  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlaying(null);
  }, []);

  const playFrom = useCallback(
    (global: number) => {
      if (!meta) return;
      audioRef.current?.pause();
      const audio = new Audio(audioUrl(global));
      audioRef.current = audio;
      setPlaying(global);
      setSelected(null);
      const [s, a] = fromGlobal(meta, global);
      const target = pageOf(meta, s, a);
      setPage((cur) => (spreadOf(cur, wide).includes(target) ? cur : target));
      audio.onended = () => {
        if (audioRef.current !== audio) return;
        if (global < 6236) playFrom(global + 1);
        else stopAudio();
      };
      audio.onerror = () => audioRef.current === audio && stopAudio();
      audio.play().catch(() => audioRef.current === audio && stopAudio());
    },
    [meta, wide, stopAudio]
  );

  useEffect(() => () => audioRef.current?.pause(), []);

  const togglePagePlayback = async () => {
    if (!meta) return;
    if (playing) {
      stopAudio();
      return;
    }
    const ayahs = await loadPage(meta, spread[0]);
    if (ayahs[0]) playFrom(ayahs[0].global);
  };

  const toggleBookmark = () => {
    const p = spread[0];
    setBookmarks((b) => (b.includes(p) ? b.filter((x) => x !== p) : [...b, p].sort((x, y) => x - y)));
  };
  const isBookmarked = spread.some((p) => bookmarks.includes(p));

  const filteredSurahs = useMemo(() => {
    if (!meta) return [];
    const raw = search.trim();
    const q = normalizeArabic(raw);
    if (!q) return meta.surahs;
    return meta.surahs.filter((s) => normalizeArabic(s.name).includes(q) || String(s.n) === raw);
  }, [meta, search]);

  const surahAtPage = (p: number) => (meta ? meta.surahs[meta.pages[p - 1][0] - 1].name : '');

  if (metaError) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center p-6">
        <p className="text-xl text-gray-700 dark:text-gray-300 text-center" style={UI_FONT}>
          تعذّر تحميل المصحف. تأكد من الاتصال وافتح الصفحة مرة ثانية.
        </p>
      </div>
    );
  }

  // ------------------------------- Reader -------------------------------
  if (view === 'reader' && meta) {
    const iconBtn = 'p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--mushaf-ink)]';
    return (
      <div className="mushaf min-h-screen bg-[var(--mushaf-bg)]">
        <div className="sticky z-30 bg-[var(--mushaf-bg)] border-b border-[var(--mushaf-line)]" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
          <div className="max-w-6xl mx-auto flex items-center gap-1 px-2 py-2" style={UI_FONT}>
            <button
              onClick={() => {
                stopAudio();
                setView('index');
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-green-800 dark:text-green-300 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <ChevronRight size={20} /> الفهرس
            </button>
            <div className="flex-1 text-center truncate font-bold text-[var(--mushaf-ink)]">{surahAtPage(spread[0])}</div>
            <button onClick={() => setFontScale((f) => Math.max(0.8, +(f - 0.1).toFixed(1)))} aria-label="تصغير الخط" className={iconBtn}>
              <Minus size={18} />
            </button>
            <button onClick={() => setFontScale((f) => Math.min(1.6, +(f + 0.1).toFixed(1)))} aria-label="تكبير الخط" className={iconBtn}>
              <Plus size={18} />
            </button>
            <button onClick={toggleBookmark} aria-pressed={isBookmarked} aria-label="علامة على الصفحة" className={`${iconBtn} !text-[var(--mushaf-gold)]`}>
              {isBookmarked ? <BookmarkCheck size={20} className="fill-current" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        <main
          className="max-w-6xl mx-auto px-2 md:px-4 py-3"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 60) return;
            // Like turning an Arabic mushaf page: drag right → next page
            if (dx > 0) next();
            else prev();
          }}
        >
          <div className={`grid gap-3 ${spread.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`} dir="rtl">
            {spread.map((p) => (
              <MushafPage
                key={p}
                meta={meta}
                page={p}
                fontScale={fontScale}
                selected={selected?.global ?? null}
                playing={playing}
                onAyahTap={setSelected}
              />
            ))}
          </div>
        </main>

        <nav className="sticky bottom-0 z-30 bg-[var(--mushaf-bg)] border-t border-[var(--mushaf-line)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-3 py-2" style={UI_FONT}>
            <button
              onClick={prev}
              disabled={spread[0] <= 1}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[var(--mushaf-paper)] border border-[var(--mushaf-line)] text-[var(--mushaf-ink)] disabled:opacity-40 font-bold"
            >
              <ChevronRight size={20} /> السابقة
            </button>
            <button
              onClick={togglePagePlayback}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white ${playing ? 'bg-red-600' : 'bg-green-700'}`}
            >
              {playing ? <Square size={18} /> : <Play size={18} />}
              {playing ? 'إيقاف' : 'استماع'}
            </button>
            <button
              onClick={next}
              disabled={spread[spread.length - 1] >= TOTAL_PAGES}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[var(--mushaf-paper)] border border-[var(--mushaf-line)] text-[var(--mushaf-ink)] disabled:opacity-40 font-bold"
            >
              التالية <ChevronLeft size={20} />
            </button>
          </div>
        </nav>

        {selected && <AyahSheet meta={meta} ayah={selected} onClose={() => setSelected(null)} onPlayFrom={playFrom} />}
      </div>
    );
  }

  // ------------------------------- Index -------------------------------
  const juzStartPages = meta ? meta.juz.map(([s, a]) => pageOf(meta, s, a)) : [];
  const card = 'rounded-2xl bg-white/90 dark:bg-gray-800/90 border-2 border-green-800/10 dark:border-green-700/30 hover:border-green-600 transition-colors text-right';

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/muslim-guide')} className="mb-4 flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-900" style={UI_FONT}>
          <ArrowLeft size={20} /> العودة
        </button>

        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-xl p-5 md:p-8 border-t-4 border-yellow-600 dark:border-yellow-500 mb-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600/30">
              <BookOpen size={26} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100" style={UI_FONT}>
                المصحف الشريف
              </h1>
              <p className="text-gray-600 dark:text-gray-400" style={UI_FONT}>
                مصحف المدينة برواية حفص، بخط مجمع الملك فهد
              </p>
            </div>
          </div>

          {meta && (
            <button
              onClick={() => openAt(page)}
              className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg mb-4"
              style={UI_FONT}
            >
              <span className="text-right">
                <span className="block text-sm text-green-100">{page > 1 ? 'أكمل من حيث وقفت' : 'ابدأ القراءة'}</span>
                <span className="block text-xl font-bold">
                  سورة {surahAtPage(page)} · صفحة {toArabicDigits(page)}
                </span>
              </span>
              <ChevronLeft size={26} className="text-yellow-300" />
            </button>
          )}

          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="surah-search"
                type="search"
                placeholder="ابحث عن سورة..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setTab('surahs');
                }}
                className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-green-600 outline-none text-lg"
                style={UI_FONT}
              />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(goTo.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))), 10);
                if (n >= 1 && n <= TOTAL_PAGES) openAt(n);
              }}
              className="flex shrink-0"
            >
              <input
                id="goto-page"
                inputMode="numeric"
                placeholder="صفحة"
                value={goTo}
                onChange={(e) => setGoTo(e.target.value)}
                className="w-16 px-2 py-3 rounded-r-xl border-2 border-l-0 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center outline-none"
                style={UI_FONT}
                aria-label="رقم الصفحة"
              />
              <button type="submit" className="px-3 rounded-l-xl bg-green-700 text-white font-bold" style={UI_FONT}>
                اذهب
              </button>
            </form>
          </div>
        </header>

        {bookmarks.length > 0 && meta && (
          <section className="mb-5">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2 px-1" style={UI_FONT}>
              العلامات
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {bookmarks.map((p) => (
                <button
                  key={p}
                  onClick={() => openAt(p)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-800 border-2 border-yellow-600/40 text-gray-800 dark:text-gray-100"
                  style={UI_FONT}
                >
                  <BookmarkCheck size={16} className="text-yellow-600" />
                  {surahAtPage(p)} · {toArabicDigits(p)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-2 mb-4" style={UI_FONT}>
          {(['surahs', 'juz'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`flex-1 py-2.5 rounded-xl font-bold border-2 ${
                tab === t
                  ? 'bg-green-700 border-green-700 text-white'
                  : 'bg-white/80 dark:bg-gray-800 border-green-200 dark:border-green-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t === 'surahs' ? 'السور' : 'الأجزاء'}
            </button>
          ))}
        </div>

        {!meta && <div className="h-64 rounded-2xl bg-white/60 dark:bg-gray-800/60 animate-pulse" />}

        {meta && tab === 'surahs' && (
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {filteredSurahs.map((s) => (
              <button key={s.n} onClick={() => openAt(s.page)} className={`flex items-center gap-3 p-4 ${card}`}>
                <span className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 text-white font-bold flex items-center justify-center">
                  {toArabicDigits(s.n)}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-2xl text-gray-800 dark:text-gray-100" style={{ fontFamily: QURAN_FONT }}>
                    {s.name}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400" style={UI_FONT}>
                    {s.type} · {toArabicDigits(s.ayahs)} آية
                  </span>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0" style={UI_FONT}>
                  ص {toArabicDigits(s.page)}
                </span>
              </button>
            ))}
            {filteredSurahs.length === 0 && (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8" style={UI_FONT}>
                ما فيه سورة بهذا الاسم.
              </p>
            )}
          </div>
        )}

        {meta && tab === 'juz' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {juzStartPages.map((p, i) => (
              <button key={i} onClick={() => openAt(p)} className={`p-4 ${card}`} style={UI_FONT}>
                <span className="block text-xl font-bold text-gray-800 dark:text-gray-100">الجزء {toArabicDigits(i + 1)}</span>
                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {surahAtPage(p)} · ص {toArabicDigits(p)}
                </span>
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6" style={UI_FONT}>
          النص من موسوعة القرآن الكريم (QuranEnc) · الخط من مجمع الملك فهد · تقسيم الصفحات من Tanzil · التلاوة: مشاري العفاسي
        </p>
        <Footer />
      </div>
    </div>
  );
}
