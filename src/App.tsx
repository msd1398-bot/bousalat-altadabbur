import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import UpdateNotification from './components/UpdateNotification';
import Home from './pages/Home';
import MuslimGuide from './pages/MuslimGuide';
import Emotions from './pages/Emotions';
import Hadith from './pages/Hadith';
import PrayerTimes from './pages/PrayerTimes';
import Qibla from './pages/Qibla';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/muslim-guide" element={<MuslimGuide />} />
          <Route path="/emotions" element={<Emotions />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/qibla" element={<Qibla />} />
        </Routes>
        <UpdateNotification />
      </div>
    </Router>
  );
}

export default App;
