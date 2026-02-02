import { useState } from 'react';
import { BookOpen, Clock, Moon, Sun, Compass, Sparkles, HandHeart, Droplets, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Azkar from '../components/Azkar';
import DailyDuas from './DailyDuas';
import Tasbih from './Tasbih';
import AllahNames from './AllahNames';
import Ruqyah from './Ruqyah';

type PageType = 'main' | 'morning' | 'evening' | 'duas' | 'tasbih' | 'names' | 'ruqyah';

export default function MuslimGuide() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const navigate = useNavigate();

  if (currentPage === 'morning' || currentPage === 'evening') {
    return <Azkar type={currentPage} onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'duas') {
    return <DailyDuas onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'tasbih') {
    return <Tasbih onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'names') {
    return <AllahNames onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'ruqyah') {
    return <Ruqyah onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500 mb-8">
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
            دليل المسلم
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center mb-8" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            مرجعك الشامل للعبادات والأذكار
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>أوقات الصلاة</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>معرفة أوقات الصلوات الخمس بدقة حسب موقعك</p>
            <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950/30 dark:to-green-950/30 rounded-lg border border-yellow-600/20 dark:border-yellow-500/20">
              <span className="text-yellow-700 dark:text-yellow-500 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>قريباً</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('evening')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-purple-500 group-hover:to-purple-600 transition-all">
              <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>أذكار المساء</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الأذكار المأثورة من السنة النبوية الشريفة</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('morning')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-amber-500 group-hover:to-amber-600 transition-all">
              <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>أذكار الصباح</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>ابدأ يومك بالأذكار النبوية المباركة</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('duas')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-green-500 group-hover:to-green-600 transition-all">
              <HandHeart className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الأدعية اليومية</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>أدعية مأثورة من السنة النبوية الشريفة</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('tasbih')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/50 dark:to-orange-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-amber-500 group-hover:to-orange-600 transition-all">
              <Droplets className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>المسبحة الإلكترونية</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>عداد تسبيح رقمي لذكر الله</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('names')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900/50 dark:to-cyan-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-teal-500 group-hover:to-cyan-600 transition-all">
              <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>أسماء الله الحسنى</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الأسماء التسعة والتسعون لله تعالى</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('ruqyah')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/50 dark:to-green-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-emerald-500 group-hover:to-green-600 transition-all">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الرقية الشرعية</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>آيات قرآنية وأدعية للشفاء والحماية</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-teal-500 group-hover:to-teal-600 transition-all">
              <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اتجاه القبلة</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>تحديد اتجاه القبلة الشريفة بدقة</p>
            <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950/30 dark:to-green-950/30 rounded-lg border border-yellow-600/20 dark:border-yellow-500/20">
              <span className="text-yellow-700 dark:text-yellow-500 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>قريباً</span>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all">
              <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>القرآن الكريم</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>قراءة واستماع للقرآن الكريم مع التفسير</p>
            <div className="text-center py-3 bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950/30 dark:to-green-950/30 rounded-lg border border-yellow-600/20 dark:border-yellow-500/20">
              <span className="text-yellow-700 dark:text-yellow-500 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>قريباً</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/hadith')}
            className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
          >
            <div className="bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-rose-500 group-hover:to-rose-600 transition-all">
              <BookOpen className="w-6 h-6 text-rose-600 dark:text-rose-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الأحاديث النبوية</h3>
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>مجموعة من الأحاديث الصحيحة المختارة</p>
            <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
              <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
            </div>
          </button>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center border-2 border-yellow-600/30 dark:border-yellow-500/30">
          <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الطلاق: 2
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
