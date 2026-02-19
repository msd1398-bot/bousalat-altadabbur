import { useState, useEffect } from 'react';
import { Emotion } from '../types/emotion';
import EmotionModal from '../components/EmotionModal';
import { Sparkles, Search, Shuffle, BookOpen, ArrowUpDown, Heart, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

type SortOption = 'category' | 'alphabetical' | 'date';
type FilterOption = 'all' | 'favorites';

export default function Emotions() {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [filteredEmotions, setFilteredEmotions] = useState<Emotion[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('category');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotions();
    loadFavorites();
  }, []);

  useEffect(() => {
    let filtered = emotions;

    if (searchQuery.trim() !== '') {
      filtered = emotions.filter(emotion =>
        emotion.emotion_name.includes(searchQuery) ||
        emotion.emotion_category.includes(searchQuery)
      );
    }

    if (filterBy === 'favorites') {
      filtered = filtered.filter(emotion => favorites.has(emotion.id));
    }

    const sorted = sortEmotions(filtered, sortBy);
    setFilteredEmotions(sorted);
  }, [searchQuery, emotions, sortBy, filterBy, favorites]);

  const sortEmotions = (emotionsList: Emotion[], sortOption: SortOption): Emotion[] => {
    const sorted = [...emotionsList];

    switch (sortOption) {
      case 'category':
        return sorted.sort((a, b) => {
          const categoryCompare = a.emotion_category.localeCompare(b.emotion_category, 'ar');
          if (categoryCompare !== 0) return categoryCompare;
          return a.emotion_name.localeCompare(b.emotion_name, 'ar');
        });
      case 'alphabetical':
        return sorted.sort((a, b) => a.emotion_name.localeCompare(b.emotion_name, 'ar'));
      case 'date':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return sorted;
    }
  };

  const groupByCategory = (emotionsList: Emotion[]): Record<string, Emotion[]> => {
    const groups: Record<string, Emotion[]> = {};

    emotionsList.forEach(emotion => {
      if (!groups[emotion.emotion_category]) {
        groups[emotion.emotion_category] = [];
      }
      groups[emotion.emotion_category].push(emotion);
    });

    return groups;
  };

  const loadEmotions = async () => {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('*');

      if (error) throw error;
      setEmotions(data || []);
    } catch (error) {
      console.error('Error loading emotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = (emotionId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(emotionId)) {
        newFavorites.delete(emotionId);
      } else {
        newFavorites.add(emotionId);
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const handleShare = async (emotion: Emotion) => {
    const shareText = `${emotion.ayah_text}\n\n${emotion.ayah_reference}\n\nالحالة: ${emotion.emotion_name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: emotion.emotion_name,
          text: shareText,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmotionClick = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEmotion(null), 300);
  };

  const handleSurpriseMe = () => {
    if (emotions.length > 0) {
      const randomIndex = Math.floor(Math.random() * emotions.length);
      handleEmotionClick(emotions[randomIndex]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="text-yellow-600 dark:text-yellow-500 w-16 h-16 animate-pulse mx-auto mb-4" />
          <p className="text-2xl text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="text-yellow-600 w-8 h-8 animate-pulse" />
          </div>

          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500">
            <div className="mb-8">
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-800 to-yellow-600 rounded-full blur-3xl"></div>
                </div>
                <div className="relative text-center">
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-green-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-yellow-600"></div>
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-yellow-600 to-yellow-600"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
                <BookOpen size={36} className="text-yellow-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              بماذا تشعر الآن؟
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl mb-6" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              اختر حالتك واكتشف الآية المناسبة
            </p>

            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ابحث عن حالة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-12 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-green-600 dark:focus:border-green-500 focus:outline-none text-right"
                    style={{ fontFamily: 'Traditional Arabic, Arial' }}
                  />
                </div>

                <button
                  onClick={handleSurpriseMe}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Traditional Arabic, Arial' }}
                >
                  <Shuffle size={20} />
                  <span>فاجئني</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 justify-center">
                  <Heart className="text-gray-500 dark:text-gray-400" size={18} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterBy('all')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        filterBy === 'all'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      الكل
                    </button>
                    <button
                      onClick={() => setFilterBy('favorites')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        filterBy === 'favorites'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      <Heart size={16} fill={filterBy === 'favorites' ? 'currentColor' : 'none'} />
                      <span>المفضلات ({favorites.size})</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <ArrowUpDown className="text-gray-500 dark:text-gray-400" size={18} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('category')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        sortBy === 'category'
                          ? 'bg-green-700 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      حسب الفئة
                    </button>
                    <button
                      onClick={() => setSortBy('alphabetical')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        sortBy === 'alphabetical'
                          ? 'bg-green-700 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      أبجديًا
                    </button>
                    <button
                      onClick={() => setSortBy('date')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        sortBy === 'date'
                          ? 'bg-green-700 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      حسب التاريخ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredEmotions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              لا توجد نتائج
            </p>
          </div>
        ) : sortBy === 'category' ? (
          <div className="space-y-8">
            {Object.entries(groupByCategory(filteredEmotions)).map(([category, categoryEmotions]) => (
              <div key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-l from-yellow-600 dark:from-yellow-500 to-transparent"></div>
                  <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 px-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-yellow-600 dark:from-yellow-500 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryEmotions.map((emotion) => (
                    <div
                      key={emotion.id}
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right relative"
                    >
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(emotion.id);
                          }}
                          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-md transition-all duration-300 hover:scale-110"
                        >
                          <Heart
                            size={20}
                            className={favorites.has(emotion.id) ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}
                            fill={favorites.has(emotion.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(emotion);
                          }}
                          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-md transition-all duration-300 hover:scale-110"
                        >
                          <Share2 size={20} className="text-green-700 dark:text-green-500" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleEmotionClick(emotion)}
                        className="w-full text-right"
                      >
                        <div className="flex items-center justify-between mb-3 pl-20">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${emotion.color}-500 to-${emotion.color}-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                            <Sparkles size={24} />
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                            {emotion.emotion_name}
                          </h3>
                        </div>

                        <div className="text-right text-gray-700 dark:text-gray-300 line-clamp-2 text-base md:text-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                          {emotion.ayah_text}
                        </div>

                        <div className="mt-3 text-sm md:text-base text-yellow-700 dark:text-yellow-500 font-bold">
                          {emotion.ayah_reference}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmotions.map((emotion) => (
              <div
                key={emotion.id}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right relative"
              >
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(emotion.id);
                    }}
                    className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-md transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      size={20}
                      className={favorites.has(emotion.id) ? 'text-red-600' : 'text-gray-400 dark:text-gray-500'}
                      fill={favorites.has(emotion.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(emotion);
                    }}
                    className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 shadow-md transition-all duration-300 hover:scale-110"
                  >
                    <Share2 size={20} className="text-green-700 dark:text-green-500" />
                  </button>
                </div>

                <button
                  onClick={() => handleEmotionClick(emotion)}
                  className="w-full text-right"
                >
                  <div className="flex items-center justify-between mb-3 pl-20">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${emotion.color}-500 to-${emotion.color}-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                      {emotion.emotion_name}
                    </h3>
                  </div>

                  <div className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-3 text-right" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {emotion.emotion_category}
                  </div>

                  <div className="text-right text-gray-700 dark:text-gray-300 line-clamp-2 text-base md:text-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {emotion.ayah_text}
                  </div>

                  <div className="mt-3 text-sm md:text-base text-yellow-700 dark:text-yellow-500 font-bold">
                    {emotion.ayah_reference}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-yellow-600/20 dark:border-yellow-500/20 inline-block">
            <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
            </p>
            <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium">
              الطلاق: 2
            </p>
          </div>
        </div>

        <Footer />
      </div>

      <EmotionModal
        emotion={selectedEmotion}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
