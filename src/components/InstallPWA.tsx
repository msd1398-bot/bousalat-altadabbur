import { useState, useEffect } from 'react';
import { Download, X, Share, MoreVertical, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const androidDevice = /Android/.test(ua);

    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);

    if (iosDevice) {
      setTimeout(() => setShowBanner(true), 2000);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowBanner(false);
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    } else if (isAndroid) {
      setShowBanner(false);
      setShowAndroidModal(true);
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-area-bottom"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-green-800/20 dark:border-green-700/30 overflow-hidden animate-slide-up">
            <div className="h-1 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700" />
            <div className="p-4 flex items-center gap-4" dir="rtl">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-700 to-green-800 rounded-2xl flex items-center justify-center shadow-lg">
                <img src="/icon.svg" alt="icon" className="w-9 h-9" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>

              <div className="flex-1 min-w-0 text-right">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-base" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  أضف التطبيق للشاشة الرئيسية
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {isIOS ? 'متاح لأجهزة iPhone و iPad' : 'متاح لأجهزة Android'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  style={{ fontFamily: 'Traditional Arabic, Arial' }}
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-green-800/20 dark:border-green-700/30 overflow-hidden animate-slide-up"
            dir="rtl"
          >
            <div className="h-1.5 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3
                  className="text-xl font-bold text-gray-800 dark:text-gray-100"
                  style={{ fontFamily: 'Traditional Arabic, Arial' }}
                >
                  إضافة إلى الشاشة الرئيسية
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      اضغط على زر{' '}
                      <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-green-700 dark:text-green-400 font-bold mx-1">
                        <Share className="w-3.5 h-3.5" />
                        مشاركة
                      </span>{' '}
                      في شريط المتصفح السفلي
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      مرر للأسفل واختر{' '}
                      <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-green-700 dark:text-green-400 font-bold mx-1">
                        <Plus className="w-3.5 h-3.5" />
                        أضف إلى الشاشة الرئيسية
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                      style={{ fontFamily: 'Traditional Arabic, Arial' }}
                    >
                      اضغط على <strong className="text-green-700 dark:text-green-400">إضافة</strong> في الزاوية العلوية اليمنى
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg active:scale-95"
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                فهمت، شكراً
              </button>
            </div>
          </div>
        </div>
      )}

      {showAndroidModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md border border-green-800/20 dark:border-green-700/30 overflow-hidden animate-slide-up"
            dir="rtl"
          >
            <div className="h-1.5 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <button
                  onClick={() => setShowAndroidModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3
                  className="text-xl font-bold text-gray-800 dark:text-gray-100"
                  style={{ fontFamily: 'Traditional Arabic, Arial' }}
                >
                  إضافة إلى الشاشة الرئيسية
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p
                    className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                    style={{ fontFamily: 'Traditional Arabic, Arial' }}
                  >
                    اضغط على زر{' '}
                    <span className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 text-green-700 dark:text-green-400 font-bold mx-1">
                      <MoreVertical className="w-3.5 h-3.5" />
                      القائمة
                    </span>{' '}
                    في الزاوية العلوية اليمنى للمتصفح
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p
                    className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                    style={{ fontFamily: 'Traditional Arabic, Arial' }}
                  >
                    اختر <strong className="text-green-700 dark:text-green-400">"إضافة إلى الشاشة الرئيسية"</strong> أو <strong className="text-green-700 dark:text-green-400">"تثبيت التطبيق"</strong>
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <p
                    className="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                    style={{ fontFamily: 'Traditional Arabic, Arial' }}
                  >
                    اضغط على <strong className="text-green-700 dark:text-green-400">إضافة</strong> للتأكيد
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAndroidModal(false)}
                className="w-full py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg active:scale-95"
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                فهمت، شكراً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
