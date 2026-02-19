import { BookOpen, Heart, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Home() {
  const revealRef = useScrollReveal();

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8" ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="max-w-5xl mx-auto">
        <div
          data-reveal="fade-down"
          data-reveal-delay="0"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-yellow-600 dark:border-yellow-500 mb-8"
        >
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

          <div
            data-reveal="zoom-in"
            data-reveal-delay="100"
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
                <Compass className="w-10 h-10 text-yellow-400" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              بوصلة التدبّر
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-2xl mb-8 leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              رفيقك في رحلة التدبّر والتأمل، نرشدك نحو السكينة والطمأنينة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/muslim-guide"
              data-reveal="fade-right"
              data-reveal-delay="200"
              className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-right relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-700 to-green-800 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen size={28} strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>دليل المسلم</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  مرجعك الشامل للعبادات اليومية، الأذكار، أوقات الصلاة، والمزيد من الأدوات التي تعينك على العبادة
                </p>
              </div>
            </Link>

            <Link
              to="/emotions"
              data-reveal="fade-left"
              data-reveal-delay="350"
              className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-right relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Heart size={28} strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>يومياتي</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  سجل مشاعرك اليومية، تابع حالتك النفسية، واكتشف الآيات القرآنية المناسبة لكل حالة
                </p>
              </div>
            </Link>
          </div>

          <div
            data-reveal="flip-up"
            data-reveal-delay="450"
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 text-center border-2 border-yellow-600/30 dark:border-yellow-500/30"
          >
            <div className="mb-4">
              <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto" />
            </div>
            <p className="text-gray-800 dark:text-gray-100 text-2xl md:text-3xl leading-relaxed font-semibold mb-3" style={{ fontFamily: 'Traditional Arabic, serif' }}>
              "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ"
            </p>
            <p className="text-yellow-700 dark:text-yellow-500 text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>حديث شريف</p>
          </div>
        </div>

        <div data-reveal="fade-up" data-reveal-delay="500">
          <Footer />
        </div>
      </div>
    </div>
  );
}
