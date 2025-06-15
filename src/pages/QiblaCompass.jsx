import React, { useEffect, useState } from "react";

// دالة جلب زاوية القبلة من API
async function fetchQibla(lat, lng) {
  const res = await fetch(`https://api.islamicdevelopers.com/v1/qibla?latitude=${lat}&longitude=${lng}`);
  const data = await res.json();
  return data.degrees;
}

const QiblaCompass = () => {
  const [qiblaDegree, setQiblaDegree] = useState(0);
  const [deviceDegree, setDeviceDegree] = useState(0);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [needLocationPermission, setNeedLocationPermission] = useState(false);
  const [needMotionPermission, setNeedMotionPermission] = useState(false);

  // طلب إذن الموقع
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNeedLocationPermission(false);
      },
      err => {
        setNeedLocationPermission(true);
        alert("يجب السماح للموقع لاستخدام البوصلة وأوقات الصلاة");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // طلب إذن مستشعر الحركة (خاصة iOS)
  const requestMotion = () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission().then((response) => {
        if (response === "granted") {
          setNeedMotionPermission(false);
        } else {
          setNeedMotionPermission(true);
          alert("يجب السماح لمستشعر الحركة لعمل البوصلة");
        }
      });
    }
  };

  // جلب الموقع عند أول تحميل
  useEffect(() => {
    requestLocation();
  }, []);

  // جلب زاوية القبلة
  useEffect(() => {
    if (location.lat && location.lng) {
      fetchQibla(location.lat, location.lng).then(setQiblaDegree);
    }
  }, [location]);

  // قراءة اتجاه الجهاز
  useEffect(() => {
    const handleOrientation = (e) => {
      let heading = 0;
      if (typeof e.webkitCompassHeading === "number") {
        heading = e.webkitCompassHeading;
      } else if (typeof e.alpha === "number") {
        heading = 360 - e.alpha;
      }
      setDeviceDegree(heading);
    };

    // إذا كان يحتاج إذن مستشعر الحركة (iOS)
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setNeedMotionPermission(true);
    } else {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // زاوية سهم القبلة بالنسبة للجهاز
  const arrowAngle = (qiblaDegree - deviceDegree + 360) % 360;
  const isAligned = arrowAngle < 10 || arrowAngle > 350;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "80vh"
    }}>
      <h2 style={{ color: "#a7f3d0", marginBottom: 24, fontWeight: "bold", fontSize: "2rem" }}>اتجاه القبلة</h2>
      {/* زر طلب إذن الموقع */}
      {needLocationPermission && (
        <button
          onClick={requestLocation}
          style={{
            background: "#fde047", color: "#22223b", border: "none",
            borderRadius: 10, padding: "12px 28px", fontWeight: "bold", fontSize: "1.1rem", marginBottom: 18
          }}
        >
          السماح بتحديد الموقع
        </button>
      )}
      {/* زر طلب إذن مستشعر الحركة */}
      {needMotionPermission && (
        <button
          onClick={requestMotion}
          style={{
            background: "#a855f7", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px 28px", fontWeight: "bold", fontSize: "1.1rem", marginBottom: 18
          }}
        >
          السماح للبوصلة (مستشعر الحركة)
        </button>
      )}
      <div style={{
        width: 340, height: 340, position: "relative",
        margin: "0 auto", background: "radial-gradient(circle, #202940 70%, #161E31 100%)",
        borderRadius: "50%", boxShadow: "0 8px 32px #0007"
      }}>
        <svg width="340" height="340" viewBox="0 0 340 340">
          {/* خلفية وتدرج */}
          <defs>
            <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#23243b" />
              <stop offset="100%" stopColor="#202940" />
            </radialGradient>
            <linearGradient id="qiblaArrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0007" />
            </filter>
          </defs>
          {/* دائرة البوصلة */}
          <circle cx="170" cy="170" r="160" fill="url(#compassBg)" stroke="#a7f3d0" strokeWidth="10" filter="url(#shadow)" />
          {/* مؤشرات الدرجات */}
          {[...Array(36)].map((_, i) => (
            <g key={i}>
              <rect
                x={170 - 2}
                y={30}
                width={i % 3 === 0 ? 4 : 2}
                height={i % 3 === 0 ? 18 : 10}
                fill={i % 9 === 0 ? "#a855f7" : "#a7f3d0"}
                opacity={i % 3 === 0 ? 1 : 0.5}
                transform={`rotate(${i * 10} 170 170)`}
              />
            </g>
          ))}
          {/* دائرة ذهبية وسطية */}
          <circle cx="170" cy="170" r="32" fill="#fde047" stroke="#a855f7" strokeWidth="3" />
          {/* سهم الشمال */}
          <g>
            <polygon points="170,38 178,70 170,60 162,70" fill="#e11d48" filter="url(#shadow)" />
            <text x="170" y="32" textAnchor="middle" fontSize="22" fill="#e11d48" fontWeight="bold">شمال</text>
          </g>
          {/* سهم القبلة متدرج يتحرك فقط */}
          <g style={{
            transform: `rotate(${arrowAngle}deg)`,
            transformOrigin: "170px 170px"
          }}>
            <polygon points="170,70 190,170 170,130 150,170" fill="url(#qiblaArrow)" filter="url(#shadow)" />
            <circle cx="170" cy="170" r="20" fill="#a855f7" />
            <text x="170" y="178" textAnchor="middle" fontSize="20" fill="#fff" fontWeight="bold">قبلة</text>
          </g>
        </svg>
        {/* دائرة خضراء إذا الاتجاه صحيح */}
        {isAligned && (
          <div style={{
            position: "absolute", top: 18, left: 18, width: 48, height: 48,
            background: "#22c55e", borderRadius: "50%", border: "4px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", color: "#fff", fontSize: 26, boxShadow: "0 2px 8px #0006"
          }}>
            ✔
          </div>
        )}
      </div>
      <div style={{ color: isAligned ? "#22c55e" : "#fff", fontWeight: "bold", fontSize: "1.4rem", marginTop: 28 }}>
        {isAligned ? "أنت الآن باتجاه القبلة" : "وجّه الجهاز حتى يصبح السهم على القبلة"}
      </div>
    </div>
  );
};

export default QiblaCompass;