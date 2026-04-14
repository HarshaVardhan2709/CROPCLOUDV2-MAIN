'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // ✅ Read token from cookie to authenticate requests
      
const token = localStorage.getItem('cropcloud-token') 
  || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = {
        role: 'bot',
        text: data.response?.message || data.message || 'No response',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '❌ Server error' }]);
    }

    setLoading(false);
  };

  // Don't render chatbot until hydrated and if user is not logged in
  if (!hydrated || !accessToken) {
    return null;
  }

  return (
    <>
      {/* 🤖 Floating Button - Green themed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ position: 'fixed', bottom: '24px', right: '24px' }}
          className="z-[9999] w-16 h-16 rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Chat with CropCloud AI"
          aria-label="Open Chatbot"
        >
          <span
            className="absolute w-16 h-16 rounded-full animate-ping opacity-30"
            style={{ background: 'radial-gradient(circle, #2d6a4f, #1b4332)' }}
          />
          <span
            className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              boxShadow: '0 0 20px #2d6a4f88, 0 0 40px #1b433244',
            }}
          >
            🤖
          </span>
        </button>
      )}

      {/* 💬 Chat Window - Green themed */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '500px',
            height: '650px',
            background: '#0d1f16',
            border: '1px solid #2d6a4f44',
            boxShadow: '0 0 40px #2d6a4f33, 0 20px 60px #00000088',
          }}
          className="z-[9999] rounded-2xl flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
              boxShadow: '0 4px 20px #1b433266',
            }}
            className="p-4 flex justify-between items-center shrink-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                🤖
              </div>
              <div>
                <p className="text-white font-bold tracking-wide text-base leading-none">CropCloud AI</p>
                <p className="text-green-200 text-xs mt-0.5">● Online & Ready</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg w-8 h-8 rounded-full flex items-center justify-center hover:rotate-90 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: '#0d1f16' }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="text-5xl">🤖</div>
                <p className="font-semibold text-base" style={{ color: '#74c69d' }}>Welcome to CropCloud AI</p>
                <p className="text-sm max-w-[260px]" style={{ color: '#52b788' }}>
                  Ask me about crops, market prices, weather, or farming products.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {['🌽 Crop advice', '💰 Market prices', '🌧️ Weather tips'].map(hint => (
                    <span
                      key={hint}
                      className="text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition"
                      style={{ background: '#1b4332', color: '#74c69d', border: '1px solid #2d6a4f' }}
                      onClick={() => setInput(hint.split(' ').slice(1).join(' '))}
                    >
                      {hint}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className="px-4 py-3 rounded-2xl text-sm max-w-[75%] leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                          color: '#fff',
                          borderBottomRightRadius: '4px',
                          boxShadow: '0 4px 15px #1b433244',
                        }
                      : {
                          background: '#1a3728',
                          color: '#d8f3dc',
                          border: '1px solid #2d6a4f44',
                          borderBottomLeftRadius: '4px',
                        }
                  }
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: '#1a3728', border: '1px solid #2d6a4f', color: '#74c69d' }}
                  >
                    👤
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2 justify-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}
                >
                  🤖
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-sm flex gap-1 items-center"
                  style={{ background: '#1a3728', border: '1px solid #2d6a4f44', borderBottomLeftRadius: '4px' }}
                >
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#74c69d', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#74c69d', animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#74c69d', animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div
            className="flex items-center gap-2 p-3 shrink-0"
            style={{ background: '#112318', borderTop: '1px solid #2d6a4f33' }}
          >
            <input
              className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all"
              style={{
                background: '#1a3728',
                color: '#d8f3dc',
                border: '1px solid #2d6a4f44',
                caretColor: '#74c69d',
              }}
              placeholder="Ask something about farming..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg transition-all hover:scale-105 disabled:opacity-40 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                boxShadow: '0 4px 15px #1b433244',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
