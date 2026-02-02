import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateVersion, setUpdateVersion] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateVersion(event.data.version);
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800 text-white rounded-lg shadow-2xl p-4 border border-teal-500">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 mt-0.5">
            <RefreshCw className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1">تحديث جديد متوفر!</h3>
            <p className="text-sm text-teal-50 leading-relaxed">
              إصدار {updateVersion} جاهز. اضغط "تحديث" للحصول على أحدث المميزات والتحسينات.
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-white text-teal-700 font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors duration-200 text-sm"
              >
                تحديث الآن
              </button>
              <button
                onClick={handleDismiss}
                className="bg-teal-800/50 hover:bg-teal-800/70 p-2 rounded-lg transition-colors duration-200"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
