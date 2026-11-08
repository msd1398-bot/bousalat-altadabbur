import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Gem, Search, Shuffle, ExternalLink } from 'lucide-react';
import '@fontsource/amiri-quran/400.css';
import Footer from '../components/Footer';
import { quranGems, gemCategories, GEMS_SOURCE, type QuranGem } from '../data/quranGems';

interface QuranGemsProps {
  onBack: () => void;
}

const PAGE_SIZE = 20;
const ALL = 'الكل';
const UI_FONT = { fontFamily: 'Traditional Arabic, Arial' };
const QURAN_FONT = { fontFamily: '"Amiri Quran", "Traditional Arabic", serif' };

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/** Strip diacritics and unify letter forms so search ignores tashkeel and hamza variants. */
const normalize = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[ً-ٰٟۖ-ࣰۭ-ࣲـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

// Pre-build one searchable string per card (done once, not on every keystroke).
const searchIndex = new Map<string, string>(
  quranGems.map((g) => [
    g.id,
    normalize(
      [
        g.title,
        g.highlight,
        g.summary,
        ...g.points.map((p) => `${p.label} ${p.text}`),
        ...g.notes,
        ...g.verses.map((v) => `${v.surahName} ${v.text}`),
      ].join(' ')
    ),
  ])
);

function GemCard({ gem, index, flash }: { gem: QuranGem; index: number; flash: boolean }) {
  const twoSided = gem.points.length === 2;
  return (
    <article
      id={gem.id}
      className={`scroll-mt-24 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 border-2 transition-all duration-500 ${
        flash
          ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20'
          : 'border-green-800/20 dark:border-green-700/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-snug" style={UI_FONT}>
          {gem.title}
        </h3>
        <span
          className="shrink-0 text-sm font-semibold text-yellow-800 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-3 py-1"
          style={UI_FONT}
        >
          {gem.category}
        </span>
      </div>

      {gem.verses.length > 0 && (
        <div className="space-y-3 mb-4">
          {gem.verses.map((v) => (
            <div
              key={`${v.surahName}-${v.ayahFrom}`}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 rounded-xl px-4 py-3 border border-green-200/70 dark:border-green-800/50"
            >
              <p className="text-2xl md:text-[1.7rem] text-gray-800 dark:text-gray-100" style={{ ...QURAN_FONT, lineHeight: 2.3 }}>
                {v.text}{' '}
                <span className="whitespace-nowrap text-green-700 dark:text-green-400">
                  ﴿{toArabicDigits(v.ayahFrom)}
                  {v.ayahTo !== v.ayahFrom ? `-${toArabicDigits(v.ayahTo)}` : ''}﴾
                </span>
              </p>
              <p className="text-sm font-semibold text-green-800 dark:text-green-400 mt-1" style={UI_FONT}>
                سورة {v.surahName}
              </p>
            </div>
          ))}
        </div>
      )}

      <p
        className="inline-block text-2xl text-green-800 dark:text-green-300 border-b-2 border-yellow-600 dark:border-yellow-500 mb-3"
        style={{ ...QURAN_FONT, lineHeight: 2 }}
      >
        {gem.highlight}
      </p>

      <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100 leading-relaxed mb-4 font-medium" style={UI_FONT}>
        {gem.summary}
      </p>

      {gem.points.length > 0 && (
        <div className={`grid gap-3 mb-4 ${twoSided ? 'sm:grid-cols-2' : ''}`}>
          {gem.points.map((p) => (
            <div key={p.label} className="rounded-xl border-2 border-green-800/10 dark:border-green-700/30 p-3 min-w-0">
              <p className="font-bold text-green-800 dark:text-green-400 text-lg mb-1" style={UI_FONT}>
                {p.label}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed" style={UI_FONT}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {gem.notes.length > 0 && (
        <ul className="space-y-2 mb-4">
          {gem.notes.map((n) => (
            <li key={n} className="flex gap-2 text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed" style={UI_FONT}>
              <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-full bg-yellow-600 dark:bg-yellow-500" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400" style={UI_FONT}>
        فائدة {toArabicDigits(index)}
      </div>
    </article>
  );
}

export default function QuranGems({ onBack }: QuranGemsProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [scrollTick, setScrollTick] = useState(0);
  const pendingScroll = useRef<string | null>(null);

  const order = useMemo(() => new Map(quranGems.map((g, i) => [g.id, i + 1])), []);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    return quranGems.filter(
      (g) => (category === ALL || g.category === category) && (!q || searchIndex.get(g.id)!.includes(q))
    );
  }, [search, category]);

  useEffect(() => setVisible(PAGE_SIZE), [search, category]);

  // Scroll after the chosen card is actually rendered.
  useEffect(() => {
    const id = pendingScroll.current;
    if (!id) return;
    pendingScroll.current = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [scrollTick, visible]);

  // Remove the highlight ring a moment after it appears.
  useEffect(() => {
    if (!flashId) return;
    const t = window.setTimeout(() => setFlashId(null), 2500);
    return () => window.clearTimeout(t);
  }, [flashId]);

  const showRandom = () => {
    if (!filtered.length) return;
    const i = Math.floor(Math.random() * filtered.length);
    const gem = filtered[i];
    if (i >= visible) setVisible(i + 1);
    pendingScroll.current = gem.id;
    setFlashId(gem.id);
    setScrollTick((n) => n + 1);
  };

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500 mb-6">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span style={UI_FONT}>العودة</span>
          </button>

          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
              <Gem size={34} className="text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={UI_FONT}>
            فرائد قرآنية
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-2xl text-center mb-6" style={UI_FONT}>
            معاني كلمات القرآن والفروق بينها، وفوائد من آياته
          </p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="gems-search"
                type="search"
                placeholder="ابحث عن كلمة أو آية أو سورة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-800/80 focus:border-green-600 dark:focus:border-green-500 outline-none transition-colors text-right text-lg text-gray-800 dark:text-gray-100"
                style={UI_FONT}
              />
            </div>
            <button
              onClick={showRandom}
              className="shrink-0 flex items-center gap-2 px-4 rounded-xl bg-gradient-to-r from-green-600 to-green-800 text-white font-bold hover:shadow-lg transition-all"
              style={UI_FONT}
            >
              <Shuffle size={18} />
              <span className="hidden sm:inline">فائدة عشوائية</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {[ALL, ...gemCategories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`px-4 py-1.5 rounded-full border-2 text-base transition-colors ${
                  category === c
                    ? 'border-green-700 bg-green-700 text-white dark:border-green-500 dark:bg-green-600'
                    : 'border-green-200 dark:border-green-800 text-gray-700 dark:text-gray-300 hover:border-green-500'
                }`}
                style={UI_FONT}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 px-1" style={UI_FONT}>
          {toArabicDigits(filtered.length)} فائدة
        </p>

        <div className="space-y-5 mb-6">
          {shown.map((g) => (
            <GemCard key={g.id} gem={g} index={order.get(g.id)!} flash={flashId === g.id} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 text-xl py-12" style={UI_FONT}>
            ما فيه نتائج. جرّب كلمة ثانية أو اختر «الكل».
          </p>
        )}

        {visible < filtered.length && (
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="w-full mb-8 py-3 rounded-xl border-2 border-green-700 text-green-800 dark:text-green-300 dark:border-green-600 font-bold hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors"
            style={UI_FONT}
          >
            عرض المزيد ({toArabicDigits(filtered.length - visible)} متبقية)
          </button>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 text-center border-2 border-yellow-600/30 dark:border-yellow-500/30 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg" style={UI_FONT}>
            المحتوى من قناة «{GEMS_SOURCE.name}» بإذن منها
          </p>
          <a
            href={GEMS_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 hover:underline mt-1"
          >
            <span dir="ltr">t.me/quranfaa</span>
            <ExternalLink size={14} />
          </a>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2" style={UI_FONT}>
            نص الآيات بالرسم العثماني من موسوعة القرآن الكريم
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
