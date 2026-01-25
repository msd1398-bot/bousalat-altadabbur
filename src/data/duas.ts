export interface Dua {
  id: string;
  category: string;
  title_ar: string;
  dua_ar: string;
  occasion: string;
  source?: string;
}

export const duasData: Dua[] = [
  {
    id: '1',
    category: 'food',
    title_ar: 'دعاء قبل الطعام',
    dua_ar: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    occasion: 'before_eating',
    source: 'رواه أبو داود'
  },
  {
    id: '2',
    category: 'food',
    title_ar: 'دعاء بعد الطعام',
    dua_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    occasion: 'after_eating',
    source: 'رواه أبو داود والترمذي'
  },
  {
    id: '3',
    category: 'sleep',
    title_ar: 'دعاء النوم',
    dua_ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    occasion: 'before_sleep',
    source: 'صحيح البخاري'
  },
  {
    id: '4',
    category: 'sleep',
    title_ar: 'دعاء النوم الشامل',
    dua_ar: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا، اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    occasion: 'before_sleep',
    source: 'صحيح البخاري'
  },
  {
    id: '5',
    category: 'waking',
    title_ar: 'دعاء الاستيقاظ',
    dua_ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    occasion: 'after_waking',
    source: 'صحيح البخاري'
  },
  {
    id: '6',
    category: 'home',
    title_ar: 'دعاء الخروج من المنزل',
    dua_ar: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    occasion: 'leaving_home',
    source: 'رواه أبو داود والترمذي'
  },
  {
    id: '7',
    category: 'home',
    title_ar: 'دعاء دخول المنزل',
    dua_ar: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    occasion: 'entering_home',
    source: 'رواه أبو داود'
  },
  {
    id: '8',
    category: 'mosque',
    title_ar: 'دعاء دخول المسجد',
    dua_ar: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    occasion: 'entering_mosque',
    source: 'صحيح مسلم'
  },
  {
    id: '9',
    category: 'mosque',
    title_ar: 'دعاء الخروج من المسجد',
    dua_ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    occasion: 'leaving_mosque',
    source: 'صحيح مسلم'
  },
  {
    id: '10',
    category: 'travel',
    title_ar: 'دعاء السفر',
    dua_ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    occasion: 'traveling',
    source: 'رواه أبو داود والترمذي'
  },
  {
    id: '11',
    category: 'wudhu',
    title_ar: 'دعاء بعد الوضوء',
    dua_ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    occasion: 'after_wudhu',
    source: 'صحيح مسلم'
  },
  {
    id: '12',
    category: 'prayer',
    title_ar: 'دعاء الاستفتاح',
    dua_ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
    occasion: 'opening_prayer',
    source: 'رواه أبو داود'
  }
];

export const duaCategories = [
  { id: 'food', name_ar: 'أدعية الطعام والشراب', icon: 'utensils' },
  { id: 'sleep', name_ar: 'أدعية النوم', icon: 'moon' },
  { id: 'waking', name_ar: 'أدعية الاستيقاظ', icon: 'sun' },
  { id: 'home', name_ar: 'أدعية المنزل', icon: 'home' },
  { id: 'mosque', name_ar: 'أدعية المسجد', icon: 'building' },
  { id: 'travel', name_ar: 'أدعية السفر', icon: 'plane' },
  { id: 'wudhu', name_ar: 'أدعية الوضوء', icon: 'droplet' },
  { id: 'prayer', name_ar: 'أدعية الصلاة', icon: 'hands' }
];
