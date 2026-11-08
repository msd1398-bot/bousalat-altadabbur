import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, Heart, Copy, Check, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import '@fontsource/amiri/arabic-400.css';
import '@fontsource/amiri/arabic-700.css';
import Footer from '../components/Footer';
import { hadiths, hadithCategories, hadithSource, type Hadith } from '../data/hadith';

const PAGE_SIZE = 20;
const ALL = 'الكل';
const FAVORITES = 'المفضلة';
const FAV_KEY = 'hadith-favorites-v2';
const UI_FONT = { fontFamily: 'Traditional Arabic, Arial' };
const TEXT_FONT = { fontFamily: 'Amiri, "Traditional Arabic", serif' };

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/** Ignore tashkeel and hamza forms so a plain search finds a fully-vowelled text. */
const normalize = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

const searchIndex = new Map(hadiths.map((h) => [h.id, normalize(`${h.title} ${h.text} ${h.category}`)]));

function loadFavorites(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Same hadith for everyone on a given day. */
function hadithOfTheDay(): Hadith {
  const d = new Date();
  const dayNumber = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  return hadiths[dayNumber % hadiths.length];
}

function attributionStyle(a: string) {
  if (a === 'متفق عليه') return 'bg-green-700 text-white dark:bg-green-600';
  return 'bg-green-50 text-green-800 border border-green-600/30 dark:bg-green-950/40 dark:text-green-300 dark:border-green-500/30';
}

function HadithCard({
  hadith,
  isFavorite,
  onToggleFavorite,
  featured = false,
}: {
  hadith: Hadith;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = `${hadith.text}\n\n${hadith.attribution} — درجته: ${hadith.grade}\nالمصدر: ${hadithSource.name} (${hadithSource.site})\n${hadith.link}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard can be blocked; nothing else to do */
    }
  };

  return (
    <article
      className={`rounded-2xl p-5 md:p-7 border-2 transition-colors ${
        featured
          ? 'bg-gradient-to-br from-green-800 to-green-900 border-yellow-600/40 text-white'
          : 'bg-white/95 dark:bg-gray-800/95 border-green-800/15 dark:border-green-700/30'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {featured && (
          <span className="flex items-center gap-1 text-sm font-bold text-yellow-300" style={UI_FONT}>
            <Sparkles size={16} /> حديث اليوم
          </span>
        )}
        <span className={`text-sm font-semibold rounded-full px-3 py-1 ${featured ? 'bg-yellow-500 text-green-950' : attributionStyle(hadith.attribution)}`} style={UI_FONT}>
          {hadith.attribution}
        </span>
        <span
          className={`text-sm rounded-full px-3 py-1 ${featured ? 'bg-white/10 text-green-50' : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
          style={UI_FONT}
        >
          {hadith.category}
        </span>
      </div>

      <p
        className={`text-[1.35rem] md:text-2xl ${featured ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}
        style={{ ...TEXT_FONT, lineHeight: 2.1 }}
      >
        {hadith.text}
      </p>

      <div className="flex items-center gap-2 mt-5">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-colors ${
            featured
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-green-50 hover:bg-green-100 text-green-800 dark:bg-green-950/40 dark:hover:bg-green-900/50 dark:text-green-300'
          }`}
          style={UI_FONT}
        >
          {open ? 'إخفاء الشرح' : 'شرح الحديث وفوائده'}
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={() => onToggleFavorite(hadith.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          className={`p-2.5 rounded-xl transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : featured
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
        </button>
        <button
          onClick={copy}
          aria-label="نسخ الحديث"
          className={`p-2.5 rounded-xl transition-colors ${
            featured ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
        </button>
      </div>

      {open && (
        <div className={`mt-5 space-y-5 ${featured ? 'text-green-50' : 'text-gray-700 dark:text-gray-300'}`} style={UI_FONT}>
          <section>
            <h3 className={`font-bold text-lg mb-2 ${featured ? 'text-yellow-300' : 'text-green-800 dark:text-green-400'}`}>الشرح</h3>
            <p className="text-lg leading-loose whitespace-pre-line">{hadith.explanation}</p>
          </section>

          {hadith.words.length > 0 && (
            <section>
              <h3 className={`font-bold text-lg mb-2 ${featured ? 'text-yellow-300' : 'text-green-800 dark:text-green-400'}`}>معاني الكلمات</h3>
              <dl className="space-y-2">
                {hadith.words.map((w) => (
                  <div key={w.word} className={`rounded-lg px-3 py-2 ${featured ? 'bg-white/5' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                    <dt className="font-bold inline">{w.word}: </dt>
                    <dd className="inline">{w.meaning}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {hadith.benefits.length > 0 && (
            <section>
              <h3 className={`font-bold text-lg mb-2 ${featured ? 'text-yellow-300' : 'text-green-800 dark:text-green-400'}`}>من فوائد الحديث</h3>
              <ul className="space-y-2">
                {hadith.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-lg leading-relaxed">
                    <span className="mt-3 w-1.5 h-1.5 shrink-0 rounded-full bg-yellow-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <a
            href={hadith.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-base hover:underline ${featured ? 'text-yellow-300' : 'text-green-700 dark:text-green-400'}`}
          >
            الحديث في موسوعة الأحاديث النبوية
            <ExternalLink size={14} />
          </a>
        </div>
      )}
    </article>
  );
}

export default function HadithPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const today = useMemo(hadithOfTheDay, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable (private mode) — favorites stay for this visit */
    }
  }, [favorites]);

  useEffect(() => setVisible(PAGE_SIZE), [search, category]);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    return hadiths.filter((h) => {
      if (category === FAVORITES && !favorites.includes(h.id)) return false;
      if (category !== ALL && category !== FAVORITES && h.category !== category) return false;
      return !q || searchIndex.get(h.id)!.includes(q);
    });
  }, [search, category, favorites]);

  const chips = [ALL, ...hadithCategories, FAVORITES];
  const showToday = category === ALL && !search.trim();

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-xl p-5 md:p-8 border-t-4 border-yellow-600 dark:border-yellow-500 mb-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600/30">
              <BookOpen size={26} className="text-yellow-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100" style={UI_FONT}>
                الأحاديث النبوية
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg" style={UI_FONT}>
                {toArabicDigits(hadiths.length)} حديثًا صحيحًا من صحيحي البخاري ومسلم، مع الشرح والفوائد
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="hadith-search"
              type="search"
              placeholder="ابحث في الأحاديث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-green-600 dark:focus:border-green-500 outline-none transition-colors text-right text-lg"
              style={UI_FONT}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full border-2 text-base transition-colors ${
                  category === c
                    ? 'border-green-700 bg-green-700 text-white dark:border-green-500 dark:bg-green-600'
                    : 'border-green-200 dark:border-green-800 text-gray-700 dark:text-gray-300 hover:border-green-500'
                }`}
                style={UI_FONT}
              >
                {c === FAVORITES && <Heart size={14} className={category === c ? 'fill-current' : ''} />}
                {c}
                {c === FAVORITES && favorites.length > 0 && <span>({toArabicDigits(favorites.length)})</span>}
              </button>
            ))}
          </div>
        </header>

        {showToday && (
          <div className="mb-5">
            <HadithCard hadith={today} isFavorite={favorites.includes(today.id)} onToggleFavorite={toggleFavorite} featured />
          </div>
        )}

        <p className="text-gray-600 dark:text-gray-400 mb-3 px-1" style={UI_FONT}>
          {toArabicDigits(filtered.length)} حديثًا
        </p>

        <div className="space-y-5 mb-6">
          {filtered.slice(0, visible).map((h) => (
            <HadithCard key={h.id} hadith={h} isFavorite={favorites.includes(h.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 text-xl py-12" style={UI_FONT}>
            {category === FAVORITES ? 'ما أضفت أحاديث للمفضلة بعد. اضغط ♡ على أي حديث.' : 'ما فيه نتائج. جرّب كلمة ثانية أو اختر «الكل».'}
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

        <section className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 text-center border-2 border-yellow-600/30 dark:border-yellow-500/30 mb-8" style={UI_FONT}>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
            الأحاديث وشروحها من «{hadithSource.name}» ({hadithSource.site})، الإصدار {hadithSource.version}، كما نُشرت دون تعديل.
          </p>
          <a
            href={hadithSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 hover:underline mt-1"
          >
            <span dir="ltr">hadeethenc.com</span>
            <ExternalLink size={14} />
          </a>
          <details className="mt-3 text-right">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 text-center">معلومات نسخة المصدر</summary>
            <pre dir="ltr" className="mt-2 text-xs text-left whitespace-pre-wrap text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 overflow-x-auto">
              {hadithSource.versionBlock}
            </pre>
          </details>
        </section>

        <Footer />
      </div>
    </div>
  );
}
