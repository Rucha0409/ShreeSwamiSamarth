import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mic, MicOff, VolumeX, Volume2, ChevronUp, ChevronDown, Send } from 'lucide-react'
import { useChatur } from '@/hooks/useChatur'
import chaturAvatar from '@/assets/chatur-avatar.png'

// Animated wave bars shown when speaking or listening
function VoiceWaves({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-150"
          style={{
            width: '3px',
            backgroundColor: color,
            height: active ? `${8 + Math.sin(i * 0.9) * 12 + Math.random() * 8}px` : '4px',
            animation: active ? `wave ${0.4 + i * 0.08}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 60}ms`,
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to { height: 28px; }
        }
      `}</style>
    </div>
  )
}

export default function ChaturBar() {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const [textInput, setTextInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages, loading, isSpeaking, isListening, lang,
    sendMessage, speakText, stopSpeaking,
    startListening, stopListening, greetPage, toggleLang
  } = useChatur()

  // Auto-greet on every route change
  useEffect(() => {
    const t = setTimeout(() => greetPage(location.pathname), 500)
    return () => clearTimeout(t)
  }, [location.pathname])

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!textInput.trim()) return
    sendMessage(textInput, true)
    setTextInput('')
  }

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant')
  const statusText = isListening
    ? (lang === 'hi' ? 'Sun raha hoon...' : 'Listening...')
    : isSpeaking
    ? (lang === 'hi' ? 'Bol raha hoon...' : 'Speaking...')
    : loading
    ? (lang === 'hi' ? 'Soch raha hoon...' : 'Thinking...')
    : (lang === 'hi' ? 'Baat karein...' : 'Talk to me...')

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 select-none"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Expanded Panel ── */}
      {expanded && (
        <div
          className="mx-auto max-w-2xl"
          style={{
            background: 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 40px rgba(0,200,180,0.15)',
            borderTop: '1px solid rgba(0,200,180,0.25)',
          }}
        >
          {/* Messages */}
          <div className="h-64 overflow-y-auto px-4 pt-4 pb-2 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <img
                    src={chaturAvatar}
                    alt="Chatur"
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-1 border border-teal-400"
                  />
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal-500 text-white rounded-tr-none'
                      : 'text-gray-100 rounded-tl-none'
                  }`}
                  style={
                    msg.role === 'assistant'
                      ? { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }
                      : {}
                  }
                >
                  {msg.text}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                      className="ml-2 text-teal-400 hover:text-teal-200 transition-colors inline-flex items-center gap-1 text-xs"
                    >
                      {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center">
                <img src={chaturAvatar} alt="Chatur" className="w-7 h-7 rounded-full border border-teal-400" />
                <div className="px-3 py-2 rounded-2xl rounded-tl-none flex gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text input */}
          <div className="px-4 pb-2 flex gap-2">
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'hi' ? 'Message ya link type karein...' : 'Type a message or link...'}
              className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(0,200,180,0.2)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!textInput.trim() || loading}
              className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Bottom Bar ── */}
      <div
        className="mx-auto max-w-2xl"
        style={{
          background: 'linear-gradient(90deg, #0f2027 0%, #1a3a4a 50%, #0f2027 100%)',
          borderTop: '1px solid rgba(0,200,180,0.3)',
          boxShadow: '0 -4px 30px rgba(0,200,180,0.1)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">

          {/* Avatar — pulses when speaking */}
          <div className="relative flex-shrink-0">
            {(isSpeaking || isListening) && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: isSpeaking ? 'rgba(0,200,180,0.4)' : 'rgba(239,68,68,0.4)' }}
              />
            )}
            <div
              className="rounded-full overflow-hidden border-2 transition-all duration-300"
              style={{
                width: isSpeaking ? '52px' : '44px',
                height: isSpeaking ? '52px' : '44px',
                borderColor: isSpeaking ? '#00c8b4' : isListening ? '#ef4444' : '#2a5a6a',
                boxShadow: isSpeaking ? '0 0 16px rgba(0,200,180,0.6)' : 'none',
              }}
            >
              <img src={chaturAvatar} alt="Chatur" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Status + Waves */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white text-xs font-bold">Chatur</p>
              <span className="text-xs text-teal-400">{statusText}</span>
            </div>
            <div className="mt-1">
              <VoiceWaves
                active={isSpeaking || isListening || loading}
                color={isListening ? '#ef4444' : '#00c8b4'}
              />
            </div>
            {/* Last message preview when collapsed */}
            {!expanded && lastAssistantMsg && !isSpeaking && !isListening && (
              <p className="text-gray-400 text-xs truncate mt-0.5">
                {lastAssistantMsg.text.slice(0, 60)}...
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Lang toggle */}
            <button
              onClick={toggleLang}
              className="text-xs font-bold px-2 py-1 rounded-lg transition-all"
              style={{
                background: 'rgba(0,200,180,0.15)',
                color: '#00c8b4',
                border: '1px solid rgba(0,200,180,0.3)',
              }}
            >
              {lang === 'hi' ? 'EN' : 'HI'}
            </button>

            {/* Mic — hold to talk */}
            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={(e) => { e.preventDefault(); startListening() }}
              onTouchEnd={(e) => { e.preventDefault(); stopListening() }}
              className="rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                width: '44px',
                height: '44px',
                background: isListening
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #00c8b4, #0891b2)',
                boxShadow: isListening ? '0 0 20px rgba(239,68,68,0.5)' : '0 0 12px rgba(0,200,180,0.3)',
                transform: isListening ? 'scale(1.1)' : 'scale(1)',
              }}
              title={lang === 'hi' ? 'Dabakar bolein' : 'Hold to speak'}
            >
              {isListening ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
            </button>

            {/* Stop speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="rounded-full flex items-center justify-center transition-all"
                style={{
                  width: '36px', height: '36px',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.4)',
                }}
              >
                <VolumeX size={16} color="#ef4444" />
              </button>
            )}

            {/* Expand/collapse */}
            <button
              onClick={() => setExpanded(p => !p)}
              className="rounded-full flex items-center justify-center transition-all"
              style={{
                width: '36px', height: '36px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {expanded
                ? <ChevronDown size={16} color="#94a3b8" />
                : <ChevronUp size={16} color="#94a3b8" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}