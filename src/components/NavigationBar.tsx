import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NavigationBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg border-b-4 border-yellow-600 dark:border-yellow-500 relative">
      <div className="absolute inset-0 islamic-pattern opacity-30 dark:opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-green-800 hover:bg-green-700 text-white transition-all duration-300 shadow-lg hover:scale-105"
            aria-label="تبديل الوضع"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="flex gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg transform scale-105'
                  : 'text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>الرئيسية</span>
          </NavLink>

          <NavLink
            to="/muslim-guide"
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg transform scale-105'
                  : 'text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>دليل المسلم</span>
          </NavLink>

          <NavLink
            to="/emotions"
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-green-800 to-green-700 text-white shadow-lg transform scale-105'
                  : 'text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <Heart className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>يومياتي</span>
          </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
