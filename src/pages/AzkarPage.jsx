import React, { useState } from "react";
import azkarData from "./azkarData";

const getAzkarList = (cat) =>
  cat.sections || cat.adyas || cat.adkar || cat.adykar || cat.azkar || cat.azkarat || [];

const getZekrText = (zekr) =>
  zekr.text || zekr.zekr || zekr.content || "";

const getZekrSource = (zekr) =>
  zekr.source || zekr.reference || "";

const getZekrCount = (zekr) =>
  zekr.repetition || zekr.count || "";

const AzkarPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!selectedCategory) {
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
        }}>الأذكار</h2>
        <div style={{
          width: "100%",
          maxWidth: 1100,
          margin: 0,
          padding: 0,
          boxSizing: "border-box"
        }}>
          <div
            className="azkar-grid"
            style={{
              display: "grid",
              gap: 18,
              width: "100%",
              gridTemplateColumns: "1fr 1fr",
              boxSizing: "border-box"
            }}
          >
            {azkarData
              .filter(cat => Array.isArray(cat.sections) && cat.sections.length > 0)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
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
                  {cat.category}
                </button>
              ))}
          </div>
        </div>
        <style>
          {`
            .azkar-grid {
              grid-template-columns: 1fr 1fr;
            }
            @media (min-width: 700px) {
              .azkar-grid {
                grid-template-columns: 1fr 1fr 1fr;
              }
            }
            @media (min-width: 1100px) {
              .azkar-grid {
                grid-template-columns: 1fr 1fr 1fr 1fr;
              }
            }
          `}
        </style>
      </div>
    );
  }

  // عرض الأذكار داخل القسم
  const azkarList = getAzkarList(selectedCategory);

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
      <button
        onClick={() => setSelectedCategory(null)}
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
      }}>{selectedCategory.category}</h2>
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
        {azkarList.map((zekr, i) => (
          <div
            key={zekr.id || i}
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
              {getZekrText(zekr)}
            </div>
            {getZekrCount(zekr) && (
              <div style={{ color: "#a7f3d0", fontSize: "0.95rem", marginBottom: 6, width: "100%", textAlign: "right" }}>
                التكرار: {getZekrCount(zekr)}
              </div>
            )}
            {getZekrSource(zekr) && (
              <div style={{ color: "#a7f3d0", fontSize: "0.95rem", width: "100%", textAlign: "right" }}>
                المصدر: {getZekrSource(zekr)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AzkarPage;