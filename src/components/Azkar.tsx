import { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AzkarItem {
  id: string;
  type: string;
  text_arabic: string;
  text_transliteration: string | null;
  repetition: number;
  reference: string | null;
  order_number: number;
}

interface AzkarProps {
  type: 'morning' | 'evening';
  onBack: () => void;
}

export default function Azkar({ type, onBack }: AzkarProps) {
  const [azkarList, setAzkarList] = useState<AzkarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedCounts, setCompletedCounts] = useState<{ [key: string]: number }>({});
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    fetchAzkar();
  }, [type]);

  async function fetchAzkar() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('azkar')
        .select('*')
        .eq('type', type)
        .order('order_number', { ascending: true });

      if (error) throw error;

      if (data) {
        setAzkarList(data);
        const initialCounts: { [key: string]: number } = {};
        data.forEach(item => {
          initialCounts[item.id] = 0;
        });
        setCompletedCounts(initialCounts);
      }
    } catch (error) {
      console.error('Error fetching azkar:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleIncrement = (id: string, maxRepetition: number) => {
    setCompletedCounts(prev => {
      const currentCount = prev[id] || 0;
      if (currentCount < maxRepetition) {
        if (soundEnabled) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDCC0fPTgjMGHm7A7+OZSA0PVKzn8LJjHAU5k9jyz3otByd6yfLekUELFGC36+yrVxQKR6Hh8sFuIgU0hNHz1YU0Bx9wwfDkmEoOD1Wt6PKzYxwGO5XY89F8LgcqfMny4ZNDCxRiuuztrlgUC0mk4vPDbyMGNobT89aHNQkgcsPx5ZpMDhBXrury');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        }
        return { ...prev, [id]: currentCount + 1 };
      }
      return prev;
    });
  };

  const handleReset = (id: string) => {
    setCompletedCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const isCompleted = (id: string, maxRepetition: number) => {
    return (completedCounts[id] || 0) >= maxRepetition;
  };

  const totalProgress = azkarList.length > 0
    ? Math.round((Object.values(completedCounts).filter((count, idx) => count >= azkarList[idx]?.repetition).length / azkarList.length) * 100)
    : 0;

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mb-6 transition-colors group"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>رجوع</span>
          </button>

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
            {type === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950/30 dark:to-yellow-950/30 rounded-2xl p-6 mb-6 border-2 border-yellow-600/20 dark:border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                التقدم الكلي
              </p>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                title={soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-800 dark:text-green-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            </div>
            <div className="relative h-3 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-600 to-green-800 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
            <p className="text-center text-green-800 dark:text-green-400 font-bold text-lg mt-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              {totalProgress}%
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {azkarList.map((dhikr, index) => {
            const completed = isCompleted(dhikr.id, dhikr.repetition);
            const currentCount = completedCounts[dhikr.id] || 0;

            return (
              <div
                key={dhikr.id}
                className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                  completed
                    ? 'border-green-600 dark:border-green-500 bg-green-50/50 dark:bg-green-950/50'
                    : 'border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-xl'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-gray-800 dark:text-gray-100 text-xl md:text-2xl leading-relaxed mb-4 text-right"
                      style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '2' }}
                    >
                      {dhikr.text_arabic}
                    </p>

                    {dhikr.reference && (
                      <div className="flex justify-end mb-3">
                        <span className="text-sm text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1 rounded-full border border-yellow-600/20 dark:border-yellow-500/20" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                          {dhikr.reference}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                          {currentCount} / {dhikr.repetition}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {!completed && (
                          <button
                            onClick={() => handleIncrement(dhikr.id, dhikr.repetition)}
                            className="px-6 py-2 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-lg hover:from-green-800 hover:to-green-900 transition-all transform hover:scale-105 shadow-md font-medium"
                            style={{ fontFamily: 'Traditional Arabic, Arial' }}
                          >
                            تم
                          </button>
                        )}
                        {currentCount > 0 && (
                          <button
                            onClick={() => handleReset(dhikr.id)}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-md font-medium"
                            style={{ fontFamily: 'Traditional Arabic, Arial' }}
                          >
                            إعادة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalProgress === 100 && (
          <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-700 dark:to-green-900 text-white rounded-2xl p-8 shadow-2xl text-center border-4 border-yellow-600/30 dark:border-yellow-500/30 animate-pulse mb-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              بارك الله فيك!
            </p>
            <p className="text-lg md:text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              أتممت جميع الأذكار
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
