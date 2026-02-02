import { useState, useEffect, useRef } from 'react';
import { BookOpen, Play, Pause, Volume2, ArrowLeft, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio: string;
}

export default function Quran() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();

      if (data.code === 200) {
        setSurahs(data.data);
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurahAyahs = async (surahNumber: number) => {
    try {
      setLoadingAyahs(true);
      const [textResponse, audioResponse] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
      ]);

      const textData = await textResponse.json();
      const audioData = await audioResponse.json();

      if (textData.code === 200 && audioData.code === 200) {
        const ayahsWithAudio = textData.data.ayahs.map((ayah: Ayah, index: number) => ({
          ...ayah,
          audio: audioData.data.ayahs[index].audio,
        }));
        setAyahs(ayahsWithAudio);
      }
    } catch (error) {
      console.error('Error fetching ayahs:', error);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const handleSurahClick = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchSurahAyahs(surah.number);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAudio = (ayah: Ayah) => {
    if (playingAyah === ayah.number) {
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = ayah.audio;
        audioRef.current.play();
        setPlayingAyah(ayah.number);
      }
    }
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="text-green-700 dark:text-green-500 w-16 h-16 animate-pulse mx-auto mb-4" />
          <p className="text-2xl text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            جاري تحميل القرآن الكريم...
          </p>
        </div>
      </div>
    );
  }

  if (selectedSurah) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => {
                setSelectedSurah(null);
                setAyahs([]);
                setPlayingAyah(null);
                audioRef.current?.pause();
              }}
              className="flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mb-4"
              style={{ fontFamily: 'Traditional Arabic, Arial' }}
            >
              <ArrowLeft size={20} />
              <span className="font-medium">العودة للسور</span>
            </button>

            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-yellow-600"></div>
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-yellow-600 to-yellow-600"></div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-3" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {selectedSurah.name}
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {selectedSurah.englishNameTranslation}
                </p>

                <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
                  <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                  </span>
                  <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {selectedSurah.numberOfAyahs} آية
                  </span>
                </div>
              </div>

              {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                <div className="text-center mb-8 py-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl">
                  <p className="text-3xl md:text-4xl text-gray-800 dark:text-gray-200" style={{ fontFamily: 'Traditional Arabic, serif' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </div>
          </div>

          {loadingAyahs ? (
            <div className="text-center py-12">
              <BookOpen className="text-green-700 dark:text-green-500 w-16 h-16 animate-pulse mx-auto mb-4" />
              <p className="text-xl text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                جاري تحميل الآيات...
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {ayahs.map((ayah) => (
                <div
                  key={ayah.number}
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handlePlayAudio(ayah)}
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      {playingAyah === ayah.number ? (
                        <Pause size={20} fill="white" />
                      ) : (
                        <Volume2 size={20} />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                          {ayah.numberInSurah}
                        </div>
                      </div>

                      <p
                        className="text-2xl md:text-3xl leading-loose text-gray-800 dark:text-gray-100 text-right"
                        style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '2.5' }}
                      >
                        {ayah.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Footer />
        </div>

        <audio
          ref={audioRef}
          onEnded={() => setPlayingAyah(null)}
          onError={() => setPlayingAyah(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/muslim-guide')}
            className="flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mb-4"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">العودة</span>
          </button>

          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500">
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

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              القرآن الكريم
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              قراءة واستماع للقرآن الكريم
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن سورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-green-800/20 dark:border-green-700/30 bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 text-lg focus:outline-none focus:border-green-600 dark:focus:border-green-500 transition-colors"
              style={{ fontFamily: 'Traditional Arabic, Arial' }}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            ) : (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSurahClick(surah)}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-right"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                  {surah.number}
                </div>
                <div className="flex-1 mr-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {surah.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {surah.englishNameTranslation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                </span>
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {surah.numberOfAyahs} آية
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              لم يتم العثور على نتائج
            </p>
          </div>
        )}

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center border-2 border-yellow-600/30 dark:border-yellow-500/30 mb-8">
          <BookOpen className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
          </p>
          <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الإسراء: 9
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
