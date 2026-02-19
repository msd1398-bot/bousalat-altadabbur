import { useState } from 'react';
import { BookOpen, Clock, Moon, Sun, Compass, Sparkles, HandHeart, Droplets, Shield, Heart, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Azkar from '../components/Azkar';
import DailyDuas from './DailyDuas';
import Tasbih from './Tasbih';
import AllahNames from './AllahNames';
import Ruqyah from './Ruqyah';
import { useScrollReveal } from '../hooks/useScrollReveal';

type PageType = 'main' | 'morning' | 'evening' | 'duas' | 'tasbih' | 'names' | 'ruqyah';

const menuItems = [
  { id: 'prayer-times' as const, navigate: true, label: 'أوقات الصلاة', desc: 'معرفة أوقات الصلوات الخمس بدقة حسب موقعك', icon: Clock, bg: 'from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50', hoverBg: 'group-hover:from-blue-500 group-hover:to-blue-600', iconColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'evening' as const, navigate: false, label: 'أذكار المساء', desc: 'الأذكار المأثورة من السنة النبوية الشريفة', icon: Moon, bg: 'from-slate-100 to-slate-200 dark:from-slate-900/50 dark:to-slate-800/50', hoverBg: 'group-hover:from-slate-500 group-hover:to-slate-600', iconColor: 'text-slate-600 dark:text-slate-400' },
  { id: 'morning' as const, navigate: false, label: 'أذكار الصباح', desc: 'ابدأ يومك بالأذكار النبوية المباركة', icon: Sun, bg: 'from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50', hoverBg: 'group-hover:from-amber-500 group-hover:to-amber-600', iconColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'duas' as const, navigate: false, label: 'الأدعية اليومية', desc: 'أدعية مأثورة من السنة النبوية الشريفة', icon: HandHeart, bg: 'from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50', hoverBg: 'group-hover:from-green-500 group-hover:to-green-600', iconColor: 'text-green-600 dark:text-green-400' },
  { id: 'tasbih' as const, navigate: false, label: 'المسبحة الإلكترونية', desc: 'عداد تسبيح رقمي لذكر الله', icon: Droplets, bg: 'from-amber-100 to-orange-200 dark:from-amber-900/50 dark:to-orange-800/50', hoverBg: 'group-hover:from-amber-500 group-hover:to-orange-600', iconColor: 'text-amber-600 dark:text-amber-400' },
  { id: 'names' as const, navigate: false, label: 'أسماء الله الحسنى', desc: 'الأسماء التسعة والتسعون لله تعالى', icon: Sparkles, bg: 'from-teal-100 to-cyan-200 dark:from-teal-900/50 dark:to-cyan-800/50', hoverBg: 'group-hover:from-teal-500 group-hover:to-cyan-600', iconColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'ruqyah' as const, navigate: false, label: 'الرقية الشرعية', desc: 'آيات قرآنية وأدعية للشفاء والحماية', icon: Shield, bg: 'from-emerald-100 to-green-200 dark:from-emerald-900/50 dark:to-green-800/50', hoverBg: 'group-hover:from-emerald-500 group-hover:to-green-600', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'qibla' as const, navigate: true, label: 'اتجاه القبلة', desc: 'تحديد اتجاه القبلة الشريفة بدقة', icon: Compass, bg: 'from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50', hoverBg: 'group-hover:from-teal-500 group-hover:to-teal-600', iconColor: 'text-teal-600 dark:text-teal-400' },
  { id: 'quran' as const, navigate: true, label: 'القرآن الكريم', desc: 'قراءة واستماع للقرآن الكريم', icon: BookOpen, bg: 'from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50', hoverBg: 'group-hover:from-emerald-500 group-hover:to-emerald-600', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'hadith' as const, navigate: true, label: 'الأحاديث النبوية', desc: 'مجموعة من الأحاديث الصحيحة المختارة', icon: BookOpen, bg: 'from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/50', hoverBg: 'group-hover:from-rose-500 group-hover:to-rose-600', iconColor: 'text-rose-600 dark:text-rose-400' },
];

export default function MuslimGuide() {
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  const navigate = useNavigate();
  const revealRef = useScrollReveal();

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

  const handleClick = (item: typeof menuItems[0]) => {
    if (item.navigate) {
      navigate(`/${item.id}`);
    } else {
      setCurrentPage(item.id as PageType);
    }
  };

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8" ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="max-w-6xl mx-auto">
        <div
          data-reveal="fade-down"
          data-reveal-delay="0"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500 mb-8"
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
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
              <BookOpen size={36} className="text-yellow-400" />
            </div>
          </div>

          <h1
            data-reveal="fade-up"
            data-reveal-delay="150"
            className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            دليل المسلم
          </h1>

          <div
            data-reveal="fade-up"
            data-reveal-delay="200"
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
          </div>

          <p
            data-reveal="fade-up"
            data-reveal-delay="250"
            className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl text-center mb-8"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            مرجعك الشامل للعبادات والأذكار
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-reveal="fade-up"
                data-reveal-delay={`${index * 60}`}
                onClick={() => handleClick(item)}
                className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group text-right"
              >
                <div className={`bg-gradient-to-br ${item.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${item.hoverBg} transition-all`}>
                  <Icon className={`w-6 h-6 ${item.iconColor} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>{item.label}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>{item.desc}</p>
                <div className="text-center py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg">
                  <span className="text-white font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>اضغط للبدء</span>
                </div>
              </button>
            );
          })}
        </div>

        <a
          href="https://ehsan.sa/"
          target="_blank"
          rel="noopener noreferrer"
          data-reveal="flip-up"
          data-reveal-delay="200"
          className="block mb-8 group"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-green-800 via-green-700 to-green-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-yellow-600/30 hover:border-yellow-500/60 transition-all duration-300 hover:shadow-yellow-600/20 hover:shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-right">
              <div className="flex-shrink-0 w-16 h-16 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-all duration-300">
                <Heart className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-1">
                  <span className="text-yellow-400 text-sm font-medium tracking-wide" style={{ fontFamily: 'Traditional Arabic, Arial' }}>تبرع وتصدق</span>
                  <div className="w-8 h-0.5 bg-yellow-500/50"></div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  الصدقة - جمعية إحسان الخيرية
                </h3>
                <p className="text-green-100/80 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  قال النبي ﷺ: "الصدقة تطفئ الخطيئة كما يطفئ الماء النار" — تبرع الآن عبر جمعية إحسان الخيرية وكن سبباً في نشر الخير
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-5 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg">
                <span style={{ fontFamily: 'Traditional Arabic, Arial' }}>تبرع الآن</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>

        <div
          data-reveal="fade-up"
          data-reveal-delay="100"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center border-2 border-yellow-600/30 dark:border-yellow-500/30"
        >
          <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            الطلاق: 2
          </p>
        </div>

        <div data-reveal="fade-up" data-reveal-delay="150">
          <Footer />
        </div>
      </div>
    </div>
  );
}
