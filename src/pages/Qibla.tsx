import { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
}

export default function Qibla() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    getLocationAndQibla();
    startCompass();
  }, []);

  const getLocationAndQibla = async () => {
    try {
      setLoading(true);
      setError(null);
      setPermissionDenied(false);

      if (!navigator.geolocation) {
        throw new Error('الموقع الجغرافي غير مدعوم في متصفحك');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchLocationName(latitude, longitude);
          calculateQiblaDirection(latitude, longitude);
          calculateDistance(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setPermissionDenied(true);
          setError('يرجى السماح بالوصول إلى الموقع الجغرافي');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setError('حدث خطأ في تحديد الموقع');
      setLoading(false);
    }
  };

  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`);
      const data = await response.json();
      setLocation({
        latitude,
        longitude,
        city: data.city || data.locality || 'الموقع الحالي',
      });
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocation({
        latitude,
        longitude,
        city: 'الموقع الحالي',
      });
    }
  };

  const calculateQiblaDirection = (lat: number, lng: number) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const dLng = kaabaLngRad - lngRad;
    const y = Math.sin(dLng) * Math.cos(kaabaLatRad);
    const x = Math.cos(latRad) * Math.sin(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);

    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    setQiblaDirection(bearing);
  };

  const calculateDistance = (lat: number, lng: number) => {
    const R = 6371;
    const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
    const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) * Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    setDistance(Math.round(distance));
  };

  const startCompass = () => {
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading = event.alpha || 0;

    if (event.webkitCompassHeading) {
      heading = event.webkitCompassHeading;
    } else if (event.alpha) {
      heading = 360 - event.alpha;
    }

    setCompassHeading(heading);
  };

  const getQiblaRotation = () => {
    return qiblaDirection - compassHeading;
  };

  const getCardinalDirection = (angle: number) => {
    const directions = ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen islamic-pattern dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Compass className="text-green-700 dark:text-green-500 w-16 h-16 animate-spin mx-auto mb-4" />
          <p className="text-2xl text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            جاري تحديد الموقع...
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
          {permissionDenied && (
            <p className="text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              للحصول على اتجاه دقيق للقبلة، يرجى السماح بالوصول إلى موقعك في إعدادات المتصفح
            </p>
          )}
          <button
            onClick={getLocationAndQibla}
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
      <div className="max-w-4xl mx-auto">
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
                <Compass size={36} className="text-yellow-400" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              اتجاه القبلة
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
              <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 dark:via-yellow-500 to-transparent"></div>
            </div>

            {location && (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin size={20} className="text-green-700 dark:text-green-500" />
                  <span className="text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                    {location.city}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                  المسافة إلى مكة المكرمة: <span className="font-bold text-green-700 dark:text-green-500">{distance.toLocaleString('ar-SA')}</span> كم
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="relative">
            <div className="w-full max-w-md mx-auto aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-full"></div>

              <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full shadow-inner flex items-center justify-center">
                <div
                  className="absolute inset-8 rounded-full border-4 border-gray-200 dark:border-gray-700"
                  style={{
                    transform: `rotate(${-compassHeading}deg)`,
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>ش</div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>ج</div>
                  </div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>ش</div>
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-xl" style={{ fontFamily: 'Traditional Arabic, Arial' }}>غ</div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${getQiblaRotation()}deg)`,
                    transition: 'transform 0.5s ease-out',
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-full blur-xl opacity-50"></div>
                    <Navigation size={80} className="text-green-700 dark:text-green-500 drop-shadow-2xl relative" fill="currentColor" />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-600 dark:bg-yellow-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 -left-2 -top-2 rounded-full" style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34, 197, 94, 0.1) 45deg, rgba(34, 197, 94, 0.3) 90deg, rgba(34, 197, 94, 0.1) 135deg, transparent 180deg, transparent 360deg)',
                transform: `rotate(${getQiblaRotation()}deg)`,
                transition: 'transform 0.5s ease-out',
              }}></div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-2 border-green-600/20 dark:border-green-500/20">
              <p className="text-gray-600 dark:text-gray-400 mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                الاتجاه
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-500" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
                {getCardinalDirection(qiblaDirection)}
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                {Math.round(qiblaDirection)}°
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
              <Navigation size={16} className="text-green-700 dark:text-green-500" />
              <span>وجه هاتفك نحو السهم الأخضر للصلاة في اتجاه القبلة</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center border-2 border-yellow-600/30 dark:border-yellow-500/30 mb-8">
          <Compass className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-200 text-2xl md:text-3xl leading-relaxed font-semibold mb-2" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
          </p>
          <p className="text-yellow-700 dark:text-yellow-500 text-base md:text-lg font-medium" style={{ fontFamily: 'Traditional Arabic, Arial' }}>
            البقرة: 144
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}
