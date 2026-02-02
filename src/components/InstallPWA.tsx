import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    if (!isStandalone && !isIOSDevice) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallButton(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border-4 border-green-700">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              تثبيت التطبيق
            </h3>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 text-right" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              لتثبيت التطبيق على جهاز iOS:
            </p>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">1</span>
                <span>اضغط على زر "المشاركة" (السهم للأعلى) في شريط المتصفح السفلي</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">2</span>
                <span>مرر للأسفل واختر "أضف إلى الشاشة الرئيسية"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold">3</span>
                <span>اضغط على "إضافة" في الزاوية العلوية</span>
              </li>
            </ol>
          </div>

          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            فهمت
          </button>
        </div>
      </div>
    );
  }

  if (!showInstallButton && !isIOS) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="p-2 rounded-lg bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-2"
      aria-label="تثبيت التطبيق"
      title="تثبيت التطبيق على جهازك"
    >
      <Download className="w-5 h-5" />
      <span className="hidden sm:inline font-medium text-sm" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
        تثبيت
      </span>
    </button>
  );
}
