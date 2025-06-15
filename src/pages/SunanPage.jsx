import React, { useState } from "react";
import sunanData from "./sunanData";

const SunanPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  if (!selectedSection) {
    return (
      <div style={{
        background: "#161E31",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
        width: "100vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{
          color: "#a7f3d0",
          marginBottom: 24,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "2rem"
        }}>السنن النبوية</h2>
        <div style={{
          width: "100%",
          maxWidth: 1100,
          margin: 0,
          padding: 0,
          boxSizing: "border-box"
        }}>
          <div
            className="sunan-grid"
            style={{
              display: "grid",
              gap: 18,
              width: "100%",
              gridTemplateColumns: "1fr 1fr",
              boxSizing: "border-box"
            }}
          >
            {sunanData.map(section => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section)}
                style={{
                  background: "#202940",
                  color: "#a7f3d0",
                  border: "none",
                  borderRadius: 14,
                  padding: "22px 0",
                  fontWeight: "bold",
                  fontSize: "1.15rem",
                  boxShadow: "0 2px 8px #0003",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                  width: "100%",
                  margin: 0
                }}
              >
                {section.category}
              </button>
            ))}
          </div>
        </div>
        <style>
          {`
            .sunan-grid {
              grid-template-columns: 1fr 1fr;
            }
            @media (min-width: 700px) {
              .sunan-grid {
                grid-template-columns: 1fr 1fr 1fr;
              }
            }
            @media (min-width: 1100px) {
              .sunan-grid {
                grid-template-columns: 1fr 1fr 1fr 1fr;
              }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      background: "#161E31",
      minHeight: "100vh",
      padding: 0,
      margin: 0,
      width: "100%", // عدل هنا بدل 100vw
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowX: "hidden" // يمنع اللف الأفقي
    }}>
      <button
        onClick={() => setSelectedSection(null)}
        style={{
          background: "#a7f3d0",
          color: "#22223b",
          border: "none",
          borderRadius: 8,
          padding: "8px 22px",
          fontWeight: "bold",
          marginBottom: 18,
          fontSize: "1rem",
          alignSelf: "flex-start",
          marginRight: 24
        }}
      >
        &larr; رجوع
      </button>
      <h2 style={{
        color: "#a7f3d0",
        marginBottom: 24,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.4rem"
      }}>{selectedSection.category}</h2>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: "100%",
        maxWidth: 700,
        margin: 0,
        padding: 0,
        boxSizing: "border-box"
      }}>
        {selectedSection.ahadith.map(hadith => (
          <div
            key={hadith.id}
            style={{
              background: "#202940",
              color: "#fff",
              borderRadius: 14,
              padding: "18px 14px",
              boxShadow: "0 2px 8px #0002",
              fontSize: "1.1rem",
              lineHeight: 2,
              wordBreak: "break-word",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: "100%",
              margin: 0
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: "bold", color: "#fde047", fontSize: "1.1rem", width: "100%", textAlign: "right" }}>
              {hadith.text}
            </div>
            <div style={{ color: "#a7f3d0", fontSize: "0.95rem", marginBottom: 6, width: "100%", textAlign: "right" }}>
              المصدر: {hadith.source} {hadith.number && `(${hadith.number})`}
            </div>
            {hadith.grade && (
              <div style={{ color: "#a7f3d0", fontSize: "0.95rem", width: "100%", textAlign: "right" }}>
                الدرجة: {hadith.grade}
              </div>
            )}
            <div style={{ color: "#a7f3d0", fontSize: "0.95rem", width: "100%", textAlign: "right" }}>
              المرجع: {hadith.reference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SunanPage;