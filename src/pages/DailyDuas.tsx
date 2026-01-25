import { useState } from 'react';
import { ArrowLeft, Home, Moon, Sun, Utensils, Plane, Droplet, Building, HandHeart } from 'lucide-react';
import Footer from '../components/Footer';
import { duasData, duaCategories } from '../data/duas';

interface DailyDuasProps {
  onBack: () => void;
}

export default function DailyDuas({ onBack }: DailyDuasProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      utensils: Utensils,
      moon: Moon,
      sun: Sun,
      home: Home,
      building: Building,
      plane: Plane,
      droplet: Droplet,
      hands: HandHeart
    };
    const Icon = icons[iconName] || HandHeart;
    return <Icon className="w-6 h-6" />;
  };

  const filteredDuas = selectedCategory
    ? duasData.filter(dua => dua.category === selectedCategory)
    : duasData;

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-green-600 dark:border-green-500 mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>العودة</span>
          </button>

          <div className="mb-8">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 bg-gradient-to-br from-green-800 to-green-600 rounded-full blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-green-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-green-600/30">
              <HandHeart size={36} className="text-green-100" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الأدعية اليومية
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-600 dark:via-green-500 to-transparent"></div>
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-600 dark:via-green-500 to-transparent"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center mb-8" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            أدعية مأثورة من السنة النبوية الشريفة
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
            }`}
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            الكل
          </button>
          {duaCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
              style={{ fontFamily: 'Traditional Arabic, Arial' }}
            >
              {getIcon(category.icon)}
              {category.name_ar}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-green-600 dark:hover:border-green-500 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-400 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {dua.title_ar}
              </h3>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 mb-4 border border-green-200 dark:border-green-800">
                <p className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 text-center leading-loose" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '2' }}>
                  {dua.dua_ar}
                </p>
              </div>

              {dua.source && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full"></div>
                  <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>{dua.source}</span>
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
