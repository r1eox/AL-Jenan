import React from "react";

const dailyWirds = [
  {
    day: 1,
    from: "الفاتحة 1",
    to: "البقرة 141",
    date: "اليوم",
    desc: "من الفاتحة 1 صفحة 1 إلى البقرة 141 صفحة 22"
  },
  {
    day: 2,
    from: "البقرة 142",
    to: "البقرة 252",
    date: "غدًا",
    desc: "من البقرة 142 صفحة 23 إلى البقرة 252 صفحة 42"
  },
  // ... أكمل بقية الأيام
];

const KhatmaDetailsPage = () => (
  <div style={{
    background: "#161E31",
    minHeight: "100vh",
    fontFamily: "'Cairo', sans-serif"
  }}>
    <div style={{
      background: "#202940",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      boxShadow: "0 2px 12px #0003",
      padding: "18px 0 0 0",
      marginBottom: 18,
      textAlign: "center"
    }}>
      <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>الورد اليومي</h2>
    </div>
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 10px" }}>
      {dailyWirds.map((w, i) => (
        <div key={i} style={{
          background: "#202940",
          borderRadius: 14,
          padding: "18px 18px 10px 18px",
          color: "#fff",
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          boxShadow: "0 2px 8px #0002",
          fontSize: "1.1rem"
        }}>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>ورد اليوم {w.day}</div>
          <div style={{ color: "#fbbf24", fontSize: "1rem", marginTop: 2 }}>{w.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export default KhatmaDetailsPage;