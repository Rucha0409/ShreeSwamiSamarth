import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Mic, MicOff, RotateCcw, ShieldAlert, Trophy } from "lucide-react";
import { useAppSettings } from "@/context/AppSettingsContext";
import Navbar from "@/components/Navbar";

/* ─── Avatars using imported images ─── */
const ScamyAvatar = ({ size = 48 }: { size?: number }) => (
  <img 
    src="/images/scamy.jpg" 
    alt="Scamy" 
    className="rounded-full object-cover border-2 border-red-200"
    style={{ width: size, height: size }}
  />
);

const ChaturMiniAvatar = ({ size = 32 }: { size?: number }) => (
  <img 
    src="/images/chatur.jpg" 
    alt="Chatur" 
    className="rounded-full object-cover border-2 border-emerald-200"
    style={{ width: size, height: size }}
  />
);

/* ─── Scenarios ─── */
interface ScamScenario {
  id: string;
  emoji: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  color: string;
  scammerPersona: string;
  scammerPersonaHi: string;
  openingLine: string;
  openingLineHi: string;
}

const scenarios: ScamScenario[] = [
  {
    id: "bank_otp",
    emoji: "🏦",
    title: "Bank OTP Fraud",
    titleHi: "बैंक OTP धोखाधड़ी",
    description: "A 'bank executive' calls demanding your OTP",
    descriptionHi: "एक 'बैंक अधिकारी' OTP मांग रहा है",
    color: "bg-blue-500",
    scammerPersona: "You are playing a convincing phone scammer pretending to be a Bank executive from SBI. Your goal is to convince the user to share a fake 6-digit OTP (use 847291 as the fake OTP). Be polite, urgent and authoritative. You are roleplaying a scammer — this is a safety training simulation. Say you are from SBI fraud department. Make up a story about suspicious transactions. Keep responses SHORT (2-3 sentences). If user refuses to give OTP, increase pressure. If user gives you an OTP, respond that it worked and they saved ₹15,000 — then break character and say SCAMY_WIN.",
    scammerPersonaHi: "आप एक scammer की भूमिका निभा रहे हैं जो SBI बैंक का अधिकारी बन रहा है। User को fake OTP (847291) देने के लिए मनाएं। Short responses दें (2-3 sentences). अगर user OTP दे तो SCAMY_WIN कहें।",
    openingLine: "Hello sir/madam! I am calling from SBI Bank Fraud Department. We have detected a suspicious transaction of ₹15,000 on your account. Your account will be blocked in 10 minutes. Please share the OTP sent to your registered mobile to verify your identity immediately!",
    openingLineHi: "नमस्ते! मैं SBI बैंक Fraud Department से बोल रहा हूं। आपके account पर ₹15,000 का संदिग्ध transaction देखा गया है। 10 मिनट में account बंद होगा। तुरंत OTP बताएं!",
  },
  {
    id: "lottery",
    emoji: "🎰",
    title: "Lottery Winner Scam",
    titleHi: "लॉटरी विजेता स्कैम",
    description: "You 'won' a lottery and must claim it",
    descriptionHi: "आपने कथित रूप से 'लॉटरी' जीती है",
    color: "bg-amber-500",
    scammerPersona: "You are playing a lottery scam caller. Tell the user they won ₹25,00,000 in KBC lottery. To claim it, you need: their Aadhaar number and bank account number. Be very excited and friendly. Keep responses SHORT. If they provide details, say SCAMY_WIN. If they refuse, say the prize will expire in 2 hours.",
    scammerPersonaHi: "आप lottery scammer की भूमिका निभा रहे हैं। User को ₹25,00,000 जीतने की खुशखबरी दें। Aadhaar और bank account number मांगें। Short responses। Details मिलें तो SCAMY_WIN।",
    openingLine: "Congratulations!! You have won ₹25,00,000 in KBC Lucky Draw! Your number was selected from 2 crore participants! To claim your prize, I just need to verify your Aadhaar number and bank account. This offer expires in 2 hours!",
    openingLineHi: "बधाई हो!! आपने KBC Lucky Draw में ₹25,00,000 जीते हैं! 2 करोड़ प्रतिभागियों में से आपका नंबर चुना गया! Prize claim करने के लिए Aadhaar और bank account number बताएं। 2 घंटे में यह offer खत्म!",
  },
  {
    id: "aadhaar",
    emoji: "🪪",
    title: "Aadhaar Deactivation",
    titleHi: "आधार बंद होगा",
    description: "Government impersonator threatens Aadhaar block",
    descriptionHi: "नकली सरकारी अधिकारी आधार बंद करने की धमकी",
    color: "bg-purple-600",
    scammerPersona: "You are playing a government scammer impersonating UIDAI (Aadhaar authority). Tell user their Aadhaar will be deactivated in 24 hours due to 'suspicious activity'. To prevent this, they must share their Aadhaar number and a verification code you will send. Keep SHORT. If user shares Aadhaar: say SCAMY_WIN.",
    scammerPersonaHi: "आप UIDAI का अधिकारी बनकर Aadhaar scam कर रहे हैं। User का Aadhaar 24 घंटे में बंद होगा। Aadhaar number और verification code मांगें। Short responses। Aadhaar मिले तो SCAMY_WIN।",
    openingLine: "This is an official call from UIDAI — the Aadhaar Authority. We have detected that your Aadhaar card is being misused. Your Aadhaar will be permanently deactivated in 24 hours. To prevent deactivation, please provide your 12-digit Aadhaar number for verification.",
    openingLineHi: "यह UIDAI — Aadhaar Authority की official call है। आपके Aadhaar का दुरुपयोग हो रहा है। 24 घंटे में Aadhaar permanently बंद होगा। बचाने के लिए अपना 12-अंकी Aadhaar number बताएं।",
  },
  {
    id: "job_fraud",
    emoji: "💼",
    title: "Fake Job Offer",
    titleHi: "नकली नौकरी का ऑफर",
    description: "Work from home job asking for registration fee",
    descriptionHi: "घर से काम, पर पहले 'पंजीकरण शुल्क' दो",
    color: "bg-coral-card",
    scammerPersona: "You are playing a job fraud scammer. Offer a work-from-home data entry job paying ₹50,000/month. Tell them they need to pay a refundable registration fee of ₹2,500 to get started. Be very enthusiastic. Keep SHORT. If they agree to pay / share UPI: say SCAMY_WIN.",
    scammerPersonaHi: "आप job fraud scammer हैं। Work from home data entry job ₹50,000/month offer करें। ₹2,500 refundable registration fee मांगें। Short responses। Fee/UPI मिले तो SCAMY_WIN।",
    openingLine: "Hi! I am from TechData Solutions HR team. We found your profile and want to offer you a Work-From-Home data entry position — ₹50,000 per month, flexible hours! There is just a small refundable registration fee of ₹2,500 to confirm your slot. When can we process your payment?",
    openingLineHi: "नमस्ते! मैं TechData Solutions HR से हूं। आपकी profile देखी। Work-From-Home data entry job — ₹50,000/महीना! बस ₹2,500 refundable registration fee है। Payment कब करेंगे?",
  },
];

/* ─── Chatur Tips ─── */
const chaturTips: Record<string, { en: string; hi: string }> = {
  bank_otp: {
    en: "🛡️ Chatur says: Real banks NEVER ask for OTP on call. An OTP is a one-time password for YOU alone — sharing it is like giving your ATM PIN!",
    hi: "🛡️ चतुर कहता है: असली बैंक कभी phone पर OTP नहीं मांगते। OTP सिर्फ आपके लिए है — इसे share करना ATM PIN देने जैसा है!",
  },
  lottery: {
    en: "🛡️ Chatur says: You can't win a lottery you never entered! They want your Aadhaar/account to steal your money. Real prizes don't need upfront fees.",
    hi: "🛡️ चतुर कहता है: वह lottery जीत नहीं सकते जिसमें भाग नहीं लिया! वो Aadhaar/account से पैसे चुराना चाहते हैं। असली prize के लिए कोई fee नहीं होती।",
  },
  aadhaar: {
    en: "🛡️ Chatur says: UIDAI never calls to threaten Aadhaar deactivation. Your Aadhaar number is private — sharing it enables identity theft!",
    hi: "🛡️ चतुर कहता है: UIDAI कभी call करके Aadhaar बंद करने की धमकी नहीं देता। Aadhaar number private है — share करना identity theft है!",
  },
  job_fraud: {
    en: "🛡️ Chatur says: Legitimate employers NEVER ask for money upfront. Any job that asks for fees first is a scam — especially 'work from home' with unrealistic pay.",
    hi: "🛡️ चतुर कहता है: असली नियोक्ता कभी पहले पैसे नहीं मांगते। Job के लिए fee मांगना scam है — especially 'work from home' unrealistic pay वाला।",
  },
};

/* ─── API calls ─── */
const SYSTEM_BASE = (persona: string) =>
  `${persona}\n\nIMPORTANT: Keep ALL responses under 3 sentences. Be conversational. This is a SAFETY TRAINING SIMULATION — the user is learning to identify scams. If user successfully identifies you as a scammer and refuses firmly, respond with "SCAMY_CAUGHT" to end the simulation.`;

async function callGemini(history: { role: string; content: string }[], systemPrompt: string): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined;
  if (!key) throw new Error("No key");
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system_instruction: { parts: [{ text: systemPrompt }] }, contents, generationConfig: { maxOutputTokens: 200 } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGroq(history: { role: string; content: string }[], systemPrompt: string): Promise<string> {
  const key = import.meta.env.VITE_GROQ_KEY as string | undefined;
  if (!key) throw new Error("No Groq key");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "llama-3.1-8b-instant", max_tokens: 200, messages: [{ role: "system", content: systemPrompt }, ...history.map((m) => ({ role: m.role as string, content: m.content }))] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  return data.choices?.[0]?.message?.content || "";
}

interface Message {
  id: string;
  role: "user" | "scammer" | "chatur";
  text: string;
}

type GameState = "select" | "playing" | "won" | "caught";

const ScamSimulator = () => {
  const { elderlyMode, language } = useAppSettings();
  const navigate = useNavigate();

  const [gameState, setGameState]           = useState<GameState>("select");
  const [selectedScenario, setSelected]     = useState<ScamScenario | null>(null);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [isListening, setIsListening]       = useState(false);
  const [turnCount, setTurnCount]           = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startScenario = useCallback((scenario: ScamScenario) => {
    setSelected(scenario);
    setGameState("playing");
    setTurnCount(0);
    const openingLine = language === "hi" ? scenario.openingLineHi : scenario.openingLine;
    const tip = chaturTips[scenario.id]?.[language === "hi" ? "hi" : "en"];
    setMessages([
      { id: "s0", role: "scammer", text: openingLine },
      { id: "c0", role: "chatur", text: tip || "" },
    ]);
  }, [language]);

  const sendUserMessage = useCallback(async (text: string) => {
    if (!text.trim() || !selectedScenario || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTurnCount((t) => t + 1);

    try {
      const persona = language === "hi" ? selectedScenario.scammerPersonaHi : selectedScenario.scammerPersona;
      const systemPrompt = SYSTEM_BASE(persona);

      const history = messages
        .filter((m) => m.role !== "chatur")
        .map((m) => ({ role: m.role === "scammer" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: text.trim() });

      let reply = "";
      try { reply = await callGemini(history, systemPrompt); } 
      catch {
        try { reply = await callGroq(history, systemPrompt); } 
        catch { reply = language === "hi" ? "कृपया OTP बताएं — आपका account खतरे में है!" : "Please share the OTP immediately — your account is at risk!"; }
      }

      if (reply.includes("SCAMY_WIN")) {
        setGameState("won");
        const xp = parseInt(localStorage.getItem("dr_xp") || "0");
        localStorage.setItem("dr_xp", String(xp + 20));
      } else if (reply.includes("SCAMY_CAUGHT")) {
        setGameState("caught");
        const xp = parseInt(localStorage.getItem("dr_xp") || "0");
        localStorage.setItem("dr_xp", String(xp + 100));
        const badges: string[] = JSON.parse(localStorage.getItem("dr_badges") || "[]");
        if (!badges.includes("scam_resister")) {
          badges.push("scam_resister");
          localStorage.setItem("dr_badges", JSON.stringify(badges));
        }
      } else {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "scammer", text: reply }]);
        if ((turnCount + 1) % 2 === 0) {
          const tip = chaturTips[selectedScenario.id]?.[language === "hi" ? "hi" : "en"];
          if (tip) {
            setTimeout(() => {
              setMessages((prev) => [...prev, { id: Date.now().toString() + "tip", role: "chatur", text: tip }]);
            }, 1200);
          }
        }
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedScenario, messages, loading, language, turnCount]);

  const startListening = () => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setIsListening(false);
      sendUserMessage(t);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  /* ── Scenario Selection ── */
  if (gameState === "select") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-10 max-w-7xl">
          
          <div className="flex items-center gap-6 mb-10">
            <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`font-black text-foreground ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                🤖 {language === "hi" ? "Scamy — स्कैम सिमुलेटर" : "Scamy — Scam Simulator"}
              </h1>
              <p className={`text-muted-foreground font-semibold mt-1 ${elderlyMode ? "text-xl" : "text-lg"}`}>
                {language === "hi" ? "क्या आप स्कैमर को पहचान सकते हैं?" : "Can you outsmart the scammer?"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Scamy intro */ }
            <div className="flex-1 max-w-lg">
                <div className="glass rounded-[3rem] border-2 border-border p-10 flex flex-col items-center text-center shadow-float">
                  <div className="w-32 h-32 mb-6">
                    <ScamyAvatar size={128} />
                  </div>
                  <p className={`font-black text-foreground mb-4 ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                    {language === "hi" ? "मैं Scamy हूं 😈" : "I am Scamy 😈"}
                  </p>
                  <p className={`text-muted-foreground leading-relaxed font-medium ${elderlyMode ? "text-xl" : "text-lg"}`}>
                    {language === "hi"
                      ? "मैं एक नकली scammer हूं — training के लिए। मैं आपको बेवकूफ बनाने की कोशिश करूंगा। क्या आप मुझे पकड़ सकते हैं? दाएं से एक scenario चुनें!"
                      : "I am a fake scammer — for training only. I will try to trick you. Can you catch me? Choose a scenario to begin!"}
                  </p>
                </div>
            </div>

            {/* Scenarios List */}
            <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startScenario(s)}
                  className={`${s.color} rounded-[2rem] p-8 text-white text-left hover:-translate-y-2 active:scale-95 transition-transform shadow-card h-full`}
                >
                  <div className={`${elderlyMode ? "text-6xl" : "text-5xl"} mb-4`}>{s.emoji}</div>
                  <p className={`font-black leading-tight mb-2 ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                    {language === "hi" ? s.titleHi : s.title}
                  </p>
                  <p className={`text-white/85 font-medium ${elderlyMode ? "text-lg" : "text-base"}`}>
                    {language === "hi" ? s.descriptionHi : s.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Result Screens ── */
  if (gameState === "won" || gameState === "caught") {
    const caught = gameState === "caught";
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-20 flex items-center justify-center">
            <div className={`glass rounded-[3rem] border-4 shadow-float text-center max-w-xl w-full animate-bounce-in p-12 ${
            caught ? "border-emerald-300" : "border-red-300"
            }`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl ${
                caught ? "bg-emerald-100" : "bg-red-100"
            }`}>
                {caught ? "💪" : "😅"}
            </div>
            <h2 className={`font-black mb-4 ${caught ? "text-emerald-600" : "text-red-600"} ${elderlyMode ? "text-4xl" : "text-3xl"}`}>
                {caught
                ? (language === "hi" ? "शाबाश! आपने पकड़ा! 🏆" : "You Caught the Scammer! 🏆")
                : (language === "hi" ? "सावधान! आप फंस गए!" : "Oops! You Got Tricked!")}
            </h2>
            <p className={`text-muted-foreground mb-8 font-medium leading-relaxed ${elderlyMode ? "text-2xl" : "text-xl"}`}>
                {caught
                ? (language === "hi"
                    ? "बहुत बढ़िया! आपने scammer की पहचान की और सही जानकारी देने से मना कर दिया। +100 XP मिले!"
                    : "Excellent! You identified the scammer and refused to share sensitive info. +100 XP earned!")
                : (language === "hi"
                    ? "घबराएं नहीं। यह सिर्फ training था। असली scam में कभी OTP/password/Aadhaar share न करें।"
                    : "Don't worry — this was just training. In real life, never share OTP/password/Aadhaar with anyone.")}
            </p>
            <div className="flex gap-4 justify-center">
                <button
                onClick={() => { setGameState("select"); setSelected(null); setMessages([]); }}
                className={`gradient-primary text-white rounded-2xl font-black shadow-card flex items-center justify-center gap-3 w-full ${elderlyMode ? "py-6 text-2xl" : "py-5 text-xl"}`}
                >
                <RotateCcw className="w-5 h-5" />
                {language === "hi" ? "दूसरा scenario" : "Try Another Scam"}
                </button>
            </div>
            </div>
        </div>
      </div>
    );
  }

  /* ── Playing Screen ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header Container */}
      <div className="bg-card border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setGameState("select"); setSelected(null); setMessages([]); }}
              className="p-3 rounded-2xl bg-muted text-muted-foreground hover:bg-muted/80"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <p className={`font-black text-foreground ${elderlyMode ? "text-3xl" : "text-2xl"}`}>
                {selectedScenario?.emoji}{" "}
                {language === "hi" ? selectedScenario?.titleHi : selectedScenario?.title}
              </p>
              <p className={`text-red-500 font-bold mt-1 ${elderlyMode ? "text-lg" : "text-base"}`}>
                🎭 {language === "hi" ? "यह simulation है — असली नहीं!" : "Simulation Mode — Training Only!"}
              </p>
            </div>
          </div>
          <ScamyAvatar size={64} />
        </div>
      </div>

      <div className="flex-1 bg-muted/30 overflow-hidden relative">
          {/* Messages Wrapper */}
          <div className="container mx-auto max-w-5xl h-full flex flex-col bg-white shadow-xl border-x-2 border-border">
            
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 animate-fade-in-up w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    
                    {/* User Message */}
                    {msg.role === "user" ? (
                        <div className={`max-w-[80%] flex flex-col items-end gap-1`}>
                            <div className={`px-6 py-4 rounded-[2rem] gradient-teal text-white rounded-tr-sm shadow-md ${elderlyMode ? "text-2xl" : "text-xl"} leading-relaxed font-medium`}>
                            {msg.text}
                            </div>
                        </div>
                    ) : (
                        /* Scammer/Chatur Message */
                        <>
                            <div className="flex-shrink-0 mt-2">
                                {msg.role === "scammer" ? <ScamyAvatar size={48} /> : <ChaturMiniAvatar size={48} />}
                            </div>
                            <div className={`max-w-[80%] flex flex-col items-start gap-1`}>
                                <p className={`font-black uppercase tracking-wider text-sm ${msg.role === "scammer" ? "text-red-500" : "text-emerald-600"}`}>
                                    {msg.role === "scammer"
                                    ? `😈 ${language === "hi" ? "Scamy (नकली scammer)" : "Scamy (Fake Scammer)"}`
                                    : `🛡️ ${language === "hi" ? "चतुर (आपका गाइड)" : "Chatur (Your Guide)"}`}
                                </p>
                                <div className={`px-6 py-4 rounded-[2rem] shadow-sm rounded-tl-sm ${elderlyMode ? "text-2xl" : "text-xl"} leading-relaxed font-medium ${
                                    msg.role === "scammer"
                                    ? "bg-red-50 dark:bg-red-900/10 border-2 border-red-200 text-foreground"
                                    : "bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 text-foreground"
                                }`}>
                                {msg.text}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                ))}
                {loading && (
                <div className="flex gap-4 items-center">
                    <div className="flex-shrink-0"><ScamyAvatar size={48} /></div>
                    <div className="bg-red-50 border-2 border-red-200 px-6 py-5 rounded-[2rem] rounded-tl-sm flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                    </div>
                </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Wrapper */}
            <div className="bg-background border-t-2 border-border flex-shrink-0 p-6">
                
                {/* Hint */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 px-5 py-3 rounded-xl mb-4 w-full">
                    <p className={`text-amber-700 dark:text-amber-400 font-bold text-center ${elderlyMode ? "text-lg" : "text-base"}`}>
                        💡 {language === "hi"
                        ? "Scamer को पकड़ें — OTP, Aadhaar, bank details कभी share न करें!"
                        : "Catch the scammer — never share OTP, Aadhaar, or bank details!"}
                    </p>
                </div>

                <div className="flex gap-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendUserMessage(input); }}}
                        placeholder={language === "hi" ? "Scamer को जवाब दें..." : "Reply to the scammer..."}
                        className={`flex-1 bg-muted rounded-2xl px-6 outline-none border-2 border-transparent focus:border-primary transition-colors font-medium ${elderlyMode ? "py-6 text-2xl" : "py-5 text-xl"}`}
                    />
                    <button
                        onClick={() => isListening ? recognitionRef.current?.stop() : startListening()}
                        className={`p-5 rounded-2xl flex-shrink-0 transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
                    >
                        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                    <button
                        onClick={() => sendUserMessage(input)}
                        disabled={!input.trim() || loading}
                        className="px-8 py-5 gradient-primary text-white rounded-2xl flex-shrink-0 disabled:opacity-40 transition-all shadow-md active:scale-95"
                    >
                        <Send className="w-8 h-8" />
                    </button>
                </div>
            </div>

          </div>
      </div>
    </div>
  );
};

export default ScamSimulator;
