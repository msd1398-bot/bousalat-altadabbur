import { useState, useEffect, useRef } from 'react';
import { Clock, MapPin, Sunrise, Sun, Sunset, Moon, Calendar, RefreshCw, ArrowLeft, Volume2, VolumeX, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  icon: typeof Sunrise;
  color: string;
}

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function PrayerTimes() {
  const navigate = useNavigate();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [adhanEnabled, setAdhanEnabled] = useState(() => {
    const saved = localStorage.getItem('adhanEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastPlayedPrayer, setLastPlayedPrayer] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [currentAudioSource, setCurrentAudioSource] = useState(0);
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  const audioSources = [
    'https://cdn.islamic.network/adhan/azan-makkah.mp3',
    'https://ia801407.us.archive.org/1/items/adhaan_202010/adhaan.mp3',
    'https://archive.org/download/adhaan_202010/adhaan.mp3',
  ];

  useEffect(() => {
    getLocationAndPrayerTimes();
    requestNotificationPermission();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    if (adhanAudioRef.current) {
      adhanAudioRef.current.addEventListener('canplaythrough', () => {
        setAudioLoaded(true);
      });
      adhanAudioRef.current.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        setAudioLoaded(false);
      });
    }

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      calculateNextPrayer();
      checkPrayerTime();
    }
  }, [currentTime, prayerTimes]);

  useEffect(() => {
    localStorage.setItem('adhanEnabled', JSON.stringify(adhanEnabled));
  }, [adhanEnabled]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  const checkPrayerTime = () => {
    if (!adhanEnabled) return;

    const now = currentTime;
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const prayer of prayerTimes) {
      if (prayer.name === 'Sunrise') continue;

      const prayerTimeStr = formatTime(prayer.time);

      if (currentTimeStr === prayerTimeStr && lastPlayedPrayer !== `${prayer.name}-${currentTimeStr}`) {
        playAdhan(prayer);
        setLastPlayedPrayer(`${prayer.name}-${currentTimeStr}`);
        showNotification(prayer);
        break;
      }
    }
  };

  const playAdhan = async (prayer: PrayerTime) => {
    if (!adhanAudioRef.current) return;

    const tryPlayAudio = async (sourceIndex: number): Promise<boolean> => {
      if (sourceIndex >= audioSources.length) {
        return false;
      }

      try {
        adhanAudioRef.current!.src = audioSources[sourceIndex];
        adhanAudioRef.current!.currentTime = 0;
        adhanAudioRef.current!.volume = 1.0;
        await adhanAudioRef.current!.play();
        setCurrentAudioSource(sourceIndex);
        return true;
      } catch (error) {
        console.error(`Failed to play from source ${sourceIndex}:`, error);
        return tryPlayAudio(sourceIndex + 1);
      }
    };

    await tryPlayAudio(currentAudioSource);
  };

  const showNotification = (prayer: PrayerTime) => {
    if (notificationsEnabled && 'Notification' in window) {
      new Notification('حان وقت الصلاة', {
        body: `حان الآن وقت صلاة ${prayer.arabicName}`,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'prayer-time',
        requireInteraction: true
      });
    }
  };

  const toggleAdhan = () => {
    setAdhanEnabled(!adhanEnabled);
  };

  const testAdhan = async () => {
    if (!adhanAudioRef.current) {
      alert('جاري تحميل الأذان...');
      return;
    }

    const tryPlayAudio = async (sourceIndex: number): Promise<boolean> => {
      if (sourceIndex >= audioSources.length) {
        return false;
      }

      try {
        adhanAudioRef.current!.src = audioSources[sourceIndex];
        adhanAudioRef.current!.currentTime = 0;
        adhanAudioRef.current!.volume = 1.0;

        await adhanAudioRef.current!.play();
        setCurrentAudioSource(sourceIndex);
        console.log(`Adhan playing from source ${sourceIndex}`);
        return true;
      } catch (error) {
        console.error(`Failed to play from source ${sourceIndex}:`, error);
        return tryPlayAudio(sourceIndex + 1);
      }
    };

    const success = await tryPlayAudio(currentAudioSource);

    if (!success) {
      alert('حدث خطأ في تشغيل الأذان. تأكد من الاتصال بالإنترنت والسماح بتشغيل الصوت في المتصفح.');
    }
  };

  const getLocationAndPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        throw new Error('الموقع الجغرافي غير مدعوم في متصفحك');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchPrayerTimes(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          fetchPrayerTimesByIP();
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ في تحميل المواقيت');
      setLoading(false);
    }
  };

  const fetchPrayerTimesByIP = async () => {
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      await fetchPrayerTimes(ipData.latitude, ipData.longitude, ipData.city, ipData.country_name);
    } catch (error) {
      console.error('Error fetching location by IP:', error);
      setError('يرجى السماح بالوصول إلى الموقع الجغرافي');
      setLoading(false);
    }
  };

  const fetchCityName = async (latitude: number, longitude: number): Promise<{ city: string; country: string }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar`,
        { headers: { 'Accept-Language': 'ar' } }
      );
      const data = await response.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        data.address?.state ||
        'غير معروف';
      const country = data.address?.country || '';
      return { city, country };
    } catch {
      return { city: 'غير معروف', country: '' };
    }
  };

  const fetchPrayerTimes = async (latitude: number, longitude: number, cityName?: string, countryName?: string) => {
    try {
      const [prayerResponse, locationData] = await Promise.all([
        fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`),
        cityName ? Promise.resolve({ city: cityName, country: countryName || '' }) : fetchCityName(latitude, longitude),
      ]);

      const data = await prayerResponse.json();

      if (data.code === 200) {
        const timings = data.data.timings;
        const date = data.data.date;

        setLocation({
          city: locationData.city,
          country: locationData.country,
          latitude,
          longitude,
        });

        setHijriDate(`${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year}هـ`);

        const prayers: PrayerTime[] = [
          {
            name: 'Fajr',
            time: timings.Fajr,
            arabicName: 'الفجر',
            icon: Sunrise,
            color: 'from-blue-500 to-blue-600',
          },
          {
            name: 'Sunrise',
            time: timings.Sunrise,
            arabicName: 'الشروق',
            icon: Sun,
            color: 'from-amber-400 to-orange-500',
          },
          {
            name: 'Dhuhr',
            time: timings.Dhuhr,
            arabicName: 'الظهر',
            icon: Sun,
            color: 'from-yellow-400 to-yellow-500',
          },
          {
            name: 'Asr',
            time: timings.Asr,
            arabicName: 'العصر',
            icon: Sun,
            color: 'from-orange-400 to-orange-500',
          },
          {
            name: 'Maghrib',
            time: timings.Maghrib,
            arabicName: 'المغرب',
            icon: Sunset,
            color: 'from-rose-500 to-pink-600',
          },
          {
            name: 'Isha',
            time: timings.Isha,
            arabicName: 'العشاء',
            icon: Moon,
            color: 'from-slate-600 to-slate-700',
          },
        ];

        setPrayerTimes(prayers);
      } else {
        throw new Error('فشل تحميل المواقيت');
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setError('حدث خطأ في تحميل المواقيت');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerTimes) {
      if (prayer.name === 'Sunrise') continue;

      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer);
        return;
      }
    }

    setNextPrayer(prayerTimes[0]);
  };

  const getTimeUntilNextPrayer = () => {
    if (!nextPrayer) return '';

    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const now = currentTime;
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0);

    if (prayerTime < now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    const diff = prayerTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursLeft} ساعة و ${minutesLeft} دقيقة`;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Clock className="text-green-700 dark:text-green-500 w-16 h-16 animate-spin mx-auto mb-4" />
          <p className="text-2xl text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            جاري تحميل المواقيت...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <MapPin className="text-red-600 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            {error}
          </h2>
          <button
            onClick={getLocationAndPrayerTimes}
            className="px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <RefreshCw size={20} />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen islamic-pattern dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/muslim-guide')}
            className="flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mb-4"
            style={{ fontFamily: 'Traditional Arabic, Arial' }}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">العودة</span>
          </button>

          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border-t-4 border-yellow-600 dark:border-yellow-500">
            <div className="mb-8">
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-64 h-64 bg-gradient-to-br from-green-800 to-yellow-600 rounded-full blur-3xl"></div>
                </div>
                <div className="relative text-center">
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 via-green-700 to-green-800 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Traditional Arabic, serif', lineHeight: '1.8' }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-yellow-600"></div>
                    <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-yellow-600 to-yellow-600"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-green-700 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-600/30">
                <Clock size={36} className="text-yellow-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              مواقيت الصلاة
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            </div>

            <div className="text-center space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin size={20} className="text-green-700 dark:text-green-500" />
                <span className="text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {location?.city}{location?.country ? ` - ${location.country}` : ''}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar size={20} className="text-green-700 dark:text-green-500" />
                <span className="text-lg" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  {hijriDate}
                </span>
              </div>
              <p className="text-3xl font-bold text-green-800 dark:text-green-400">
                {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-green-800/20 dark:border-green-700/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bell className="text-green-700 dark:text-green-500" size={24} />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  تفعيل الأذان
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  سيتم تشغيل الأذان تلقائياً عند حلول وقت الصلاة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testAdhan}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                <Volume2 size={18} />
                <span>تجربة</span>
              </button>

              <button
                onClick={toggleAdhan}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                  adhanEnabled
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                style={{ fontFamily: 'Traditional Arabic, Arial' }}
              >
                {adhanEnabled ? (
                  <>
                    <Volume2 size={20} />
                    <span>مفعّل</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={20} />
                    <span>معطّل</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {adhanEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-500">
                <Bell size={18} />
                <p className="text-sm font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  الأذان مفعّل - سيتم التشغيل تلقائياً عند حلول وقت الصلاة
                </p>
              </div>
            </div>
          )}
        </div>

        {nextPrayer && (
          <div className="mb-8 bg-gradient-to-br from-green-700 to-green-800 rounded-3xl shadow-2xl p-6 md:p-8 text-white">
            <div className="text-center">
              <p className="text-lg md:text-xl mb-2 opacity-90" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                الصلاة القادمة
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {nextPrayer.arabicName}
              </h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-0.5 bg-white/30"></div>
                <Clock className="w-8 h-8" />
                <div className="w-16 h-0.5 bg-white/30"></div>
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-2">{formatTime(nextPrayer.time)}</p>
              <p className="text-lg md:text-xl opacity-90" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                متبقي: {getTimeUntilNextPrayer()}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {prayerTimes.map((prayer, index) => {
            const Icon = prayer.icon;
            const isNext = nextPrayer?.name === prayer.name;

            return (
              <div
                key={index}
                className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 ${
                  isNext
                    ? 'border-green-600 dark:border-green-500 shadow-2xl shadow-green-600/30'
                    : 'border-green-800/20 dark:border-green-700/30 hover:border-yellow-600 dark:hover:border-yellow-500 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${prayer.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {prayer.arabicName}
                  </h3>
                </div>

                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400">
                    {formatTime(prayer.time)}
                  </p>
                  {isNext && (
                    <p className="mt-2 text-green-700 dark:text-green-500 font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                      الصلاة القادمة
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center border-2 border-yellow-600/30 dark:border-yellow-500/30 mb-8">
          <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
          </p>
          <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            النساء: 103
          </p>
        </div>

        <Footer />
      </div>

      <audio
        ref={adhanAudioRef}
        preload="auto"
        src={audioSources[0]}
        crossOrigin="anonymous"
      />
    </div>
  );
}
