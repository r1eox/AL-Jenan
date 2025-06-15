import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaComments } from "react-icons/fa";

const BayanAIChat = ({ callGeminiAPI }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("bayan_chat");
    return saved ? JSON.parse(saved) : [
      { from: "ai", text: "مرحبًا بك في بيان! اسأل ما تشاء في أمور الدين أو الحياة." }
    ];
  });
  const [input, setInput] = useState(() => localStorage.getItem("bayan_last_input") || "");
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showChats, setShowChats] = useState(false);
  const [modalSource, setModalSource] = useState(null);
  const [chatsHistory, setChatsHistory] = useState(() =>
    JSON.parse(localStorage.getItem("bayan_chats_history") || "[]")
  );
  const [isHistory, setIsHistory] = useState(false);
  const touchStartX = useRef(null);
  const chatEndRef = useRef(null);

  // حفظ المحادثة في localStorage
  useEffect(() => {
    localStorage.setItem("bayan_chat", JSON.stringify(messages));
  }, [messages]);

  // حفظ آخر رسالة كتبتها
  useEffect(() => {
    localStorage.setItem("bayan_last_input", input);
  }, [input]);

  // النزول التلقائي لآخر رسالة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // تحديث سجل المحادثات عند فتح القائمة
  useEffect(() => {
    if (showChats) {
      setChatsHistory(JSON.parse(localStorage.getItem("bayan_chats_history") || "[]"));
    }
  }, [showChats]);

  // إرسال رسالة نصية
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages(msgs => [
      ...msgs,
      {
        from: "user",
        text: input,
        replyTo: replyTo !== null ? replyTo : undefined
      }
    ]);
    setLoading(true);
    setInput("");
    setReplyTo(null);

    try {
      let aiReply = await callGeminiAPI(messages, input);
      aiReply = aiReply.replace(/أنا نموذج لغوي كبير[^.!\n]*[.!\n]?/gi, "");
      aiReply = aiReply.replace(/دربتني جوجل/gi, "");
      setMessages(msgs => [
        ...msgs,
        { from: "ai", text: aiReply.trim() }
      ]);
    } catch {
      setMessages(msgs => [...msgs, { from: "ai", text: "حدث خطأ أثناء الاتصال بالخدمة." }]);
    }
    setLoading(false);
  };

  // الرد على رسالة
  const handleReplyClick = idx => setReplyTo(idx);

  // عند السحب لليمين على رسالة بيان
  const handleTouchStart = (e, idx) => {
    if (messages[idx].from !== "ai") return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e, idx) => {
    if (messages[idx].from !== "ai") return;
    const diff = e.changedTouches[0].clientX - (touchStartX.current || 0);
    if (diff > 60) setReplyTo(idx);
    touchStartX.current = null;
  };

  // بدء محادثة جديدة
  const startNewChat = () => {
    if (messages.length > 1 && !isHistory) saveChatToHistory(messages);
    setMessages([{ from: "ai", text: "مرحبًا بك في بيان! اسأل ما تشاء في أمور الدين أو الحياة." }]);
    setInput("");
    setReplyTo(null);
    setIsHistory(false);
    localStorage.removeItem("bayan_chat");
  };

  return (
    <div style={{
      background: '#161E31',
      borderRadius: 20,
      padding: 0,
      margin: 0,
      width: '100%',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      boxSizing: 'border-box',
      flex: 1,
      position: 'relative'
    }}>
      {/* الهيدر الثابت */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1100,
          background: "#161E31",
          borderTopLeftRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 60,
          boxShadow: "0 2px 10px #0002"
        }}
      >
        {/* يمين: بدء محادثة جديدة */}
        <button
          onClick={startNewChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#a7f3d0",
            color: "#22223b",
            border: "none",
            borderRadius: 8,
            padding: "7px 13px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer"
          }}
          title="بدء محادثة جديدة"
        >
          <FaPlus /> جديد
        </button>
        {/* وسط: العنوان */}
        <div
          style={{
            color: '#a855f7',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            textAlign: 'center',
            flex: 1,
          }}
        >
          بيان
        </div>
        {/* يسار: زر قائمة المحادثات */}
        <button
          onClick={() => setShowChats(true)}
          style={{
            background: "#9400d3",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "7px 13px",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
          title="المحادثات القديمة"
        >
          <FaComments />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#202940',
          borderRadius: 0,
          padding: 18,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          position: 'relative',
          minHeight: 0,
          paddingBottom: 90 // اترك مساحة أسفلية تساوي ارتفاع شريط الإدخال + هامش بسيط
        }}
        className="bayan-chat-scroll"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: '6px 0',
              position: "relative"
            }}
            onTouchStart={e => handleTouchStart(e, i)}
            onTouchEnd={e => handleTouchEnd(e, i)}
          >
            {/* عرض الرد على رسالة معينة */}
            {typeof msg.replyTo === "number" && messages[msg.replyTo] && (
              <div
                style={{
                  background: "#a855f7",
                  color: "#fff",
                  borderRadius: 7,
                  padding: "3px 10px",
                  fontSize: "0.85rem",
                  marginBottom: 3,
                  opacity: 0.8,
                  maxWidth: 180
                }}
              >
                {messages[msg.replyTo].text}
              </div>
            )}
            <span
              style={{
                display: 'inline-block',
                background: msg.from === "user" ? "#a7f3d0" : "#9400d3",
                color: msg.from === "user" ? "#22223b" : "#fff",
                borderRadius: 8,
                padding: "7px 12px",
                maxWidth: 220,
                fontSize: "0.97rem",
                direction: "rtl",
                lineHeight: 1.7,
                textAlign: "justify",
                wordBreak: "break-word",
                whiteSpace: "pre-line"
              }}
            >
              {msg.text}
            </span>
            {/* عرض الصورة المرسلة من قبل المستخدم */}
            {msg.image && (
              <img
                src={msg.image}
                alt="صورة مرسلة"
                style={{
                  maxWidth: 140,
                  maxHeight: 140,
                  borderRadius: 10,
                  marginBottom: 6,
                  display: "block"
                }}
              />
            )}
            {/* زر رد يظهر عند تمرير الماوس على رسالة بيان */}
            {msg.from === "ai" && (
              <button
                onClick={() => handleReplyClick(i)}
                style={{
                  position: "absolute",
                  left: msg.from === "ai" ? -55 : undefined,
                  right: msg.from === "user" ? -55 : undefined,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#9400d3 ",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "3px 10px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  opacity: 0.7,
                  display: "none"
                }}
                className="reply-btn"
                tabIndex={-1}
              >↩ رد</button>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: "left", margin: '6px 0' }}>
            <span
              style={{
                display: 'inline-block',
                background: "#9400d3",
                color: "#fff",
                borderRadius: 10,
                padding: "7px 14px",
                maxWidth: 260,
                fontSize: "1rem"
              }}
            >
              جاري التفكير...
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* إذا كنت ترد على رسالة */}
      {replyTo !== null && messages[replyTo] && (
        <div
          style={{
            background: "#9400d3",
            color: "#fff",
            borderRadius: 7,
            padding: "5px 12px",
            fontSize: "0.95rem",
            marginBottom: 7,
            maxWidth: 220,
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span>رد على: {messages[replyTo].text}</span>
          <button
            onClick={() => setReplyTo(null)}
            style={{
              marginRight: 10,
              background: "transparent",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            title="إلغاء الرد"
          >✕</button>
        </div>
      )}
      {/* شريط الإدخال ثابت أسفل الصفحة */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '14px 12px',
          background: '#161E31',
          position: 'fixed',
          bottom: 65,
          right: 0,
          left: 0,
          zIndex: 1001,
          maxWidth: '100vw',
          alignItems: 'flex-end'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          placeholder="اكتب سؤالك هنا..."
          style={{
            flex: 1,
            borderRadius: 8,
            border: '1px solid #a7f3d0',
            padding: '8px 12px',
            fontSize: '1rem',
            background: '#202940',
            color: '#a7f3d0'
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            background: '#9400d3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          title="إرسال"
        >
          {loading ? "جاري الإرسال..." : "إرسال"}
        </button>
      </div>
      {/* قائمة المحادثات القديمة (الشاتات) */}
      {showChats && (
        <div
          style={{
            position: "fixed",
            top: 60,
            right: 0,
            width: 270,
            height: "calc(100% - 60px)",
            background: "#202940",
            boxShadow: "-2px 0 12px #0003",
            zIndex: 1200,
            padding: "18px 10px",
            overflowY: "auto"
          }}
        >
          <div style={{ fontWeight: "bold", color: "#a855f7", marginBottom: 12, fontSize: "1.1rem", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>المحادثات السابقة</span>
            <button
              onClick={() => setShowChats(false)}
              style={{
                background: "transparent",
                color: "#fff",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                marginRight: 0,
                marginLeft: 0,
                alignSelf: "center"
              }}
              title="إغلاق"
            >✕</button>
          </div>
          {/* هنا يمكن عرض قائمة المحادثات القديمة من خلال استدعاء دالة أو استخدام props */}
          {chatsHistory.length === 0 && (
            <div style={{ color: "#fff", opacity: 0.7, textAlign: "center" }}>لا توجد محادثات سابقة</div>
          )}
          {chatsHistory.map(chat => (
            <div
              key={chat.id}
              style={{
                background: "#a855f7",
                color: "#fff",
                borderRadius: 10,
                padding: "10px 10px",
                marginBottom: 10,
                cursor: "pointer",
                width: "100%",
                minHeight: 44,
                fontWeight: "bold",
                fontSize: "1.08rem",
                boxShadow: "0 2px 8px #0002",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxSizing: "border-box",
                overflow: "hidden"
              }}
              onClick={() => {
                setMessages(chat.messages);
                setShowChats(false);
                setIsHistory(true);
              }}
              title="عرض هذه المحادثة"
              onMouseOver={e => e.currentTarget.style.background = "#9333ea"}
              onMouseOut={e => e.currentTarget.style.background = "#a855f7"}
            >
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1
              }}>
                {chat.title}
              </span>
              <span style={{
                fontSize: "0.85rem",
                opacity: 0.7,
                marginRight: 10
              }}>
                {new Date(chat.id).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BayanAIChat;

// مثال مبسط لدالة البحث في dorar.net
async function searchHadithDorar(query) {
  try {
    const url = `https://dorar.net/dorar_api.json?skey=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    // النتائج في data.ahadith (مصفوفة)
    return data.ahadith || [];
  } catch {
    return [];
  }
}

// حفظ المحادثة في السجل
function saveChatToHistory(messages) {
  const history = JSON.parse(localStorage.getItem("bayan_chats_history") || "[]");
  const last = history[history.length - 1];
  if (last && JSON.stringify(last.messages) === JSON.stringify(messages)) return;
  history.push({
    id: Date.now(),
    title: messages[1]?.text?.slice(0, 30) || "محادثة جديدة",
    messages
  });
  localStorage.setItem("bayan_chats_history", JSON.stringify(history));
}