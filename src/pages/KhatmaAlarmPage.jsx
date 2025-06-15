import React, { useState } from "react";

const KhatmaAlarmPage = () => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState("21:00");

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
        <h2 style={{ color: "#fff", fontWeight: "bold", fontSize: "1.3rem", margin: 0 }}>منبه الختمة</h2>
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 10px" }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: "#a7f3d0", fontWeight: "bold", marginLeft: 12 }}>
            تفعيل تنبيه الورد اليومي
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              style={{ marginRight: 8 }}
            />
          </label>
        </div>
        {enabled && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ color: "#a7f3d0", marginBottom: 8 }}>وقت التنبيه</div>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{
                background: "#202940",
                color: "#fff",
                border: "1px solid #a7f3d0",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: "1.1rem"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default KhatmaAlarmPage;