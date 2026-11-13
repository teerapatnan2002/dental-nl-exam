import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TutorChat({ questionId, userAnswer = null, correctAnswer = null }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'สวัสดีครับ มีจุดไหนในข้อนี้ที่อยากให้อาจารย์ช่วยขยายความ หรือสอนทริคจำเข้าห้องสอบเพิ่มเติม กดเลือกคำถามลัดด้านล่างหรือพิมพ์ถามได้เลยครับ' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageText = async (rawText) => {
    if (!rawText.trim() || loading) return;

    const userMessage = rawText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question_id: questionId, message: userMessage })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองอีกครั้ง' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    await sendMessageText(input);
  };

  const quickPrompts = [
    ...(userAnswer && correctAnswer && String(userAnswer) !== String(correctAnswer)
      ? [{ label: `⚖️ เทียบข้อ ${userAnswer} (ที่ฉันตอบ) vs ${correctAnswer}`, prompt: `ฉันเลือกตอบตัวเลือก ${userAnswer} แต่เฉลยคือ ${correctAnswer} ช่วยเปรียบเทียบจุดตัดสำคัญว่าทำไมฉันถึงพลาดและมีวิธีแยกสองตัวเลือกนี้อย่างไรไม่ให้สับสนอีก` }]
      : []),
    { label: '🧠 ขอสูตรจำ / Mnemonic', prompt: 'ช่วยสรุปเทคนิคการจำหรือ Mnemonic สั้นๆ สำหรับหลักการข้อนี้เพื่อนำไปใช้ในห้องสอบหน่อยครับ' },
    { label: '🪜 สรุปวิธีคิด 3 ขั้นตอน', prompt: 'ช่วยสรุปวิธีคิดและลำดับการตัดตัวเลือกในข้อนี้เป็น 3 ขั้นตอนสั้นๆ หน่อยครับ' },
    { label: '🔄 ถ้าโจทย์พลิกแพลงจะตอบอะไร?', prompt: 'หากกรรมการออกสอบพลิกแพลงเงื่อนไขของเคสนี้ (เช่น เปลี่ยนอายุ อาการ หรือค่าผลตรวจ) คำตอบจะเปลี่ยนเป็นตัวเลือกใดบ้าง?' },
  ];

  if (!user) {
    return (
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)', marginTop: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>กรุณาเข้าสู่ระบบเพื่อใช้งานระบบติวเตอร์ AI</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem', background: 'rgba(18,18,30,0.6)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot size={18} color="var(--primary-light)" />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>คุยกับ AI Tutor</span>
      </div>

      {/* Chat Messages */}
      <div style={{ padding: '1rem', height: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color="var(--primary-light)" />}
            </div>
            <div style={{
              background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              padding: '0.6rem 1rem', borderRadius: '12px',
              borderTopRightRadius: m.role === 'user' ? '2px' : '12px',
              borderTopLeftRadius: m.role === 'user' ? '12px' : '2px',
              maxWidth: '85%', fontSize: '0.9rem', color: 'white',
              lineHeight: 1.5
            }}>
              {m.role === 'user' ? m.text : (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  p: ({node, ...props}) => <p style={{ margin: 0, paddingBottom: '0.5rem' }} {...props} />
                }}>
                  {m.text}
                </ReactMarkdown>
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
          onChange={e => setInput(e.target.value)}
          placeholder="ถามข้อสงสัยเกี่ยวกับข้อนี้..."
          style={{ flex: 1, padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
          disabled={loading}
        />
        <button type="submit" style={{ padding: '0 1rem', background: 'transparent', border: 'none', color: input.trim() && !loading ? 'var(--primary-light)' : 'var(--text-muted)', cursor: input.trim() && !loading ? 'pointer' : 'default' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
