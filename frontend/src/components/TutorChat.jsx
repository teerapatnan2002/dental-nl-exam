import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookmarkPlus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QUICK_TAGS = [
  'สับสนนิยาม',
  'ลืมตัวเลข',
  'พลาดแนวทางไทย',
  'โดนตัวลวง',
  'สรุป AI Tutor',
];

export default function TutorChat({
  questionId = null,
  topicId = null,
  pathwayId = null,
  topicTitle = '',
  userAnswer = null,
  correctAnswer = null,
  onSavedNote = null,
}) {
  const { token, user, authFetch } = useAuth();

  const buildGreeting = () => {
    if (topicId && !questionId) {
      return `สวัสดีครับ เรากำลังศึกษาหัวข้อ **${topicTitle || topicId}** ด้วยกัน อยากให้อาจารย์ช่วยไล่ Clinical Pathway, เทียบแนวทางทันตแพทย์ไทย หรือสรุปกฎ 3 ข้อก่อนเข้าห้องสอบ พิมพ์ถามหรือกดปุ่มลัดด้านล่างได้เลยครับ`;
    }
    return 'สวัสดีครับ มีจุดไหนในข้อนี้ที่อยากให้อาจารย์ช่วยขยายความ แยกตัวลวง หรือสอนทริคจำเข้าห้องสอบเพิ่มเติม กดเลือกคำถามลัดด้านล่างหรือพิมพ์ถามได้เลยครับ';
  };

  const [messages, setMessages] = useState([{ role: 'assistant', text: buildGreeting(), isGreeting: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingIdx, setSavingIdx] = useState(null);
  const [savedStates, setSavedStates] = useState({}); // { [idx]: tag }
  const [selectedSaveTags, setSelectedSaveTags] = useState({}); // { [idx]: tag }
  const endRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', text: buildGreeting(), isGreeting: true }]);
    setSavedStates({});
    setSelectedSaveTags({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, topicId, pathwayId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageText = async (rawText) => {
    if (!rawText.trim() || loading) return;

    const userMessage = rawText.trim();
    const priorHistory = messages
      .filter((m) => !m.isGreeting && m.text)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.text }));

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const doFetch = authFetch || fetch;
      const res = await doFetch(`${API_BASE}/api/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question_id: questionId || null,
          topic_id: topicId || null,
          pathway_id: pathwayId || null,
          user_answer: userAnswer ? String(userAnswer) : null,
          message: userMessage,
          history: priorHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply,
          mode: data.mode,
          suggestedTag: data.suggested_tag || 'สรุป AI Tutor',
          resolvedTopicId: data.resolved_topic_id || topicId || null,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessageText(input);
  };

  const handleSaveReplyToNote = async (msg, idx) => {
    if (!token || savingIdx !== null) return;
    const tagToSave = selectedSaveTags[idx] || msg.suggestedTag || 'สรุป AI Tutor';
    setSavingIdx(idx);
    try {
      const doFetch = authFetch || fetch;
      const res = await doFetch(`${API_BASE}/api/bookmarks/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question_id: questionId || null,
          topic_id: msg.resolvedTopicId || topicId || null,
          mistake_tag: tagToSave,
          note_text: msg.text,
          append: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedStates((prev) => ({ ...prev, [idx]: tagToSave }));
      if (onSavedNote) onSavedNote(tagToSave);
    } catch (err) {
      console.error('Failed to save AI Tutor reply to personal notes:', err);
    } finally {
      setSavingIdx(null);
    }
  };

  const quickPrompts = [
    ...(questionId && userAnswer && correctAnswer && String(userAnswer) !== String(correctAnswer)
      ? [{
          label: `⚖️ เทียบข้อ ${userAnswer} (ที่ฉันตอบ) vs ${correctAnswer}`,
          prompt: `ฉันเลือกตอบตัวเลือก ${userAnswer} แต่เฉลยคือ ${correctAnswer} ช่วยเปรียบเทียบจุดตัดสำคัญว่าทำไมฉันถึงพลาดและมีวิธีแยกสองตัวเลือกนี้อย่างไรไม่ให้สับสนอีก`,
        }]
      : []),
    {
      label: '⚖️ แยกจากตัวลวงข้ออื่นยังไง?',
      prompt: 'แยกจากตัวลวงข้ออื่นยังไง? ช่วยสรุปจุดตัดสำคัญที่ใช้ตัดตัวเลือกหลอกให้ชัดเจนหน่อยครับ',
    },
    {
      label: '🪜 สรุปเป็นกฎ 3 ข้อก่อนเข้าห้องสอบ',
      prompt: 'ช่วยสรุปเป็นกฎ 3 ข้อสั้นๆ และ Mnemonic สำหรับนำไปจำใช้ในห้องสอบหน่อยครับ',
    },
    {
      label: '🇹🇭 แนวทางทันตแพทย์ไทยต่างจาก Textbook ไหม?',
      prompt: 'แนวทางปฏิบัติของทันตแพทยสภา/สมาคมทันตแพทย์ไทยในหัวข้อนี้เหมือนหรือแตกต่างจาก Textbook สากลอย่างไรบ้าง?',
    },
    ...(questionId
      ? [{
          label: '🔄 ถ้าโจทย์พลิกแพลงจะตอบอะไร?',
          prompt: 'หากกรรมการออกสอบพลิกแพลงเงื่อนไขของเคสนี้ (เช่น เปลี่ยนอายุ อาการ หรือค่าผลตรวจ) คำตอบจะเปลี่ยนเป็นตัวเลือกใดบ้าง?',
        }]
      : []),
  ];

  if (!user) {
    return (
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.35rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)', marginTop: '0.85rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          กรุณาเข้าสู่ระบบเพื่อใช้งานอาจารย์ AI Socratic Tutor และบันทึกคำตอบเข้าสมุดโน้ตส่วนตัว
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0.85rem', background: 'rgba(18,18,30,0.68)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={18} color="var(--primary-light)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
            อาจารย์ AI Tutor (Multi-turn Socratic & Thai Protocols)
          </span>
        </div>
        {topicTitle && (
          <span style={{ fontSize: '0.74rem', color: '#a5b4fc', fontWeight: 600 }}>
            📚 {topicTitle}
          </span>
        )}
      </div>

      {/* Chat Messages */}
      <div style={{ padding: '1rem', height: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="var(--primary-light)" />}
            </div>

            <div style={{ maxWidth: '88%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{
                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                padding: '0.68rem 1rem', borderRadius: '12px',
                borderTopRightRadius: m.role === 'user' ? '2px' : '12px',
                borderTopLeftRadius: m.role === 'user' ? '12px' : '2px',
                fontSize: '0.9rem', color: 'white',
                lineHeight: 1.55
              }}>
                {m.role === 'user' ? m.text : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({ node, ...props }) => <p style={{ margin: 0, paddingBottom: '0.45rem' }} {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ margin: '0.25rem 0 0.45rem', paddingLeft: '1.25rem' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ margin: '0.25rem 0 0.45rem', paddingLeft: '1.25rem' }} {...props} />,
                  }}>
                    {m.text}
                  </ReactMarkdown>
                )}
              </div>

              {/* 1-Click Save Assistant Reply as Personal Note */}
              {m.role === 'assistant' && !m.isGreeting && (questionId || topicId || m.resolvedTopicId) && (
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', paddingLeft: '0.2rem' }}>
                  <select
                    value={selectedSaveTags[i] || m.suggestedTag || 'สรุป AI Tutor'}
                    onChange={(e) => setSelectedSaveTags((prev) => ({ ...prev, [i]: e.target.value }))}
                    disabled={Boolean(savedStates[i])}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.45rem',
                      borderRadius: '7px',
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    {QUICK_TAGS.map((tg) => (
                      <option key={tg} value={tg}>{tg}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={Boolean(savedStates[i]) || savingIdx === i}
                    onClick={() => handleSaveReplyToNote(m, i)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      padding: '0.22rem 0.65rem',
                      borderRadius: '8px',
                      cursor: savedStates[i] ? 'default' : 'pointer',
                      background: savedStates[i] ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.14)',
                      color: savedStates[i] ? '#34d399' : '#fbbf24',
                      border: `1px solid ${savedStates[i] ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.38)'}`,
                    }}
                  >
                    {savedStates[i] ? (
                      <>
                        <Check size={12} /> บันทึกเป็นโน้ตแล้ว ({savedStates[i]})
                      </>
                    ) : (
                      <>
                        <BookmarkPlus size={12} />
                        {savingIdx === i ? 'กำลังบันทึก...' : '📌 บันทึกคำตอบนี้เป็นโน้ตส่วนตัว'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color="var(--primary-light)" />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '12px', borderTopLeftRadius: '2px', display: 'flex', alignItems: 'center' }}>
              <Loader2 size={16} className="spin" color="var(--primary-light)" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Pedagogical Prompt Chips */}
      <div style={{
        padding: '0.5rem 0.75rem',
        borderTop: '1px solid var(--border)',
        background: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        gap: '0.4rem',
        flexWrap: 'wrap'
      }}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loading}
            onClick={() => sendMessageText(qp.prompt)}
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              padding: '0.25rem 0.65rem',
              borderRadius: '14px',
              background: 'rgba(124, 58, 237, 0.14)',
              border: '1px solid rgba(124, 58, 237, 0.35)',
              color: 'var(--primary-light)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={topicId && !questionId ? 'ถามอาจารย์เกี่ยวกับหัวข้อนี้หรือขอทริคเพิ่ม...' : 'ถามข้อสงสัยเกี่ยวกับข้อนี้ต่อได้เลย...'}
          style={{ flex: 1, padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
          disabled={loading}
        />
        <button
          type="submit"
          style={{ padding: '0 1rem', background: 'transparent', border: 'none', color: input.trim() && !loading ? 'var(--primary-light)' : 'var(--text-muted)', cursor: input.trim() && !loading ? 'pointer' : 'default' }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
