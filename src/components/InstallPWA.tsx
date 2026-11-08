import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, X } from 'lucide-react';
import InstallGuideModal from './InstallGuideModal';
import { useInstallApp } from '../hooks/useInstallApp';

const FONT = { fontFamily: 'Traditional Arabic, Arial' };
const DISMISS_KEY = 'pwa-banner-dismissed';

/** Small bottom banner on phones, once per session. The permanent button lives on the home page. */
export default function InstallPWA() {
  const { platform, installed, nativeReady, install, showGuide, closeGuide } = useInstallApp();
  const [showBanner, setShowBanner] = useState(false);
  // The home page has its own permanent install card, so the banner stays off there.
  const onHome = useLocation().pathname === '/';

  useEffect(() => {
    if (installed) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      /* storage blocked */
    }
    // On phones only: iPhone always (no native prompt there), Android/desktop when the browser offers install.
    const eligible = platform === 'ios' || (platform === 'android' && nativeReady);
    if (dismissed || !eligible) return;
    const t = window.setTimeout(() => setShowBanner(true), 2000);
    return () => window.clearTimeout(t);
  }, [installed, platform, nativeReady]);

  const dismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      /* storage blocked */
    }
  };

  if (installed) return null;

  return (
    <>
      {showBanner && !onHome && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-green-800/20 dark:border-green-700/30 overflow-hidden animate-slide-up">
            <div className="h-1 bg-gradient-to-r from-green-700 via-yellow-500 to-green-700" />
            <div className="p-4 flex items-center gap-4" dir="rtl">
              <img src="/icon-192.png" alt="" className="flex-shrink-0 w-14 h-14 rounded-2xl shadow-lg" />
              <div className="flex-1 min-w-0 text-right">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-base" style={FONT}>
                  أضف التطبيق للشاشة الرئيسية
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5" style={FONT}>
                  يفتح بضغطة ويشتغل بدون إنترنت
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setShowBanner(false);
                    install();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                  style={FONT}
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت</span>
                </button>
                <button
                  onClick={dismiss}
                  aria-label="إغلاق"
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showGuide && <InstallGuideModal platform={platform} onClose={closeGuide} />}
    </>
  );
}
