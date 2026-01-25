import { useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';

interface TasbihProps {
  onBack: () => void;
}

const tasbihPhrases = [
  { id: 1, text: 'سُبْحَانَ اللَّهِ', translation: 'Glory be to Allah', color: 'from-blue-600 to-blue-800' },
  { id: 2, text: 'الْحَمْدُ لِلَّهِ', translation: 'Praise be to Allah', color: 'from-green-600 to-green-800' },
  { id: 3, text: 'اللَّهُ أَكْبَرُ', translation: 'Allah is the Greatest', color: 'from-amber-600 to-amber-800' },
  { id: 4, text: 'لَا إِلَهَ إِلَّا اللَّهُ', translation: 'There is no god but Allah', color: 'from-teal-600 to-teal-800' },
  { id: 5, text: 'أَسْتَغْفِرُ اللَّهَ', translation: 'I seek forgiveness from Allah', color: 'from-purple-600 to-purple-800' }
];

export default function Tasbih({ onBack }: TasbihProps) {
  const [selectedPhrase, setSelectedPhrase] = useState(tasbihPhrases[0]);
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalCount(totalCount + 1);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 300);

    if (newCount === 33 || newCount === 100) {
      setTimeout(() => {
        alert(`ما شاء الله! أتممت ${newCount} تسبيحة`);
      }, 300);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleResetAll = () => {
    setCount(0);
    setTotalCount(0);
  };

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-amber-600 dark:border-amber-500 mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>العودة</span>
          </button>

          <div className="mb-8">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 bg-gradient-to-br from-amber-800 to-amber-600 rounded-full blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-800 to-amber-700 rounded-full flex items-center justify-center shadow-xl border-4 border-amber-600/30">
              <Sparkles size={36} className="text-amber-100" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            المسبحة الإلكترونية
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600 dark:via-amber-500 to-transparent"></div>
            <div className="w-3 h-3 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-600 dark:via-amber-500 to-transparent"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tasbihPhrases.map((phrase) => (
              <button
                key={phrase.id}
                onClick={() => {
                  setSelectedPhrase(phrase);
                  setCount(0);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedPhrase.id === phrase.id
                    ? `bg-gradient-to-r ${phrase.color} text-white shadow-lg scale-105`
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                {phrase.text}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-3xl p-8 mb-8 border-2 border-amber-200 dark:border-amber-800">
            <div className={`text-center mb-8 transition-all duration-300 ${showAnimation ? 'scale-110' : 'scale-100'}`}>
              <p className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                {selectedPhrase.text}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                {selectedPhrase.translation}
              </p>
            </div>

            <div className="text-center mb-8">
              <button
                onClick={handleCount}
                className={`w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${selectedPhrase.color} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center mx-auto border-8 border-white dark:border-gray-900`}
              >
                <div className="text-center">
                  <div className="text-7xl md:text-8xl font-bold text-white mb-2">{count}</div>
                  <div className="text-sm md:text-base text-white/90 font-semibold" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    عدد التسبيحات
                  </div>
                </div>
              </button>
            </div>

            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-900 transition-all flex items-center gap-2"
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                <RotateCcw size={20} />
                إعادة تعيين العدد
              </button>
              <button
                onClick={handleResetAll}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-900 transition-all flex items-center gap-2"
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                <RotateCcw size={20} />
                إعادة تعيين الكل
              </button>
            </div>

            <div className="text-center">
              <div className="inline-block bg-white/80 dark:bg-gray-800/80 rounded-xl px-6 py-3 border-2 border-amber-300 dark:border-amber-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  إجمالي التسبيحات اليوم
                </p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-500">{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 text-center border border-green-200 dark:border-green-800">
            <p className="text-gray-700 dark:text-gray-200 text-xl md:text-2xl leading-relaxed font-semibold" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              «مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ»
            </p>
            <p className="text-green-700 dark:text-green-500 mt-3 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              صحيح البخاري
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
