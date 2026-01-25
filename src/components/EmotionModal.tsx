import { X, BookOpen, Lightbulb, Heart, Sparkles, Share2, Copy, Check } from 'lucide-react';
import { Emotion } from '../types/emotion';
import { useState } from 'react';

interface EmotionModalProps {
  emotion: Emotion | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmotionModal({ emotion, isOpen, onClose }: EmotionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !emotion) return null;

  const handleShare = async () => {
    const shareText = `${emotion.ayah_text}\n\n${emotion.ayah_reference}\n\nالحالة: ${emotion.emotion_name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: emotion.emotion_name,
          text: shareText,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-600/30 dark:border-yellow-500/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 islamic-pattern opacity-30 rounded-3xl pointer-events-none"></div>

        <div className="sticky top-0 bg-gradient-to-r from-green-800 via-green-700 to-green-800 dark:from-green-900 dark:via-green-800 dark:to-green-900 text-white p-6 rounded-t-3xl flex justify-between items-center relative z-10 border-b-4 border-yellow-600 dark:border-yellow-500">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="hover:bg-green-900 rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              onClick={handleShare}
              className="hover:bg-green-900 rounded-full p-2 transition-all duration-300 relative"
              aria-label="Share"
            >
              {copied ? (
                <Check size={24} className="text-yellow-400" />
              ) : (
                <Share2 size={24} />
              )}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              {emotion.emotion_name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10">
          {/* Decorative Stars */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 text-yellow-600 dark:text-yellow-500">
              <span className="text-2xl">✦</span>
              <span className="text-xl">✦</span>
              <span className="text-2xl">✦</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r-8 border-yellow-600 dark:border-yellow-500 p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20 bg-green-800/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-600/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <p className="text-3xl text-gray-800 dark:text-gray-100 leading-loose text-right font-arabic mb-6" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {emotion.ayah_text}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <div className="px-4 py-2 bg-gradient-to-r from-green-800 to-green-700 text-white rounded-full text-sm font-bold">
                    {emotion.ayah_reference}
                  </div>
                  <div className="w-8 h-0.5 bg-yellow-600 dark:bg-yellow-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-800/20 dark:border-green-700/30">
              <div className="flex items-center justify-end gap-3 mb-4">
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  الشرح
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
              </div>
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed text-right" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {emotion.explanation}
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-600/20 dark:border-yellow-500/20">
              <div className="flex items-center justify-end gap-3 mb-4">
                <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-500" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  عمل عملي
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <Lightbulb size={20} className="text-white" />
                </div>
              </div>
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed text-right" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {emotion.action}
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border-2 border-rose-600/20 dark:border-rose-500/20">
              <div className="flex items-center justify-end gap-3 mb-4">
                <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-500" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  دعاء
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
              </div>
              <p className="text-xl text-gray-800 dark:text-gray-200 leading-loose text-right font-arabic" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {emotion.duaa}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-800/5 via-yellow-600/5 to-green-800/5 p-6 rounded-b-3xl relative z-10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-800 to-green-700 hover:from-green-900 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-2 border-yellow-600/50"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
