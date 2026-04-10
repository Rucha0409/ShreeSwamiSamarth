import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useChatur } from '@/hooks/useChatur'
import { useAppSettings } from '@/context/AppSettingsContext'

/* ─── Chatur Avatar using imported image ─── */
const ChaturAvatar = ({ size = 48 }: { size?: number }) => (
  <img 
    src="/images/chatur.jpg" 
    alt="Chatur" 
    className="rounded-full object-cover border-2 border-emerald-200"
    style={{ width: size, height: size }}
  />
)

function formatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/•/g, '&bull;')
}

export default function ChaturAssistant() {
  const [input, setInput]           = useState('')
  const [autoSpeak, setAutoSpeak]   = useState(true)
  const bottomRef                    = useRef<HTMLDivElement>(null)
  const location                     = useLocation()
  const { elderlyMode, language }    = useAppSettings()

  const {
    messages, loading, isOpen, isSpeaking, isListening, lang,
    setIsOpen, sendMessage, speakText, stopSpeaking,
    startListening, stopListening, resetForPage, toggleLang
  } = useChatur()

  useEffect(() => {
    const timer = setTimeout(() => resetForPage(location.pathname), 400)
    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input, autoSpeak)
    setInput('')
  }

  const quickActions = lang === 'hi'
    ? ['🔍 यह message check करो', '🔗 Link safe है?', '📞 Number spam है?', '💡 Safety tip दो']
    : ['🔍 Check this message', '🔗 Is this link safe?', '📞 Is this number spam?', '💡 Give safety tip']

  const isElderly = elderlyMode

  return (
    <>
      {/* ── Floating bubble (when closed) ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 z-50 group hover:scale-110 transition-transform duration-300"
          title="Chat with Chatur"
          style={{ filter: 'drop-shadow(0 10px 25px rgba(5,150,105,0.4))' }}
        >
          {isSpeaking && (
            <>
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" style={{ animationDelay: '0.3s' }} />
            </>
          )}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-400 shadow-xl bg-white">
            <ChaturAvatar size={96} />
          </div>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-7 h-7 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-md animate-bounce">
            AI
          </span>
        </button>
      )}

      {/* ── Chat Panel (Desktop Friendly Sidebar/Popup) ── */}
      {isOpen && (
        <div className="fixed bottom-10 right-10 w-full max-w-[450px] h-[750px] z-[60] flex flex-col bg-background rounded-3xl overflow-hidden border-2 border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)]">

          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 gradient-teal shadow-md flex-shrink-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {isSpeaking && (
                <span className="absolute inset-0 rounded-full bg-white opacity-40 animate-ping" />
              )}
              <div className={`rounded-full overflow-hidden border-2 transition-all duration-300 bg-white ${isSpeaking ? 'border-yellow-300 scale-110' : 'border-white/50'}`}>
                <ChaturAvatar size={56} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-xl leading-tight">Chatur 🛡️</p>
              <p className="text-emerald-100 text-sm font-semibold truncate">
                {loading ? (lang === 'hi' ? 'सोच रहा हूं...' : 'Thinking...') :
                 isSpeaking ? (lang === 'hi' ? 'बोल रहा हूं...' : 'Speaking...') :
                 isListening ? (lang === 'hi' ? 'सुन रहा हूं...' : 'Listening...') :
                 (lang === 'hi' ? 'AI Safety दोस्त' : 'AI Safety Assistant')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-xl text-emerald-900 bg-emerald-100 hover:bg-white transition-colors text-xs font-black"
              >
                {lang === 'hi' ? 'EN' : 'HI'}
              </button>
              <button
                onClick={() => { setAutoSpeak(!autoSpeak); if (isSpeaking) stopSpeaking() }}
                className="p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors"
                title="Toggle Auto Speak"
              >
                {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Quick action chips */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-muted border-b border-border flex-shrink-0 custom-scrollbar">
            {quickActions.map(action => (
              <button
                key={action}
                onClick={() => setInput(action.replace(/^[^\s]+ /, ''))}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary transition-colors whitespace-nowrap ${
                  isElderly ? 'text-base' : 'text-sm'
                }`}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/50 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    <ChaturAvatar size={40} />
                  </div>
                )}
                <div className={`max-w-[85%] flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl leading-relaxed shadow-sm font-medium ${isElderly ? 'text-xl' : 'text-base'} ${
                      msg.role === 'user'
                        ? 'gradient-primary text-white rounded-tr-md'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-md'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                      className="flex items-center gap-1.5 px-2 py-1 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-bold rounded-lg hover:bg-emerald-50"
                    >
                      {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      {lang === 'hi' ? (isSpeaking ? 'रोकें' : 'सुनें') : (isSpeaking ? 'Stop' : 'Listen')}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <ChaturAvatar size={40} />
                </div>
                <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-md shadow-sm flex gap-2 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-white flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }}}
                placeholder={lang === 'hi' ? 'कोई message, link या सवाल लिखें...' : 'Type any message, link or question...'}
                rows={1}
                className={`flex-1 bg-muted/50 text-foreground rounded-2xl px-5 py-4 outline-none resize-none border-2 border-transparent focus:border-emerald-300 focus:bg-white transition-all font-medium ${
                  isElderly ? 'text-lg' : 'text-base'
                }`}
                style={{ minHeight: '60px' }}
              />
              <div className="flex flex-col gap-2">
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                    isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'bg-muted text-gray-600 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                    {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="p-3 gradient-emerald text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center"
                    title="Send"
                >
                    <Send size={22} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-semibold text-center mt-3 tracking-wide">
              {lang === 'hi' ? 'यह simulation है — असली OTP कभी मत दो 🛡️' : 'This is a simulation — never share your real OTP 🛡️'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}