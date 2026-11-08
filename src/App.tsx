import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import UpdateNotification from './components/UpdateNotification';
import InstallPWA from './components/InstallPWA';
import Home from './pages/Home';
import MuslimGuide from './pages/MuslimGuide';
import Emotions from './pages/Emotions';
import PrayerTimes from './pages/PrayerTimes';
import Qibla from './pages/Qibla';
import Quran from './pages/Quran';

// Loaded only when opened: ~300 hadiths with explanations + the Amiri font.
const Hadith = lazy(() => import('./pages/Hadith'));

const pageFallback = (
  <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center">
    <p className="text-xl text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>جاري التحميل...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/muslim-guide" element={<MuslimGuide />} />
          <Route path="/emotions" element={<Emotions />} />
          <Route path="/hadith" element={<Suspense fallback={pageFallback}><Hadith /></Suspense>} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/quran" element={<Quran />} />
        </Routes>
        <UpdateNotification />
        <InstallPWA />
      </div>
    </Router>
  );
}

export default App;
