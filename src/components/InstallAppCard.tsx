import { Smartphone, Download } from 'lucide-react';
import InstallGuideModal from './InstallGuideModal';
import { useInstallApp } from '../hooks/useInstallApp';

const FONT = { fontFamily: 'Traditional Arabic, Arial' };

/** Always-visible "add to home screen" card. Hidden once the app runs installed. */
export default function InstallAppCard() {
  const { platform, installed, install, showGuide, closeGuide } = useInstallApp();

  if (installed) return null;

  return (
    <>
      <div className="mb-8 rounded-2xl p-5 md:p-6 bg-gradient-to-r from-green-800 via-green-700 to-green-800 border border-yellow-600/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className="w-14 h-14 shrink-0 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-7 h-7 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white mb-1" style={FONT}>
              ثبّت التطبيق على جوالك
            </h2>
            <p className="text-green-100/90 text-base md:text-lg" style={FONT}>
              يصير مثل أي تطبيق: أيقونة على الشاشة، يفتح بضغطة، ويشتغل حتى بدون إنترنت
            </p>
          </div>
          <button
            onClick={install}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 text-lg"
            style={FONT}
          >
            <Download className="w-5 h-5" />
            تثبيت التطبيق
          </button>
        </div>
      </div>
      {showGuide && <InstallGuideModal platform={platform} onClose={closeGuide} />}
    </>
  );
}
