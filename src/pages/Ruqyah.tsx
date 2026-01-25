import { useState } from 'react';
import { ArrowLeft, Heart, BookOpen, Shield } from 'lucide-react';
import Footer from '../components/Footer';
import { ruqyahData, ruqyahCategories } from '../data/ruqyah';

interface RuqyahProps {
  onBack: () => void;
}

export default function Ruqyah({ onBack }: RuqyahProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = selectedCategory === 'all'
    ? ruqyahData
    : ruqyahData.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quran':
        return <BookOpen className="w-5 h-5" />;
      case 'dua':
        return <Heart className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-emerald-600 dark:border-emerald-500 mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>العودة</span>
          </button>

          <div className="mb-8">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-full blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-800 to-emerald-700 rounded-full flex items-center justify-center shadow-xl border-4 border-emerald-600/30">
              <Shield size={36} className="text-emerald-100" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الرقية الشرعية
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 dark:via-emerald-500 to-transparent"></div>
            <div className="w-3 h-3 bg-emerald-600 dark:bg-emerald-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 dark:via-emerald-500 to-transparent"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center mb-8" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            آيات قرآنية وأدعية للشفاء والحماية
          </p>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl p-6 text-center border-2 border-emerald-200 dark:border-emerald-800 mb-6">
            <p className="text-gray-700 dark:text-gray-200 text-lg md:text-xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ
            </p>
            <p className="text-emerald-700 dark:text-emerald-500 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              الإسراء: 82
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
            }`}
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <Shield className="w-5 h-5" />
            الكل
          </button>
          <button
            onClick={() => setSelectedCategory('quran')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              selectedCategory === 'quran'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
            }`}
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <BookOpen className="w-5 h-5" />
            آيات قرآنية
          </button>
          <button
            onClick={() => setSelectedCategory('dua')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              selectedCategory === 'dua'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
            }`}
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <Heart className="w-5 h-5" />
            أدعية مأثورة
          </button>
        </div>

        <div className="grid gap-6 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-800/20 dark:border-emerald-700/30 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  item.category === 'quran'
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                    : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                }`}>
                  {getCategoryIcon(item.category)}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-400 flex-1" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {item.title_ar}
                </h3>
                {item.repeat && (
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-lg">
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                      تكرر {item.repeat}×
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl p-6 mb-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 text-center leading-loose" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '2.2' }}>
                  {item.text_ar}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full"></div>
                <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>{item.source}</span>
                <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-6 text-center border-2 border-amber-200 dark:border-amber-800 mb-8">
          <Shield className="w-8 h-8 text-amber-600 dark:text-amber-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-base md:text-lg leading-relaxed mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            <strong>ملاحظة مهمة:</strong> الرقية الشرعية سبب من أسباب الشفاء، والشافي هو الله سبحانه وتعالى. يُنصح بالمحافظة على الصلوات الخمس، وقراءة القرآن، والأذكار اليومية.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            إذا استمرت الأعراض، يُرجى مراجعة الطبيب المختص.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
