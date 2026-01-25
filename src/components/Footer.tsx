import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 md:p-10 border-2 border-yellow-600/30 dark:border-yellow-500/30 shadow-xl">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-700 to-green-800 rounded-full shadow-lg mb-4">
                <Heart className="w-8 h-8 text-yellow-400" fill="currentColor" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-800 dark:text-gray-200 text-xl md:text-2xl leading-relaxed font-semibold" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                اللهم إني استودعتك هذا العمل، فاجعله لي شفيعاً ولأهلي حجاباً من النار
              </p>

              <div className="flex items-center justify-center gap-3 my-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
                <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              </div>

              <p className="text-green-800 dark:text-green-400 text-lg md:text-xl leading-relaxed font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                خالصٌ لوجه الله
              </p>

              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-yellow-600/20 dark:border-yellow-500/20">
                <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  أسألكم الدعاء لي ولوالديّ بالرحمة والمغفرة والرزق الكريم
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-yellow-600/20 dark:border-yellow-500/20">
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  آمين يا رب العالمين
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
