import React, { useState } from "react";

const khatmaList = [
  { days: 30, desc: "الورد اليومي: جزء" },
  { days: 240, desc: "الورد اليومي: ربع" },
  { days: 120, desc: "الورد اليومي: ربعان", ayat: 7, page: 1 },
  { days: 80, desc: "الورد اليومي: 3 أرباع", ayat: 286, page: 2 },
  { days: 60, desc: "الورد اليومي: حزب", ayat: 200, page: 50 },
  { days: 40, desc: "الورد اليومي: حزب ونصف" },
  { days: 20, desc: "الورد اليومي: جزء ونصف" },
  { days: 15, desc: "الورد اليومي: جزعان" },
  { days: 10, desc: "الورد اليومي: 3 أجزاء" },
  { days: 6, desc: "الورد اليومي: 5 أجزاء" },
  { days: 3, desc: "الورد اليومي: 10 أجزاء" }
];

const KhatmaSelectPage = ({ onBack }) => {
  return (
    <div
      style={{
        background: "#161E31",
        minHeight: "100vh",
        fontFamily: "'Cairo', sans-serif",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          padding: "18px 0 0 0",
          background: "#202940",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: "0 2px 12px #0003",
          marginBottom: 18,
          textAlign: "center",
          position: "relative"
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: "absolute",
              right: 16,
              top: 16,
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
            رجوع
          </button>
        )}
        <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>اختر ختمة</h2>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 10px" }}>
        {khatmaList.map((k, i) => (
          <div
            key={i}
            style={{
              background: "#202940",
              borderRadius: 14,
              padding: "18px 18px 10px 18px",
              color: "#fff",
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              boxShadow: "0 2px 8px #0002",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>ختمة {k.days} يوما</div>
            <div style={{ color: "#fbbf24", fontSize: "1rem", marginTop: 2 }}>{k.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KhatmaSelectPage;