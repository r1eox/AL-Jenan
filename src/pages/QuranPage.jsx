import React, { useState, useEffect } from "react";
import KhatmaSelectPage from "./KhatmaSelectPage";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// بيانات أولية للسور (اختصرناها للعرض)
const surahs = [
  { number: 1, name: "الفاتحة", type: "مكية", ayat: 7, page: 1 },
  { number: 2, name: "البقرة", type: "مدنية", ayat: 286, page: 2 },
  { number: 3, name: "آل عمران", type: "مدنية", ayat: 200, page: 50 },
  { number: 4, name: "النساء", type: "مدنية", ayat: 176, page: 77 },
  { number: 5, name: "المائدة", type: "مدنية", ayat: 120, page: 106 },
  { number: 6, name: "الأنعام", type: "مكية", ayat: 165, page: 128 },
  { number: 7, name: "الأعراف", type: "مكية", ayat: 206, page: 151 },
  { number: 8, name: "الأنفال", type: "مدنية", ayat: 75, page: 177 },
  { number: 9, name: "التوبة", type: "مدنية", ayat: 129, page: 187 },
  { number: 10, name: "يونس", type: "مكية", ayat: 109, page: 208 },
  { number: 11, name: "هود", type: "مكية", ayat: 123, page: 221 },
  { number: 12, name: "يوسف", type: "مكية", ayat: 111, page: 235 },
  { number: 13, name: "الرعد", type: "مدنية", ayat: 43, page: 249 },
  { number: 14, name: "إبراهيم", type: "مكية", ayat: 52, page: 255 },
  { number: 15, name: "الحجر", type: "مكية", ayat: 99, page: 262 },
  { number: 16, name: "النحل", type: "مكية", ayat: 128, page: 267 },
  { number: 17, name: "الإسراء", type: "مكية", ayat: 111, page: 282 },
  { number: 18, name: "الكهف", type: "مكية", ayat: 110, page: 293 },
  { number: 19, name: "مريم", type: "مكية", ayat: 98, page: 305 },
  { number: 20, name: "طه", type: "مكية", ayat: 135, page: 312 },
  { number: 21, name: "الأنبياء", type: "مكية", ayat: 112, page: 322 },
  { number: 22, name: "الحج", type: "مدنية", ayat: 78, page: 332 },
  { number: 23, name: "المؤمنون", type: "مكية", ayat: 118, page: 342 },
  { number: 24, name: "النور", type: "مدنية", ayat: 64, page: 350 },
  { number: 25, name: "الفرقان", type: "مكية", ayat: 77, page: 359 },
  { number: 26, name: "الشعراء", type: "مكية", ayat: 227, page: 367 },
  { number: 27, name: "النمل", type: "مكية", ayat: 93, page: 377 },
  { number: 28, name: "القصص", type: "مكية", ayat: 88, page: 385 },
  { number: 29, name: "العنكبوت", type: "مكية", ayat: 69, page: 396 },
  { number: 30, name: "الروم", type: "مكية", ayat: 60, page: 404 },
  { number: 31, name: "لقمان", type: "مكية", ayat: 34, page: 411 },
  { number: 32, name: "السجدة", type: "مكية", ayat: 30, page: 415 },
  { number: 33, name: "الأحزاب", type: "مدنية", ayat: 73, page: 418 },
  { number: 34, name: "سبأ", type: "مكية", ayat: 54, page: 428 },
  { number: 35, name: "فاطر", type: "مكية", ayat: 45, page: 434 },
  { number: 36, name: "يس", type: "مكية", ayat: 83, page: 440 },
  { number: 37, name: "الصافات", type: "مكية", ayat: 182, page: 446 },
  { number: 38, name: "ص", type: "مكية", ayat: 88, page: 453 },
  { number: 39, name: "الزمر", type: "مكية", ayat: 75, page: 458 },
  { number: 40, name: "غافر", type: "مكية", ayat: 85, page: 467 },
  { number: 41, name: "فصلت", type: "مكية", ayat: 54, page: 477 },
  { number: 42, name: "الشورى", type: "مكية", ayat: 53, page: 482 },
  { number: 43, name: "الزخرف", type: "مكية", ayat: 89, page: 489 },
  { number: 44, name: "الدخان", type: "مكية", ayat: 59, page: 496 },
  { number: 45, name: "الجاثية", type: "مكية", ayat: 37, page: 499 },
  { number: 46, name: "الأحقاف", type: "مكية", ayat: 35, page: 502 },
  { number: 47, name: "محمد", type: "مدنية", ayat: 38, page: 507 },
  { number: 48, name: "الفتح", type: "مدنية", ayat: 29, page: 511 },
  { number: 49, name: "الحجرات", type: "مدنية", ayat: 18, page: 515 },
  { number: 50, name: "ق", type: "مكية", ayat: 45, page: 518 },
  { number: 51, name: "الذاريات", type: "مكية", ayat: 60, page: 520 },
  { number: 52, name: "الطور", type: "مكية", ayat: 49, page: 523 },
  { number: 53, name: "النجم", type: "مكية", ayat: 62, page: 526 },
  { number: 54, name: "القمر", type: "مكية", ayat: 55, page: 528 },
  { number: 55, name: "الرحمن", type: "مدنية", ayat: 78, page: 531 },
  { number: 56, name: "الواقعة", type: "مكية", ayat: 96, page: 534 },
  { number: 57, name: "الحديد", type: "مدنية", ayat: 29, page: 537 },
  { number: 58, name: "المجادلة", type: "مدنية", ayat: 22, page: 542 },
  { number: 59, name: "الحشر", type: "مدنية", ayat: 24, page: 545 },
  { number: 60, name: "الممتحنة", type: "مدنية", ayat: 13, page: 549 },
  { number: 61, name: "الصف", type: "مدنية", ayat: 14, page: 551 },
  { number: 62, name: "الجمعة", type: "مدنية", ayat: 11, page: 553 },
  { number: 63, name: "المنافقون", type: "مدنية", ayat: 11, page: 554 },
  { number: 64, name: "التغابن", type: "مدنية", ayat: 18, page: 556 },
  { number: 65, name: "الطلاق", type: "مدنية", ayat: 12, page: 558 },
  { number: 66, name: "التحريم", type: "مدنية", ayat: 12, page: 560 },
  { number: 67, name: "الملك", type: "مكية", ayat: 30, page: 562 },
  { number: 68, name: "القلم", type: "مكية", ayat: 52, page: 564 },
  { number: 69, name: "الحاقة", type: "مكية", ayat: 52, page: 566 },
  { number: 70, name: "المعارج", type: "مكية", ayat: 44, page: 568 },
  { number: 71, name: "نوح", type: "مكية", ayat: 28, page: 570 },
  { number: 72, name: "الجن", type: "مكية", ayat: 28, page: 572 },
  { number: 73, name: "المزمل", type: "مكية", ayat: 20, page: 574 },
  { number: 74, name: "المدثر", type: "مكية", ayat: 56, page: 575 },
  { number: 75, name: "القيامة", type: "مكية", ayat: 40, page: 577 },
  { number: 76, name: "الإنسان", type: "مدنية", ayat: 31, page: 578 },
  { number: 77, name: "المرسلات", type: "مكية", ayat: 50, page: 580 },
  { number: 78, name: "النبأ", type: "مكية", ayat: 40, page: 582 },
  { number: 79, name: "النازعات", type: "مكية", ayat: 46, page: 583 },
  { number: 80, name: "عبس", type: "مكية", ayat: 42, page: 585 },
  { number: 81, name: "التكوير", type: "مكية", ayat: 29, page: 586 },
  { number: 82, name: "الانفطار", type: "مكية", ayat: 19, page: 587 },
  { number: 83, name: "المطففين", type: "مكية", ayat: 36, page: 587 },
  { number: 84, name: "الانشقاق", type: "مكية", ayat: 25, page: 589 },
  { number: 85, name: "البروج", type: "مكية", ayat: 22, page: 590 },
  { number: 86, name: "الطارق", type: "مكية", ayat: 17, page: 591 },
  { number: 87, name: "الأعلى", type: "مكية", ayat: 19, page: 591 },
  { number: 88, name: "الغاشية", type: "مكية", ayat: 26, page: 592 },
  { number: 89, name: "الفجر", type: "مكية", ayat: 30, page: 593 },
  { number: 90, name: "البلد", type: "مكية", ayat: 20, page: 594 },
  { number: 91, name: "الشمس", type: "مكية", ayat: 15, page: 595 },
  { number: 92, name: "الليل", type: "مكية", ayat: 21, page: 595 },
  { number: 93, name: "الضحى", type: "مكية", ayat: 11, page: 596 },
  { number: 94, name: "الشرح", type: "مكية", ayat: 8, page: 596 },
  { number: 95, name: "التين", type: "مكية", ayat: 8, page: 597 },
  { number: 96, name: "العلق", type: "مكية", ayat: 19, page: 597 },
  { number: 97, name: "القدر", type: "مكية", ayat: 5, page: 598 },
  { number: 98, name: "البينة", type: "مدنية", ayat: 8, page: 598 },
  { number: 99, name: "الزلزلة", type: "مدنية", ayat: 8, page: 599 },
  { number: 100, name: "العاديات", type: "مكية", ayat: 11, page: 599 },
  { number: 101, name: "القارعة", type: "مكية", ayat: 11, page: 600 },
  { number: 102, name: "التكاثر", type: "مكية", ayat: 8, page: 600 },
  { number: 103, name: "العصر", type: "مكية", ayat: 3, page: 601 },
  { number: 104, name: "الهمزة", type: "مكية", ayat: 9, page: 601 },
  { number: 105, name: "الفيل", type: "مكية", ayat: 5, page: 601 },
  { number: 106, name: "قريش", type: "مكية", ayat: 4, page: 602 },
  { number: 107, name: "الماعون", type: "مكية", ayat: 7, page: 602 },
  { number: 108, name: "الكوثر", type: "مكية", ayat: 3, page: 602 },
  { number: 109, name: "الكافرون", type: "مكية", ayat: 6, page: 603 },
  { number: 110, name: "النصر", type: "مدنية", ayat: 3, page: 603 },
  { number: 111, name: "المسد", type: "مكية", ayat: 5, page: 603 },
  { number: 112, name: "الإخلاص", type: "مكية", ayat: 4, page: 604 },
  { number: 113, name: "الفلق", type: "مكية", ayat: 5, page: 604 },
  { number: 114, name: "الناس", type: "مكية", ayat: 6, page: 604 }
];

const QuranPage = () => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahText, setSurahText] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("quran_bookmarks") || "[]")
  );
  const [showTafsir, setShowTafsir] = useState({});
  const [audioAyah, setAudioAyah] = useState(null);
  const [tab, setTab] = useState("surahs");
  const [showKhatma, setShowKhatma] = useState(false);
  const [columns, setColumns] = useState(getColumns());
  const [showAyahOptions, setShowAyahOptions] = useState(null);
  const [showAudioBar, setShowAudioBar] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(92); // رقم القارئ الافتراضي
  const [surahPage, setSurahPage] = useState(0);
  const ayahsPerPage = 10;

  function getColumns() {
    if (window.innerWidth < 500) return 2;
    return 3;
  }

  useEffect(() => {
    const handleResize = () => setColumns(getColumns());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // جلب نص السورة (مثال: من API)
  const fetchSurah = async (number) => {
    try {
      const res = await fetch(`https://alquran.vip/APIs/ayah?number=${number}`);
      const data = await res.json();
      // تأكد أن البيانات مصفوفة
      if (Array.isArray(data)) {
        setSurahText(
          data.map(a => ({
            ayah: a.number_in_surah,
            text: a.text
          }))
        );
      } else {
        setSurahText([]);
      }
    } catch (e) {
      setSurahText([]);
    }
  };

  useEffect(() => {
    if (selectedSurah) fetchSurah(selectedSurah.number);
  }, [selectedSurah]);

  useEffect(() => {
    setSurahPage(0); // عند تغيير السورة، ارجع لأول صفحة
  }, [selectedSurah]);

  const handleSearch = () => {
    if (!search.trim()) return setSearchResults([]);
    const results = surahText.filter(a =>
      a.text.includes(search)
    );
    setSearchResults(results);
  };

  const addBookmark = (ayah) => {
    const newBookmarks = [...bookmarks, { surah: selectedSurah.number, ayah }];
    setBookmarks(newBookmarks);
    localStorage.setItem("quran_bookmarks", JSON.stringify(newBookmarks));
  };

  const playAudio = (ayah) => {
    setAudioAyah(ayah);
    // يمكنك إضافة كود الصوت لاحقًا
  };

  const fetchTafsir = async (ayah) => {
    setShowTafsir({ ...showTafsir, [ayah]: "تفسير هذه الآية ..." });
  };

  const playAudioForSurah = (surahNumber, reciterId) => {
    // هنا يمكنك إضافة كود تشغيل الصوت للسورة كاملة
    console.log(`تشغيل سورة ${surahNumber} برواية ${reciterId}`);
  };

  // دالة تقسيم الآيات لأسطر مرنة (كل سطر 2-4 آيات حسب الطول)
  function groupAyat(ayat, maxChars = 60) {
    const lines = [];
    let line = [];
    let chars = 0;
    for (let i = 0; i < ayat.length; i++) {
      const a = ayat[i];
      const len = a.text.length;
      if (chars + len > maxChars && line.length > 0) {
        lines.push(line);
        line = [];
        chars = 0;
      }
      line.push(a);
      chars += len;
      // إذا السطر فيه 3 آيات أو أكثر، أو آخر آية
      if (line.length === 3 || i === ayat.length - 1) {
        lines.push(line);
        line = [];
        chars = 0;
      }
    }
    if (line.length) lines.push(line);
    return lines;
  }

  // التنقل إلى صفحة الختمة
  if (showKhatma) {
    return <KhatmaSelectPage onBack={() => setShowKhatma(false)} />;
  }

  return (
    <div
      style={{
        background: "#161E31",
        minHeight: "100vh",
        padding: 0,
        fontFamily: "'Cairo', sans-serif",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        boxSizing: "border-box",
        maxWidth: "100vw",
        overflowX: "hidden"
      }}
    >
      {/* الهيدر */}
      <div style={{
        padding: "18px 0 0 0",
        background: "#202940",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: "0 2px 12px #0003",
        marginBottom: 18
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px"
        }}>
          <span style={{ color: "#a7f3d0", fontWeight: "bold", fontSize: "1.3rem" }}>المصحف</span>
          <button
            onClick={() => setShowKhatma(true)}
            style={{
              background: "#a7f3d0",
              color: "#22223b",
              border: "none",
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            الختمة
          </button>
        </div>
        {/* Tabs */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 18,
          marginBottom: 8
        }}>
          <button
            onClick={() => setTab("surahs")}
            style={{
              background: tab === "surahs" ? "#a7f3d0" : "transparent",
              color: tab === "surahs" ? "#22223b" : "#a7f3d0",
              border: "none",
              borderRadius: 12,
              padding: "6px 22px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >السور</button>
          <button
            onClick={() => setTab("ajzaa")}
            style={{
              background: tab === "ajzaa" ? "#a7f3d0" : "transparent",
              color: tab === "ajzaa" ? "#22223b" : "#a7f3d0",
              border: "none",
              borderRadius: 12,
              padding: "6px 22px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >الأجزاء</button>
          <button
            onClick={() => setTab("pages")}
            style={{
              background: tab === "pages" ? "#a7f3d0" : "transparent",
              color: tab === "pages" ? "#22223b" : "#a7f3d0",
              border: "none",
              borderRadius: 12,
              padding: "6px 22px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >الصفحات</button>
        </div>
      </div>

      {/* قائمة السور */}
      {tab === "surahs" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 14,
            padding: "0 8px 20px 8px",
            width: "100%",
            maxWidth: "100vw",
            boxSizing: "border-box",
            alignSelf: "stretch",
            margin: 0,
            overflowX: "hidden"
          }}
        >
          {surahs.map((s) => (
            <div
              key={s.number}
              onClick={() => setSelectedSurah(s)}
              style={{
                background: "#202940",
                borderRadius: 14,
                padding: "10px 6px 8px 6px",
                color: "#fff",
                boxShadow: "0 2px 8px #0002",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                borderRight: "3px solid #a855f7",
                minHeight: 60,
                fontSize: "0.95rem",
                overflowWrap: "break-word",
                maxWidth: "100%",
                cursor: "pointer" // أضف مؤشر اليد
              }}
            >
              <div style={{
                fontWeight: "bold",
                color: "#a855f7",
                fontSize: "1rem",
                marginBottom: 4,
                alignSelf: "flex-start"
              }}>{s.number}</div>
              <div style={{
                fontFamily: "'Amiri', serif",
                fontSize: "1.05rem",
                fontWeight: "bold",
                marginBottom: 2,
                marginRight: 0
              }}>
                {s.name}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#a7f3d0", margin: "1px 0" }}>
                {s.type}، آياتها: <span style={{ color: "#fbbf24" }}>{s.ayat}</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#a7f3d0" }}>
                الصفحة <span style={{ color: "#fff" }}>{s.page}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* عرض السورة */}
      {selectedSurah && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "#161E31",
            overflowY: "auto",
            padding: "0 0 60px 0",
            direction: "rtl",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          tabIndex={0}
        >
          {/* زر إغلاق */}
          <button
            onClick={() => setSelectedSurah(null)}
            style={{
              position: "absolute", left: 16, top: 16, zIndex: 1100,
              background: "#a7f3d0", color: "#22223b", border: "none",
              borderRadius: 8, padding: "6px 16px", fontWeight: "bold"
            }}
          >إغلاق</button>

          {/* الأسهم للتنقل بين صفحات المصحف */}
          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "24px 0 0 0",
            gap: 16
          }}>
            <button
              onClick={e => {
                e.stopPropagation();
                if (surahPage > 0) setSurahPage(p => p - 1);
                else {
                  // السورة السابقة
                  const idx = surahs.findIndex(s => s.number === selectedSurah.number);
                  if (idx > 0) {
                    setSelectedSurah(surahs[idx - 1]);
                    setSurahPage(0);
                  }
                }
              }}
              disabled={surahPage === 0 && surahs.findIndex(s => s.number === selectedSurah.number) === 0}
              style={{
                background: "#202940",
                color: "#a7f3d0",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                fontSize: "1.7rem",
                opacity: surahPage === 0 && surahs.findIndex(s => s.number === selectedSurah.number) === 0 ? 0.4 : 1,
                cursor: "pointer"
              }}
            >&#8592;</button>
            <span style={{ color: "#a7f3d0", fontWeight: "bold", fontSize: "1.1rem" }}>
              صفحة {selectedSurah.page + surahPage}
            </span>
            <button
              onClick={e => {
                e.stopPropagation();
                // احسب آخر صفحة في السورة
                const idx = surahs.findIndex(s => s.number === selectedSurah.number);
                const lastPage = idx < surahs.length - 1
                  ? surahs[idx + 1].page - 1
                  : 604;
                if (selectedSurah.page + surahPage < lastPage) {
                  setSurahPage(p => p + 1);
                } else if (idx < surahs.length - 1) {
                  setSelectedSurah(surahs[idx + 1]);
                  setSurahPage(0);
                }
              }}
              disabled={
                (() => {
                  const idx = surahs.findIndex(s => s.number === selectedSurah.number);
                  const lastPage = idx < surahs.length - 1
                    ? surahs[idx + 1].page - 1
                    : 604;
                  return selectedSurah.page + surahPage >= lastPage && idx === surahs.length - 1;
                })()
              }
              style={{
                background: "#202940",
                color: "#a7f3d0",
                border: "none",
                borderRadius: "50%",
                width: 44,
                height: 44,
                fontSize: "1.7rem",
                opacity: (() => {
                  const idx = surahs.findIndex(s => s.number === selectedSurah.number);
                  const lastPage = idx < surahs.length - 1
                    ? surahs[idx + 1].page - 1
                    : 604;
                  return selectedSurah.page + surahPage >= lastPage && idx === surahs.length - 1
                    ? 0.4 : 1;
                })(),
                cursor: "pointer"
              }}
            >&#8594;</button>
          </div>
      {/* العلامات المرجعية */}
      <div style={{ background: "#22223b", borderRadius: 10, padding: 12, marginBottom: 18 }}>
        <h4 style={{ color: "#a7f3d0" }}>علاماتي</h4>
        {bookmarks.length === 0 && <div style={{ color: "#fff", opacity: 0.7 }}>لا توجد علامات بعد</div>}
        {bookmarks.map((b, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span>سورة {b.surah} - آية {b.ayah}</span>
          </div>
        ))}
      </div>
        </div>
      )}
    </div>
  );
};

export default QuranPage;