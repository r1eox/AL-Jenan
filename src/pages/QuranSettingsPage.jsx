import React, { useState } from "react";

const QuranSettingsPage = () => {
  const [numberColor, setNumberColor] = useState("blue");
  const [theme, setTheme] = useState("light");
  const [numbersType, setNumbersType] = useState("arabic");

  return (
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
        <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>إعدادات المصحف</h2>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 10px" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#a7f3d0", marginBottom: 8 }}>لون الأرقام</div>
          <div style={{ display: "flex", gap: 16 }}>
            {["red", "black", "blue", "green", "brown"].map(c => (
              <div key={c}
                onClick={() => setNumberColor(c)}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: c, border: numberColor === c ? "3px solid #a7f3d0" : "2px solid #fff",
                  cursor: "pointer"
                }} />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#a7f3d0", marginBottom: 8 }}>الوضع الداكن</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["تلقائي", "فاتح", "داكن"].map(opt => (
              <button key={opt}
                onClick={() => setTheme(opt)}
                style={{
                  background: theme === opt ? "#a7f3d0" : "transparent",
                  color: theme === opt ? "#22223b" : "#a7f3d0",
                  border: "1px solid #a7f3d0",
                  borderRadius: 10,
                  padding: "6px 22px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer"
                }}>{opt}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#a7f3d0", marginBottom: 8 }}>الأرقام في الواجهة الرئيسية</div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setNumbersType("arabic")}
              style={{
                background: numbersType === "arabic" ? "#a7f3d0" : "transparent",
                color: numbersType === "arabic" ? "#22223b" : "#a7f3d0",
                border: "1px solid #a7f3d0",
                borderRadius: 10,
                padding: "6px 22px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer"
              }}>1234</button>
            <button
              onClick={() => setNumbersType("hindi")}
              style={{
                background: numbersType === "hindi" ? "#a7f3d0" : "transparent",
                color: numbersType === "hindi" ? "#22223b" : "#a7f3d0",
                border: "1px solid #a7f3d0",
                borderRadius: 10,
                padding: "6px 22px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer"
              }}>١٢٣٤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranSettingsPage;