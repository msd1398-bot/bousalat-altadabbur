import { useState, useEffect } from 'react';
import { Search, Heart, Copy, BookOpen, Check } from 'lucide-react';
import { hadithData, hadithCategories, type Hadith } from '../data/hadith';
import { supabase } from '../lib/supabase';

export default function HadithPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    initializeHadiths();
  }, []);

  async function initializeHadiths() {
    setLoading(true);
    try {
      const { data: existingHadiths, error: fetchError } = await supabase
        .from('hadith')
        .select('*');

      if (fetchError) throw fetchError;

      if (!existingHadiths || existingHadiths.length === 0) {
        const { error: insertError } = await supabase
          .from('hadith')
          .insert(hadithData);

        if (insertError) throw insertError;

        const { data: newHadiths, error: refetchError } = await supabase
          .from('hadith')
          .select('*');

        if (refetchError) throw refetchError;
        setHadiths(newHadiths || []);
      } else {
        setHadiths(existingHadiths);
      }
    } catch (error) {
      console.error('Error initializing hadiths:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const copyHadith = (hadith: Hadith) => {
    const text = `${hadith.hadith_arabic}\n\n${hadith.hadith_english}\n\nالراوي: ${hadith.narrator}\nالمصدر: ${hadith.source} (${hadith.reference})`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHadiths = hadiths
    .filter(hadith => selectedCategory === 'all' || hadith.category === selectedCategory)
    .filter(hadith =>
      searchQuery === '' ||
      hadith.hadith_arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.hadith_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-green-800 dark:border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500 mb-6">
          <div className="mb-8">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 bg-gradient-to-br from-green-800 to-yellow-600 rounded-full blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-green-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
              <BookOpen size={36} className="text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الأحاديث النبوية
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-8" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            أحاديث صحيحة مختارة من البخاري ومسلم
          </p>

          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث في الأحاديث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-green-800 dark:focus:border-green-600 focus:outline-none transition-colors text-right"
              style={{ fontFamily: 'Traditional Arabic, Arial' }}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {hadithCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all transform hover:scale-105 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          {filteredHadiths.length === 0 ? (
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
              <p className="text-gray-600 dark:text-gray-400 text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                لا توجد أحاديث تطابق البحث
              </p>
            </div>
          ) : (
            filteredHadiths.map((hadith) => (
              <div
                key={hadith.id}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-xl transition-all"
              >
                <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-yellow-600/20 dark:border-yellow-500/20">
                  <p
                    className="text-gray-800 dark:text-gray-100 text-2xl md:text-3xl leading-relaxed text-right"
                    style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '2.2' }}
                  >
                    {hadith.hadith_arabic}
                  </p>
                </div>

                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {hadith.hadith_english}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 px-4 py-2 rounded-lg border border-green-600/20 dark:border-green-500/20">
                    <span className="text-sm text-green-800 dark:text-green-400 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                      الراوي: {hadith.narrator}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-2 rounded-lg border border-yellow-600/20 dark:border-yellow-500/20">
                    <span className="text-sm text-yellow-800 dark:text-yellow-400 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                      {hadith.source} - {hadith.reference}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => toggleFavorite(hadith.id)}
                    className={`p-3 rounded-lg transition-all transform hover:scale-110 ${
                      favorites.includes(hadith.id)
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="إضافة للمفضلة"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(hadith.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => copyHadith(hadith)}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all transform hover:scale-110"
                    title="نسخ الحديث"
                  >
                    {copiedId === hadith.id ? (
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
