import { useState } from 'react';
import { ArrowLeft, Sparkles, Search } from 'lucide-react';
import Footer from '../components/Footer';
import { allahNames } from '../data/allahNames';

interface AllahNamesProps {
  onBack: () => void;
}

export default function AllahNames({ onBack }: AllahNamesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNames = allahNames.filter(
    (name) =>
      name.name_ar.includes(searchTerm) ||
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.meaning_ar.includes(searchTerm)
  );

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-teal-600 dark:border-teal-500 mb-8">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>العودة</span>
          </button>

          <div className="mb-8">
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 bg-gradient-to-br from-teal-800 to-teal-600 rounded-full blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-800 to-teal-700 rounded-full flex items-center justify-center shadow-xl border-4 border-teal-600/30">
              <Sparkles size={36} className="text-teal-100" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            أسماء الله الحسنى
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-600 dark:via-teal-500 to-transparent"></div>
            <div className="w-3 h-3 bg-teal-600 dark:bg-teal-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-600 dark:via-teal-500 to-transparent"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center mb-8" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الأسماء التسعة والتسعون لله سبحانه وتعالى
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن اسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-6 py-4 rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-white/80 dark:bg-gray-800/80 focus:border-teal-500 dark:focus:border-teal-400 outline-none transition-colors text-right text-lg"
              style={{ fontFamily: 'Traditional Arabic, Arial' }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredNames.map((name) => (
            <div
              key={name.id}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-teal-800/20 dark:border-teal-700/30 hover:border-teal-600 dark:hover:border-teal-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full text-white font-bold mb-3">
                  {name.id}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif' }}>
                  {name.name_ar}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">
                  {name.transliteration}
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl p-4 border border-teal-200 dark:border-teal-800">
                <p className="text-gray-700 dark:text-gray-300 text-center text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {name.meaning_ar}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredNames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              لا توجد نتائج للبحث
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-2xl p-8 text-center border-2 border-teal-200 dark:border-teal-800 mb-8">
          <Sparkles className="w-8 h-8 text-teal-600 dark:text-teal-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-3" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            «إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ»
          </p>
          <p className="text-teal-700 dark:text-teal-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            صحيح البخاري ومسلم
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
