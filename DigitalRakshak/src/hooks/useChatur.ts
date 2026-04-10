import { useState, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export interface ChaturMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

const SYSTEM_PROMPT = `You are Chatur, a friendly AI voice safety assistant for DigiRakshak — an app that helps elderly and non-tech-savvy Indians stay safe online.

Your personality:
- Warm, patient, encouraging — like a helpful nephew/niece
- Use simple language, mix Hindi naturally when speaking Hindi (ji, bhaiya, didi, bilkul, theek hai)
- Keep responses SHORT — max 3-4 sentences (you are a voice assistant)
- Always end with one clear action or tip
- Use emojis sparingly (voice will read them out)

SCAM DETECTION: When user shares any message/link/number:
Verdict: SCAM / SUSPICIOUS / SAFE
Why: one simple sentence
Do this: one clear action

Always respond in the same language the user speaks. Short, clear, spoken-style responses only.

NEVER ask the user to share real OTP, passwords, or bank details. This is a safety training app.`

const PAGE_GREETINGS: Record<string, { hi: string; en: string }> = {
  '/': {
    hi: 'Namaste ji! Main Chatur hoon — aapka digital safety dost. Koi bhi suspicious message ya link mujhe dikhao, main bataunga safe hai ya scam!',
    en: 'Hello! I am Chatur, your digital safety friend. Show me any suspicious message or link and I will tell you if it is safe or a scam!'
  },
  '/game': {
    hi: 'Safe ya Scam game mein swagat hai! Yeh game aapko online fraud pehchaanna sikhayega. Chhiye shuru karte hain!',
    en: 'Welcome to the Safe or Scam quiz! This game teaches you to spot online fraud. Good luck — trust your instincts!'
  },
  '/upi-training': {
    hi: 'UPI Training mein aaye hain aap! Main Meena Didi ki kahani ke saath aapko guide karunga. PIN kabhi share mat karna!',
    en: 'You are in UPI Training! Follow Meena Didi\'s story to learn UPI safety. Remember — never share your PIN with anyone!'
  },
  '/scam-simulator': {
    hi: 'Scam Simulator aa gaye ho! Yahan Scamy naam ka naqli scammer aapko trick karne ki koshish karega. Kya aap usse pakad sakte ho?',
    en: 'You are in the Scam Simulator! Scamy the fake scammer will try to trick you. Can you catch him? Never share real OTP or personal details!'
  },
  '/progress': {
    hi: 'Yeh hai aapka Progress page. Badges dekho, XP dekho. Quiz khelo, UPI sikho, Scamy ko pakdo — badges milenge!',
    en: 'This is your Progress page! See your badges and XP level. Complete all modules to earn the Digital Guardian badge!'
  },
}

const FALLBACK_TIPS = [
  'Yaad rakhein — koi bhi OTP kabhi share mat karo! Banks kabhi phone par nahi maangti.',
  'Remember — never share OTP with anyone. Banks never ask for it on phone.',
  'Suspicious link dikhe toh pehle URL dhyan se padho. Galat spelling scam ki nishani hai!',
  'Lottery ya prize ka message? Delete karo — 99% yeh scam hota hai!',
]

// Language to speech code mapping
const LANG_TO_SPEECH: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  pa: 'pa-IN',
}

async function callGemini(history: { role: string; content: string }[]): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('No Gemini key')
  const contents = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 300 }
      })
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Gemini error')
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(history: { role: string; content: string }[]): Promise<string> {
  const key = import.meta.env.VITE_GROQ_KEY as string | undefined
  if (!key) throw new Error('No Groq key')
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role as string, content: m.content }))
      ]
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Groq error')
  return data.choices?.[0]?.message?.content || ''
}

export function useChatur() {
  const location = useLocation()
  const [lang, setLang]           = useState<'hi' | 'en'>('hi')
  const [messages, setMessages]   = useState<ChaturMessage[]>([])
  const [loading, setLoading]     = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen]       = useState(false)
  const recognitionRef            = useRef<any>(null)
  const utterRef                  = useRef<SpeechSynthesisUtterance | null>(null)

  // ── Text to Speech ──
  const speakText = useCallback((text: string, speechLang?: 'hi' | 'en') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const useLang = speechLang ?? lang
    window.speechSynthesis.cancel()

    const clean = text
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
      .replace(/[*_#•\[\]]/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    const utter = new SpeechSynthesisUtterance(clean)
    utterRef.current = utter
    utter.rate = 0.88
    utter.pitch = 1.1
    utter.volume = 1

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const hiVoice  = voices.find(v => v.lang === 'hi-IN')
      const enInVoice = voices.find(v => v.lang === 'en-IN')
      const enVoice  = voices.find(v => v.lang.startsWith('en'))

      if (useLang === 'hi' && hiVoice) {
        utter.lang = 'hi-IN'; utter.voice = hiVoice
      } else if (enInVoice) {
        utter.lang = 'en-IN'; utter.voice = enInVoice
      } else if (enVoice) {
        utter.lang = 'en-US'; utter.voice = enVoice
      } else {
        utter.lang = 'en-US'
      }

      utter.onstart = () => setIsSpeaking(true)
      utter.onend   = () => setIsSpeaking(false)
      utter.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utter)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true })
    } else {
      trySpeak()
    }
  }, [lang])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  // ── Page Greet ──
  const greetPage = useCallback((pathname: string, speechLang?: 'hi' | 'en') => {
    const useLang = speechLang ?? lang
    const greetings = PAGE_GREETINGS[pathname] || PAGE_GREETINGS['/']
    const text = useLang === 'hi' ? greetings.hi : greetings.en
    const msg: ChaturMessage = {
      id: 'greet-' + Date.now(),
      role: 'assistant',
      text,
      timestamp: new Date()
    }
    setMessages([msg])
    setTimeout(() => speakText(text, useLang), 600)
  }, [lang, speakText])

  // ── resetForPage (used by ChaturAssistant on route change) ──
  const resetForPage = useCallback((pathname: string) => {
    greetPage(pathname)
  }, [greetPage])

  // ── Voice Input ──
  const startListening = useCallback(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert('Please use Chrome for voice input.'); return }
    stopSpeaking()
    const rec = new SR()
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setIsListening(false)
      sendMessage(transcript, true)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend   = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }, [lang, stopSpeaking])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  // ── Send Message ──
  const sendMessage = useCallback(async (text: string, autoSpeak = true) => {
    if (!text.trim() || loading) return
    const userMsg: ChaturMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages
        .filter(m => !m.id.startsWith('greet-'))
        .map(m => ({ role: m.role, content: m.text }))
      history.push({ role: 'user', content: text.trim() })

      let reply = ''
      try { reply = await callGemini(history) }
      catch { try { reply = await callGroq(history) }
        catch { reply = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)] }
      }
      if (!reply) reply = FALLBACK_TIPS[0]

      const assistantMsg: ChaturMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMsg])
      if (autoSpeak) speakText(reply)
    } catch {
      const fallback = FALLBACK_TIPS[0]
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallback,
        timestamp: new Date()
      }])
      if (autoSpeak) speakText(fallback)
    }
    setLoading(false)
  }, [messages, loading, speakText])

  // ── Toggle Lang ──
  const toggleLang = useCallback(() => {
    const newLang = lang === 'hi' ? 'en' : 'hi'
    setLang(newLang)
    greetPage(location.pathname, newLang)
  }, [lang, location.pathname, greetPage])

  return {
    messages, loading, isSpeaking, isListening, isOpen, lang,
    setIsOpen, sendMessage, speakText, stopSpeaking,
    startListening, stopListening, greetPage, resetForPage, toggleLang
  }
}