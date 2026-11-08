import { useEffect, type ReactNode } from 'react';
import { X, Share, MoreVertical, PlusSquare, Download } from 'lucide-react';
import type { Platform } from '../lib/installPrompt';

const FONT = { fontFamily: 'Traditional Arabic, Arial' };

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-green-700 dark:text-green-400 font-bold mx-1 align-middle">
      {children}
    </span>
  );
}

const STEPS: Record<Platform, { title: string; steps: ReactNode[]; note?: string }> = {
  ios: {
    title: 'ثبّت التطبيق على الآيفون',
    steps: [
      <>
        اضغط زر <Pill><Share className="w-4 h-4" />مشاركة</Pill> في أسفل الشاشة (في Safari) أو أعلاها (في Chrome)
      </>,
      <>
        انزل في القائمة واختر <Pill><PlusSquare className="w-4 h-4" />إضافة إلى الشاشة الرئيسية</Pill>
      </>,
      <>
        اضغط <strong className="text-green-700 dark:text-green-400">إضافة</strong> في الزاوية العلوية، وبيطلع التطبيق مع تطبيقاتك
      </>,
    ],
    note: 'إذا ما لقيت الخيار، افتح الموقع من متصفح Safari وجرّب مرة ثانية.',
  },
  android: {
    title: 'ثبّت التطبيق على الأندرويد',
    steps: [
      <>
        اضغط زر <Pill><MoreVertical className="w-4 h-4" />القائمة</Pill> (الثلاث نقاط) أعلى المتصفح
      </>,
      <>
        اختر <Pill><Download className="w-4 h-4" />تثبيت التطبيق</Pill> أو <Pill>إضافة إلى الشاشة الرئيسية</Pill>
      </>,
      <>
        اضغط <strong className="text-green-700 dark:text-green-400">تثبيت</strong> للتأكيد، وبيطلع التطبيق مع تطبيقاتك
      </>,
    ],
    note: 'الأفضل تفتح الموقع من متصفح Chrome.',
  },
  desktop: {
    title: 'ثبّت التطبيق على الجهاز',
    steps: [
      <>
        في Chrome أو Edge اضغط أيقونة <Pill><Download className="w-4 h-4" />التثبيت</Pill> في آخر شريط العنوان
      </>,
      <>
        أو افتح قائمة المتصفح واختر <Pill>تثبيت التطبيق</Pill>
      </>,
      <>للجوال: افتح نفس الرابط من جوالك واضغط زر التثبيت</>,
    ],
  },
};

export default function InstallGuideModal({ platform, onClose }: { platform: Platform; onClose: () => void }) {
  const guide = STEPS[platform];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-green-800/20 dark:border-green-700/30 overflow-hidden animate-slide-up"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 id="install-guide-title" className="text-xl font-bold text-gray-800 dark:text-gray-100" style={FONT}>
              {guide.title}
            </h3>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ol className="space-y-3 mb-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <p className="flex-1 text-gray-700 dark:text-gray-300 text-base leading-loose" style={FONT}>
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {guide.note && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5" style={FONT}>
              {guide.note}
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg active:scale-95"
            style={FONT}
          >
            فهمت
          </button>
        </div>
      </div>
    </div>
  );
}
