// App.jsx
import React, { useState, useEffect } from 'react';
import { FaHome, FaBookOpen, FaDharmachakra, FaPrayingHands, FaCog, FaCompass, FaRegBookmark } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import BayanAIChat from './pages/BayanAIChat';
import QuranPage from "./pages/QuranPage";
import QiblaCompass from "./pages/QiblaCompass";
import AzkarPage from "./pages/AzkarPage";
import SunanPage from "./pages/SunanPage";
// أضف هذا الجزء في الأعلى قبل أي استخدام لـ cities
const cities = [
  { name: "مكة المكرمة", country: "Saudi Arabia", method: 4 },
  { name: "الرياض", country: "Saudi Arabia", method: 4 },
  { name: "القاهرة", country: "Egypt", method: 5 },
  { name: "دبي", country: "United Arab Emirates", method: 8 },
  { name: "الجزائر", country: "Algeria", method: 14 }
];

// --- (1) الأنماط (يجب تعريفها هنا في الأعلى قبل كل شيء آخر يستخدمها) ---
const styles = {
  appContainer: {
    fontFamily: "'Cairo', sans-serif",
    direction: 'rtl',
    backgroundColor: '#0B1120',
    minHeight: '100vh',
    color: '#ced4da',
    paddingBottom: '70px',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden', // أضف هذا السطر
  },
  header: { position: 'relative', height: '200px', borderBottomLeftRadius: '35px', borderBottomRightRadius: '35px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', color: '#fff', flexShrink: 0, },
  headerBgImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, filter: 'brightness(0.8) contrast(1.0) saturate(1.05)', },
  headerOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.05)', zIndex: 2, },
  headerTimeDateContainer: { position: 'absolute', top: '20px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textShadow: '0 2px 5px rgba(0,0,0,0.7)', zIndex: 3, },
  headerTime: { fontSize: '1.3rem', fontWeight: '700', },
  headerDate: { fontSize: '1.0rem', fontWeight: '600', },
  mainContent: {
    padding: '20px 8px', // قلل البادينغ للطرفين
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
    width: '100%',
    maxWidth: '100%', // اجعلها 100% وليس 600
    margin: 0,        // أزل الهامش الجانبي
    minHeight: 0,
    boxSizing: 'border-box',
  },
  prayerCard: { 
    backgroundColor: '#161E31', borderRadius: '20px', padding: '18px 15px', 
    textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', 
    borderTop: '3px solid #a7f3d0', color: '#e9ecef', minHeight: '180px', 
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    width: '100%', // أضف هذا
    marginBottom: 0 // أزل أي تباعد سفلي
  },
  prayerCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem', color: '#d0bfff', fontWeight: '600', marginBottom: '8px', },
  prayerTimeRemaining: { fontSize: '2.2rem', fontWeight: 'bold', color: '#f8f9fa', margin: '4px 0', direction: 'ltr', letterSpacing: '1px', },
  prayerTimeRemainingLabel: { fontSize: '0.85rem', color: '#adb5bd', marginBottom: '12px', },
  dailyPrayersContainer: { display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', color: '#adb5bd', borderTop: '1px solid #2a3b5f', paddingTop: '10px', gap: '4px 8px' },
  dailyPrayerTimeText: { fontSize: '0.875rem', margin: '0 4px', },
  wirdCard: { 
    backgroundColor: '#161E31', borderRadius: '20px', padding: '18px 15px', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)', borderTop: '3px solid #c4b5fd',
    width: '100%', // أضف هذا
    marginBottom: 0 // أزل أي تباعد سفلي
  },
  wirdCardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #2a3b5f', },
  wirdCardTitle: { color: '#d0bfff', fontSize: '1.1rem', fontWeight: 'bold', margin: 0, },
  wirdList: { listStyle: 'none', paddingRight: 0, margin: 0, },
  wirdListItem: { color: '#ced4da', fontSize: '0.9rem', padding: '8px 5px', borderBottom: '1px dashed #2a3b5f', display: 'flex', alignItems: 'center', gap: '8px', },
  quickAccessGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '22px',
    width: '100%',
    boxSizing: 'border-box',
    maxWidth: '100%',
  },
  quickAccessCard: { 
    backgroundColor: '#161E31', color: '#f8f9fa', padding: '20px 12px', borderRadius: '16px', cursor: 'pointer', 
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)', textAlign: 'center', transition: 'transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s',
    borderTop: '3px solid transparent', willChange: 'transform',
  },
  quickAccessIconWrapper: { marginBottom: '10px', fontSize: '2rem' }, // حجم أيقونة نصية مؤقت
  quickAccessLabel: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px', },
  quickAccessDescription: { fontSize: '0.8rem', color: '#adb5bd', minHeight: '2.4em', lineHeight: '1.4' },
  quickAccessItemsColors: { quran: '#a7f3d0', azkar: '#81d4fa', azkarNew: '#81d4fa', qibla: '#fde047', bayan: '#a855f7', },
  dailyReminderCard: { 
    backgroundColor: '#161E31', borderRadius: '20px', padding: '20px 18px', 
    textAlign: 'right', color: '#e9ecef', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', 
    borderRight: '3px solid #c4b5fd',
    width: '100%', // أضف هذا
    marginBottom: 0 // أزل أي تباعد سفلي
  },
  dailyReminderTitle: { marginBottom: '12px', color: '#d0bfff', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '2px solid #a78bfa', paddingBottom: '8px', },
  dailyReminderText: { fontSize: '1.15rem', fontWeight: '600', color: '#e9ecef', lineHeight: '1.9', fontFamily: "'Noto Naskh Arabic', 'Cairo', sans-serif", },
  dailyReminderVerseSource: { fontSize: '0.85rem', color: '#adb5bd', display: 'block', marginTop: '8px', textAlign: 'left', },
  navBar: { position: 'fixed', bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(11, 17, 32, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 -5px 25px rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 5px', height: '65px', zIndex: 1000, borderTopLeftRadius: '28px', borderTopRightRadius: '28px', borderTop: '1px solid #394d73' },
  navButtonBase: { background: 'transparent', color: '#8c9db3', border: 'none', borderRadius: '16px', flex: 1, padding: '8px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.20s ease-in-out', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', height: '100%', },
  navButtonActive: { color: '#a7f3d0', transform: 'scale(1.1)', },
  navButtonSpecial: { backgroundColor: '#a855f7', color: '#ffffff', borderRadius: '50%', width: '68px', height: '68px', padding: '0', margin: '0 8px', boxShadow: "0 7px 20px #a855f777", transform: 'translateY(-28px)', border: '3px solid #0B1120', zIndex: 10, flexGrow: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease-in-out', fontSize: '1.5rem' }, // حجم أيقونة نصية مؤقت
  navButtonSpecialActive: { backgroundColor: '#9333ea', boxShadow: "0 9px 25px #a855f799", transform: 'translateY(-30px) scale(1.05)', color: '#fff' },
  navButtonSpecialInactive: { backgroundColor: '#a855f7', color: '#f3e8ff', borderRadius: '50%', width: '68px', height: '68px', padding: '0', margin: '0 8px', boxShadow: "0 6px 15px #a855f766", transform: 'translateY(-28px)', border: '3px solid #0B1120', zIndex: 10, flexGrow: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }, // حجم أيقونة نصية مؤقت
  navButtonIconWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }, // حجم أيقونة نصية مؤقت
  navButtonLabel: { fontSize: '0.7rem', fontWeight: '600', marginTop: '3px', whiteSpace: 'nowrap', opacity: 0.9, },
  pageContentPlaceholder: { padding: '30px 20px', textAlign: 'right', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#161E31', borderRadius: '20px', width: '100%', color: '#e9ecef', overflowY: 'auto', },
  pageTitle: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', paddingBottom: '10px', textAlign: 'center', },
  pagePlaceholderText: { fontSize: '1rem', lineHeight: '1.7', color: '#adb5bd', marginBottom: '15px', textAlign: 'center' },
  placeholderListItem: { backgroundColor: '#202940', padding: '12px 15px', borderRadius: '8px', marginBottom: '10px', fontSize: '1rem', color: '#ced4da', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', },
};
// --- نهاية الأنماط ---

// --- (3) صور الهيدر ---
const headerImages = {
  morning: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80", // فجر/صباح
  afternoon: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1400&q=80", // ظهر/عصر
  evening: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80", // مغرب
  night: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1400&q=80", // عشاء/ليل
};
// --- نهاية صور الهيدر ---

// --- (4) أسماء الصلوات بالعربية والدوال المساعدة ---
const prayerNameMapping = { fajr: "الفجر", sunrise: "الشروق", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء", };
const getArabicPrayerName = (prayerKey) => prayerNameMapping[prayerKey.toLowerCase()] || prayerKey;
// --- نهاية أسماء الصلوات ---

// --- (5) مكونات صفحات وهمية (تستخدم styles) ---
// لتجنب أي مشاكل مع الأيقونات المخصصة مؤقتًا، سأجعلها تعرض فقط اسم الصفحة
const PageContainer = ({ children }) => (
  <div style={{
    background: '#161E31',
    borderRadius: 20,
    padding: '18px 6px', // بادينغ صغير للطرفين
    margin: '0 0 18px 0', // بدون auto
    width: '100%',
    minWidth: 0,
    boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    boxSizing: 'border-box'
  }}>
    {children}
  </div>
);


const QiblaPage = () => (
  <PageContainer>
    <h2 style={{ color: styles.quickAccessItemsColors.qibla, fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 18 }}>القبلة</h2>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '1.1rem' }}>
      سيتم إضافة اتجاه القبلة قريبًا
    </div>
  </PageContainer>
);

const BayanAIChatPage = () => (
  <PageContainer>
    <h2 style={{ color: styles.quickAccessItemsColors.bayan, fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 18 }}>اسأل بيان</h2>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '1.1rem' }}>
      سيتم إضافة مساعد بيان قريبًا
    </div>
  </PageContainer>
);

const MorePage = () => (
  <PageContainer>
    <h2 style={{ color: '#8c9db3', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: 18 }}>المزيد</h2>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: '1.1rem' }}>
      سيتم إضافة المزيد قريبًا
    </div>
  </PageContainer>
);
// --- نهاية المكونات الوهمية ---


// --- (6) بداية دالة التطبيق الرئيسية ---
function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerImage, setHeaderImage] = useState(headerImages.afternoon);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved ? JSON.parse(saved) : cities[0];
  });
  const [dailyWird, setDailyWird] = useState([
    { text: "قراءة سورة الملك", done: false },
    { text: "أذكار الصباح والمساء", done: false },
    { text: "الاستغفار 100 مرة", done: false }
  ]);
  const [newWird, setNewWird] = useState("");
  const [swipedIdx, setSwipedIdx] = useState(null);
  const [dragX, setDragX] = useState({}); // {idx: value}
  const [undoInfo, setUndoInfo] = useState(null); // لحفظ العنصر المحذوف مؤقتاً
  const [locationAllowed, setLocationAllowed] = useState(true);

const handleDeleteWird = idx => {
  console.log("حذف العنصر رقم:", idx);
  setDailyWird(prev => prev.filter((_, i) => i !== idx));
  setSwipedIdx(null);
  setUndoInfo(null);
};
const handleUndo = () => {
  if (undoInfo) {
    const newList = [...dailyWird];
    newList.splice(undoInfo.idx, 0, undoInfo.item);
    setDailyWird(newList);
    setUndoInfo(null);
  }
};
  // --- (API) جلب مواقيت الصلاة من بيانات الـ API ---
  useEffect(() => {
    async function fetchPrayerTimes() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}&method=${selectedCity.method}&day=${day}&month=${month}&year=${year}&lang=ar`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const timings = data.data.timings;
        const dailyPrayers = {
          fajr: to12Hour(timings.Fajr),
          dhuhr: to12Hour(timings.Dhuhr),
          asr: to12Hour(timings.Asr),
          maghrib: to12Hour(timings.Maghrib),
          isha: to12Hour(timings.Isha)
        };

        // حساب الصلاة القادمة
        const now = new Date();
        const prayerTimes = [
          { key: "fajr", time: timings.Fajr },
          { key: "dhuhr", time: timings.Dhuhr },
          { key: "asr", time: timings.Asr },
          { key: "maghrib", time: timings.Maghrib },
          { key: "isha", time: timings.Isha }
        ];
        let nextPrayer = prayerTimes[0];
        let minDiff = Infinity;
        for (let i = 0; i < prayerTimes.length; i++) {
          const [h, m] = prayerTimes[i].time.split(":");
          const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
          const diff = prayerDate - now;
          if (diff > 0 && diff < minDiff) {
            minDiff = diff;
            nextPrayer = prayerTimes[i];
          }
        }
        if (minDiff === Infinity) {
          const [h, m] = prayerTimes[0].time.split(":");
          const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, Number(h), Number(m));
          minDiff = prayerDate - now;
          nextPrayer = prayerTimes[0];
        }
        const totalSeconds = Math.floor(minDiff / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        const timeToNextPrayer = `${hours}:${minutes}:${seconds}`;

        setPrayerData({
          nextPrayerName: getArabicPrayerName(nextPrayer.key),
          timeToNextPrayer,
          dailyPrayers,
          currentLocation: selectedCity.name
        });
      } catch (error) {
        // في حال فشل الجلب، أبقِ المواقيت القديمة
        console.error("خطأ في جلب مواقيت الصلاة:", error);
      }
    }
    fetchPrayerTimes();
  }, [currentTime, selectedCity]);
  const [prayerData, setPrayerData] = useState({
    nextPrayerName: "العصر",
    timeToNextPrayer: "00:28:15",
    dailyPrayers: { fajr: "04:09 ص", dhuhr: "11:46 ص", asr: "03:32 م", maghrib: "06:17 م", isha: "07:42 م" },
    currentLocation: "مكة المكرمة"
  });

  const dailyAyat = [
    { prayer: "الفجر", text: "﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾", source: "طه: ١١٤" },
    { prayer: "الظهر", text: "﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا﴾", source: "النساء: 103" },
    { prayer: "العصر", text: "﴿وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ﴾", source: "البقرة: 45" },
    { prayer: "المغرب", text: "﴿فَاذْكُرُونِي أَذْكُرْكُمْ﴾", source: "البقرة: 152" },
    { prayer: "العشاء", text: "﴿إِنَّ اللَّهَ مَعَ الصَّابِرِينَ﴾", source: "البقرة: 153" },
  ];
  const currentAyah = dailyAyat.find(a => a.prayer === prayerData.nextPrayerName) || dailyAyat[0];

  useEffect(() => {
    console.log("التبويب النشط الحالي:", activeTab); 
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!prayerData.dailyPrayers) return;
    const now = currentTime;
    const getTime = (t) => {
      const [h, m] = t.split(':');
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(h), Number(m));
    };
    const fajr = getTime(prayerData.dailyPrayers.fajr.replace(/[^\d:]/g, ''));
    const dhuhr = getTime(prayerData.dailyPrayers.dhuhr.replace(/[^\d:]/g, ''));
    const asr = getTime(prayerData.dailyPrayers.asr.replace(/[^\d:]/g, ''));
    const maghrib = getTime(prayerData.dailyPrayers.maghrib.replace(/[^\d:]/g, ''));
    const isha = getTime(prayerData.dailyPrayers.isha.replace(/[^\d:]/g, ''));

    let newImage = headerImages.night;
    if (now >= fajr && now < dhuhr) newImage = headerImages.morning;
    else if (now >= dhuhr && now < asr) newImage = headerImages.afternoon;
    else if (now >= asr && now < maghrib) newImage = headerImages.afternoon;
    else if (now >= maghrib && now < isha) newImage = headerImages.evening;
    else newImage = headerImages.night;
    setHeaderImage(newImage);
  }, [currentTime, prayerData.dailyPrayers]);

  const formatTime = (date) => date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (date) => date.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function to12Hour(time24) {
    const [h, m] = time24.split(':');
    let hour = Number(h);
    const suffix = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${suffix}`;
  }

  // استخدم شعارات بدلاً من الإيموجي
  const navItems = [ 
    { key: 'home', label: 'الرئيسية', icon: <FaHome /> },
    { key: 'quran', label: 'المصحف', icon: <FaBookOpen /> },
    { key: 'bayan', label: "بيان", icon: <GiBrain />, special: true }, // دائرة
    { key: 'azkar', label: 'الأذكار', icon: <FaPrayingHands /> },
    { key: 'more', label: 'المزيد', icon: <FaCog /> },
  ];
  const quickAccessItems = [ 
    { label: "المصحف", icon: <FaBookOpen />, description: "تلاوة واستماع", tabKey: 'quran', color: styles.quickAccessItemsColors.quran }, 
    { label: "الأذكار", icon: <FaPrayingHands />, description: "حصنك اليومي", tabKey: 'azkar', color: styles.quickAccessItemsColors.azkarNew }, 
    { label: "القبلة", icon: <FaCompass />, description: "تحديد الاتجاه", tabKey: 'qibla', color: styles.quickAccessItemsColors.qibla }, 
    { label: "السنن النبوية", icon: <FaRegBookmark />, description: "سنن وهدي النبي ﷺ", tabKey: 'sunan', color: "#fbbf24" }, 
  ];

  const handleNavClick = (tabKey) => { setActiveTab(tabKey); };

  // إضافة ورد جديد
  const handleAddWird = () => {
    if (newWird.trim() !== "") {
      setDailyWird([...dailyWird, { text: newWird.trim(), done: false }]);
      setNewWird("");
    }
  };

  // تبديل حالة الإتمام
  const toggleWirdDone = idx => {
    setDailyWird(dailyWird.map((item, i) =>
      i === idx ? { ...item, done: !item.done } : item
    ));
  };

  const renderActivePageContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <div
              style={{
                width: '100%',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                boxSizing: 'border-box',
                padding: 0,
              }}
            >
              <div style={{ ...styles.prayerCard, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <div style={styles.prayerCardHeader}>
                  <span style={styles.dailyPrayerTimeText}>الفجر: {prayerData.dailyPrayers.fajr}</span>
                  <span style={styles.dailyPrayerTimeText}>الظهر: {prayerData.dailyPrayers.dhuhr}</span>
                  <span style={styles.dailyPrayerTimeText}>العصر: {prayerData.dailyPrayers.asr}</span>
                  <span style={styles.dailyPrayerTimeText}>المغرب: {prayerData.dailyPrayers.maghrib}</span>
                  <span style={styles.dailyPrayerTimeText}>العشاء: {prayerData.dailyPrayers.isha}</span>
                </div>
              </div>

              {/* الورد اليومي */}
              <div style={{ ...styles.wirdCard, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <div style={styles.wirdCardHeader}>
                  <span><FaBookOpen /></span>
                  <h3 style={styles.wirdCardTitle}>الورد اليومي</h3>
                  <input
                    type="text"
                    value={newWird}
                    onChange={e => setNewWird(e.target.value)}
                    placeholder="أضف ورد جديد"
                    style={{
                      marginRight: 8, fontSize: '1rem', borderRadius: 8,
                      border: '1px solid #a7f3d0', padding: '2px 8px', background: '#202940', color: '#a7f3d0', width: 120
                    }}
                    onKeyDown={e => { if (e.key === "Enter") handleAddWird(); }}
                  />
                  <button
                    onClick={handleAddWird}
                    style={{
                      background: '#a7f3d0', color: '#161E31', border: 'none',
                      borderRadius: 8, padding: '4px 12px', fontWeight: 'bold', cursor: 'pointer'
                    }}
                    title="إضافة"
                  >إضافة</button>
                </div>
                <ul style={styles.wirdList}>
                  {dailyWird.map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        ...styles.wirdListItem,
                        textDecoration: item.done ? 'line-through' : 'none',
                        background: swipedIdx === idx ? '#2a3b5f' : 'transparent',
                        marginBottom: 8,
                        position: 'relative',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        if (e.clientX < rect.left + 60) return;
                        if (swipedIdx !== idx) toggleWirdDone(idx);
                      }}
                      onTouchStart={e => {
                        e.currentTarget.touchStartX = e.touches[0].clientX;
                        e.currentTarget.touchStartY = e.touches[0].clientY;
                        setDragX(d => ({ ...d, [idx]: 0 }));
                      }}
                      onTouchMove={e => {
                        const moveX = e.touches[0].clientX - (e.currentTarget.touchStartX || 0);
                        const moveY = e.touches[0].clientY - (e.currentTarget.touchStartY || 0);
                        if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 10) {
                          e.preventDefault();
                          if (moveX > 0) setDragX(d => ({ ...d, [idx]: moveX }));
                        }
                      }}
                      onTouchEnd={e => {
                        const touchEndX = e.changedTouches[0].clientX;
                        const touchStartX = e.currentTarget.touchStartX || 0;
                        const diff = touchEndX - touchStartX;
                        if (diff > 40) {
                          handleDeleteWird(idx); // حذف مباشرة
                          setSwipedIdx(null);
                        } else {
                          setDragX(d => ({ ...d, [idx]: 0 }));
                          setSwipedIdx(null);
                        }
                      }}
                      onMouseDown={e => {
                        e.currentTarget.mouseStartX = e.clientX;
                        setDragX(d => ({ ...d, [idx]: 0 }));
                        e.currentTarget.isMouseDown = true;
                      }}
                      onMouseMove={e => {
                        if (e.currentTarget.isMouseDown) {
                          const moveX = e.clientX - (e.currentTarget.mouseStartX || 0);
                          if (moveX > 0) setDragX(d => ({ ...d, [idx]: moveX }));
                        }
                      }}
                      onMouseUp={e => {
                        const mouseEndX = e.clientX;
                        const mouseStartX = e.currentTarget.mouseStartX || 0;
                        const diff = mouseEndX - mouseStartX;
                        if (diff > 40) {
                          handleDeleteWird(idx); // حذف مباشرة
                          setSwipedIdx(null);
                        } else {
                          setDragX(d => ({ ...d, [idx]: 0 }));
                          setSwipedIdx(null);
                        }
                        e.currentTarget.isMouseDown = false;
                      }}
                      onMouseLeave={e => {
                        setDragX(d => ({ ...d, [idx]: 0 }));
                        e.currentTarget.isMouseDown = false;
                      }}
                    >
                      {/* زر الحذف يغطي أول 60px من اليسار */}
                      {(dragX[idx] > 40 || swipedIdx === idx) && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteWird(idx);
                          }}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 60,
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '4px 14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            zIndex: 2
                          }}
                        >حذف</button>
                      )}
                      <span style={{
                        display: 'inline-block',
                        width: 22, height: 22, borderRadius: '50%',
                        border: '2px solid #a7f3d0', marginLeft: 6,
                        background: item.done ? '#22c55e' : 'transparent',
                        color: item.done ? '#fff' : '#a7f3d0',
                        textAlign: 'center', lineHeight: '18px', fontWeight: 'bold', fontSize: '1.1rem'
                      }}>
                        {item.done ? '✔' : ''}
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                {/* إشعار التراجع */}
                {undoInfo && (
                  <div style={{
                    position: 'fixed',
                    bottom: 90,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#22223b',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: 16,
                    boxShadow: '0 4px 16px #0006',
                    fontWeight: 'bold',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    fontSize: '1.05rem'
                  }}>
                    تم حذف الورد
                    <button
                      onClick={handleUndo}
                      style={{
                        marginRight: 12,
                        background: '#a7f3d0',
                        color: '#22223b',
                        border: 'none',
                        borderRadius: 8,
                        padding: '4px 18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >تراجع</button>
                  </div>
                )}
              </div>

              {/* أقسام الوصول السريع */}
              <div style={styles.quickAccessGrid}>
                {quickAccessItems.map((item, i) => (
                  <div
                    key={i}
                    style={{ ...styles.quickAccessCard, borderTop: `3px solid ${item.color}` }}
                    onClick={() => handleNavClick(item.tabKey)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <div style={{ ...styles.quickAccessIconWrapper, color: item.color }}>{item.icon}</div>
                    <div style={styles.quickAccessLabel}>{item.label}</div>
                    <div style={styles.quickAccessDescription}>{item.description}</div>
                  </div>
                ))}
              </div>

              {/* التذكير اليومي */}
              <div style={{ ...styles.dailyReminderCard, width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                <div style={styles.dailyReminderTitle}>تذكير اليوم</div>
                <div style={styles.dailyReminderText}>
                  {currentAyah.text}
                  <span style={styles.dailyReminderVerseSource}>{currentAyah.source}</span>
                </div>
              </div>
            </div>
          </>
        );
      case 'quran':
        return <QuranPage />;
      case 'azkar':
        return <AzkarPage />; // <-- هذا فقط، بدون تعريف صفحة وهمية هنا
      case 'qibla':
        return <QiblaCompass />;
      case 'bayan':
        return <BayanAIChat callGeminiAPI={callGeminiAPI} />;
      case 'more':
        return <MorePage />;
      case 'sunan':
        return <SunanPage />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const userCity = data.address && (data.address.city || data.address.town || data.address.village || data.address.state);
          if (userCity) {
            const foundCity = cities.find(c => c.name.includes(userCity)) || cities[0];
            setSelectedCity(foundCity);
          } else {
            setSelectedCity(cities[0]);
          }
        } catch (error) {
          console.error("خطأ في تحديد الموقع:", error);
          setSelectedCity(cities[0]);
        }
      }, () => {
        setLocationAllowed(false);
      });
    } else {
      setLocationAllowed(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
  }, [selectedCity]);

  const callGeminiAPI = async (messages, userInput) => {
    const apiKey = "AIzaSyCA4QfNof3vDp-9idQllgmuS6REzNt-0-4";
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

    // أضف كل الرسائل السابقة (سياق المحادثة)
    const contents = [
      ...messages.map(msg => ({
        role: msg.from === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      })),
      {
        role: "user",
        parts: [{ text: userInput }]
      }
    ];

    const body = { contents };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("فشل الاتصال بـ Gemini API");
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتم الحصول على رد.";
  };

  return (
    <div style={styles.appContainer}>
      {/* الهيدر - يتضمن صورة الخلفية، الوقت، التاريخ، ومعلومات الصلاة القادمة */}
      {activeTab === 'home' && (
  <div style={styles.header}>
    <img src={headerImage} alt="Background" style={styles.headerBgImage} />
    <div style={styles.headerOverlay} />
    <div style={styles.headerTimeDateContainer}>
      <div style={styles.headerTime}>{formatTime(currentTime)}</div>
      <div style={styles.headerDate}>{formatDate(currentTime)}</div>
    </div>
  </div>
)}

      {/* اختيار المدينة إذا لم يسمح بالموقع */}
      {activeTab === 'home' && (!locationAllowed || !selectedCity) && (
        <div style={{ margin: '12px 0', textAlign: 'center' }}>
          <label style={{ color: '#a7f3d0', fontWeight: 'bold', marginLeft: 8 }}>اختر مدينتك:</label>
          <select
            value={selectedCity?.name || ''}
            onChange={e => {
              const city = cities.find(c => c.name === e.target.value);
              setSelectedCity(city);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid #a7f3d0',
              background: '#161E31',
              color: '#a7f3d0',
              fontWeight: 'bold'
            }}
          >
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* المحتوى الرئيسي */}
      <div style={styles.mainContent}>
        {renderActivePageContent()}
      </div>

      {/* شريط التنقل السفلي */}
      <div style={styles.navBar}>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item.key)}
            style={{ ...styles.navButtonBase, ...(activeTab === item.key ? styles.navButtonActive : {}) }}
            title={item.label}
          >
            <div style={styles.navButtonIconWrapper}>{item.icon}</div>
            <div style={styles.navButtonLabel}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


export default App;